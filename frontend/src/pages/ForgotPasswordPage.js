import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import Button from '../components/ui/Button';
import { forgotPassword } from '../services/authApi';

function ForgotPasswordPage({ onSubmitted, onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email: email.trim().toLowerCase() });
      onSubmitted(email.trim().toLowerCase());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Password reset" title="Find your way back in" description="Enter your account email and we will send a reset code if an account exists.">
      <div className="password-guidance"><Mail size={17} aria-hidden="true" /><span>We will never reveal whether an email is registered.</span></div>
      <form className="auth-form" onSubmit={submit} noValidate>
        <AuthField label="Email address" id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        {error && <div className="auth-alert" role="alert">{error}</div>}
        <Button type="submit" size="large" className="auth-submit" disabled={loading}>{loading ? 'Sending code...' : 'Send reset code'} {!loading && <ArrowRight size={17} aria-hidden="true" />}</Button>
      </form>
      <p className="auth-switch"><button type="button" onClick={onLogin}>Return to sign in</button></p>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
