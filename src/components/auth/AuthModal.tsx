import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/marketing.ts';
import { userProfiles } from '../../data/mockData.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  targetRoleHint?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  targetRoleHint,
}) => {
  const [username, setUsername] = useState(
    targetRoleHint === 'admin'
      ? 'admin@amit.com'
      : targetRoleHint === 'billing_manager'
      ? 'billing@amit.com'
      : 'marketing@amit.com'
  );
  const [password, setPassword] = useState(
    targetRoleHint === 'admin'
      ? 'admin123'
      : targetRoleHint === 'billing_manager'
      ? 'billing123'
      : 'marketing123'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check credentials
    if (
      (cleanUser === 'marketing' || cleanUser === 'marketing@amit.com') &&
      cleanPass === 'marketing123'
    ) {
      const profile = userProfiles.find((p) => p.role === 'super_admin')!;
      onLoginSuccess(profile);
      onClose();
      return;
    }

    if (
      (cleanUser === 'admin' || cleanUser === 'admin@amit.com') &&
      cleanPass === 'admin123'
    ) {
      const profile = userProfiles.find((p) => p.role === 'admin')!;
      onLoginSuccess(profile);
      onClose();
      return;
    }

    if (
      (cleanUser === 'billing' || cleanUser === 'billing@amit.com') &&
      cleanPass === 'billing123'
    ) {
      const profile = userProfiles.find((p) => p.role === 'billing_manager')!;
      onLoginSuccess(profile);
      onClose();
      return;
    }

    setErrorMessage(
      'Invalid username or password. Please use the quick credentials below to log in.'
    );
  };

  const handleSelectPreset = (role: UserRole) => {
    if (role === 'super_admin') {
      setUsername('marketing@amit.com');
      setPassword('marketing123');
    } else if (role === 'admin') {
      setUsername('admin@amit.com');
      setPassword('admin123');
    } else {
      setUsername('billing@amit.com');
      setPassword('billing123');
    }
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#193d85] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Role Authentication</h3>
              <p className="text-xs text-white/80 mt-0.5">
                Sign in to switch between Super Admin & Operations Admin
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin@amit.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20 focus:border-[#193d85]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#193d85]/20 focus:border-[#193d85]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#193d85] hover:bg-[#122e64] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Authenticate & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Quick 1-Click Role Switch:
            </div>

            <div className="space-y-2">
              {/* Marketing Team (Super Admin) */}
              <button
                type="button"
                onClick={() => handleSelectPreset('super_admin')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#193d85] hover:bg-[#eef3fc] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#193d85]">
                    <span>Marketing Team (Super Admin)</span>
                    <span className="text-[9px] bg-[#193d85] text-white px-1.5 py-0.2 rounded font-mono">
                      Full Access
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    marketing@amit.com · marketing123
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#193d85] group-hover:underline">
                  Auto-fill
                </span>
              </button>

              {/* Admin (Operations) */}
              <button
                type="button"
                onClick={() => handleSelectPreset('admin')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#149257] hover:bg-[#e8f7ef] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#149257]">
                    <span>Admin (Operations Manager)</span>
                    <span className="text-[9px] bg-[#149257] text-white px-1.5 py-0.2 rounded font-mono">
                      Restricted View
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    admin@amit.com · admin123
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#149257] group-hover:underline">
                  Auto-fill
                </span>
              </button>

              {/* Medical Billing Manager */}
              <button
                type="button"
                onClick={() => handleSelectPreset('billing_manager')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/70 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                    <span>Medical Billing Manager</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                      Sales & Onboarding
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    billing@amit.com · billing123
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 group-hover:underline">
                  Auto-fill
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
