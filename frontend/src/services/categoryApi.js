import { apiRequest } from './api';

export function getCategories() {
  return apiRequest('/api/categories', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
    },
  });
}

const authOptions = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
  },
});

export function createCategory(data) {
  return apiRequest('/api/categories', {
    ...authOptions(),
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(categoryId, data) {
  return apiRequest(`/api/categories/${categoryId}`, {
    ...authOptions(),
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(categoryId) {
  return apiRequest(`/api/categories/${categoryId}`, {
    ...authOptions(),
    method: 'DELETE',
  });
}