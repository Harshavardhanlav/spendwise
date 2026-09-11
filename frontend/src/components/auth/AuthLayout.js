import React from 'react';
import { ShieldCheck, Wallet } from 'lucide-react';

function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <div className="auth-brand"><span className="brand-mark"><Wallet size={18} aria-hidden="true" /></span>SpendWise</div>
        <div className="auth-aside-copy">
          <span className="eyebrow">Personal finance, made clear</span>
          <h1>Make room for what matters.</h1>
          <p>One quiet place to understand your money and make your next decision with confidence.</p>
        </div>
        <div className="auth-aside-note"><ShieldCheck size={16} aria-hidden="true" /><span>Your data stays tied to your private account.</span></div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
