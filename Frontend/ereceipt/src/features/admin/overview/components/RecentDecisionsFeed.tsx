import React from 'react';
import styles from './RecentDecisionsFeed.module.css';

interface DecisionItem {
  timestamp: string;
  officer: string;
  action: string;
  reference: string;
}

interface RecentDecisionsFeedProps {
  events?: DecisionItem[];
}

const defaultEvents: DecisionItem[] = [
  {
    timestamp: '20 Oct 2026 · 16:22',
    officer: 'Hana Alemu · RO-218',
    action: 'Merchant application reviewed',
    reference: 'APP-2026-0147',
  },
  {
    timestamp: '20 Oct 2026 · 15:48',
    officer: 'Bekele Tadesse · RO-184',
    action: 'Tax report approved',
    reference: 'TR-2026-0909',
  },
  {
    timestamp: '20 Oct 2026 · 14:31',
    officer: 'Hana Alemu · RO-218',
    action: 'Additional information requested',
    reference: 'APP-2026-0145',
  },
  {
    timestamp: '20 Oct 2026 · 12:06',
    officer: 'Meron Girma · RO-203',
    action: 'Receipt authorization changed',
    reference: 'MER-10473',
  },
];

export const RecentDecisionsFeed: React.FC<RecentDecisionsFeedProps> = ({
  events = defaultEvents,
}) => {
  return (
    <aside className={styles.asideCard}>
      <h2 className={styles.cardTitle}>Recent Administrative Decisions</h2>
      <div className={styles.asideList}>
        {events.map((event) => (
          <div key={`${event.timestamp}-${event.reference}`} className={styles.asideItem}>
            <p className={styles.asideAction}>{event.action}</p>
            <p className={styles.asideMeta}>{event.reference} · {event.officer}</p>
            <p className={styles.asideDate}>{event.timestamp}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RecentDecisionsFeed;
