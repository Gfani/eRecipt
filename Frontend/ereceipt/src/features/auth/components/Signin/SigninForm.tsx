import React, { useState } from 'react';
import axios from 'axios';
import { Logo } from '../../../../components/ui/Logo/Logo';
import { saveStoredMerchantProfile } from '../../../merchant-registration/profileStorage';
import { syncMerchantReceipts } from '../../../../services/merchantDataStore';
import styles from './SigninForm.module.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface AuthenticatedMerchant {
  id: string;
  role: string;
  tin: string;
  businessName: string;
  tradeName?: string;
  status: string;
}

export interface SigninFormProps {
  onLoginSuccess?: (merchant: AuthenticatedMerchant) => void;
  onSuccess?: (authData?: { token: string; user: any }) => void;
  onNavigateToRegister?: () => void;
  onRegisterClick?: () => void;
  onNavigateToHome?: () => void;
  onNavigateHome?: () => void;
  onHomeClick?: () => void;
  onAdminClick?: () => void;
}

export type LoginFormProps = SigninFormProps;

export const LoginForm: React.FC<SigninFormProps> = ({
  onLoginSuccess,
  onSuccess,
  onNavigateToRegister,
  onRegisterClick,
  onNavigateToHome,
  onNavigateHome,
  onHomeClick,
  onAdminClick,
}) => {
  const handleRegister = onNavigateToRegister || onRegisterClick;
  const handleHome = onNavigateToHome || onNavigateHome || onHomeClick;
  const [tin, setTin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tinError, setTinError] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleTinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // only allow digits
    if (value.length <= 10) {
      setTin(value);
      if (tinError) setTinError('');
      if (authError) setAuthError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (tin.length !== 10) {
      setTinError('Please enter a valid 10-digit TIN');
      return;
    }

    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/merchant/login`, {
        tin: tin.trim(),
        password,
        rememberMe,
      });

      const data = response.data?.data || response.data;
      const token = data.token;
      const merchant = data.user;

      if (token && merchant) {
        localStorage.setItem('ereceipt_token', token);
        localStorage.setItem('ereceipt_merchant', JSON.stringify(merchant));
        localStorage.setItem('merchant_token', token);
        localStorage.setItem('merchant_user', JSON.stringify(merchant));
        if (!rememberMe) {
          sessionStorage.setItem('ereceipt_token', token);
          sessionStorage.setItem('ereceipt_merchant', JSON.stringify(merchant));
        }

        // Set authoritative active profile for this merchant to ensure isolation
        saveStoredMerchantProfile({
          fullName: merchant.fullName || merchant.businessName || '',
          phoneNumber: merchant.phoneNumber || '',
          sellerLegalName: merchant.businessName || merchant.sellerLegalName || '',
          tradeName: merchant.tradeName || merchant.businessName || '',
          tin: merchant.tin,
          businessLicenseNumber: merchant.businessLicenseNumber || '',
          uploadedFileName: '',
          uploadedFileSize: '',
          city: merchant.city || '',
          subCity: merchant.subCity || '',
          buildingName: merchant.buildingName || '',
          floor: merchant.floor || '',
          gpsLocation: merchant.gpsLocation || '',
          referenceNumber: merchant.referenceNumber || '',
          status: merchant.status || 'Approved',
          registeredAt: merchant.registeredAt || new Date().toISOString(),
        });

        // Sync real receipts from backend for this merchant (and ONLY this merchant)
        syncMerchantReceipts(merchant.tin, token);
      }

      setIsLoading(false);

      if (onLoginSuccess) {
        onLoginSuccess(merchant);
      }
      if (onSuccess) {
        onSuccess(data);
      }
      if (!onLoginSuccess && !onSuccess) {
        window.location.href = '/merchant/overview';
      }
    } catch (err: unknown) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to sign in. Please verify your TIN and password.';
        setAuthError(errorMsg);
      } else if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('An unexpected authentication error occurred.');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Form Area */}
      <div className={styles.leftColumn}>
        <div className={styles.formWrapper}>
          {/* Logo Header */}
          <div className={styles.brandRow}>
            <Logo onClick={handleHome ? handleHome : () => { window.location.href = '/'; }} />
          </div>

          {/* Titles & Pre-header */}
          <div className={styles.titleSection}>
            <span className={styles.preTitle}>MERCHANT WORKSPACE</span>
            <h1 className={styles.mainHeading}>Welcome back</h1>
            <p className={styles.subHeading}>
              Sign in to record sales and manage digital receipts.
            </p>
          </div>

          {authError && (
            <div
              className={
                authError.toLowerCase().includes('pending') ||
                authError.toLowerCase().includes('review')
                  ? styles.alertWarningBox
                  : styles.alertBox
              }
              role="alert"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* TIN Input */}
            <div className={styles.fieldGroup}>
              <label htmlFor="tin" className={styles.label}>
                Taxpayer Identification Number (TIN)
              </label>
              <input
                id="tin"
                type="text"
                value={tin}
                onChange={handleTinChange}
                placeholder="Enter your 10-digit TIN"
                required
                className={`${styles.input} ${tinError ? styles.inputError : ''}`}
                maxLength={10}
              />
              {tinError && <span className={styles.errorMessage}>{tinError}</span>}
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
                  placeholder="Enter your password"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                  aria-label="Toggle password visibility"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Options Row (Remember me & Forgot password) */}
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
              <a href="#forgot-password" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {/* Sign In CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Registration Link */}
          <div className={styles.signupPrompt}>
            <span>New to eReceipt? </span>
            <button
              type="button"
              onClick={handleRegister ? handleRegister : () => { window.location.href = '/?view=registration'; }}
              className={styles.signupLink}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#16A34A',
                fontWeight: 600,
                cursor: 'pointer',
                font: 'inherit',
                textDecoration: 'underline',
              }}
            >
              Create an account
            </button>
          </div>

          {/* Revenue Authority Officer Link */}
          <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '13px', color: '#526059' }}>
            <span>Revenue Authority Officer? </span>
            <button
              type="button"
              onClick={onAdminClick ? onAdminClick : () => { window.location.href = '/?view=admin'; }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#123D2C',
                fontWeight: 600,
                cursor: 'pointer',
                font: 'inherit',
                textDecoration: 'underline',
              }}
            >
              Sign in to Admin Portal
            </button>
          </div>

          {/* Privacy Disclaimer Footer */}
          <div className={styles.disclaimerText}>
            Your information is used only to operate and secure your account.
          </div>
        </div>
      </div>

      {/* Right Navy Branded Banner */}
      <div className={styles.rightColumn}>
        <div className={styles.bannerContent}>
          {/* Top Receipt Badge Icon */}
          <div className={styles.badgeWrapper}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
              <line x1="8" y1="8" x2="16" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="12" y2="16" />
            </svg>
          </div>

          <h2 className={styles.bannerHeadline}>
            Your sales, receipts, and records in one calm workspace.
          </h2>

          <p className={styles.bannerSubtext}>
            Designed for everyday business in Ethiopia, with clear ETB amounts and practical workflows.
          </p>

          {/* 2x2 Feature List with Checkmarks */}
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <span className={styles.checkCircle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Faster sale entry</span>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.checkCircle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Digital-first receipts</span>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.checkCircle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Searchable records</span>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.checkCircle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Traceable changes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;