import { apiRequest } from './api';

const authOptions = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
  },
});

export function getTransactionSummary() {
  return apiRequest('/api/transactions/summary', authOptions());
}

export function getCategorySummary() {
  return apiRequest('/api/transactions/summary/categories', authOptions());
}

export function getMonthlySummary() {
  return apiRequest('/api/transactions/summary/monthly', authOptions());
}

export function getTransactions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return apiRequest(`/api/transactions${query ? `?${query}` : ''}`, authOptions());
}

export function createTransaction(transaction) {
  return apiRequest('/api/transactions', {
    ...authOptions(),
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

export function updateTransaction(transactionId, transaction) {
  return apiRequest(`/api/transactions/${transactionId}`, {
    ...authOptions(),
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
}

export function deleteTransaction(transactionId) {
  return apiRequest(`/api/transactions/${transactionId}`, {
    ...authOptions(),
    method: 'DELETE',
  });
}

export function getUserCategories() {
  return apiRequest('/api/categories', authOptions());
}
