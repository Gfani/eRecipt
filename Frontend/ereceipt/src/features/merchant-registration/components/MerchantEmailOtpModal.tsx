import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, RotateCw, X, Zap } from 'lucide-react';

interface MerchantEmailOtpModalProps {
  email: string;
  recipientName: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

export const MerchantEmailOtpModal: React.FC<MerchantEmailOtpModalProps> = ({
  email,
  recipientName,
  isOpen,
  onClose,
  onVerified,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [deliveryNotice, setDeliveryNotice] = useState<string | null>(null);

  // Send OTP on initial modal open
  useEffect(() => {
    if (!isOpen) return;
    setCode('');
    setError(null);
    setSuccessNotice(null);
    setSimulatedCode(null);
    setIsSimulated(false);
    setDeliveryNotice(null);
    sendOtpCode();
  }, [isOpen, email]);

  // Countdown timer for resend
  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, resendCooldown]);

  const sendOtpCode = async () => {
    try {
      setIsResending(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          purpose: 'merchant_registration',
          recipientName: recipientName.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to dispatch verification code.');
      }

      setResendCooldown(data.cooldownSeconds || 45);
      setIsSimulated(Boolean(data.simulated));
      setDeliveryNotice(data.deliveryNotice || null);
      if (data.code) {
        setSimulatedCode(data.code);
      }
      setSuccessNotice(data.message || `Verification code sent to ${email}.`);
    } catch (err: any) {
      setError(err.message || 'Could not send verification email. Please check the address.');
    } finally {
      setIsResending(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    await sendOtpCode();
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          purpose: 'merchant_registration',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Invalid or expired verification code.');
      }

      onVerified();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '460px',
          padding: '28px 24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
          }}
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Mail size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Verify Business Email
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>
              {isSimulated ? 'Simulation Active · Instant Code Available' : '6-Digit Email Verification'}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          We sent a 6-digit confirmation code to:
          <br />
          <strong style={{ color: '#0F172A', fontWeight: 600 }}>{email}</strong>
        </p>

        {/* Simulation / Development Banner */}
        {simulatedCode && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              color: '#92400E',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                <Zap size={15} color="#D97706" />
                <span>Simulation / Dev Mode</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCode(simulatedCode);
                  setError(null);
                }}
                style={{
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                Autofill Code
              </button>
            </div>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', lineHeight: 1.4, color: '#78350F' }}>
              Email delivery is simulated. Your verification code is:
              <strong
                style={{
                  marginLeft: '6px',
                  fontSize: '15px',
                  letterSpacing: '2px',
                  fontFamily: 'monospace',
                  color: '#92400E',
                  backgroundColor: '#FDE68A',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {simulatedCode}
              </strong>
            </p>
            {deliveryNotice && (
              <p style={{ margin: 0, fontSize: '11px', color: '#B45309', opacity: 0.9 }}>
                {deliveryNotice}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* OTP Input Field */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="merchant-otp-input"
              style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}
            >
              Enter 6-digit code
            </label>
            <input
              id="merchant-otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={code}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(clean);
                setError(null);
              }}
              placeholder="••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '26px',
                fontWeight: 800,
                letterSpacing: '10px',
                textAlign: 'center',
                fontFamily: 'monospace',
                borderRadius: '8px',
                border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#F8FAFC',
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                color: '#DC2626',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Notice */}
          {successNotice && !error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '6px',
                color: '#15803D',
                fontSize: '12px',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Resend Action with Countdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              fontSize: '13px',
            }}
          >
            <span style={{ color: '#64748B' }}>Didn't receive code?</span>
            {resendCooldown > 0 ? (
              <span style={{ color: '#94A3B8', fontWeight: 500 }}>
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#176B4D',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <RotateCw size={13} className={isResending ? 'spin' : ''} />
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Change Email
            </button>
            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              style={{
                flex: 1.5,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: code.length === 6 && !isSubmitting ? '#176B4D' : '#94A3B8',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: code.length === 6 && !isSubmitting ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MerchantEmailOtpModal;
