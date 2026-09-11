import { apiRequest } from './api';

const authOptions = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('spendwiseToken') || ''}`,
  },
});

const withPeriod = (path, period = {}) => {
  const params = new URLSearchParams();
  if (period.startDate) params.set('startDate', period.startDate);
  if (period.endDate) params.set('endDate', period.endDate);
  const query = params.toString();
  return apiRequest(`${path}${query ? `?${query}` : ''}`, authOptions());
};

export function getSummary(period) {
  return withPeriod('/api/transactions/summary', period);
}

export function getCategorySummary(period) {
  return withPeriod('/api/transactions/summary/categories', period);
}

export function getMonthlySummary(period) {
  return withPeriod('/api/transactions/summary/monthly', period);
}

export function getPaymentMethodSummary(period) {
  return withPeriod('/api/transactions/summary/payment-methods', period);
}

export function getComparison(period) {
  return withPeriod('/api/transactions/summary/comparison', period);
}

export function getReportTransactions(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return apiRequest(`/api/transactions/report${query ? `?${query}` : ''}`, authOptions());
}
