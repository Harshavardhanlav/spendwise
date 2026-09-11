import React, { useState } from 'react';
import { ArrowRight, MailCheck } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/ui/Button';
import { verifyEmail } from '../services/authApi';

function VerifyEmailPage({ email, onVerified, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setResendMessage('');
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit verification code.');

    setLoading(true);
    try {
      await verifyEmail({ email, verificationCode: code });
      onVerified();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = () => {
    setError('');
    setResendMessage('Resending codes is not available in the current backend API. Please register again if the code expired.');
  };

  return (
    <AuthLayout eyebrow="Verify your email" title="Check your inbox" description={<>We sent a 6-digit code to <strong className="auth-email">{email}</strong>.</>}>
      <div className="verify-icon"><MailCheck size={24} aria-hidden="true" /></div>
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-field"><label htmlFor="verification-code">Verification code</label><input id="verification-code" inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} placeholder="000000" /></div>
        {error && <div className="auth-alert" role="alert">{error}</div>}
        {resendMessage && <div className="auth-note" role="status">{resendMessage}</div>}
        <Button type="submit" size="large" className="auth-submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify email'} {!loading && <ArrowRight size={17} aria-hidden="true" />}</Button>
      </form>
      <div className="verify-actions"><button type="button" onClick={resend}>Resend code</button><button type="button" onClick={onBack}>Use a different email</button></div>
    </AuthLayout>
  );
}

export default VerifyEmailPage;
