const configuredApiUrl = process.env.REACT_APP_API_URL;
const defaultApiUrl = process.env.NODE_ENV === 'production'
  ? 'https://spendwise-5h8t.onrender.com'
  : 'http://localhost:5000';
const API_BASE_URL = (configuredApiUrl || defaultApiUrl)
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');
const API_REQUEST_TIMEOUT_MS = 30000;

export async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
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
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The request took too long. Please try again.');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export { API_BASE_URL };
