export type LeadStatus =
  | 'New Leads'
  | 'Working Leads'
  | 'Qualified Leads'
  | 'Converted Leads'
  | 'Other';

export type LeadChannel =
  | 'Website'
  | 'Google Maps / GBP'
  | 'Social Media'
  | 'Google Ads'
  | 'Social Ads'
  | 'Email Marketing';

export type MedicalSpecialty =
  | 'Cardiology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Oncology'
  | 'Neurology'
  | 'Dentistry'
  | 'Plastic Surgery'
  | 'Ophthalmology'
  | 'Family Medicine';

export interface Lead {
  id: string;
  clientName: string;
  providerPracticeName: string;
  city: string;
  state: string;
  country: string;
  specialty: MedicalSpecialty;
  email: string;
  phone: string;
  channel: LeadChannel;
  sourceUrl: string;
  message: string;
  status: LeadStatus;
  dealValue?: number;
  createdAt: string;
  utmCampaign?: string;
  utmMedium?: string;
  device?: 'Desktop' | 'Mobile' | 'Tablet';
  assignedRep?: string;
  assignedTo?: string;
  practiceSize?: string;
  lastContacted?: string;
  urgency?: 'Low' | 'Medium' | 'High' | 'Immediate';
  sharedWithBilling?: boolean;
  sharedWithAdmin?: boolean;
  sharedDestinations?: ('Admin' | 'Medical Billing Manager')[];
  sharedAt?: string;
  sharedBy?: string;
  handoffNotes?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'billing_manager';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatarUrl?: string;
}

export const ASSIGNABLE_DESTINATIONS = [
  'Marketing Team',
  'Billing Team',
  'Sarah Jenkins (Sales)',
  'Marcus Vance (Consultant)',
  'Dr. Elena Rostova (Clinical)',
] as const;

export interface ChannelBreakdownMetric {
  name: string;
  channelKey: 'website' | 'gbp' | 'social' | 'email' | 'referral' | 'other';
  visitors: number;
  leads: number;
  conversionToLeadRate: number; // percentage
  iconName: string;
  shareOfLeads: number;
}

export interface TrafficSourceMetric {
  channel: string;
  visitors: number;
  percentage: number;
  leads: number;
  conversionRate: number;
  bounceRate: number;
  avgDuration: string;
  color: string;
}

export interface TopPagePerformance {
  path: string;
  title: string;
  pageviews: number;
  uniqueVisitors: number;
  avgTimeOnPage: string;
  leadsGenerated: number;
  convRate: number;
}

export interface TopConversionAsset {
  assetName: string;
  type: 'Intake Form' | 'Google Call Ext' | 'Landing Campaign' | 'Lead Magnet' | 'Assessment Tool';
  impressions: number;
  submissions: number;
  payingClients: number;
  conversionRate: number;
  revenueGenerated: number;
}

export interface GeoLocationLead {
  stateCode: string;
  stateName: string;
  country: string;
  leads: number;
  visitors: number;
  convRate: number;
  topCity: string;
  topSpecialty: string;
  leadSharePercent: number;
  coordinates: [number, number]; // [x%, y%] for map positioning
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Sales Executive' | 'Clinical Director' | 'Practice Onboarding' | 'Physician Liaison';
  avatarUrl: string;
  email: string;
  activeLeadsCount: number;
}
