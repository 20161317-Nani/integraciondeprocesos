// src/api.js
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const fetchApi = (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  // Añade el token automáticamente si existe
  if (token) {
    options.headers = {
      ...options.headers,
      'x-auth-token': token,
    };
  }

  // Añade Content-Type si hay un body y no se ha definido
  if (options.body && !options.headers?.['Content-Type']) {
     options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    };
  }

  return fetch(`${API_URL}${endpoint}`, options);
};