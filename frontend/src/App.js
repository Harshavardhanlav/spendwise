import './App.css';
import React, { useState } from 'react';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SetPasswordPage from './pages/SetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const pages = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  categories: CategoriesPage,
  reports: ReportsPage,
  profile: ProfilePage,
  settings: SettingsPage,
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [authStage, setAuthStage] = useState(() => (localStorage.getItem('spendwiseToken') ? 'app' : 'login'));
  const [authEmail, setAuthEmail] = useState('');
  const Page = pages[activePage];
  const logout = () => {
    localStorage.removeItem('spendwiseToken');
    localStorage.removeItem('spendwiseUser');
    setAuthStage('login');
  };

  if (authStage === 'login') {
    return <LoginPage onLogin={() => setAuthStage('app')} onRegister={() => setAuthStage('register')} onForgotPassword={() => setAuthStage('forgot-password')} />;
  }

  if (authStage === 'register') {
    return <RegisterPage onRegistered={(email) => { setAuthEmail(email); setAuthStage('verify'); }} onLogin={() => setAuthStage('login')} />;
  }

  if (authStage === 'verify') {
    return <VerifyEmailPage email={authEmail} onVerified={() => setAuthStage('set-password')} onBack={() => setAuthStage('register')} />;
  }

  if (authStage === 'set-password') {
    return <SetPasswordPage email={authEmail} onComplete={() => setAuthStage('login')} />;
  }

  if (authStage === 'forgot-password') {
    return <ForgotPasswordPage onSubmitted={(email) => { setAuthEmail(email); setAuthStage('reset-password'); }} onLogin={() => setAuthStage('login')} />;
  }

  if (authStage === 'reset-password') {
    return <ResetPasswordPage email={authEmail} onComplete={() => setAuthStage('login')} onLogin={() => setAuthStage('login')} />;
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage} onLogout={logout}>
      <Page onUnauthorized={logout} />
    </AppShell>
  );
}

export default App;
