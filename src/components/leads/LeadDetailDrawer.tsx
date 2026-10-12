import React from 'react';
import { Lead, LeadStatus } from '../../types/marketing.ts';
import { STATUS_CONFIG, ALL_STATUSES } from '../../utils/statusStyles.ts';
import {
  X,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Calendar,
  Clock,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onShareLead: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onShareLead,
}) => {
  if (!lead) return null;

  const currentStatusMeta = STATUS_CONFIG[lead.status];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-50">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              {lead.clientName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {lead.clientName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lead.providerPracticeName} · {lead.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShareLead(lead)}
              className="p-2 text-[#193d85] bg-[#eef3fc] hover:bg-[#dbe7fa] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#193d85]" />
              <span>Share Lead</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Status Bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Pipeline Status
              </span>
              <span className={`font-mono text-xs font-bold ${currentStatusMeta.textColor}`}>
                {lead.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              {currentStatusMeta.description}
            </p>

            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                Update Status Stage:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateStatus(lead.id, st)}
                    className={`py-1.5 px-2 text-[11px] font-medium rounded-lg text-left transition-colors border ${
                      lead.status === st
                        ? 'bg-[#193d85] text-white border-[#193d85] font-bold'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Contact & Practice Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-400">Email Address</div>
                <div className="font-semibold text-slate-900 mt-0.5 truncate">
                  <a href={`mailto:${lead.email}`} className="hover:underline text-blue-600">
                    {lead.email}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-400">Phone Number</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-400">Territory / Location</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {lead.city}, {lead.state}, {lead.country}
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-400">Medical Specialty</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {lead.specialty}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Message / Inquiry Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Patient Acquisition Inquiry / Clinical Directives
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800 text-xs whitespace-pre-wrap">
              {lead.message}
            </div>
          </div>

          {/* Complete Marketing Attribution Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Attribution & Acquisition Origin
            </h4>
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-sans">Attribution Channel:</span>
                <span className="font-bold text-slate-900">{lead.channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-sans">Source URL / Route:</span>
                <a
                  href={lead.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline truncate max-w-xs flex items-center gap-1"
                >
                  <span className="truncate">{lead.sourceUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-sans">UTM Campaign:</span>
                <span className="text-slate-700">{lead.utmCampaign || 'organic_direct'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-sans">Visitor Device:</span>
                <span className="text-slate-700">{lead.device || 'Desktop'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Assigned Specialist:</span>
                <span className="font-bold text-purple-700">{lead.assignedRep || 'Unassigned'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onShareLead(lead)}
            className="px-4 py-2 bg-[#193d85] hover:bg-[#132f67] text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Route Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
