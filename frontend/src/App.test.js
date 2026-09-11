import { render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => {
  localStorage.clear();
});

test('renders the SpendWise dashboard shell', () => {
  localStorage.setItem('spendwiseToken', 'test-token');
  localStorage.setItem('spendwiseUser', JSON.stringify({ name: 'Test User' }));
  expect(() => render(<App />)).not.toThrow();
  expect(screen.getAllByText('SpendWise').length).toBeGreaterThan(0);
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test('renders the login entry and forgot password action when signed out', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Sign in to SpendWise' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Forgot password?' })).toBeInTheDocument();
});
