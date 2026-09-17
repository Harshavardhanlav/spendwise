import './App.css';
import React, { useEffect, useState } from 'react';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import BudgetsPage from './pages/BudgetsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SetPasswordPage from './pages/SetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { getCurrentUser } from './services/userApi';

const pages = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  categories: CategoriesPage,
  reports: ReportsPage,
  budgets: BudgetsPage,
  profile: ProfilePage,
  settings: SettingsPage,
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('spendwiseUser');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const getPendingRegistrationEmail = () => {
  const email = sessionStorage.getItem('spendwisePendingEmail');
  return email && email.includes('@') ? email : '';
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [authStage, setAuthStage] = useState(() => getPendingRegistrationEmail() ? 'verify' : 'login');
  const [authEmail, setAuthEmail] = useState(() => getPendingRegistrationEmail());
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('spendwiseToken');
    if (!token) {
      setCurrentUser(null);
      setAuthStage(getPendingRegistrationEmail() ? 'verify' : 'login');
      setAuthLoading(false);
      return undefined;
    }

    let mounted = true;
    getCurrentUser()
      .then(({ user }) => {
        if (!mounted) return;
        setCurrentUser(user);
        setAuthStage('app');
        setActivePage('dashboard');
      })
      .catch(() => {
        if (!mounted) return;
        localStorage.removeItem('spendwiseToken');
        localStorage.removeItem('spendwiseUser');
        setCurrentUser(null);
        setAuthStage('login');
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const Page = pages[activePage];
  const logout = () => {
    localStorage.removeItem('spendwiseToken');
    localStorage.removeItem('spendwiseUser');
    setCurrentUser(null);
    setAuthStage('login');
    setActivePage('dashboard');
  };

  const loginSuccess = (user) => {
    setCurrentUser(user);
    setAuthStage('app');
    setActivePage('dashboard');
  };

  if (authLoading) {
    return (
      <div className="account-state">
        <div className="dashboard-spinner" />
        <h2>Checking your session</h2>
      </div>
    );
  }

  if (authStage === 'login') {
    return <LoginPage onLogin={loginSuccess} onRegister={() => setAuthStage('register')} onForgotPassword={() => setAuthStage('forgot-password')} />;
  }

  if (authStage === 'register') {
    return <RegisterPage onRegistered={(email) => { sessionStorage.setItem('spendwisePendingEmail', email); setAuthEmail(email); setAuthStage('verify'); }} onLogin={() => setAuthStage('login')} />;
  }

  if (authStage === 'verify') {
    return <VerifyEmailPage email={authEmail} onVerified={() => { sessionStorage.removeItem('spendwisePendingEmail'); setAuthStage('set-password'); }} onBack={() => { sessionStorage.removeItem('spendwisePendingEmail'); setAuthStage('register'); }} />;
  }

  if (authStage === 'set-password') {
    return <SetPasswordPage email={authEmail} onComplete={() => { sessionStorage.removeItem('spendwisePendingEmail'); setAuthStage('login'); }} />;
  }

  if (authStage === 'forgot-password') {
    return <ForgotPasswordPage onSubmitted={(email) => { setAuthEmail(email); setAuthStage('reset-password'); }} onLogin={() => setAuthStage('login')} />;
  }

  if (authStage === 'reset-password') {
    return <ResetPasswordPage email={authEmail} onComplete={() => setAuthStage('login')} onLogin={() => setAuthStage('login')} />;
  }

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage} onLogout={logout}>
      <Page currentUser={currentUser} onUnauthorized={logout} onLogout={logout} />
    </AppShell>
  );
}

export default App;
