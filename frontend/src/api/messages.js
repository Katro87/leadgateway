import { apiFetch } from './index';

export const getMessages = () => apiFetch('/messages');
export const sendMessage = (data) => apiFetch('/messages', { method: 'POST', body: JSON.stringify(data) });
export const deleteMessage = (id) => apiFetch(`/messages/${id}`, { method: 'DELETE' });