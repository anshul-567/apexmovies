import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

const CityContext = createContext(null);

const DEFAULT_CITIES = [
  'All Cities', 'Indore', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune',
  'Kolkata', 'Chennai', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Bhopal', 'Chandigarh',
  'Kochi', 'Patna', 'Surat', 'Nagpur', 'Varanasi', 'Agra', 'Goa',
];

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCityState] = useState(() => {
    return localStorage.getItem('apex_selected_city') || 'All Cities';
  });
  const [cities, setCities] = useState(DEFAULT_CITIES);

  useEffect(() => {
    api.get('/theaters')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          const dbCities = Array.from(new Set(data.map((t) => t.city).filter(Boolean))).sort();
          if (dbCities.length) {
            setCities(['All Cities', ...dbCities]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const setSelectedCity = useCallback((city) => {
    setSelectedCityState(city);
    localStorage.setItem('apex_selected_city', city);
  }, []);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
