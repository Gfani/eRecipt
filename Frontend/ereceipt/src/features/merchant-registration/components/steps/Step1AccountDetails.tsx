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
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
      </label>

      <label className="field-group">
        <span className="field-label">Phone number</span>
        <input
          required
          type="tel"
          className="field-input"
          placeholder="+251 9__ ___ ___"
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
            placeholder="Enter your password"
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
