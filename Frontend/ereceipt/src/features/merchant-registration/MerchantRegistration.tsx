import React, { useState } from 'react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout/AuthSplitLayout';
import CenteredCardLayout from '../../layouts/CenteredCardLayout/CenteredCardLayout';
import Step1AccountDetails from './components/steps/Step1AccountDetails';
import Step2TaxIdentity from './components/steps/Step2TaxIdentity';
import Step3Licenses from './components/steps/Step3Licenses';
import Step4BusinessLocation from './components/steps/Step4BusinessLocation';
import Step5Review from './components/steps/Step5Review';
import WorkflowPipelineStepper from './components/status/WorkflowPipelineStepper';
import type {
  MerchantRegistrationFormData,
  RegistrationStep,
} from './types';
import { initialRegistrationFormData } from './types';
import styles from './MerchantRegistration.module.css';

interface MerchantRegistrationProps {
  onSignInClick?: () => void;
  onHomeClick?: () => void;
}

const STEP_TITLES: Record<RegistrationStep, string> = {
  1: 'Account details',
  2: 'Tax identity',
  3: 'Licenses',
  4: 'Business location',
  5: 'Review',
};

export const MerchantRegistration: React.FC<MerchantRegistrationProps> = ({
  onSignInClick,
  onHomeClick,
}) => {
  const [step, setStep] = useState<RegistrationStep>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<MerchantRegistrationFormData>(initialRegistrationFormData);

  const updateFormData = (patch: Partial<MerchantRegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep((prev) => (prev + 1) as RegistrationStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as RegistrationStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If application was submitted, show WorkflowPipelineStepper inside CenteredCardLayout
  if (isSubmitted) {
    const today = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <CenteredCardLayout onLogoClick={onHomeClick}>
        <WorkflowPipelineStepper
          referenceNumber="EIMS-2026-0094"
          submissionDate={today}
          onReturnToSignIn={() => {
            if (onSignInClick) {
              onSignInClick();
            } else {
              setIsSubmitted(false);
              setStep(1);
            }
          }}
          onContactSupport={() => {
            alert('Support contact: support@ereceipt.et | +251 11 550 0000');
          }}
        />
      </CenteredCardLayout>
    );
  }

  return (
    <AuthSplitLayout onLogoClick={onHomeClick}>
      {/* Step Indicator Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressLabelRow}>
          <span>Step {step} of 5</span>
          <span>{STEP_TITLES[step]}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${step * 20}%` }}
          />
        </div>
      </div>

      {/* Heading */}
      <div className={styles.headingWrapper}>
        <p className="eyebrow">Merchant registration</p>
        <h1 className={styles.pageTitle}>{STEP_TITLES[step]}</h1>
        <p className={styles.pageSubtitle}>
          Tell us about your business. You can review everything before submitting.
        </p>
      </div>

      {/* Multi-Step Form */}
      <form onSubmit={handleSubmit} className={styles.formContent}>
        {step === 1 && (
          <Step1AccountDetails
            formData={formData}
            onChange={updateFormData}
          />
        )}

        {step === 2 && (
          <Step2TaxIdentity
            formData={formData}
            onChange={updateFormData}
          />
        )}

        {step === 3 && (
          <Step3Licenses
            formData={formData}
            onChange={updateFormData}
          />
        )}

        {step === 4 && (
          <Step4BusinessLocation
            formData={formData}
            onChange={updateFormData}
          />
        )}

        {step === 5 && (
          <Step5Review
            formData={formData}
            onChange={updateFormData}
            onGoToStep={(targetStep) => {
              setStep(targetStep);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Buttons */}
        <div className={styles.buttonsStack}>
          <button
            type="submit"
            className={`btn-primary ${styles.fullWidthBtn}`}
          >
            {step === 5 ? 'Submit for MoR EIMS accreditation' : 'Continue'}
          </button>

          {step > 1 && (
            <button
              type="button"
              className={`btn-secondary ${styles.fullWidthBtn}`}
              onClick={handleBack}
            >
              Back
            </button>
          )}
        </div>
      </form>

      {/* Switch to Sign In */}
      <p className={styles.switchAuthRow}>
        Already registered?{' '}
        <button
          type="button"
          className={styles.signInLink}
          onClick={onSignInClick || (() => alert('Sign in navigation clicked'))}
        >
          Sign in
        </button>
      </p>
    </AuthSplitLayout>
  );
};

export default MerchantRegistration;
