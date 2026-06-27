const API_URL = 'https://api.leadgateway.tech/api/contacts';

const getToken = () => localStorage.getItem('token');

export const getContacts = async () => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
};

export const createContact = async (contact) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error('Failed to create contact');
  return res.json();
};

export const updateContact = async (id, contact) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error('Failed to update contact');
  return res.json();
};

export const deleteContact = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to delete contact');
  return res.json();
};

export const toggleFavorite = async (id) => {
  const res = await fetch(`${API_URL}/${id}/favorite`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
};