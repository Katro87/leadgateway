import { apiFetch } from './index';

export const getCalls = () => apiFetch('/calls');
export const createCall = (data) => apiFetch('/calls', { method: 'POST', body: JSON.stringify(data) });
export const deleteCall = (id) => apiFetch(`/calls/${id}`, { method: 'DELETE' });