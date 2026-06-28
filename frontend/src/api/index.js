const API_URL = 'https://api.leadgateway.tech/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
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
  return data;
};