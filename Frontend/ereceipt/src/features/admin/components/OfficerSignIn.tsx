import React, { useState } from 'react';
import { ReceiptText, Eye, EyeOff, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import styles from './OfficerSignIn.module.css';

interface OfficerSignInProps {
  onSuccess: () => void;
  onReturnToMerchant?: () => void;
  onNavigateToRegistration?: () => void;
}

export const OfficerSignIn: React.FC<OfficerSignInProps> = ({
  onSuccess,
  onReturnToMerchant,
  onNavigateToRegistration,
}) => {
  const [username, setUsername] = useState('officer.demo');
  const [password, setPassword] = useState('Revenue123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberOfficer, setRememberOfficer] = useState(false);
  const [authError, setAuthError] = useState('');

  const submitSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setAuthError('Enter your username and password.');
      return;
    }
    if (username !== 'officer.demo' || password !== 'Revenue123') {
      setAuthError('Invalid username or password. Check the demo credentials and try again.');
      return;
    }
    setAuthError('');
    onSuccess();
  };

  return (
    <div className={styles.container}>
      {/* Left Sign In Form */}
      <main className={styles.leftColumn}>
        <button
          type="button"
          onClick={onReturnToMerchant}
          className={styles.brandButton}
        >
          <span className={styles.brandIcon}>
            <ReceiptText size={21} />
          </span>
          <span className={styles.brandName}>eReceipt</span>
        </button>

        <div className={styles.formBox}>
          <p className={styles.preTitle}>Revenue administration</p>
          <h1 className={styles.title}>Revenue Officer Sign In</h1>
          <p className={styles.description}>
            Sign in to manage merchant verification and tax records.
          </p>

          <form onSubmit={submitSignIn} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="admin-username">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setAuthError('');
                }}
                className={`${styles.input} ${authError ? styles.inputError : ''}`}
                placeholder="Officer username"
                autoComplete="username"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="admin-password">
                Password
              </label>
              <span className={styles.passwordWrapper}>
                <input
                  id="admin-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${authError ? styles.inputError : ''}`}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </div>

            {authError && (
              <div role="alert" className={styles.errorMessage}>
                <AlertCircle size={17} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <div className={styles.optionsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberOfficer}
                  onChange={(e) => setRememberOfficer(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => alert('Demo officer credentials are: officer.demo / Revenue123')}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>
          </form>

          <div className={styles.credentialsBox}>
            <b>Prototype credentials:</b> officer.demo / Revenue123
            <br />
            Fictional demonstration data only. No government database is accessed.
          </div>

          {/* Prominent Merchant Sign Up Card */}
          <div className={styles.merchantSignupBox}>
            <div className={styles.merchantSignupInfo}>
              <span className={styles.merchantSignupTitle}>Are you a Merchant or Business Owner?</span>
              <p className={styles.merchantSignupDesc}>
                Register your business to begin issuing digital fiscal receipts and file tax reports.
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToRegistration || (() => window.location.assign('/?view=registration'))}
              className={styles.merchantSignupBtn}
            >
              Register as Merchant →
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToMerchant}
          className={styles.returnBtn}
        >
          Return to Merchant Workspace
        </button>
      </main>

      {/* Right Dark Green Marketing Banner */}
      <aside className={styles.rightBanner}>
        <div className={styles.bannerWrapper}>
          <span className={styles.shieldIcon}>
            <ShieldCheck size={28} />
          </span>
          <h2 className={styles.bannerTitle}>
            A focused workspace for accountable revenue administration.
          </h2>
          <p className={styles.bannerDesc}>
            Verify merchant identity, review fiscal records, reconcile tax reports, and record every
            administrative decision.
          </p>

          <div className={styles.featuresList}>
            {[
              'Role-based officer access',
              'Documented review decisions',
              'Merchant and TIN search',
              'Protected administrative audit trail',
            ].map((item) => (
              <p key={item} className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OfficerSignIn;
