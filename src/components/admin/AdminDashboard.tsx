import React, { useState, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  FileCheck2,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Building,
  MapPin,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertCircle,
  X,
  Share2,
  Plus,
} from 'lucide-react';
import { Lead, LeadStatus, MedicalSpecialty, ASSIGNABLE_DESTINATIONS, LeadChannel } from '../../types/marketing.ts';
import { STATUS_CONFIG, ALL_STATUSES } from '../../utils/statusStyles.ts';
import { summaryMetrics } from '../../data/mockData.ts';

interface AdminDashboardProps {
  leads: Lead[];
  onUpdateLeadStatus: (id: string, newStatus: LeadStatus) => void;
  onUpdateLeadAssignment: (id: string, assignedTo: string) => void;
  onViewLeadDetails: (lead: Lead) => void;
  onOpenShareModal?: (leads: Lead[]) => void;
  onOpenAddLeadModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  leads,
  onUpdateLeadStatus,
  onUpdateLeadAssignment,
  onViewLeadDetails,
  onOpenShareModal,
  onOpenAddLeadModal,
}) => {
  // Navigation sub-tabs within Admin Dashboard
  const [adminTab, setAdminTab] = useState<'overview' | 'table'>('overview');

  // Search & filter state for Admin Data Table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected lead for message preview modal
  const [selectedMessageLead, setSelectedMessageLead] = useState<Lead | null>(null);

  // Derived KPI calculations (synchronous with marketing data layer)
  const totalSessions = summaryMetrics.totalVisitors; // 248,930
  const totalChatsInquiries = 3420; // Verified clinical inquiries & chats
  const totalLeadsCount = leads.length > 0 ? leads.length : summaryMetrics.totalLeads;
  const convertedLeads = leads.filter((l) => l.status === 'Converted Leads').length;
  // Fallback to overall conversion metric if mock leads have specific stages
  const overallConversionRate = (
    (Math.max(convertedLeads, summaryMetrics.convertedPayingClients) /
      Math.max(leads.length, summaryMetrics.totalLeads)) *
    100
  ).toFixed(1);

  // Filtered leads for Admin Data Table
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Query match (Name, Provider, Email, Phone, Location)
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        lead.clientName.toLowerCase().includes(q) ||
        lead.providerPracticeName.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.state.toLowerCase().includes(q) ||
        lead.specialty.toLowerCase().includes(q);

      // Status match
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

      // Specialty match
      const matchesSpecialty = specialtyFilter === 'ALL' || lead.specialty === specialtyFilter;

      // Channel match
      const matchesChannel = channelFilter === 'ALL' || lead.channel === channelFilter;

      // Assignment match
      const currentAssigned = lead.assignedTo || lead.assignedRep || 'Marketing Team';
      const matchesAssignment =
        assignmentFilter === 'ALL' ||
        currentAssigned.toLowerCase().includes(assignmentFilter.toLowerCase());

      return matchesQuery && matchesStatus && matchesSpecialty && matchesChannel && matchesAssignment;
    });
  }, [leads, searchQuery, statusFilter, specialtyFilter, channelFilter, assignmentFilter]);

  // Paginated leads
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  // Recent leads snapshot for Section B (top 6 newest leads)
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [leads]);

  // CSV Export for Admin (restricted columns only – excludes marketing attribution)
  const handleExportAdminCSV = () => {
    const headers = [
      'Client Name',
      'Practice Name',
      'Location',
      'Specialty',
      'Email',
      'Phone',
      'Status',
      'Assigned To',
      'Message',
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.clientName}"`,
      `"${l.providerPracticeName}"`,
      `"${l.city}, ${l.state}"`,
      `"${l.specialty}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.status}"`,
      `"${l.assignedTo || l.assignedRep || 'Marketing Team'}"`,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AMIT_Admin_Operations_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner: Admin Operational Scope Notice */}
      <div className="bg-gradient-to-r from-[#193d85]/10 via-[#149257]/10 to-slate-100 border border-[#193d85]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-[#193d85] text-white rounded-lg shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Operations & Practice Management Dashboard
              </h2>
              <span className="text-[11px] font-mono font-bold bg-[#193d85] text-white px-2 py-0.5 rounded">
                Admin Role View
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              High-level operational monitoring, inquiry routing, and clinical practice triage.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs within Admin */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs self-start sm:self-auto shrink-0">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              adminTab === 'overview'
                ? 'bg-[#193d85] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#193d85]'
            }`}
          >
            Overview & Recent
          </button>
          <button
            onClick={() => setAdminTab('table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              adminTab === 'table'
                ? 'bg-[#193d85] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#193d85]'
            }`}
          >
            Admin Data Table ({filteredLeads.length})
          </button>
        </div>
      </div>

      {/* SECTION A: OVERVIEW TAB (KPI SUMMARY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sessions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Sessions
              </span>
              <div className="p-1.5 bg-[#eef3fc] text-[#193d85] rounded-md">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
              {totalSessions.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Operational digital sessions
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Cross-portal traffic</span>
            <span className="flex items-center gap-0.5 font-bold text-emerald-600 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{summaryMetrics.totalVisitorsGrowth}%
            </span>
          </div>
        </div>

        {/* Card 2: Total Chats / Live Inquiries */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Chats / Live Inquiries
              </span>
              <div className="p-1.5 bg-[#e8f7ef] text-[#149257] rounded-md">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[#149257] tracking-tight font-mono tabular-nums">
              {totalChatsInquiries.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active patient & practice inquiries
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Avg. 114 chats / day</span>
            <span className="flex items-center gap-0.5 font-bold text-emerald-600 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.2%
            </span>
          </div>
        </div>

        {/* Card 3: Total Leads Received */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Leads Received
              </span>
              <div className="p-1.5 bg-[#eef3fc] text-[#193d85] rounded-md">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[#193d85] tracking-tight font-mono tabular-nums">
              {totalLeadsCount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verified inbound opportunities
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Active pipeline sync</span>
            <span className="font-bold text-[#193d85] font-mono">
              {leads.filter((l) => l.status === 'Qualified Leads' || l.status === 'Working Leads').length} high intent
            </span>
          </div>
        </div>

        {/* Card 4: Overall Conversion Rate (%) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall Conversion Rate
              </span>
              <div className="p-1.5 bg-[#e8f7ef] text-[#149257] rounded-md">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[#149257] tracking-tight font-mono tabular-nums">
              {overallConversionRate}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Qualified to onboarded practices
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Benchmark target: 15%</span>
            <span className="flex items-center gap-0.5 font-bold text-emerald-600 font-mono">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +3.1%
            </span>
          </div>
        </div>
      </div>

      {/* SECTION B: RECENT LEAD OVERVIEW TABLE (Shown on Overview tab) */}
      {adminTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Recent Lead Overview Table
                </h3>
                <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Latest Inbound & Shared Intake
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Snapshot of newly acquired and routed practice inquiries with real-time assignment routing.
              </p>
            </div>

            <button
              onClick={() => setAdminTab('table')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#193d85] hover:text-[#122e64] hover:underline"
            >
              View Full Admin Data Table ({leads.length})
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Practice Name</th>
                  <th className="py-3 px-4">Lead Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {recentLeads.map((lead) => {
                  const currentAssigned = lead.assignedTo || lead.assignedRep || 'Marketing Team';
                  const statusMeta = STATUS_CONFIG[lead.status] || STATUS_CONFIG['New Leads'];

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* 1. Customer Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#193d85]/10 text-[#193d85] flex items-center justify-center font-bold text-[11px] shrink-0">
                            {lead.clientName.replace('Dr. ', '').charAt(0)}
                          </div>
                          <div>
                            <div>{lead.clientName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {lead.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Email Address */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[#193d85] hover:underline flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {lead.email}
                        </a>
                      </td>

                      {/* 3. Phone Number */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-[#193d85] hover:underline flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {lead.phone}
                        </a>
                      </td>

                      {/* 4. Practice Name */}
                      <td className="py-3.5 px-4 text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate max-w-[200px]" title={lead.providerPracticeName}>
                            {lead.providerPracticeName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lead.city}, {lead.state}
                        </div>
                      </td>

                      {/* 5. Lead Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusMeta.bgLight} ${statusMeta.textColor} ${statusMeta.borderColor}`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: statusMeta.dotColor }}
                          />
                          {lead.status}
                        </span>
                      </td>

                      {/* 6. Assigned To (Interactive Dropdown Selector) */}
                      <td className="py-3.5 px-4">
                        <select
                          value={currentAssigned}
                          onChange={(e) => onUpdateLeadAssignment(lead.id, e.target.value)}
                          className="bg-white border border-slate-300 hover:border-[#193d85] text-slate-800 rounded-lg text-xs py-1 px-2.5 font-medium focus:ring-2 focus:ring-[#193d85]/20 focus:outline-none transition-colors"
                        >
                          {ASSIGNABLE_DESTINATIONS.map((dest) => (
                            <option key={dest} value={dest}>
                              {dest}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onViewLeadDetails(lead)}
                          className="p-1.5 text-slate-500 hover:text-[#193d85] hover:bg-[#eef3fc] rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-[11px]"
                          title="View clinical profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION C: ADMIN DATA TABLE (RESTRICTED OPERATIONS VIEW) */}
      <div className={`bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden ${adminTab === 'overview' ? 'mt-6' : ''}`}>
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Admin Data Table
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#eef3fc] text-[#193d85] border border-[#c9d7f3] px-2 py-0.5 rounded">
                  Clinical & Practice Directory
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical lead inquiries with contact info, practice specialty, communication records, and team assignments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Share Lead */}
              {onOpenShareModal && (
                <button
                  onClick={() => {
                    const firstQualified = filteredLeads.find(
                      (l) => l.status === 'Qualified Leads' || l.status === 'Working Leads'
                    ) || filteredLeads[0];
                    if (firstQualified) {
                      onOpenShareModal([firstQualified]);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#193d85] hover:bg-[#132f67] rounded-lg transition-colors shadow-2xs"
                  title="Share lead with Admin or Medical Billing Manager"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Lead</span>
                </button>
              )}

              {/* Add Lead */}
              {onOpenAddLeadModal && (
                <button
                  onClick={onOpenAddLeadModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#149257] hover:bg-[#0f7a47] rounded-lg transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lead</span>
                </button>
              )}

              {/* Export CSV */}
              <button
                onClick={handleExportAdminCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export CSV ({filteredLeads.length})
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name, practice, phone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20 focus:border-[#193d85]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Specialty Filter */}
            <select
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20"
            >
              <option value="ALL">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Oncology">Oncology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dentistry">Dentistry</option>
              <option value="Plastic Surgery">Plastic Surgery</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Family Medicine">Family Medicine</option>
            </select>

            {/* All Channels Filter */}
            <select
              value={channelFilter}
              onChange={(e) => {
                setChannelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20"
            >
              <option value="ALL">All Channels</option>
              <option value="Website">Website</option>
              <option value="Google Maps / GBP">Google Maps / GBP</option>
              <option value="Social Media">Social Media</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Social Ads">Social Ads</option>
              <option value="Email Marketing">Email Marketing</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20"
            >
              <option value="ALL">All Lead Statuses</option>
              {ALL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Assignment Filter */}
            <select
              value={assignmentFilter}
              onChange={(e) => {
                setAssignmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20"
            >
              <option value="ALL">All Assigned Teams/Reps</option>
              <option value="Marketing Team">Marketing Team</option>
              <option value="Billing Team">Billing Team</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Sales)</option>
              <option value="Marcus Vance">Marcus Vance (Consultant)</option>
              <option value="Elena Rostova">Dr. Elena Rostova (Clinical)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                {/* 1. Client Name */}
                <th className="py-3 px-4">Client Name</th>
                {/* 2. Healthcare Provider Practice Name */}
                <th className="py-3 px-4">Healthcare Provider Practice Name</th>
                {/* 3. Location */}
                <th className="py-3 px-4">Location</th>
                {/* 4. Specialty Type */}
                <th className="py-3 px-4">Specialty Type</th>
                {/* 5. Email Address */}
                <th className="py-3 px-4">Email Address</th>
                {/* 6. Phone Number */}
                <th className="py-3 px-4">Phone Number</th>
                {/* 7. Message Details */}
                <th className="py-3 px-4">Message Details</th>
                {/* Status & Assigned */}
                <th className="py-3 px-4">Status & Assigned To</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No leads match the specified criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try resetting the search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const currentAssigned = lead.assignedTo || lead.assignedRep || 'Marketing Team';
                  const statusMeta = STATUS_CONFIG[lead.status] || STATUS_CONFIG['New Leads'];

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Column 1: Client Name */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{lead.clientName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lead.id}
                        </span>
                      </td>

                      {/* Column 2: Healthcare Provider Practice Name */}
                      <td className="py-3 px-4 text-slate-800">
                        <div className="font-medium truncate max-w-[180px]" title={lead.providerPracticeName}>
                          {lead.providerPracticeName}
                        </div>
                      </td>

                      {/* Column 3: Location */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {lead.city}, {lead.state}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lead.country}
                        </div>
                      </td>

                      {/* Column 4: Specialty Type */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#eef3fc] text-[#193d85] border border-[#c9d7f3]">
                          <Stethoscope className="w-3 h-3" />
                          {lead.specialty}
                        </span>
                      </td>

                      {/* Column 5: Email Address */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[#193d85] hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>

                      {/* Column 6: Phone Number */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-[#193d85] hover:underline whitespace-nowrap"
                        >
                          {lead.phone}
                        </a>
                      </td>

                      {/* Column 7: Message Details */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <p
                          className="text-[11px] text-slate-600 line-clamp-2 cursor-pointer hover:text-slate-900"
                          onClick={() => setSelectedMessageLead(lead)}
                          title="Click to view full inquiry message"
                        >
                          {lead.message}
                        </p>
                        <button
                          onClick={() => setSelectedMessageLead(lead)}
                          className="text-[10px] text-[#193d85] font-semibold hover:underline mt-0.5 block"
                        >
                          View Full Text
                        </button>
                      </td>

                      {/* Column: Status & Assignment */}
                      <td className="py-3 px-4">
                        <div className="space-y-1.5 min-w-[140px]">
                          {/* Status selector */}
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className={`w-full text-[11px] font-semibold py-0.5 px-2 rounded border focus:outline-none focus:ring-1 focus:ring-[#193d85] ${statusMeta.bgLight} ${statusMeta.textColor} ${statusMeta.borderColor}`}
                          >
                            {ALL_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {/* Assignment selector */}
                          <select
                            value={currentAssigned}
                            onChange={(e) => onUpdateLeadAssignment(lead.id, e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] py-0.5 px-1.5 rounded focus:outline-none"
                          >
                            {ASSIGNABLE_DESTINATIONS.map((dest) => (
                              <option key={dest} value={dest}>
                                {dest}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Column: Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewLeadDetails(lead)}
                          className="p-1.5 text-slate-500 hover:text-[#193d85] hover:bg-[#eef3fc] rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing{' '}
            <strong className="text-slate-900 font-semibold font-mono">
              {filteredLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-900 font-semibold font-mono">
              {Math.min(currentPage * itemsPerPage, filteredLeads.length)}
            </strong>{' '}
            of{' '}
            <strong className="text-slate-900 font-semibold font-mono">
              {filteredLeads.length}
            </strong>{' '}
            leads
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal Preview */}
      {selectedMessageLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Clinical Inquiry Details
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedMessageLead.clientName} · {selectedMessageLead.providerPracticeName}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessageLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
              {selectedMessageLead.message}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-mono text-slate-800">{selectedMessageLead.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-mono text-slate-800">{selectedMessageLead.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Specialty</span>
                <span className="font-medium text-slate-800">{selectedMessageLead.specialty}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned To</span>
                <span className="font-medium text-[#193d85]">
                  {selectedMessageLead.assignedTo || selectedMessageLead.assignedRep || 'Marketing Team'}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedMessageLead(null)}
                className="px-4 py-2 bg-[#193d85] text-white text-xs font-semibold rounded-lg hover:bg-[#122e64]"
              >
                Close Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
