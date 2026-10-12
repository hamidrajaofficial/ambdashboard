import React from 'react';
import amitLogo from '../../assets/images/AMIT Transparent logo.png';
import {
  BarChart3,
  Users2,
  GitBranch,
  Layers,
  Send,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Crown,
  Lock,
  CreditCard,
  FileSpreadsheet,
  ArrowRightLeft,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/marketing.ts';

interface SidebarProps {
  currentTab: 'analytics' | 'leads' | 'admin' | 'billing';
  setCurrentTab: (tab: 'analytics' | 'leads' | 'admin' | 'billing') => void;
  leadCount: number;
  dealsCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  currentUser: UserProfile;
  onSwitchProfile: (role: UserRole) => void;
  onOpenAuthModal: () => void;
  onAttemptRestrictedAccess: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  leadCount,
  dealsCount,
  isOpenMobile,
  setIsOpenMobile,
  currentUser,
  onSwitchProfile,
  onOpenAuthModal,
  onAttemptRestrictedAccess,
}) => {
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role === 'admin';
  const isBilling = currentUser.role === 'billing_manager';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand Header with Logo Only */}
        <div className="h-24 px-4 border-b border-slate-200 flex items-center justify-center bg-white">
          <div className="h-20 w-full max-w-[220px] flex items-center justify-center p-1">
            <img
              src={amitLogo || '/logo.png'}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* SUPER ADMIN VIEW MODULES */}
          {isSuperAdmin && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Super Admin Hub</span>
                <Crown className="w-3 h-3 text-amber-500" />
              </div>
              <nav className="space-y-1">
                {/* 1. Audience & Traffic */}
                <button
                  onClick={() => {
                    setCurrentTab('analytics');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    currentTab === 'analytics'
                      ? 'bg-[#193d85] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#eef3fc] hover:text-[#193d85]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    <span>Audience & Traffic</span>
                  </div>
                  {currentTab === 'analytics' && (
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                      Live
                    </span>
                  )}
                </button>

                {/* 2. Leads Management */}
                <button
                  onClick={() => {
                    setCurrentTab('leads');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    currentTab === 'leads'
                      ? 'bg-[#193d85] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#eef3fc] hover:text-[#193d85]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users2 className="w-4 h-4 shrink-0" />
                    <span>Marketing Pipeline</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono tabular-nums font-bold ${
                      currentTab === 'leads'
                        ? 'bg-[#149257] text-white'
                        : 'bg-emerald-50 text-[#149257]'
                    }`}
                  >
                    {leadCount}
                  </span>
                </button>

                {/* 3. Admin Dashboard (Operations View) */}
                <button
                  onClick={() => {
                    setCurrentTab('admin');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    currentTab === 'admin'
                      ? 'bg-[#193d85] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#eef3fc] hover:text-[#193d85]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Admin Operations</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    Ops
                  </span>
                </button>

                {/* 4. Medical Billing Manager */}
                <button
                  onClick={() => {
                    setCurrentTab('billing');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    currentTab === 'billing'
                      ? 'bg-[#193d85] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#eef3fc] hover:text-[#193d85]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Medical Billing</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">
                    Manager
                  </span>
                </button>
              </nav>
            </div>
          )}

          {/* ADMIN RESTRICTED MODULES */}
          {isAdmin && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Operations Admin</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#149257]" />
              </div>
              <nav className="space-y-1">
                {/* Admin Overview & Tables */}
                <button
                  onClick={() => {
                    setCurrentTab('admin');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all bg-[#193d85] text-white shadow-sm`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 shrink-0" />
                    <span>Admin Dashboard</span>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    Active
                  </span>
                </button>
              </nav>
            </div>
          )}

          {/* BILLING MANAGER MODULES */}
          {isBilling && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Medical Billing Manager
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentTab('billing');
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-lg transition-all bg-[#193d85] text-white shadow-sm`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>Billing & Onboarding</span>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                    Active
                  </span>
                </button>
              </nav>
            </div>
          )}

          {/* Quick Shortcuts for Super Admin */}
          {isSuperAdmin && (
            <div>
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Attribution & Deals
              </div>
              <div className="space-y-1 text-sm">
                <button
                  onClick={() => {
                    setCurrentTab('leads');
                    setIsOpenMobile(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 hover:text-[#193d85] hover:bg-[#eef3fc] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-[#193d85]" />
                    <span className="font-medium">High-Value Deals</span>
                  </div>
                  <span className="font-mono text-[#193d85] font-bold">{dealsCount}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('analytics');
                    setIsOpenMobile(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-600 hover:text-[#193d85] hover:bg-[#eef3fc] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#149257]" />
                    <span className="font-medium">GEO Acquisition Map</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">50 States</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom User Role Switch Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role === 'admin' ? 'Operations Admin' : 'Billing Manager'}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="p-1.5 text-slate-500 hover:text-[#193d85] hover:bg-white rounded-lg border border-slate-200 transition-colors"
              title="Authenticate with credentials"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
