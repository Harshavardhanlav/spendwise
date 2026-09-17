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

export function sendSettingsPasswordRecoveryCode() {
  return apiRequest('/api/auth/settings/forgot-password', authOptions('POST'));
}

export function verifySettingsPasswordRecoveryCode(code) {
  return apiRequest('/api/auth/settings/verify-password-reset-code', authOptions('POST', { code }));
}

export function resetSettingsPassword(newPassword) {
  return apiRequest('/api/auth/settings/reset-password', authOptions('POST', { newPassword }));
}
