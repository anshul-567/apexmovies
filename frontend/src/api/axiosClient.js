import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // so the httpOnly refresh-token cookie is sent
});

let accessToken = typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null;
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('apex_token', token);
  } else {
    localStorage.removeItem('apex_token');
  }
};

api.interceptors.request.use((config) => {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('apex_token') : null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If a request fails with 401, try refreshing the access token once, then
// retry the original request. Avoids booting the user on a stale token.
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise || api.post('/auth/refresh');
        const { data } = await refreshPromise;
        refreshPromise = null;
        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        refreshPromise = null;
        setAccessToken(null);
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
