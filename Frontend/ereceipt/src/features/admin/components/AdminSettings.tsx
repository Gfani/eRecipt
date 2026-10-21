import React, { useState } from 'react';
import styles from './AdminSettings.module.css';

export const AdminSettings: React.FC = () => {
  const [officerName, setOfficerName] = useState('Hana Alemu');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
              Officer ID
            </label>
            <input
              id="officer-id"
              className={`${styles.field} ${styles.fieldReadOnly}`}
              readOnly
              value="RO-218"
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
              value="Senior Revenue Officer"
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
