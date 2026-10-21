import React from 'react';

export const AdminTaxRecordsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#12304A', marginBottom: '8px' }}>
        Tax Records Ledger
      </h2>
      <p style={{ fontSize: '13px', color: '#64748B' }}>
        Historical assessment ledger and certified ERCA tax receipts.
      </p>
    </div>
  );
};

export default AdminTaxRecordsPage;
