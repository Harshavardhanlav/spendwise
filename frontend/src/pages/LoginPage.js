import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import Button from '../components/ui/Button';
import { loginUser } from '../services/authApi';

function LoginPage({ onLogin, onRegister, onForgotPassword }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) return setError('Enter your email and password.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');

    setLoading(true);
    try {
      const result = await loginUser({ email: form.email.trim().toLowerCase(), password: form.password });
      localStorage.setItem('spendwiseToken', result.token);
      localStorage.setItem('spendwiseUser', JSON.stringify(result.user));
      onLogin(result.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title="Sign in to SpendWise" description="See where your money is going and keep your plans moving.">
      <form className="auth-form" onSubmit={submit} noValidate>
        <AuthField label="Email address" id="login-email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        <div className="password-field">
          <AuthField label="Password" id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
        </div>
        <div className="auth-inline-action"><button type="button" onClick={onForgotPassword}>Forgot password?</button></div>
        {error && <div className="auth-alert" role="alert">{error}</div>}
        <Button type="submit" size="large" className="auth-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'} {!loading && <ArrowRight size={17} aria-hidden="true" />}</Button>
      </form>
      <p className="auth-switch">New to SpendWise? <button type="button" onClick={onRegister}>Create an account</button></p>
    </AuthLayout>
  );
}

export default LoginPage;
