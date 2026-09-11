import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import Button from '../components/ui/Button';
import { setPassword } from '../services/authApi';

function SetPasswordPage({ email, onComplete }) {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Password must be at least 8 characters long.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      await setPassword({ email, password: form.password });
      onComplete();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Secure your account" title="Set your password" description="Choose a password with at least 8 characters. You will use it to sign in to SpendWise.">
      <div className="password-guidance"><LockKeyhole size={17} aria-hidden="true" /><span>Password setup for <strong>{email}</strong></span></div>
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="password-field"><AuthField label="Password" id="new-password" type={visible.password ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /><button type="button" className="password-toggle" onClick={() => setVisible({ ...visible, password: !visible.password })} aria-label={visible.password ? 'Hide password' : 'Show password'}>{visible.password ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <div className="password-field"><AuthField label="Confirm password" id="confirm-password" type={visible.confirmPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Re-enter your password" /><button type="button" className="password-toggle" onClick={() => setVisible({ ...visible, confirmPassword: !visible.confirmPassword })} aria-label={visible.confirmPassword ? 'Hide password' : 'Show password'}>{visible.confirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {error && <div className="auth-alert" role="alert">{error}</div>}
        <Button type="submit" size="large" className="auth-submit" disabled={loading}>{loading ? 'Saving password...' : 'Set password'} {!loading && <ArrowRight size={17} aria-hidden="true" />}</Button>
      </form>
    </AuthLayout>
  );
}

export default SetPasswordPage;
