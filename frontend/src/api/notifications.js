import { apiFetch } from './index';

export const getNotifications = () => apiFetch('/notifications');
export const markAllRead = () => apiFetch('/notifications/read-all', { method: 'PUT' });
export const markOneRead = (id) => apiFetch(`/notifications/${id}/read`, { method: 'PUT' });