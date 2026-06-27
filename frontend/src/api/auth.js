import { apiFetch } from './index';

export const signupUser = (name, email, password) =>
  apiFetch('/users/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const loginUser = (email, password) =>
  apiFetch('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getProfile = () =>
  apiFetch('/users/profile');