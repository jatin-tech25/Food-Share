import React, { useState, useEffect } from 'react';
import { User, Donation, Notification, ImpactStats, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { TestRunnerModal } from './components/TestRunnerModal';

// Views
import { HomeView } from './views/HomeView';
import { MarketplaceView } from './views/MarketplaceView';
import { DonationDetailView } from './views/DonationDetailView';
import { CreateDonationView } from './views/CreateDonationView';
import { ProviderDashboard } from './views/ProviderDashboard';
import { NgoDashboard } from './views/NgoDashboard';
import { VolunteerDashboard } from './views/VolunteerDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { ImpactView } from './views/ImpactView';
import { FoodSafetyView } from './views/FoodSafetyView';
import { HowItWorksView } from './views/HowItWorksView';
import { AuthViews } from './views/AuthViews';

interface ToastAlert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [selectedRoleForRegister, setSelectedRoleForRegister] = useState<UserRole>('provider');

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Test Runner Modal
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState<boolean>(false);

  // Impact Stats (cached)
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);

  // Toast Alerts
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem('foodshare_local_user', JSON.stringify(data.user));
          } catch (e) {}
          return;
        }
      }
      // Check local system storage if session cookie expired
      const savedLocal = localStorage.getItem('foodshare_local_user');
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        setCurrentUser(parsed);
      }
    } catch (err) {
      console.error('Failed to fetch session', err);
      try {
        const savedLocal = localStorage.getItem('foodshare_local_user');
        if (savedLocal) {
          setCurrentUser(JSON.parse(savedLocal));
        }
      } catch (e) {}
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchImpactStats = async () => {
    try {
      const res = await fetch('/api/stats/impact');
      if (res.ok) {
        const data = await res.json();
        setImpactStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch impact stats', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchImpactStats();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('foodshare_local_user');
    } catch (e) {}
    showToast('Logged out successfully', 'info');
    setCurrentView('home');
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectDonation = (donation: Donation) => {
    setSelectedDonationId(donation.id);
    setCurrentView('donation-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F5F9F6] text-[#183B2C]">
      {/* Toast Manager */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl shadow-xl border text-xs font-semibold pointer-events-auto transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-[#183B2C] text-white border-gray-700'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Global Navbar */}
      <Navbar
        user={currentUser}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
        onLogout={handleLogout}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigate={(path) => {
          if (path.includes('provider')) setCurrentView('dashboard-provider');
          else if (path.includes('ngo')) setCurrentView('dashboard-ngo');
          else if (path.includes('volunteer')) setCurrentView('dashboard-volunteer');
          else if (path.includes('donations')) setCurrentView('marketplace');
        }}
      />

      {/* Automated Test Runner Modal */}
      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            stats={impactStats}
            onNavigate={(v) => {
              setCurrentView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRole={(r) => setSelectedRoleForRegister(r as UserRole)}
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView
            user={currentUser}
            onSelectDonation={handleSelectDonation}
            onRequestDonation={handleSelectDonation}
            onNavigate={(v) => setCurrentView(v)}
          />
        )}

        {currentView === 'donation-detail' && selectedDonationId && (
          <DonationDetailView
            donationId={selectedDonationId}
            user={currentUser}
            onBack={() => setCurrentView('marketplace')}
            onNavigate={(v) => setCurrentView(v)}
            onShowToast={showToast}
          />
        )}

        {currentView === 'create-donation' && (
          <CreateDonationView
            user={currentUser}
            onSuccess={(id) => {
              setSelectedDonationId(id);
              setCurrentView('donation-detail');
              fetchImpactStats();
            }}
            onCancel={() => setCurrentView('marketplace')}
            onShowToast={showToast}
          />
        )}

        {currentView === 'dashboard-provider' && currentUser && (
          <ProviderDashboard
            user={currentUser}
            onNavigate={(v) => setCurrentView(v)}
            onSelectDonation={handleSelectDonation}
            onShowToast={showToast}
          />
        )}

        {currentView === 'dashboard-ngo' && currentUser && (
          <NgoDashboard
            user={currentUser}
            onNavigate={(v) => setCurrentView(v)}
            onSelectDonation={handleSelectDonation}
            onShowToast={showToast}
          />
        )}

        {currentView === 'dashboard-volunteer' && currentUser && (
          <VolunteerDashboard
            user={currentUser}
            onNavigate={(v) => setCurrentView(v)}
            onShowToast={showToast}
          />
        )}

        {currentView === 'dashboard-admin' && currentUser && (
          <AdminDashboard
            user={currentUser}
            onShowToast={showToast}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksView
            onNavigate={(v) => setCurrentView(v)}
            onSelectRole={(r) => setSelectedRoleForRegister(r as UserRole)}
          />
        )}

        {currentView === 'food-safety' && (
          <FoodSafetyView onNavigate={(v) => setCurrentView(v)} />
        )}

        {currentView === 'impact' && (
          <ImpactView onNavigate={(v) => setCurrentView(v)} />
        )}

        {currentView === 'login' && (
          <AuthViews
            mode="login"
            onSuccess={(u) => {
              setCurrentUser(u);
              if (u.role === 'provider') setCurrentView('dashboard-provider');
              else if (u.role === 'ngo') setCurrentView('dashboard-ngo');
              else if (u.role === 'volunteer') setCurrentView('dashboard-volunteer');
              else if (u.role === 'admin') setCurrentView('dashboard-admin');
              else setCurrentView('home');
            }}
            onNavigate={(v) => setCurrentView(v)}
            onShowToast={showToast}
          />
        )}

        {currentView === 'register' && (
          <AuthViews
            mode="register"
            defaultRole={selectedRoleForRegister}
            onSuccess={(u) => {
              setCurrentUser(u);
              if (u.role === 'provider') setCurrentView('dashboard-provider');
              else if (u.role === 'ngo') setCurrentView('dashboard-ngo');
              else if (u.role === 'volunteer') setCurrentView('dashboard-volunteer');
              else setCurrentView('home');
            }}
            onNavigate={(v) => setCurrentView(v)}
            onShowToast={showToast}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl p-8 border border-[#D6E4DC] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#183B2C]">User Profile</h2>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F5F9F6] rounded-xl flex justify-between">
                  <span className="text-[#61766D]">Full Name:</span>
                  <strong className="text-[#183B2C]">{currentUser.fullName}</strong>
                </div>
                <div className="p-3 bg-[#F5F9F6] rounded-xl flex justify-between">
                  <span className="text-[#61766D]">Email Address:</span>
                  <strong className="text-[#183B2C]">{currentUser.email}</strong>
                </div>
                <div className="p-3 bg-[#F5F9F6] rounded-xl flex justify-between">
                  <span className="text-[#61766D]">Phone:</span>
                  <strong className="text-[#183B2C]">{currentUser.phone}</strong>
                </div>
                <div className="p-3 bg-[#F5F9F6] rounded-xl flex justify-between">
                  <span className="text-[#61766D]">Account Role:</span>
                  <strong className="capitalize text-[#168052]">{currentUser.role}</strong>
                </div>
                {currentUser.organizationName && (
                  <div className="p-3 bg-[#F5F9F6] rounded-xl flex justify-between">
                    <span className="text-[#61766D]">Organization:</span>
                    <strong className="text-[#183B2C]">{currentUser.organizationName}</strong>
                  </div>
                )}
                {currentUser.role === 'ngo' && (
                  <div className="p-3 bg-[#F5F9F6] rounded-xl flex justify-between">
                    <span className="text-[#61766D]">Verification Status:</span>
                    <strong className={currentUser.isNgoVerified ? 'text-emerald-700' : 'text-amber-700'}>
                      {currentUser.isNgoVerified ? 'Verified Non-Profit Partner' : 'Verification In Review'}
                    </strong>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleLogout()}
                className="w-full py-2.5 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200 text-xs hover:bg-rose-100"
              >
                Sign Out of Food Share
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
      />
    </div>
  );
}
