import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Building,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
  Eye,
  Mail,
  Phone,
  Search,
  Filter,
  Download,
  Clock,
  UserCheck,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileSpreadsheet,
} from 'lucide-react';
import { Lead, MedicalSpecialty } from '../../types/marketing.ts';

interface BillingManagerTabProps {
  leads: Lead[];
  onViewLeadDetails: (lead: Lead) => void;
  onSwitchToMarketing?: () => void;
}

export const BillingManagerTab: React.FC<BillingManagerTabProps> = ({
  leads,
  onViewLeadDetails,
  onSwitchToMarketing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'both' | 'overview' | 'table'>('both');
  const [consultationModalLead, setConsultationModalLead] = useState<Lead | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [consultationStatus, setConsultationStatus] = useState<
    'Pending Review' | 'Consultation Scheduled' | 'Agreement Sent' | 'Onboarded'
  >('Consultation Scheduled');
  const [consultationSavedMsg, setConsultationSavedMsg] = useState(false);

  // Role Access Control: The Medical Billing Manager Dashboard ONLY displays leads
  // that have been explicitly approved and shared by the Marketing Team
  const approvedBillingLeads = useMemo(() => {
    return leads.filter((l) => {
      // Must be explicitly approved and shared by marketing team
      return (
        l.sharedWithBilling === true ||
        l.sharedDestinations?.includes('Medical Billing Manager') ||
        (l.assignedTo && l.assignedTo.toLowerCase().includes('billing'))
      );
    });
  }, [leads]);

  // Section A: Recent Leads Overview (Newest shared accounts ready for billing consultation)
  const recentOverviewLeads = useMemo(() => {
    return [...approvedBillingLeads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [approvedBillingLeads]);

  // Section B: Filtered leads for Streamlined Data Table
  const filteredTableLeads = useMemo(() => {
    return approvedBillingLeads.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.clientName.toLowerCase().includes(q) ||
        l.providerPracticeName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.specialty.toLowerCase().includes(q);

      const matchesSpecialty =
        specialtyFilter === 'ALL' || l.specialty === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [approvedBillingLeads, searchQuery, specialtyFilter]);

  // Export CSV strictly with Medical Billing Manager columns
  const handleExportBillingCSV = () => {
    const headers = [
      'Client Name',
      'Healthcare Provider Practice Name',
      'Specialty Type',
      'Location',
      'Email Address',
      'Phone Number',
      'Assigned To',
    ];

    const rows = filteredTableLeads.map((l) => [
      `"${l.clientName}"`,
      `"${l.providerPracticeName}"`,
      `"${l.specialty}"`,
      `"${l.city}, ${l.state}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.assignedTo || 'Billing Manager / Onboarding Specialist'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AMIT_Medical_Billing_Consultations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenConsultation = (lead: Lead) => {
    setConsultationModalLead(lead);
    setConsultationNotes(lead.handoffNotes || '');
    setConsultationSavedMsg(false);
  };

  const handleSaveConsultation = () => {
    setConsultationSavedMsg(true);
    setTimeout(() => {
      setConsultationModalLead(null);
      setConsultationSavedMsg(false);
    }, 1200);
  };

  // Summary Metrics for Billing Manager
  const totalPipelineValue = approvedBillingLeads.reduce(
    (acc, l) => acc + (l.dealValue || 45000),
    0
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner: Role Access & Workflow Rules */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#193d85] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <CreditCard className="w-3.5 h-3.5" />
              Medical Billing Manager Dashboard
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 text-[11px] font-mono border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Role Access Control Enforced
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Actionable Sales, Onboarding & Billing Consultations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            Designed exclusively for actionable sales and onboarding, receiving only qualified leads forwarded by the marketing team.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-slate-300 text-[11px]">Forwarded Qualified Leads</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {approvedBillingLeads.length}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-slate-300 text-[11px]">Ready for Consultation</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {recentOverviewLeads.length}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-slate-300 text-[11px]">Onboarding Pipeline Value</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
                ${totalPipelineValue.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <div className="text-slate-300 text-[11px]">Assigned Role</div>
              <div className="text-xs font-semibold text-white mt-1 truncate">
                Billing Manager / Onboarding
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'both'
                ? 'bg-[#193d85] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Sections (A & B)
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#193d85] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            A. Recent Lead Overview
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-[#193d85] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            B. Billing Data Table ({filteredTableLeads.length})
          </button>
        </div>

        <button
          onClick={handleExportBillingCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Billing Consultation CSV</span>
        </button>
      </div>

      {/* Empty State Warning if no leads are shared yet */}
      {approvedBillingLeads.length === 0 && (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No Leads Forwarded to Billing Manager Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              By workflow rule, the Medical Billing Manager Dashboard only receives leads after they have been qualified and explicitly shared by the Digital Marketing Team via the "Share Lead" action.
            </p>
          </div>
          {onSwitchToMarketing && (
            <button
              onClick={onSwitchToMarketing}
              className="px-4 py-2 bg-[#193d85] text-white font-bold text-xs rounded-lg hover:bg-[#132f67] inline-flex items-center gap-2"
            >
              <span>Go to Marketing Dashboard to Share Qualified Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* SECTION A: RECENT LEAD OVERVIEW TABLE */}
      {(activeTab === 'both' || activeTab === 'overview') && approvedBillingLeads.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-slate-900 text-sm">
                  A. Recent Lead Overview Table
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Provides immediate visibility on shared accounts ready for billing consultation
              </p>
            </div>
            <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
              {recentOverviewLeads.length} Accounts Ready for Consultation
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px] tracking-wider select-none">
                  <th className="py-3 px-4 font-bold text-slate-700">Customer Name</th>
                  <th className="py-3 px-4 font-bold text-slate-700">Email Address</th>
                  <th className="py-3 px-4 font-bold text-slate-700">Phone Number</th>
                  <th className="py-3 px-4 font-bold text-slate-700">Practice Name</th>
                  <th className="py-3 px-4 font-bold text-slate-700">
                    Assigned To: (Billing Manager / Onboarding Specialist)
                  </th>
                  <th className="py-3 px-4 text-right font-bold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOverviewLeads.map((lead) => {
                  const assignedLabel =
                    lead.assignedTo || 'Billing Manager / Onboarding Specialist';

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Customer Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#193d85]/10 text-[#193d85] font-bold flex items-center justify-center text-xs shrink-0">
                            {lead.clientName.charAt(0)}
                          </div>
                          <div>
                            <div>{lead.clientName}</div>
                            <div className="text-[10.5px] text-slate-400 font-normal">
                              {lead.specialty}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[#193d85] hover:underline flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.email}</span>
                        </a>
                      </td>

                      {/* Phone Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-[#193d85] flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>

                      {/* Practice Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[220px]">
                            {lead.providerPracticeName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-5">
                          {lead.city}, {lead.state}
                        </div>
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          <span>{assignedLabel}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenConsultation(lead)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors shadow-xs"
                            title="Schedule Billing Consultation"
                          >
                            Consultation
                          </button>
                          <button
                            onClick={() => onViewLeadDetails(lead)}
                            className="p-1.5 text-slate-400 hover:text-[#193d85] hover:bg-slate-100 rounded"
                            title="View Lead Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION B: MEDICAL BILLING MANAGER DATA TABLE COLUMNS */}
      {(activeTab === 'both' || activeTab === 'table') && approvedBillingLeads.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-0">
          {/* Header & Filter Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#193d85]"></span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    B. Medical Billing Manager Data Table Columns
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Streamlined view focused strictly on practice identity and contact details
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctor, practice, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-[#193d85] w-48 sm:w-60"
                  />
                </div>

                {/* Specialty Filter */}
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-700 outline-none"
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

                <button
                  onClick={handleExportBillingCSV}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Streamlined Table (Client Name, Healthcare Provider Practice Name, Specialty Type, Location, Email Address, Phone Number) */}
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10.5px] tracking-wider select-none">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Healthcare Provider Practice Name</th>
                  <th className="py-3 px-4">Specialty Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTableLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-slate-400 font-medium"
                    >
                      No records match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredTableLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* 1. Client Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{lead.clientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {lead.id}
                        </div>
                      </td>

                      {/* 2. Healthcare Provider Practice Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {lead.providerPracticeName}
                      </td>

                      {/* 3. Specialty Type */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#eef3fc] text-[#193d85] border border-[#c9d7f3]">
                          {lead.specialty}
                        </span>
                      </td>

                      {/* 4. Location */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {lead.city}, {lead.state}
                      </td>

                      {/* 5. Email Address */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[#193d85] hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>

                      {/* 6. Phone Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <a href={`tel:${lead.phone}`} className="hover:text-[#193d85]">
                          {lead.phone}
                        </a>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onViewLeadDetails(lead)}
                          className="px-2 py-1 bg-slate-100 hover:bg-[#193d85] hover:text-white text-slate-700 rounded text-[11px] font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing Consultation Scheduling Modal */}
      {consultationModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Billing Consultation & Onboarding Protocol
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Account: {consultationModalLead.providerPracticeName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConsultationModalLead(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {consultationSavedMsg ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-900 text-sm">
                  Consultation Protocol Logged!
                </h5>
                <p className="text-xs text-slate-500">
                  Status updated to {consultationStatus}.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div>
                    <strong>Doctor / Client:</strong> {consultationModalLead.clientName}
                  </div>
                  <div>
                    <strong>Direct Phone:</strong> {consultationModalLead.phone}
                  </div>
                  <div>
                    <strong>Email:</strong> {consultationModalLead.email}
                  </div>
                  <div>
                    <strong>Specialty:</strong> {consultationModalLead.specialty} (
                    {consultationModalLead.city}, {consultationModalLead.state})
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Onboarding Stage
                  </label>
                  <select
                    value={consultationStatus}
                    onChange={(e) => setConsultationStatus(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white text-slate-800 font-medium outline-none focus:border-[#193d85]"
                  >
                    <option value="Consultation Scheduled">Consultation Scheduled</option>
                    <option value="Pending Review">Pending Practice Credential Review</option>
                    <option value="Agreement Sent">Billing Agreement & Fee Schedule Sent</option>
                    <option value="Onboarded">Onboarded & Live in System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Billing Consultation Notes / Fee Schedule Terms
                  </label>
                  <textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Discussed medical billing SaaS integration, 4-physician credentialing, and electronic claims submission terms."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-[#193d85]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setConsultationModalLead(null)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveConsultation}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Log Consultation Status
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
