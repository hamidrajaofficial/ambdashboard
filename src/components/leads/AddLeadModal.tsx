import React, { useState } from 'react';
import { Lead, LeadStatus, LeadChannel, MedicalSpecialty } from '../../types/marketing.ts';
import { ALL_STATUSES } from '../../utils/statusStyles.ts';
import { Plus, X, Building, User, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

const specialties: MedicalSpecialty[] = [
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Oncology',
  'Neurology',
  'Dentistry',
  'Plastic Surgery',
  'Ophthalmology',
  'Family Medicine',
];

const channels: LeadChannel[] = [
  'Website',
  'Google Maps / GBP',
  'Social Media',
  'Google Ads',
  'Social Ads',
  'Email Marketing',
];

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
}) => {
  const [clientName, setClientName] = useState('');
  const [providerPracticeName, setProviderPracticeName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [specialty, setSpecialty] = useState<MedicalSpecialty>('Cardiology');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<LeadChannel>('Website');
  const [sourceUrl, setSourceUrl] = useState('https://pulsepointhealth.com/instant-intake');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New Leads');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !providerPracticeName || !email) return;

    const newLead: Lead = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      providerPracticeName,
      city: city || 'Austin',
      state: state || 'TX',
      country: 'United States',
      specialty,
      email,
      phone: phone || '(512) 555-0199',
      channel,
      sourceUrl,
      message: message || 'Interested in localized patient acquisition and provider referral automation.',
      status,
      createdAt: new Date().toISOString(),
      utmCampaign: 'manual_intake_entry',
      device: 'Desktop',
      assignedRep: 'Unassigned',
      urgency: 'Medium',
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#193d85] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Record New Practice Lead
              </h3>
              <p className="text-xs text-slate-500">
                Log an incoming clinical inquiry into AMIT pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Client / Physician Name *
              </label>
              <input
                type="text"
                required
                placeholder="Dr. Alexander Vance"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Healthcare Provider / Practice Name *
              </label>
              <input
                type="text"
                required
                placeholder="Austin Heart & Vascular Center"
                value={providerPracticeName}
                onChange={(e) => setProviderPracticeName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Specialty Type *
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as MedicalSpecialty)}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-slate-900"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Initial Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-slate-900"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="doctor@practice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="(512) 555-0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                City & State
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Austin"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
                />
                <input
                  type="text"
                  placeholder="TX"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  className="w-16 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900 text-center uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Acquisition Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as LeadChannel)}
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-900 focus:outline-slate-900"
              >
                {channels.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Source URL / Campaign Landing Page
            </label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Message / Clinical Intake Details
            </label>
            <textarea
              rows={3}
              placeholder="Clinical practice objectives, provider count, patient volume needs..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-slate-900"
            />
          </div>

          {/* Footer inside form */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#149257] hover:bg-[#0f7a47] text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              Save & Register Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
