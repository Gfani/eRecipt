import React, { useState } from 'react';
import styles from './AdminSettings.module.css';

export const AdminSettings: React.FC = () => {
  const [officerData] = useState(() => {
    try {
      const stored = localStorage.getItem('officer_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [officerName, setOfficerName] = useState(officerData?.name || 'Fanuel Kassahun');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const displayBadge = officerData?.badgeNumber || 'RO-305';
  const displayRole = officerData?.role
    ? officerData.role === 'ADMIN'
      ? 'System Administrator'
      : officerData.role === 'SENIOR_AUDITOR'
      ? 'Senior Tax Auditor'
      : 'Revenue Officer'
    : 'Senior Revenue Officer';

  return (
    <div className={styles.grid}>
      {/* Officer Profile */}
      <section className={styles.section}>
        <h2 className={styles.title}>Officer Profile</h2>
        <div className={styles.fieldsStack}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="officer-name">
              Officer name
            </label>
            <input
              id="officer-name"
              className={styles.field}
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="officer-id">
              Officer Badge / Employee ID
            </label>
            <input
              id="officer-id"
              className={`${styles.field} ${styles.fieldReadOnly}`}
              readOnly
              value={displayBadge}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="officer-role">
              Role
            </label>
            <input
              id="officer-role"
              className={`${styles.field} ${styles.fieldReadOnly}`}
              readOnly
              value={displayRole}
            />
          </div>

          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
          >
            {isSaved ? 'Saved!' : 'Save profile'}
          </button>
        </div>
      </section>

      {/* Review Notifications */}
      <section className={styles.section}>
        <h2 className={styles.title}>Review Notifications</h2>
        <div className={styles.togglesList}>
          {[
            'New merchant applications',
            'Submitted tax reports',
            'Additional information responses',
            'Authorization status changes',
          ].map((item) => (
            <label key={item} className={styles.toggleRow}>
              <span>{item}</span>
              <input type="checkbox" defaultChecked className={styles.toggleInput} />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
