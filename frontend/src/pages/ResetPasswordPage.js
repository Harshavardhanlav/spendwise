import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import Button from '../components/ui/Button';
import { resetPassword } from '../services/authApi';

function ResetPasswordPage({ email, onComplete, onLogin }) {
  const [form, setForm] = useState({ code: '', newPassword: '', confirmPassword: '' });
  const [visible, setVisible] = useState({ newPassword: false, confirmPassword: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(form.code)) return setError('Enter the 6-digit reset code.');
    if (form.newPassword.length < 8) return setError('Password must be at least 8 characters long.');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      await resetPassword({ email, code: form.code, newPassword: form.newPassword });
      setSuccess(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout eyebrow="Password reset" title="You are back in control" description="Your password has been updated successfully.">
        <div className="reset-success" role="status"><CheckCircle2 size={24} aria-hidden="true" /><p>You can now sign in with your new password.</p></div>
        <Button type="button" size="large" className="auth-submit" onClick={onComplete}>Return to sign in <ArrowRight size={17} aria-hidden="true" /></Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="Password reset" title="Choose a new password" description={<>Enter the code sent to <strong className="auth-email">{email}</strong>.</>}>
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field"><label htmlFor="reset-code">Reset code</label><input id="reset-code" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.replace(/\D/g, '') })} placeholder="000000" /></div>
        <div className="password-field"><AuthField label="New password" id="reset-password" type={visible.newPassword ? 'text' : 'password'} autoComplete="new-password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} placeholder="At least 8 characters" /><button type="button" className="password-toggle" onClick={() => setVisible({ ...visible, newPassword: !visible.newPassword })} aria-label={visible.newPassword ? 'Hide password' : 'Show password'}>{visible.newPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <div className="password-field"><AuthField label="Confirm new password" id="reset-confirm-password" type={visible.confirmPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Re-enter your password" /><button type="button" className="password-toggle" onClick={() => setVisible({ ...visible, confirmPassword: !visible.confirmPassword })} aria-label={visible.confirmPassword ? 'Hide password' : 'Show password'}>{visible.confirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {error && <div className="auth-alert" role="alert">{error}</div>}
        <Button type="submit" size="large" className="auth-submit" disabled={loading}>{loading ? 'Resetting password...' : 'Reset password'} {!loading && <ArrowRight size={17} aria-hidden="true" />}</Button>
      </form>
      <p className="auth-switch"><button type="button" onClick={onLogin}>Return to sign in</button></p>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
