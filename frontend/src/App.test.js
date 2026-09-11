import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    const requestUrl = String(url);

    if (requestUrl.includes('/api/auth/me')) {
      const storedUser = JSON.parse(localStorage.getItem('spendwiseUser') || 'null');
      if (storedUser) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ user: storedUser }),
        });
      }

      return Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });
    }

    if (requestUrl.includes('/api/categories')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ categories: [] }),
      });
    }

    if (requestUrl.includes('/api/budgets')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ budgets: [] }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    });
  });
});

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test('renders the SpendWise dashboard shell', async () => {
  localStorage.setItem('spendwiseToken', 'test-token');
  localStorage.setItem('spendwiseUser', JSON.stringify({ name: 'Test User' }));
  expect(() => render(<App />)).not.toThrow();
  await waitFor(() => {
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
  expect(screen.getAllByText('SpendWise').length).toBeGreaterThan(0);
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test('renders the login entry and forgot password action when signed out', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Sign in to SpendWise' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Forgot password?' })).toBeInTheDocument();
});

test('restores the authenticated session from the stored token and loads the app shell', async () => {
  localStorage.setItem('spendwiseToken', 'test-token');
  localStorage.setItem('spendwiseUser', JSON.stringify({ id: 'user-1', name: 'Test User', email: 'test@example.com', currency: 'INR' }));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  expect(screen.queryByRole('heading', { name: 'Sign in to SpendWise' })).not.toBeInTheDocument();
});

test('includes Budgets in the authenticated navigation and shows the empty state', async () => {
  localStorage.setItem('spendwiseToken', 'test-token');
  localStorage.setItem('spendwiseUser', JSON.stringify({ id: 'user-1', name: 'Test User', email: 'test@example.com', currency: 'INR' }));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  expect(screen.getAllByRole('button', { name: 'Budgets' }).length).toBeGreaterThan(0);
  fireEvent.click(screen.getAllByRole('button', { name: 'Budgets' })[0]);

  await waitFor(() => {
    expect(screen.getAllByText('Budgets').length).toBeGreaterThan(0);
  });

  expect(await screen.findByText('No budgets yet.')).toBeInTheDocument();
});

test('navigates to Profile when the top-right profile icon is clicked', async () => {
  localStorage.setItem('spendwiseToken', 'test-token');
  localStorage.setItem('spendwiseUser', JSON.stringify({ id: 'user-1', name: 'Test User', email: 'test@example.com', currency: 'INR' }));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Open profile' })).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: 'Open profile' }));

  expect(await screen.findByRole('heading', { name: 'Profile' })).toBeInTheDocument();
});
