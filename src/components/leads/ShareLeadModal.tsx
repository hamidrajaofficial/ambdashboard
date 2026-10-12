import React, { useState } from 'react';
import { Lead, TeamMember } from '../../types/marketing.ts';
import { teamMembers } from '../../data/mockData.ts';
import {
  Share2,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';

interface ShareLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadsToShare: Lead[];
  onShareComplete: (
    leadIds: string[],
    targetRoles: ('Admin' | 'Medical Billing Manager')[],
    assignedName: string,
    notes?: string
  ) => void;
}

export const ShareLeadModal: React.FC<ShareLeadModalProps> = ({
  isOpen,
  onClose,
  leadsToShare,
  onShareComplete,
}) => {
  // Destination Role choice per prompt: Admin or Medical Billing Manager (or Both)
  const [selectedDestination, setSelectedDestination] = useState<
    'Medical Billing Manager' | 'Admin' | 'Both'
  >('Medical Billing Manager');

  // Assigned rep / onboarding specialist
  const [selectedRep, setSelectedRep] = useState<string>(
    'Billing Manager / Onboarding Specialist'
  );
  const [channelType, setChannelType] = useState<'crm' | 'email' | 'slack'>('crm');
  const [urgency, setUrgency] = useState<'Immediate' | 'High' | 'Normal'>('High');
  const [handoffNotes, setHandoffNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const targetRoles: ('Admin' | 'Medical Billing Manager')[] =
        selectedDestination === 'Both'
          ? ['Admin', 'Medical Billing Manager']
          : [selectedDestination];

      const leadIds = leadsToShare.map((l) => l.id);

      setSuccessMessage(
        `Successfully shared & routed ${leadsToShare.length} qualified lead${
          leadsToShare.length > 1 ? 's' : ''
        } to ${
          selectedDestination === 'Both'
            ? 'Admin and Medical Billing Manager'
            : selectedDestination
        }!`
      );

      setTimeout(() => {
        onShareComplete(
          leadIds,
          targetRoles,
          selectedRep,
          handoffNotes
        );
        setSuccessMessage(null);
        onClose();
      }, 1200);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#eef3fc] text-[#193d85] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Cross-Role Lead Sharing & Routing
              </h3>
              <p className="text-xs text-slate-500">
                Forward qualified leads from Digital Marketing to Admin or Billing Manager
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {successMessage ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#e8f7ef] text-[#149257] flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Lead Approved & Forwarded
              </h4>
              <p className="text-xs text-slate-600 max-w-md">{successMessage}</p>
            </div>
          ) : (
            <>
              {/* Leads Preview */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Selected Qualified Lead{leadsToShare.length > 1 ? 's' : ''} ({leadsToShare.length})
                </label>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 max-h-36 overflow-y-auto divide-y divide-slate-200/60">
                  {leadsToShare.map((l) => (
                    <div
                      key={l.id}
                      className="py-2 first:pt-0 last:pb-0 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 text-xs">
                          {l.clientName}
                        </span>
                        <span className="text-slate-400 mx-1.5">·</span>
                        <span className="text-slate-600 font-medium">
                          {l.providerPracticeName}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {l.specialty} · {l.city}, {l.state} · Phone: {l.phone}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#193d85] bg-[#eef3fc] border border-[#c9d7f3] px-2 py-0.5 rounded font-semibold">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Select Target Destination Role */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  1. Select Target Destination Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Medical Billing Manager */}
                  <div
                    onClick={() => {
                      setSelectedDestination('Medical Billing Manager');
                      setSelectedRep('Billing Manager / Onboarding Specialist');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedDestination === 'Medical Billing Manager'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-md">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        Medical Billing Manager
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      For actionable sales, onboarding, & billing consultations.
                    </p>
                    <span className="mt-2 text-[10px] font-semibold text-emerald-700">
                      Forward Qualified Lead
                    </span>
                  </div>

                  {/* Admin */}
                  <div
                    onClick={() => {
                      setSelectedDestination('Admin');
                      setSelectedRep('Operations Admin');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedDestination === 'Admin'
                        ? 'border-[#193d85] bg-[#eef3fc]/70 ring-2 ring-[#193d85]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-[#eef3fc] text-[#193d85] rounded-md">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        Admin Dashboard
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      For high-level operations monitoring & restricted data visibility.
                    </p>
                    <span className="mt-2 text-[10px] font-semibold text-[#193d85]">
                      Operations Lead Record
                    </span>
                  </div>

                  {/* Both */}
                  <div
                    onClick={() => {
                      setSelectedDestination('Both');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedDestination === 'Both'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md">
                        <Building className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        Both Destinations
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Simultaneously share to Admin & Medical Billing Manager.
                    </p>
                    <span className="mt-2 text-[10px] font-semibold text-indigo-700">
                      Cross-Functional Route
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Assigned Specialist / Onboarding Specialist */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  2. Assigned Specialist / Lead Owner
                </label>
                <select
                  value={selectedRep}
                  onChange={(e) => setSelectedRep(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 font-medium outline-none focus:border-[#193d85] text-xs"
                >
                  <option value="Billing Manager / Onboarding Specialist">
                    Billing Manager / Onboarding Specialist (Rachel Adams)
                  </option>
                  <option value="Operations Admin">Operations Admin (David Keller)</option>
                  <option value="Billing Team">Billing Team (General Queue)</option>
                  <option value="Marketing Team">Marketing Team</option>
                  <option value="Sarah Jenkins (Sales)">Sarah Jenkins (VP Sales)</option>
                  <option value="Marcus Vance (Consultant)">Marcus Vance (Sr. Consultant)</option>
                  <option value="Dr. Elena Rostova (Clinical)">Dr. Elena Rostova (Clinical Liaison)</option>
                </select>
              </div>

              {/* Step 3: Priority & Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1.5">
                    Response SLA / Priority
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 font-medium outline-none focus:border-[#193d85] text-xs"
                  >
                    <option value="Immediate">Immediate (1-Hour Urgent SLA)</option>
                    <option value="High">High Priority (Within 4 Hours)</option>
                    <option value="Normal">Standard (Within 24 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1.5">
                    Handoff Notification
                  </label>
                  <select
                    value={channelType}
                    onChange={(e) => setChannelType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-800 font-medium outline-none focus:border-[#193d85] text-xs"
                  >
                    <option value="crm">Direct Dashboard Dispatch</option>
                    <option value="email">Email Notification Alert</option>
                    <option value="slack">Slack / Teams Ping</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Notes */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Handoff & Clinical Directives
                </label>
                <textarea
                  value={handoffNotes}
                  onChange={(e) => setHandoffNotes(e.target.value)}
                  placeholder="e.g. Lead reviewed and qualified by Marketing. Ready for billing consultation and onboarding fee schedule presentation."
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-[#193d85] text-xs"
                />
              </div>

              {/* Inter-Team Workflow Rule Reminder */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-[11px] text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Workflow Rule Enforced:</strong> Medical Billing Manager Dashboard will only receive and display leads explicitly approved and shared through this action. Admin retains operational overview.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!successMessage && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Target: {selectedDestination}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#193d85] hover:bg-[#132f67] text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sharing...' : 'Confirm & Share Lead'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
