import React, { useState, useEffect } from 'react';
import { initialLeads, userProfiles } from './data/mockData.ts';
import { Lead, LeadStatus, UserProfile, UserRole } from './types/marketing.ts';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';
import { AudienceAnalyticsTab } from './components/analytics/AudienceAnalyticsTab.tsx';
import { LeadsManagementTab } from './components/leads/LeadsManagementTab.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { BillingManagerTab } from './components/admin/BillingManagerTab.tsx';
import { ShareLeadModal } from './components/leads/ShareLeadModal.tsx';
import { LeadDetailDrawer } from './components/leads/LeadDetailDrawer.tsx';
import { AddLeadModal } from './components/leads/AddLeadModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { AppNotification } from './components/common/NotificationBell.tsx';
import { CheckCircle2, X, Lock, ShieldAlert } from 'lucide-react';

export default function App() {
  // Read initial role or tab from URL parameters (e.g. ?role=admin or ?role=marketing)
  const getInitialUserAndTab = (): { user: UserProfile; tab: 'analytics' | 'leads' | 'admin' | 'billing' } => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role')?.toLowerCase();
      const tabParam = params.get('tab')?.toLowerCase();

      if (roleParam === 'admin') {
        const adminUser = userProfiles.find((u) => u.role === 'admin') || userProfiles[1];
        return { user: adminUser, tab: 'admin' };
      }
      if (roleParam === 'billing' || roleParam === 'billing_manager') {
        const billingUser = userProfiles.find((u) => u.role === 'billing_manager') || userProfiles[2];
        return { user: billingUser, tab: 'billing' };
      }
      if (tabParam === 'admin') {
        return { user: userProfiles[0], tab: 'admin' };
      }
    } catch {
      // Fallback
    }
    return { user: userProfiles[0], tab: 'analytics' };
  };

  const initialSetup = getInitialUserAndTab();
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialSetup.user);
  const [currentTab, setCurrentTab] = useState<'analytics' | 'leads' | 'admin' | 'billing'>(initialSetup.tab);

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [dateRange, setDateRange] = useState<string>('last30');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Geo map click to filter
  const [selectedGeoState, setSelectedGeoState] = useState<string | null>(null);

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [leadsToShare, setLeadsToShare] = useState<Lead[]>([]);

  const [detailDrawerLead, setDetailDrawerLead] = useState<Lead | null>(null);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [targetRoleHint, setTargetRoleHint] = useState<UserRole | undefined>(undefined);

  // Restricted access warning modal for Admin role
  const [restrictedNoticeOpen, setRestrictedNoticeOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live in-app notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Qualified Lead Shared',
      message: 'Apex Heart & Vascular Institute shared with Medical Billing Manager & Admin.',
      timestamp: '10m ago',
      isRead: false,
      type: 'lead_shared',
      leadId: 'LD-9081',
    },
    {
      id: 'notif-2',
      title: 'New Clinical Intake Ingested',
      message: 'Cascadia Orthopedic & Spine Center inquiry received via Google Ads.',
      timestamp: '2h ago',
      isRead: false,
      type: 'new_lead',
      leadId: 'LD-9082',
    },
  ]);

  const addNotification = (
    title: string,
    message: string,
    type: 'lead_shared' | 'new_lead' | 'status_change',
    leadId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      isRead: false,
      type,
      leadId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    if (notif.leadId) {
      const targetLead = leads.find((l) => l.id === notif.leadId);
      if (targetLead) {
        setDetailDrawerLead(targetLead);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync URL search params when user or tab changes
  const updateUrlParam = (role: UserRole) => {
    try {
      const url = new URL(window.location.href);
      if (role === 'admin') {
        url.searchParams.set('role', 'admin');
      } else if (role === 'billing_manager') {
        url.searchParams.set('role', 'billing');
      } else {
        url.searchParams.delete('role');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore
    }
  };

  // Switch role profile directly or via auth
  const handleSwitchProfile = (newRole: UserRole) => {
    const profile = userProfiles.find((u) => u.role === newRole);
    if (!profile) return;

    setCurrentUser(profile);
    updateUrlParam(newRole);

    if (newRole === 'admin') {
      setCurrentTab('admin');
      showToast('Switched to Admin Role (Operations & Restricted View)');
    } else if (newRole === 'billing_manager') {
      setCurrentTab('billing');
      showToast('Switched to Billing Team Manager Preview');
    } else {
      setCurrentTab('analytics');
      showToast('Switched to Marketing Team (Super Admin Access)');
    }
  };

  // Login success from modal
  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    updateUrlParam(profile.role);

    if (profile.role === 'admin') {
      setCurrentTab('admin');
    } else if (profile.role === 'billing_manager') {
      setCurrentTab('billing');
    } else {
      setCurrentTab('analytics');
    }
    showToast(`Authenticated as ${profile.name} (${profile.roleTitle})`);
  };

  // Attempt restricted action
  const handleAttemptRestrictedAccess = () => {
    setRestrictedNoticeOpen(true);
  };

  // Lead operations
  const handleUpdateLeadStatus = (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    const affectedLead = leads.find((l) => l.id === id);
    if (detailDrawerLead && detailDrawerLead.id === id) {
      setDetailDrawerLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Lead status updated to "${newStatus}"`);
    if (affectedLead) {
      addNotification(
        `Lead Status Updated`,
        `${affectedLead.providerPracticeName} moved to "${newStatus}".`,
        'status_change',
        id
      );
    }
  };

  const handleUpdateLeadAssignment = (id: string, newAssignedTo: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, assignedTo: newAssignedTo, assignedRep: newAssignedTo } : l
      )
    );
    if (detailDrawerLead && detailDrawerLead.id === id) {
      setDetailDrawerLead((prev) =>
        prev ? { ...prev, assignedTo: newAssignedTo, assignedRep: newAssignedTo } : null
      );
    }
    showToast(`Reassigned lead to "${newAssignedTo}"`);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Registered new inquiry for ${newLead.providerPracticeName}`);
    addNotification(
      `New Lead Ingested`,
      `Inquiry from ${newLead.clientName} (${newLead.providerPracticeName}) captured.`,
      'new_lead',
      newLead.id
    );
    if (currentUser.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('leads');
    }
  };

  const handleOpenShareSingle = (lead: Lead) => {
    setLeadsToShare([lead]);
    setShareModalOpen(true);
  };

  const handleOpenShareMultiple = (selectedLeads: Lead[]) => {
    setLeadsToShare(selectedLeads);
    setShareModalOpen(true);
  };

  const handleShareComplete = (
    leadIds: string[],
    targetRoles: ('Admin' | 'Medical Billing Manager')[],
    assignedName: string,
    notes?: string
  ) => {
    const isBilling = targetRoles.includes('Medical Billing Manager');
    const isAdmin = targetRoles.includes('Admin');

    setLeads((prev) =>
      prev.map((l) => {
        if (!leadIds.includes(l.id)) return l;

        const currentDestinations = l.sharedDestinations || [];
        const newDestinations = Array.from(
          new Set([...currentDestinations, ...targetRoles])
        );

        return {
          ...l,
          assignedTo: assignedName || l.assignedTo,
          assignedRep: assignedName || l.assignedRep,
          sharedWithBilling: isBilling ? true : l.sharedWithBilling,
          sharedWithAdmin: isAdmin ? true : l.sharedWithAdmin,
          sharedDestinations: newDestinations,
          sharedAt: new Date().toISOString(),
          handoffNotes: notes || l.handoffNotes,
        };
      })
    );

    const rolesText = targetRoles.join(' & ');
    showToast(
      `Approved & shared ${leadIds.length} lead${
        leadIds.length > 1 ? 's' : ''
      } with ${rolesText}!`
    );

    addNotification(
      `Leads Shared to ${rolesText}`,
      `${leadIds.length} qualified lead(s) transferred to ${rolesText} assigned to ${assignedName || 'Specialist'}.`,
      'lead_shared',
      leadIds[0]
    );
  };

  const handleNavigateFromMap = (stateCode?: string) => {
    if (stateCode) {
      setSelectedGeoState(stateCode);
    }
    setCurrentTab('leads');
  };

  // Count qualified leads
  const dealsCount = leads.filter((l) => l.status === 'Qualified Leads').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (currentUser.role === 'admin' && tab !== 'admin') {
            handleAttemptRestrictedAccess();
            return;
          }
          setCurrentTab(tab);
        }}
        leadCount={leads.length}
        dealsCount={dealsCount}
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
        currentUser={currentUser}
        onSwitchProfile={handleSwitchProfile}
        onOpenAuthModal={() => {
          setTargetRoleHint(currentUser.role);
          setAuthModalOpen(true);
        }}
        onAttemptRestrictedAccess={handleAttemptRestrictedAccess}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar Header with Profile & Role Switcher */}
        <Header
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (currentUser.role === 'admin' && tab !== 'admin') {
              handleAttemptRestrictedAccess();
              return;
            }
            setCurrentTab(tab);
          }}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onOpenAddLeadModal={() => setAddLeadModalOpen(true)}
          onOpenBatchShareModal={() => handleOpenShareMultiple(leads.slice(0, 2))}
          selectedCount={0}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          currentUser={currentUser}
          onSwitchProfile={handleSwitchProfile}
          onOpenAuthModal={() => {
            setTargetRoleHint(currentUser.role);
            setAuthModalOpen(true);
          }}
          notifications={notifications}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onNotificationClick={handleNotificationClick}
        />

        {/* Workspace Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'analytics' && currentUser.role === 'super_admin' && (
            <AudienceAnalyticsTab onNavigateToLeads={handleNavigateFromMap} />
          )}

          {currentTab === 'leads' && currentUser.role === 'super_admin' && (
            <LeadsManagementTab
              leads={leads}
              onOpenShareModal={handleOpenShareMultiple}
              onOpenDetailDrawer={(lead) => setDetailDrawerLead(lead)}
              onOpenAddModal={() => setAddLeadModalOpen(true)}
              onUpdateStatus={handleUpdateLeadStatus}
              selectedStateFilter={selectedGeoState}
              onClearStateFilter={() => setSelectedGeoState(null)}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onUpdateLeadAssignment={handleUpdateLeadAssignment}
              onViewLeadDetails={(lead) => setDetailDrawerLead(lead)}
              onOpenShareModal={handleOpenShareMultiple}
              onOpenAddLeadModal={() => setAddLeadModalOpen(true)}
            />
          )}

          {currentTab === 'billing' && (
            <BillingManagerTab
              leads={leads}
              onViewLeadDetails={(lead) => setDetailDrawerLead(lead)}
              onSwitchToMarketing={() => handleSwitchProfile('super_admin')}
            />
          )}
        </main>
      </div>

      {/* Share & Route Lead Modal */}
      <ShareLeadModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        leadsToShare={leadsToShare}
        onShareComplete={handleShareComplete}
      />

      {/* Lead Detail Slideover Panel */}
      <LeadDetailDrawer
        lead={detailDrawerLead}
        onClose={() => setDetailDrawerLead(null)}
        onUpdateStatus={handleUpdateLeadStatus}
        onShareLead={(lead) => {
          handleOpenShareSingle(lead);
          setDetailDrawerLead(null);
        }}
      />

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={addLeadModalOpen}
        onClose={() => setAddLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* Authentication Modal with Username & Password */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        targetRoleHint={targetRoleHint}
      />

      {/* Restricted Access Modal for Admin attempting Marketing Attribution */}
      {restrictedNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Marketing Attribution Restricted
                </h4>
                <span className="text-[11px] font-mono font-semibold text-amber-700">
                  Role: Operations Admin
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Marketing attribution source URLs, UTM ad campaigns, and detailed traffic acquisition metrics are restricted to the <strong>Marketing Team (Super Admin)</strong>.
            </p>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-900 text-[11px]">
                Your Current Admin Access Includes:
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                <li>Total Sessions & Live Chats KPI overview</li>
                <li>Recent Lead Overview with Team Assignment</li>
                <li>Restricted Admin Data Table (Practice contact & inquiry details)</li>
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setRestrictedNoticeOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Continue in Admin View
              </button>
              <button
                onClick={() => {
                  setRestrictedNoticeOpen(false);
                  handleSwitchProfile('super_admin');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#193d85] hover:bg-[#122e64] rounded-lg shadow-xs"
              >
                Switch to Super Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
