import { LeadStatus } from '../types/marketing.ts';

export interface StatusMeta {
  label: LeadStatus;
  shortLabel: string;
  description: string;
  dotColor: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
}

export const STATUS_CONFIG: Record<LeadStatus, StatusMeta> = {
  'New Leads': {
    label: 'New Leads',
    shortLabel: 'New Leads',
    description: 'Fresh incoming lead submissions & inquiries',
    dotColor: '#0ea5e9', // Sky blue
    textColor: 'text-sky-700',
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  'Working Leads': {
    label: 'Working Leads',
    shortLabel: 'Working Leads',
    description: 'Under active outreach and qualification by marketing team',
    dotColor: '#2563eb', // Blue
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  'Qualified Leads': {
    label: 'Qualified Leads',
    shortLabel: 'Qualified Leads',
    description: 'Validated medical practices ready for sales & billing handoff',
    dotColor: '#10b981', // Emerald
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  'Converted Leads': {
    label: 'Converted Leads',
    shortLabel: 'Converted Leads',
    description: 'Successfully onboarded paying medical practice clients',
    dotColor: '#16a34a', // Green
    textColor: 'text-green-800',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  Other: {
    label: 'Other',
    shortLabel: 'Other',
    description: 'Disqualified, unconverted, or specialized routing',
    dotColor: '#64748b', // Slate
    textColor: 'text-slate-700',
    bgLight: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
};

export const ALL_STATUSES: LeadStatus[] = [
  'New Leads',
  'Working Leads',
  'Qualified Leads',
  'Converted Leads',
  'Other',
];
