import { cacheData, getCachedData } from '../utils/cache';

const API_URL = 'https://api.leadgateway.tech/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isGet = !options.method || options.method === 'GET';
  const cacheKey = endpoint;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await res.json();

    const isAuthEndpoint = endpoint.includes('/login') || endpoint.includes('/signup') || endpoint.includes('/forgot-password') || endpoint.includes('/reset-password');

    if (res.status === 401 && token && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/login';
      throw new Error('Session expired. Please log in again.');
    }

    if (!res.ok) throw new Error(data.message || 'Something went wrong');

    if (isGet) cacheData(cacheKey, data);

    return data;
  } catch (error) {
    if (isGet && (error.name === 'TypeError' || error.message === 'Failed to fetch')) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }
    throw error;
  }
};