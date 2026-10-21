import React from 'react';
import type { MerchantRegistrationFormData, RegistrationStep } from '../../types';
import styles from './Step5Review.module.css';

interface Step5Props {
  formData: MerchantRegistrationFormData;
  onChange: (patch: Partial<MerchantRegistrationFormData>) => void;
  onGoToStep: (step: RegistrationStep) => void;
}

export const Step5Review: React.FC<Step5Props> = ({ formData, onChange, onGoToStep }) => {
  // Format TIN with middle digits masked or plain
  const maskedTin =
    formData.tin.length === 10
      ? `${formData.tin.slice(0, 3)}•••••${formData.tin.slice(-2)}`
      : formData.tin || 'Not entered';

  const taxpayerText = formData.sellerLegalName
    ? `${formData.sellerLegalName} · TIN ${maskedTin}`
    : `TIN ${maskedTin}`;
  const licenseText = formData.uploadedFileName
    ? `${formData.uploadedFileName}${formData.businessLicenseNumber ? ` · License #${formData.businessLicenseNumber}` : ''}`
    : (formData.businessLicenseNumber ? `License #${formData.businessLicenseNumber}` : 'Business documents attached');

  const locationParts = [formData.city, formData.subCity, formData.buildingName, formData.floor].filter(Boolean);
  const locationText = (locationParts.join(' · ') || 'No business address entered') + (formData.gpsLocation ? ` · GPS ${formData.gpsLocation}` : '');

  return (
    <div className={styles.stepContainer}>
      <div className={styles.reviewRow}>
        <div className={styles.reviewInfo}>
          <p className={styles.reviewLabel}>Taxpayer</p>
          <p className={styles.reviewValue}>{taxpayerText}</p>
        </div>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => onGoToStep(2)}
        >
          Edit
        </button>
      </div>

      <div className={styles.reviewRow}>
        <div className={styles.reviewInfo}>
          <p className={styles.reviewLabel}>License documents</p>
          <p className={styles.reviewValue}>{licenseText}</p>
        </div>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => onGoToStep(3)}
        >
          Edit
        </button>
      </div>

      <div className={styles.reviewRow}>
        <div className={styles.reviewInfo}>
          <p className={styles.reviewLabel}>Business location</p>
          <p className={styles.reviewValue}>{locationText || 'No location provided'}</p>
        </div>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => onGoToStep(4)}
        >
          Edit
        </button>
      </div>

      <label className={styles.certifyLabel}>
        <input
          required
          type="checkbox"
          checked={formData.certified}
          onChange={(e) => onChange({ certified: e.target.checked })}
          className={styles.certifyCheckbox}
        />
        <span>
          I certify that the submitted tax identity, license, and business location
          information is accurate and authorized.
        </span>
      </label>
    </div>
  );
};

export default Step5Review;
