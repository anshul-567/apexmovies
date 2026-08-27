import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { setAccessToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to silently refresh - keeps the user logged in across
  // page reloads without storing the access token in localStorage.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setAccessToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'theater_admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
