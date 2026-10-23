import { fiscalStorage } from './storage.js';
import type { AuditEventItem } from './types.js';

export function recordAdminAuditEvent(
  entry: Omit<AuditEventItem, 'timestamp'> & { timestamp?: string }
): AuditEventItem {
  const timestamp =
    entry.timestamp ||
    new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const fullEvent: AuditEventItem = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    officer: entry.officer,
    action: entry.action,
    reference: entry.reference,
    statusTransition: entry.statusTransition,
    notes: entry.notes,
  };

  fiscalStorage.addAuditEvent(fullEvent);
  return fullEvent;
}
