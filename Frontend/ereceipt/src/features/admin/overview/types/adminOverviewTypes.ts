export interface AdminMetric {
  id: string;
  title: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accent: 'primary' | 'warning' | 'success' | 'info';
}

export interface RecentDecision {
  id: string;
  officerName: string;
  officerId: string;
  action: 'approved' | 'rejected' | 'clarification' | 'flagged';
  targetMerchant: string;
  tin: string;
  referenceNo?: string;
  timestamp: string;
  notes?: string;
}
