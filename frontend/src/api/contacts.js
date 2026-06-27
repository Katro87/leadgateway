import { apiFetch } from './index';

export const getContacts = () => apiFetch('/contacts');

export const createContact = (contact) =>
  apiFetch('/contacts', { method: 'POST', body: JSON.stringify(contact) });

export const updateContact = (id, contact) =>
  apiFetch(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(contact) });

export const deleteContact = (id) =>
  apiFetch(`/contacts/${id}`, { method: 'DELETE' });

export const toggleFavorite = (id) =>
  apiFetch(`/contacts/${id}/favorite`, { method: 'PUT' });