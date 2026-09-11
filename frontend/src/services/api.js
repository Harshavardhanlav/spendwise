const configuredApiUrl = process.env.REACT_APP_API_URL;
const defaultApiUrl = process.env.NODE_ENV === 'production'
  ? 'https://spendwise-5h8t.onrender.com'
  : 'http://localhost:5000';
const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    const requestError = new Error(payload.error || 'Something went wrong. Please try again.');
    requestError.status = response.status;
    throw requestError;
  }

  return payload;
}

export { API_BASE_URL };
