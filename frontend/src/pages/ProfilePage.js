import React, { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, UserRound } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AuthField from '../components/auth/AuthField';
import { getCurrentUser, updateProfile } from '../services/userApi';

const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(value)) : 'Not available';

function ProfilePage({ onUnauthorized }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUser = async () => {
    setLoading(true); setError('');
    try {
      const result = await getCurrentUser();
      setUser(result.user); setName(result.user.name || '');
      localStorage.setItem('spendwiseUser', JSON.stringify(result.user));
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError(requestError.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadUser(); }, []);

  const saveName = async (event) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (name.trim().length < 2 || name.trim().length > 50) return setError('Name must be between 2 and 50 characters.');
    setSaving(true);
    try {
      const result = await updateProfile({ name: name.trim() });
      setUser(result.user); setName(result.user.name);
      localStorage.setItem('spendwiseUser', JSON.stringify(result.user)); setSuccess('Profile updated successfully.');
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError(requestError.message);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="account-state"><div className="dashboard-spinner" /><h2>Loading your profile</h2></div>;
  if (error && !user) return <div className="account-state account-error"><h2>Unable to load your profile</h2><p>{error}</p><button type="button" className="button button-secondary" onClick={loadUser}><RefreshCw size={15} /> Retry</button></div>;

  return <div className="account-page"><div className="account-intro"><div><span className="eyebrow">Account</span><h2>Profile</h2><p>Your personal account information.</p></div></div><Card><CardBody><div className="profile-hero"><div className="profile-avatar"><UserRound size={28} /></div><div><h3>{user.name}</h3><p>{user.email}</p><span className={user.isEmailVerified ? 'verified-label' : 'unverified-label'}>{user.isEmailVerified && <CheckCircle2 size={14} />} {user.isEmailVerified ? 'Email verified' : 'Email not verified'}</span></div></div></CardBody></Card><div className="account-grid"><Card><CardHeader title="Account details" description="Read-only account information" /><CardBody><dl className="account-details"><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Currency</dt><dd>{user.currency || 'INR'}</dd></div><div><dt>Member since</dt><dd>{formatDate(user.createdAt)}</dd></div></dl></CardBody></Card><Card><CardHeader title="Edit profile" description="Email changes require a separate verification flow" /><CardBody><form className="account-form" onSubmit={saveName}><AuthField label="Name" id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /><div className="auth-field"><label htmlFor="profile-email">Email</label><input id="profile-email" value={user.email} readOnly /></div>{(error || success) && <div className={error ? 'auth-alert' : 'auth-note'} role={error ? 'alert' : 'status'}>{error || success}</div>}<Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button></form></CardBody></Card></div></div>;
}

export default ProfilePage;
