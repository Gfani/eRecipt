import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { MerchantRegistrationFormData } from '../../types';
import styles from './Step4BusinessLocation.module.css';

interface Step4Props {
  formData: MerchantRegistrationFormData;
  onChange: (patch: Partial<MerchantRegistrationFormData>) => void;
}

export const Step4BusinessLocation: React.FC<Step4Props> = ({ formData, onChange }) => {
  const [gpsMessage, setGpsMessage] = useState(formData.gpsLocation || '');
  const [isLocating, setIsLocating] = useState(false);

  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      const msg = 'Location sharing is not supported by this browser.';
      setGpsMessage(msg);
      onChange({ gpsLocation: '' });
      return;
    }

    setIsLocating(true);
    setGpsMessage('Requesting location permission…');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const coordsStr = `${lat}, ${lon}`;
        setGpsMessage(coordsStr);
        onChange({ gpsLocation: coordsStr });
      },
      () => {
        setIsLocating(false);
        const msg = 'Location could not be shared. Check browser permission and try again.';
        setGpsMessage(msg);
        onChange({ gpsLocation: '' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isCoordinates = gpsMessage && gpsMessage.includes(',');

  return (
    <div className={styles.stepContainer}>
      <label className="field-group">
        <span className="field-label">City</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          value={formData.city}
          onChange={(e) => onChange({ city: e.target.value })}
        />
      </label>

      <label className="field-group">
        <span className="field-label">Sub-city</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          value={formData.subCity}
          onChange={(e) => onChange({ subCity: e.target.value })}
        />
      </label>

      <label className="field-group">
        <span className="field-label">Building name</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          value={formData.buildingName}
          onChange={(e) => onChange({ buildingName: e.target.value })}
        />
      </label>

      <label className="field-group">
        <span className="field-label">Floor</span>
        <input
          required
          type="text"
          className="field-input"
          autoComplete="off"
          value={formData.floor}
          onChange={(e) => onChange({ floor: e.target.value })}
        />
      </label>

      <div className={styles.gpsCard}>
        <div className={styles.gpsInner}>
          <span className={styles.gpsIconBox}>
            <MapPin size={20} />
          </span>
          <div className={styles.gpsDetails}>
            <p className={styles.gpsTitle}>
              Building GPS location <span className={styles.gpsOptional}>(optional)</span>
            </p>
            <p className={styles.gpsCopy}>
              Share your current location if available, or continue without GPS coordinates.
            </p>

            <button
              type="button"
              className={`btn-secondary ${styles.gpsButton}`}
              onClick={requestGpsLocation}
              disabled={isLocating}
            >
              {isLocating ? 'Locating…' : 'Share building GPS'}
            </button>

            {gpsMessage && (
              <p className={`${styles.gpsStatusText} ${isCoordinates ? styles.gpsSuccess : styles.gpsNotice}`}>
                {gpsMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4BusinessLocation;
