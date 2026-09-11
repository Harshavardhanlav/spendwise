import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import Button from '../components/ui/Button';
import { registerUser } from '../services/authApi';

function RegisterPage({ onRegistered, onLogin }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');

    setLoading(true);
    try {
      await registerUser({ name: form.name.trim(), email: form.email.trim().toLowerCase() });
      onRegistered(form.email.trim().toLowerCase());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Create your account" title="Start with a clear view" description="Register with your name and email. We will send a verification code before you set a password.">
      <form className="auth-form" onSubmit={submit} noValidate>
        <AuthField label="Full name" id="register-name" type="text" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
        <AuthField label="Email address" id="register-email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />
        {error && <div className="auth-alert" role="alert">{error}</div>}
        <Button type="submit" size="large" className="auth-submit" disabled={loading}>{loading ? 'Sending code...' : 'Continue'} {!loading && <ArrowRight size={17} aria-hidden="true" />}</Button>
      </form>
      <p className="auth-switch">Already have an account? <button type="button" onClick={onLogin}>Sign in</button></p>
    </AuthLayout>
  );
}

export default RegisterPage;
