import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { MerchantRegistrationFormData } from '../../types';
import styles from './Step1AccountDetails.module.css';

interface Step1Props {
  formData: MerchantRegistrationFormData;
  onChange: (patch: Partial<MerchantRegistrationFormData>) => void;
}

export const Step1AccountDetails: React.FC<Step1Props> = ({ formData, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.stepContainer}>
      <label className="field-group">
        <span className="field-label">Full name</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          placeholder="e.g. Abeba Tesfaye"
          value={formData.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </label>

      <label className="field-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="field-label">Official business email *</span>
          {formData.emailVerified && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ✓ Verified
            </span>
          )}
        </div>
        <input
          required
          type="email"
          className="field-input"
          autoComplete="off"
          placeholder="e.g. merchant@company.com"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value, emailVerified: false })}
        />
      </label>

      <label className="field-group">
        <span className="field-label">Phone number</span>
        <input
          required
          type="tel"
          className="field-input"
          autoComplete="off"
          placeholder="e.g. +251 911 234 567"
          value={formData.phoneNumber}
          onChange={(e) => onChange({ phoneNumber: e.target.value })}
        />
      </label>

      <div className="field-group">
        <label className="field-label" htmlFor="account-password">
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="account-password"
            required
            type={showPassword ? 'text' : 'password'}
            className={`field-input ${styles.passwordInput}`}
            autoComplete="new-password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={(e) => onChange({ password: e.target.value })}
          />
          <button
            type="button"
            className={styles.togglePasswordBtn}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1AccountDetails;
