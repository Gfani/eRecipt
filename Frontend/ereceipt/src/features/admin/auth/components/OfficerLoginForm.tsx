import React, { useState } from 'react';
import styles from './OfficerLoginForm.module.css';

interface OfficerLoginFormProps {
  onLogin?: () => void;
  onReturnToMerchant?: () => void;
}

export const OfficerLoginForm: React.FC<OfficerLoginFormProps> = ({
  onLogin,
  onReturnToMerchant,
}) => {
  const [username, setUsername] = useState('officer.demo');
  const [password, setPassword] = useState('Revenue123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('http://localhost:5000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.data?.token) {
        localStorage.setItem('officer_token', data.data.token);
        localStorage.setItem('officer_user', JSON.stringify(data.data.officer));
      }
      onLogin?.();
    } catch (err: any) {
      // In development fallback, if standard demo credentials match, proceed
      if (username.trim().toLowerCase() === 'officer.demo' && password === 'Revenue123') {
        localStorage.setItem('officer_token', 'demo-token');
        onLogin?.();
      } else {
        setLoginError(err.message || 'Invalid username or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Form Column */}
      <div className={styles.leftColumn}>
        <div className={styles.formWrapper}>
          {/* Logo Brand Header */}
          <div className={styles.brandHeader}>
            <div className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className={styles.brandTitle}>eReceipt</span>
          </div>

          {/* Form Titles */}
          <div className={styles.titlesGroup}>
            <span className={styles.preTitle}>REVENUE ADMINISTRATION</span>
            <h1 className={styles.mainTitle}>Revenue Officer Sign In</h1>
            <p className={styles.description}>
              Sign in to manage merchant verification and tax records.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {loginError && (
              <div style={{ padding: '0.65rem 0.85rem', marginBottom: '1rem', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>
                {loginError}
              </div>
            )}
            {/* Username Input */}
            <div className={styles.fieldGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Officer username"
                required
                className={styles.input}
              />
            </div>

            {/* Password Input */}
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                  aria-label="Toggle password visibility"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Checkbox & Forgot Password */}
            <div className={styles.optionsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className={styles.forgotLink}>
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Prototype Credentials Box */}
          <div className={styles.credentialsBox}>
            <p className={styles.credentialsText}>
              <strong>Prototype credentials:</strong> officer.demo / Revenue123
            </p>
            <p className={styles.credentialsSubtext}>
              Fictional demonstration data only. No government database is accessed.
            </p>
          </div>

          {/* Return Footer Link */}
          <div className={styles.footerRow}>
            <button
              type="button"
              onClick={onReturnToMerchant || (() => window.location.assign('/'))}
              className={styles.returnLink}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Return to eReceipt
            </button>
          </div>
        </div>
      </div>

      {/* Right Dark Green Marketing Banner */}
      <div className={styles.rightColumn}>
        <div className={styles.bannerContent}>
          {/* Shield Icon */}
          <div className={styles.shieldIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          {/* Main Headline */}
          <h2 className={styles.bannerTitle}>
            A focused workspace for accountable revenue administration.
          </h2>

          <p className={styles.bannerDescription}>
            Verify merchant identity, review fiscal records, reconcile tax reports, and record every administrative decision.
          </p>

          {/* Checkmark List */}
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Role-based officer access</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Documented review decisions</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Merchant and TIN search</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Protected administrative audit trail</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};