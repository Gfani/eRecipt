import React from 'react';
import type { MerchantRegistrationFormData } from '../../types';
import styles from './Step2TaxIdentity.module.css';

interface Step2Props {
  formData: MerchantRegistrationFormData;
  onChange: (patch: Partial<MerchantRegistrationFormData>) => void;
}

export const Step2TaxIdentity: React.FC<Step2Props> = ({ formData, onChange }) => {
  const handleTinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange({ tin: rawVal });
  };

  return (
    <div className={styles.stepContainer}>
      <label className="field-group">
        <span className="field-label">Seller legal name</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          placeholder="Registered business / corporate name"
          value={formData.sellerLegalName}
          onChange={(e) => onChange({ sellerLegalName: e.target.value })}
        />
      </label>

      <label className="field-group">
        <span className="field-label">Trade name</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          placeholder="Commercial / trade name"
          value={formData.tradeName}
          onChange={(e) => onChange({ tradeName: e.target.value })}
        />
      </label>

      <div className="field-group">
        <label className="field-label" htmlFor="merchant-tin">
          10-digit Taxpayer Identification Number (TIN)
        </label>
        <input
          id="merchant-tin"
          required
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          className="field-input"
          autoComplete="off"
          placeholder="0000000000"
          value={formData.tin}
          onChange={handleTinChange}
        />
        <span className={styles.tinHint}>
          Must be exactly 10 numeric digits. Currently: {formData.tin.length}/10 digits
        </span>
      </div>

      <label className="field-group">
        <span className="field-label">Business license number</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          placeholder="e.g. BL/AA/2026/00000"
          value={formData.businessLicenseNumber}
          onChange={(e) => onChange({ businessLicenseNumber: e.target.value })}
        />
      </label>
    </div>
  );
};

export default Step2TaxIdentity;
