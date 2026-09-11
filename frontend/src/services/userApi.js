import { apiRequest } from './api';

const authOptions = (method = 'GET', body) => ({
  method,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
  },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export function getCurrentUser() {
  return apiRequest('/api/auth/me', authOptions());
}

export function updateProfile(data) {
  return apiRequest('/api/auth/profile', authOptions('PUT', data));
}

export function updateCurrency(currency) {
  return apiRequest('/api/auth/currency', authOptions('PUT', { currency }));
}

export function changePassword(data) {
  return apiRequest('/api/auth/change-password', authOptions('PUT', data));
}
