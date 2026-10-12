import React, { useState, useRef, useEffect } from 'react';
import amitLogo from '../../assets/images/AMIT Transparent logo.png';
import {
  Menu,
  Calendar,
  Plus,
  Share2,
  ShieldCheck,
  ChevronDown,
  Lock,
  LogOut,
  UserCheck,
  Crown,
  Layers,
  Sparkles,
  Link,
  Check,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/marketing.ts';
import { userProfiles } from '../../data/mockData.ts';
import { NotificationBell, AppNotification } from '../common/NotificationBell.tsx';

interface HeaderProps {
  currentTab: 'analytics' | 'leads' | 'admin' | 'billing';
  setCurrentTab: (tab: 'analytics' | 'leads' | 'admin' | 'billing') => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  onOpenAddLeadModal: () => void;
  onOpenBatchShareModal: () => void;
  selectedCount: number;
  onToggleMobileMenu: () => void;
  currentUser: UserProfile;
  onSwitchProfile: (role: UserRole) => void;
  onOpenAuthModal: () => void;
  notifications?: AppNotification[];
  onMarkAllNotificationsRead?: () => void;
  onNotificationClick?: (notif: AppNotification) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  dateRange,
  setDateRange,
  onOpenAddLeadModal,
  onOpenBatchShareModal,
  selectedCount,
  onToggleMobileMenu,
  currentUser,
  onSwitchProfile,
  onOpenAuthModal,
  notifications = [],
  onMarkAllNotificationsRead = () => {},
  onNotificationClick = () => {},
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyRoleUrl = (role: UserRole) => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', role === 'super_admin' ? 'marketing' : role);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role === 'admin';
  const isBilling = currentUser.role === 'billing_manager';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Zone 1: Mobile toggle & Attribution/Scope Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center lg:hidden">
          <img
            src={amitLogo || '/logo.png'}
            alt="Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
        </div>

        {/* Dynamic Context Pill based on active role */}
        {isSuperAdmin && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#193d85] bg-[#eef3fc] border border-[#c9d7f3] px-2.5 py-1 rounded-md font-mono font-medium">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Super Admin Access
          </span>
        )}

        {isAdmin && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#149257] bg-[#e8f7ef] border border-[#bce5cf] px-2.5 py-1 rounded-md font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#149257]" />
            Admin Operations Only
          </span>
        )}

        {isBilling && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Billing Manager Preview
          </span>
        )}
      </div>

      {/* Zone 3: Actions & Interactive User Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Date Range Selector */}
        <div className="relative hidden xl:flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer"
          >
            <option value="last30">Last 30 Days (Sep - Oct 2026)</option>
            <option value="last7">Last 7 Days</option>
            <option value="q3">Q3 2026 (Jul - Sep)</option>
            <option value="ytd">Year to Date 2026</option>
          </select>
        </div>

        {/* Batch Share Button if leads selected */}
        {selectedCount > 0 && isSuperAdmin && (
          <button
            onClick={onOpenBatchShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#193d85] hover:bg-[#132f67] rounded-lg transition-colors shadow-xs animate-in fade-in"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Selected ({selectedCount})</span>
          </button>
        )}

        {/* Primary CTA: Add Lead */}
        <button
          onClick={onOpenAddLeadModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#149257] hover:bg-[#0f7a47] rounded-lg transition-colors shadow-xs whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>

        {/* Real-time Notification Bell with Red Badge */}
        <NotificationBell
          notifications={notifications}
          onMarkAllAsRead={onMarkAllNotificationsRead}
          onNotificationClick={onNotificationClick}
        />

        {/* USER PROFILE & ROLE SWITCHER DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left group"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-slate-300 ring-1 ring-slate-100 shrink-0"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-[#193d85] flex items-center gap-1">
                <span>{currentUser.name}</span>
                {isSuperAdmin && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {currentUser.roleTitle}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* DROPDOWN MENU */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSuperAdmin
                            ? 'bg-[#eef3fc] text-[#193d85] border border-[#c9d7f3]'
                            : isAdmin
                            ? 'bg-[#e8f7ef] text-[#149257] border border-[#bce5cf]'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {isSuperAdmin ? '👑 Super Admin Role' : isAdmin ? '🛡️ Admin Role' : '💳 Billing Role'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Quick Role Switcher */}
              <div className="px-3 py-2">
                <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role Profile:
                </div>

                <div className="space-y-1">
                  {/* Option 1: Marketing Team (Super Admin) */}
                  <button
                    onClick={() => {
                      onSwitchProfile('super_admin');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSuperAdmin
                        ? 'bg-[#eef3fc] text-[#193d85] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <div>Marketing Team (Super Admin)</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Full attribution & pipeline access
                        </div>
                      </div>
                    </div>
                    {isSuperAdmin && <UserCheck className="w-3.5 h-3.5 text-[#193d85]" />}
                  </button>

                  {/* Option 2: Admin (Operations) */}
                  <button
                    onClick={() => {
                      onSwitchProfile('admin');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isAdmin
                        ? 'bg-[#e8f7ef] text-[#149257] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#149257] shrink-0" />
                      <div>
                        <div>Admin (Operations View)</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          KPI summary & restricted leads table
                        </div>
                      </div>
                    </div>
                    {isAdmin && <UserCheck className="w-3.5 h-3.5 text-[#149257]" />}
                  </button>

                  {/* Option 3: Medical Billing Manager */}
                  <button
                    onClick={() => {
                      onSwitchProfile('billing_manager');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isBilling
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <div>Medical Billing Manager</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Actionable sales & onboarding (shared leads)
                        </div>
                      </div>
                    </div>
                    {isBilling && <UserCheck className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>
                </div>
              </div>

              {/* Section: Security & Authentication */}
              <div className="border-t border-slate-100 px-3 pt-2 pb-1 space-y-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Authenticate with Username & Password</span>
                </button>

                <button
                  onClick={() => handleCopyRoleUrl(currentUser.role)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Link className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Role URL (?role={isAdmin ? 'admin' : 'marketing'})</span>
                  </div>
                  {copiedLink ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
