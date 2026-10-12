import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, MedicalSpecialty, LeadChannel } from '../../types/marketing.ts';
import { STATUS_CONFIG, ALL_STATUSES } from '../../utils/statusStyles.ts';
import {
  Search,
  Filter,
  Download,
  Share2,
  Plus,
  Eye,
  CheckSquare,
  Square,
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
} from 'lucide-react';

interface LeadsManagementTabProps {
  leads: Lead[];
  onOpenShareModal: (leads: Lead[]) => void;
  onOpenDetailDrawer: (lead: Lead) => void;
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  selectedStateFilter?: string | null;
  onClearStateFilter?: () => void;
}

export const LeadsManagementTab: React.FC<LeadsManagementTabProps> = ({
  leads,
  onOpenShareModal,
  onOpenDetailDrawer,
  onOpenAddModal,
  onUpdateStatus,
  selectedStateFilter,
  onClearStateFilter,
}) => {
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('ALL');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('ALL');
  const [batchStatusValue, setBatchStatusValue] = useState<LeadStatus>('Qualified Leads');

  // Count leads per status category
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_STATUSES.forEach((st) => (counts[st] = 0));
    leads.forEach((l) => {
      counts[l.status] = (counts[l.status] || 0) + 1;
    });
    return counts;
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          l.clientName.toLowerCase().includes(query) ||
          l.providerPracticeName.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query) ||
          l.city.toLowerCase().includes(query) ||
          l.state.toLowerCase().includes(query) ||
          l.specialty.toLowerCase().includes(query) ||
          l.channel.toLowerCase().includes(query) ||
          l.message.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Status
      if (selectedStatusFilter !== 'ALL' && l.status !== selectedStatusFilter) {
        return false;
      }

      // Specialty
      if (selectedSpecialtyFilter !== 'ALL' && l.specialty !== selectedSpecialtyFilter) {
        return false;
      }

      // Channel
      if (selectedChannelFilter !== 'ALL' && l.channel !== selectedChannelFilter) {
        return false;
      }

      // State from map
      if (selectedStateFilter && l.state !== selectedStateFilter) {
        return false;
      }

      return true;
    });
  }, [
    leads,
    searchQuery,
    selectedStatusFilter,
    selectedSpecialtyFilter,
    selectedChannelFilter,
    selectedStateFilter,
  ]);

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Batch actions
  const selectedLeadsList = useMemo(() => {
    return leads.filter((l) => selectedLeadIds.includes(l.id));
  }, [leads, selectedLeadIds]);

  const handleBatchShare = () => {
    if (selectedLeadsList.length > 0) {
      onOpenShareModal(selectedLeadsList);
    }
  };

  const handleBatchStatusApply = () => {
    selectedLeadIds.forEach((id) => {
      onUpdateStatus(id, batchStatusValue);
    });
    setSelectedLeadIds([]);
  };

  // Export CSV
  const handleExportCSV = () => {
    const listToExport = selectedLeadsList.length > 0 ? selectedLeadsList : filteredLeads;
    const headers = [
      'Lead ID',
      'Client Name',
      'Healthcare Provider / Practice Name',
      'City',
      'State',
      'Country',
      'Specialty Type',
      'Email Address',
      'Phone Number',
      'Source URL / Channel',
      'Lead Status Tag',
      'Message / Inquiry Details',
    ];

    const rows = listToExport.map((l) => [
      `"${l.id}"`,
      `"${l.clientName.replace(/"/g, '""')}"`,
      `"${l.providerPracticeName.replace(/"/g, '""')}"`,
      `"${l.city}"`,
      `"${l.state}"`,
      `"${l.country}"`,
      `"${l.specialty}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.channel} (${l.sourceUrl})"`,
      `"${l.status}"`,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PulsePoint_Practice_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllSelected =
    filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. PIPELINE CLASSIFICATION SUMMARY TABS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Lead Progression & Qualification Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Active intake tracking across 5 qualification stages: New leads, Working leads, Qualified Leads, Converted leads, Other
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Total Pipeline: <strong className="text-slate-900">{leads.length}</strong> inquiries
          </div>
        </div>

        {/* 5 Categories Filter Control */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_STATUSES.map((statusKey) => {
            const meta = STATUS_CONFIG[statusKey];
            const count = statusCounts[statusKey] || 0;
            const isActive = selectedStatusFilter === statusKey;

            return (
              <button
                key={statusKey}
                onClick={() =>
                  setSelectedStatusFilter(isActive ? 'ALL' : statusKey)
                }
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-[#193d85] bg-[#193d85] text-white shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`w-2 h-2 rounded-full`}
                    style={{ backgroundColor: meta.dotColor }}
                  />
                  <span
                    className={`text-xs font-mono font-bold tabular-nums ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <div>
                  <div
                    className={`text-[11px] font-semibold truncate leading-tight ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {meta.shortLabel}
                  </div>
                  <div
                    className={`text-[9.5px] truncate mt-0.5 ${
                      isActive ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {meta.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Doctor Name, Practice, Specialty, Location, Channel, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-[#193d85] transition-colors"
            />
          </div>

          {/* Quick Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Specialty Filter */}
            <select
              value={selectedSpecialtyFilter}
              onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700 font-medium outline-none cursor-pointer"
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

            {/* Channel Filter */}
            <select
              value={selectedChannelFilter}
              onChange={(e) => setSelectedChannelFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs bg-white text-slate-700 font-medium outline-none cursor-pointer"
            >
              <option value="ALL">All Channels</option>
              <option value="Website">Website</option>
              <option value="Google Maps / GBP">Google Maps / GBP</option>
              <option value="Social Media">Social Media</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Social Ads">Social Ads</option>
              <option value="Email Marketing">Email Marketing</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Top-Level Share Lead Action Button */}
            <button
              onClick={() => {
                if (selectedLeadsList.length > 0) {
                  onOpenShareModal(selectedLeadsList);
                } else {
                  // If none selected, take the first qualified lead or first lead in view
                  const firstQualified = filteredLeads.find(
                    (l) => l.status === 'Qualified Leads' || l.status === 'Working Leads'
                  ) || filteredLeads[0];
                  if (firstQualified) {
                    onOpenShareModal([firstQualified]);
                  }
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#193d85] hover:bg-[#132f67] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              title="Share selected qualified leads with Admin or Medical Billing Manager"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>
                Share Lead{selectedLeadsList.length > 1 ? ` (${selectedLeadsList.length})` : ''}
              </span>
            </button>

            {/* Add Lead */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#149257] hover:bg-[#0f7a47] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* State Filter Indicator (if filtered from Map) */}
        {selectedStateFilter && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#eef3fc] border border-[#c9d7f3] rounded-lg text-xs text-[#193d85]">
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#193d85]" />
              <span>Filtering by Geographic State: <strong>{selectedStateFilter}</strong></span>
            </span>
            <button
              onClick={onClearStateFilter}
              className="text-[#193d85] hover:underline font-bold text-[11px]"
            >
              Clear GEO Filter
            </button>
          </div>
        )}

        {/* Selected Batch Bar */}
        {selectedLeadIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#eef3fc] border border-[#c9d7f3] rounded-lg text-xs animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-[#193d85]">
              <CheckSquare className="w-4 h-4 text-[#193d85]" />
              <span>
                {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#193d85] hover:bg-[#132f67] text-white rounded-md font-bold text-xs transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Selected Leads</span>
              </button>

              <div className="flex items-center gap-1 border-l border-[#c9d7f3] pl-2">
                <select
                  value={batchStatusValue}
                  onChange={(e) => setBatchStatusValue(e.target.value as LeadStatus)}
                  className="bg-white border border-[#c9d7f3] rounded px-2 py-1 text-[11px] font-medium text-slate-800"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <button
                  onClick={handleBatchStatusApply}
                  className="px-2.5 py-1 bg-white border border-[#c9d7f3] hover:bg-slate-50 text-[#193d85] rounded font-bold text-[11px] transition-colors"
                >
                  Apply Status
                </button>
              </div>

              <button
                onClick={() => setSelectedLeadIds([])}
                className="text-[#193d85] hover:underline font-medium text-[11px] ml-1"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. MARKETING DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px] tracking-wider select-none">
                {/* 1. Multi-select Checkbox */}
                <th className="py-3.5 px-4 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label="Select All"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#193d85]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>

                {/* 2. Client Name */}
                <th className="py-3.5 px-3 min-w-44">Client Name</th>

                {/* 3. Healthcare Provider / Practice Name */}
                <th className="py-3.5 px-3 min-w-48">Healthcare Provider / Practice</th>

                {/* 4. Location */}
                <th className="py-3.5 px-3 min-w-32">Location</th>

                {/* 5. Specialty Type */}
                <th className="py-3.5 px-3 min-w-28">Specialty Type</th>

                {/* 6. Email Address */}
                <th className="py-3.5 px-3 min-w-44">Email Address</th>

                {/* 7. Phone Number */}
                <th className="py-3.5 px-3 min-w-32">Phone Number</th>

                {/* 8. Source URL / Channel */}
                <th className="py-3.5 px-3 min-w-40">Source / Channel</th>

                {/* 9. Message / Inquiry Details */}
                <th className="py-3.5 px-3 min-w-56">Message / Inquiry Details</th>

                {/* 10. Lead Status Tag */}
                <th className="py-3.5 px-3 min-w-36">Lead Status Tag</th>

                {/* 11. Action Column: Share Lead Button */}
                <th className="py-3.5 px-4 text-right min-w-32">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-semibold text-slate-700 text-sm">
                        No practice leads match the filter criteria
                      </p>
                      <p className="text-xs text-slate-500">
                        Try resetting status filters, adjusting search queries, or registering a new lead.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStatusFilter('ALL');
                          setSelectedSpecialtyFilter('ALL');
                          setSelectedChannelFilter('ALL');
                          if (onClearStateFilter) onClearStateFilter();
                        }}
                        className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isChecked = selectedLeadIds.includes(lead.id);
                  const statusMeta = STATUS_CONFIG[lead.status];

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-[#eef3fc]/60' : ''
                      }`}
                    >
                      {/* 1. Multi-select Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelectOne(lead.id)}
                          className="text-slate-400 hover:text-slate-700"
                          aria-label={`Select ${lead.clientName}`}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#193d85]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>

                      {/* 2. Client Name */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onOpenDetailDrawer(lead)}
                          className="font-bold text-slate-900 hover:text-[#193d85] text-left transition-colors flex items-center gap-2 group"
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                            {lead.clientName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="truncate group-hover:underline">
                            {lead.clientName}
                          </span>
                        </button>
                      </td>

                      {/* 3. Healthcare Provider / Practice Name */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 truncate">
                          {lead.providerPracticeName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {lead.id}
                        </div>
                      </td>

                      {/* 4. Location */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700">
                          {lead.city}, {lead.state}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lead.country}
                        </div>
                      </td>

                      {/* 5. Specialty Type */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900">
                          {lead.specialty}
                        </span>
                      </td>

                      {/* 6. Email Address */}
                      <td className="py-3 px-3">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-slate-600 hover:text-blue-600 truncate block font-mono text-[11px]"
                        >
                          {lead.email}
                        </a>
                      </td>

                      {/* 7. Phone Number */}
                      <td className="py-3 px-3">
                        <span className="text-slate-600 font-mono text-[11px] tabular-nums">
                          {lead.phone}
                        </span>
                      </td>

                      {/* 8. Source URL / Channel */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {lead.channel}
                        </div>
                        <a
                          href={lead.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 hover:underline truncate max-w-36 block font-mono"
                          title={lead.sourceUrl}
                        >
                          {lead.sourceUrl.replace('https://', '')}
                        </a>
                      </td>

                      {/* 9. Message / Inquiry Details */}
                      <td className="py-3 px-3 max-w-xs">
                        <p
                          onClick={() => onOpenDetailDrawer(lead)}
                          className="text-slate-600 text-[11px] line-clamp-2 cursor-pointer hover:text-slate-900 transition-colors"
                          title={lead.message}
                        >
                          {lead.message}
                        </p>
                      </td>

                      {/* 10. Lead Status Tag (Mapped to 8 classifications) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: statusMeta.dotColor }}
                          />
                          <span
                            className={`font-mono text-[11px] font-bold ${statusMeta.textColor}`}
                          >
                            {lead.status}
                          </span>
                        </div>
                      </td>

                      {/* 11. Action Column: Share Lead Button + Details */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenShareModal([lead])}
                            className="px-2.5 py-1.5 bg-[#eef3fc] hover:bg-[#dbe7fa] text-[#193d85] border border-[#c9d7f3] rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                            title="Share and Route Lead to Team Member"
                          >
                            <Share2 className="w-3 h-3 text-[#193d85]" />
                            <span>Share Lead</span>
                          </button>

                          <button
                            onClick={() => onOpenDetailDrawer(lead)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Full Profile & Attribution"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="font-mono text-[11px]">
            Showing <strong className="text-slate-900">{filteredLeads.length}</strong> of{' '}
            <strong className="text-slate-900">{leads.length}</strong> total healthcare leads
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Sorted by Latest Acquisition</span>
            <span>·</span>
            <span>All Channels Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
