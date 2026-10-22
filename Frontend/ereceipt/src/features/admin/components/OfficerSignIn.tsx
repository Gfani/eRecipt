import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import styles from './OfficerSignIn.module.css';

interface OfficerSignInProps {
  onSuccess: () => void;
  onReturnToMerchant?: () => void;
}

export const OfficerSignIn: React.FC<OfficerSignInProps> = ({
  onSuccess,
  onReturnToMerchant,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Sign In state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberOfficer, setRememberOfficer] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    setUsername('');
    setPassword('');
    const timer = setTimeout(() => {
      setIsFormReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [authMode]);

  // Registration state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regBadgeNumber, setRegBadgeNumber] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBranch, setRegBranch] = useState('Addis Ababa Large Taxpayers Branch');
  const [regRole, setRegRole] = useState<'REVENUE_OFFICER' | 'SENIOR_AUDITOR' | 'ADMIN'>('REVENUE_OFFICER');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [certifyAuthorized, setCertifyAuthorized] = useState(false);

  // Common state
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Sign In submission
  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!username.trim() || !password) {
      setAuthError('Please enter your username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe: rememberOfficer,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      if (data.data?.token) {
        localStorage.setItem('officer_token', data.data.token);
        localStorage.setItem('officer_user', JSON.stringify(data.data.officer));
      }
      onSuccess();
    } catch (err: any) {
      setAuthError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Registration submission
  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!regFullName.trim() || !regUsername.trim() || !regBadgeNumber.trim() || !regEmail.trim() || !regPassword) {
      setAuthError('All fields marked with an asterisk are required.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!certifyAuthorized) {
      setAuthError('Please certify that you are an authorized Ministry of Revenues officer.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/admin/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          username: regUsername.trim(),
          badgeNumber: regBadgeNumber.trim().toUpperCase(),
          email: regEmail.trim(),
          branch: regBranch,
          role: regRole,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed. Please check your information.');
      }

      if (data.data?.token) {
        localStorage.setItem('officer_token', data.data.token);
        localStorage.setItem('officer_user', JSON.stringify(data.data.officer));
      }
      onSuccess();
    } catch (err: any) {
      setAuthError(err.message || 'Officer registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Form Column */}
      <main className={styles.leftColumn}>
        <div className={styles.brandRow}>
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

          {/* Mode Switcher Tabs */}
          <div className={styles.tabSwitcher}>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError('');
              }}
              className={`${styles.tabSwitchBtn} ${authMode === 'signin' ? styles.tabSwitchBtnActive : ''}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
              }}
              className={`${styles.tabSwitchBtn} ${authMode === 'register' ? styles.tabSwitchBtnActive : ''}`}
            >
              Officer Registration
            </button>
          </div>
        </div>

        <div className={styles.formBox}>
          {authMode === 'signin' ? (
            /* ================= SIGN IN FORM ================= */
            <>
              <p className={styles.preTitle}>REVENUE ADMINISTRATION</p>
              <h1 className={styles.title}>Revenue Officer Sign In</h1>
              <p className={styles.description}>
                Sign in to manage merchant verification, tax reconciliations, and audit records.
              </p>

              <form onSubmit={submitSignIn} className={styles.form} autoComplete="off">
                {/* Browser credential autofill trap */}
                <input
                  type="text"
                  name="fake_officer_user"
                  style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <input
                  type="password"
                  name="fake_officer_pass"
                  style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                  tabIndex={-1}
                  aria-hidden="true"
                />

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="officer-identifier">
                    Username
                  </label>
                  <input
                    id="officer-identifier"
                    name="officer_acc_code"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setAuthError('');
                    }}
                    onFocus={() => setIsFormReady(true)}
                    readOnly={!isFormReady}
                    className={`${styles.input} ${authError ? styles.inputError : ''}`}
                    placeholder="Officer username"
                    autoComplete="off"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="officer-credential">
                    Password
                  </label>
                  <span className={styles.passwordWrapper}>
                    <input
                      id="officer-credential"
                      name="officer_sec_token"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setAuthError('');
                      }}
                      onFocus={() => setIsFormReady(true)}
                      readOnly={!isFormReady}
                      type={showPassword ? 'text' : 'password'}
                      className={`${styles.input} ${authError ? styles.inputError : ''}`}
                      placeholder="Enter password"
                      autoComplete="new-password"
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
                    onClick={() => alert('Please contact the Ministry system administrator to reset your credentials.')}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? 'Signing In...' : 'Sign In as Officer'}
                </button>
              </form>

              <div className={styles.switchPromptBox}>
                <span>Need authorized officer access? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={styles.switchInlineBtn}
                >
                  Register new officer profile
                </button>
              </div>
            </>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <>
              <p className={styles.preTitle}>OFFICER ACCREDITATION</p>
              <h1 className={styles.title}>Admin & Officer Registration</h1>
              <p className={styles.description}>
                Create an official administrative profile to review merchant registrations and inspect fiscal records.
              </p>

              <form onSubmit={submitRegistration} className={styles.form}>
                <div className={styles.gridTwoCols}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-fullname">
                      Full Name *
                    </label>
                    <input
                      id="reg-fullname"
                      type="text"
                      value={regFullName}
                      onChange={(e) => {
                        setRegFullName(e.target.value);
                        setAuthError('');
                      }}
                      className={styles.input}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-username">
                      Officer Username *
                    </label>
                    <input
                      id="reg-username"
                      type="text"
                      value={regUsername}
                      onChange={(e) => {
                        setRegUsername(e.target.value);
                        setAuthError('');
                      }}
                      className={styles.input}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div className={styles.gridTwoCols}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-badge">
                      Officer Badge / ID *
                    </label>
                    <input
                      id="reg-badge"
                      type="text"
                      value={regBadgeNumber}
                      onChange={(e) => {
                        setRegBadgeNumber(e.target.value);
                        setAuthError('');
                      }}
                      className={styles.input}
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-email">
                      Official Government Email *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        setAuthError('');
                      }}
                      className={styles.input}
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div className={styles.gridTwoCols}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-branch">
                      Operational Revenue Branch
                    </label>
                    <select
                      id="reg-branch"
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      className={styles.selectInput}
                    >
                      <option>Addis Ababa Large Taxpayers Branch</option>
                      <option>Bole Sub-city Revenue Branch</option>
                      <option>Kirkos Sub-city Tax Center</option>
                      <option>Central Tax Enforcement Division</option>
                      <option>Ministry of Revenues Head Office</option>
                      <option>Hawassa Regional Revenue Directorate</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-role">
                      Administrative Role
                    </label>
                    <select
                      id="reg-role"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className={styles.selectInput}
                    >
                      <option value="REVENUE_OFFICER">Revenue Officer (Inspector)</option>
                      <option value="SENIOR_AUDITOR">Senior Tax Auditor</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                  </div>
                </div>

                <div className={styles.gridTwoCols}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-password">
                      Password *
                    </label>
                    <span className={styles.passwordWrapper}>
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          setAuthError('');
                        }}
                        className={styles.input}
                        placeholder="Min 6 characters"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                        className={styles.eyeButton}
                      >
                        {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </span>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="reg-confirm">
                      Confirm Password *
                    </label>
                    <input
                      id="reg-confirm"
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        setAuthError('');
                      }}
                      className={styles.input}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {authError && (
                  <div role="alert" className={styles.errorMessage}>
                    <AlertCircle size={17} style={{ flexShrink: 0 }} />
                    <span>{authError}</span>
                  </div>
                )}

                <div className={styles.certificationBox}>
                  <label className={styles.certLabel}>
                    <input
                      type="checkbox"
                      checked={certifyAuthorized}
                      onChange={(e) => {
                        setCertifyAuthorized(e.target.checked);
                        setAuthError('');
                      }}
                      className={styles.checkbox}
                    />
                    <span>
                      I hereby declare and certify that I am a duly appointed officer of the Ministry of Revenues
                      (MoR) authorized to inspect taxpayer receipts and approve registration filings.
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? 'Registering Officer...' : 'Register Revenue Officer'}
                </button>
              </form>

              <div className={styles.switchPromptBox}>
                <span>Already registered with an officer profile? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError('');
                  }}
                  className={styles.switchInlineBtn}
                >
                  Sign in here
                </button>
              </div>
            </>
          )}
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
            {authMode === 'register'
              ? 'Accredited Officer Identity & Verification Workspace'
              : 'A focused workspace for accountable revenue administration.'}
          </h2>
          <p className={styles.bannerDesc}>
            {authMode === 'register'
              ? 'All officer accounts are securely registered and tied to Ministry badge credentials. Audit trails record every clearance, rejection, and tax adjustment.'
              : 'Verify merchant identity, review fiscal records, reconcile tax reports, and record every administrative decision.'}
          </p>

          <div className={styles.featuresList}>
            {[
              'Role-based officer access control',
              'Documented administrative audit logging',
              'Merchant application verification & clearance',
              'Protected MoR administrative audit trail',
            ].map((item) => (
              <p key={item} className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>{item}</span>
              </p>
            ))}
          </div>

          <div className={styles.bannerNotice}>
            <p className={styles.bannerNoticeTitle}>FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA</p>
            <p className={styles.bannerNoticeSub}>Ministry of Revenues · Electronic Fiscal Management System</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default OfficerSignIn;
