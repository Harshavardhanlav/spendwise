import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, LogOut, RefreshCw, Settings } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AuthField from '../components/auth/AuthField';
import { changePassword, getCurrentUser, updateCurrency } from '../services/userApi';

function SettingsPage({ onUnauthorized, onLogout }) {
  const [currency, setCurrency] = useState('INR');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [visible, setVisible] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [loading, setLoading] = useState(true);
  const [currencySaving, setCurrencySaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCurrentUser().then((result) => setCurrency(result.user.currency || 'INR')).catch((requestError) => {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setError(requestError.message);
    }).finally(() => setLoading(false));
  }, []);

  const saveCurrency = async (event) => {
    event.preventDefault(); setError(''); setSuccess(''); setCurrencySaving(true);
    try {
      const result = await updateCurrency(currency);
      localStorage.setItem('spendwiseUser', JSON.stringify(result.user)); setSuccess('Currency preference saved.');
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError(requestError.message);
    } finally { setCurrencySaving(false); }
  };

  const savePassword = async (event) => {
    event.preventDefault(); setError(''); setSuccess('');
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) return setError('Complete all password fields.');
    if (passwords.newPassword.length < 8) return setError('New password must be at least 8 characters long.');
    if (passwords.newPassword !== passwords.confirmPassword) return setError('New passwords do not match.');
    setPasswordSaving(true);
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setSuccess('Password changed successfully.');
    } catch (requestError) {
      if (requestError.status === 401 && requestError.message !== 'Current password is incorrect') return onUnauthorized();
      setError(requestError.message);
    } finally { setPasswordSaving(false); }
  };

  const passwordField = (label, field, autoComplete) => <div className="password-field"><AuthField label={label} id={`settings-${field}`} type={visible[field] ? 'text' : 'password'} autoComplete={autoComplete} value={passwords[field]} onChange={(event) => setPasswords({ ...passwords, [field]: event.target.value })} /><button type="button" className="password-toggle" aria-label={visible[field] ? 'Hide password' : 'Show password'} onClick={() => setVisible({ ...visible, [field]: !visible[field] })}>{visible[field] ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>;

  if (loading) return <div className="account-state"><div className="dashboard-spinner" /><h2>Loading your settings</h2></div>;

  return <div className="account-page"><div className="account-intro"><div><span className="eyebrow">Preferences</span><h2>Settings</h2><p>Manage your currency and account security.</p></div></div>{(error || success) && <div className={error ? 'auth-alert' : 'auth-note'} role={error ? 'alert' : 'status'}>{error || success}</div>}<div className="settings-grid"><Card><CardHeader title="Currency" description="Used when displaying your financial amounts" /><CardBody><form className="account-form" onSubmit={saveCurrency}><div className="auth-field"><label htmlFor="settings-currency">Preferred currency</label><select id="settings-currency" value={currency} onChange={(event) => setCurrency(event.target.value)}><option value="INR">INR — Indian Rupee</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — Pound Sterling</option></select></div><Button type="submit" disabled={currencySaving}>{currencySaving ? 'Saving...' : 'Save currency'}</Button></form></CardBody></Card><Card><CardHeader title="Change password" description="Confirm your current password before changing it" /><CardBody><form className="account-form" onSubmit={savePassword}>{passwordField('Current password', 'currentPassword', 'current-password')}{passwordField('New password', 'newPassword', 'new-password')}{passwordField('Confirm new password', 'confirmPassword', 'new-password')}<Button type="submit" disabled={passwordSaving}>{passwordSaving ? 'Changing password...' : 'Change password'}</Button></form></CardBody></Card><Card><CardHeader title="Security" description="End your current SpendWise session" /><CardBody><Button variant="danger" icon={<LogOut size={16} />} onClick={onLogout}>Log out</Button></CardBody></Card></div></div>;
}

export default SettingsPage;
