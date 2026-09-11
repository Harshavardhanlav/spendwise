import { apiRequest } from './api';

const authOptions = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
  },
});

export function getBudgets() {
  return apiRequest('/api/budgets', authOptions());
}

export function getBudgetById(budgetId) {
  return apiRequest(`/api/budgets/${budgetId}`, authOptions());
}

export function createBudget(data) {
  return apiRequest('/api/budgets', {
    ...authOptions(),
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBudget(budgetId, data) {
  return apiRequest(`/api/budgets/${budgetId}`, {
    ...authOptions(),
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBudget(budgetId) {
  return apiRequest(`/api/budgets/${budgetId}`, {
    ...authOptions(),
    method: 'DELETE',
  });
}
