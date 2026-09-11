import { apiRequest } from './api';

export function getCategories() {
  return apiRequest('/api/categories', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
    },
  });
}