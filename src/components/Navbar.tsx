import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import {
  Utensils,
  Bell,
  User as UserIcon,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Search,
  Truck,
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenTestRunner: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenTestRunner,
  onNavigate,
  currentView,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardPath = () => {
    if (!user) return 'login';
    if (user.role === 'provider') return 'dashboard-provider';
    if (user.role === 'ngo') return 'dashboard-ngo';
    if (user.role === 'volunteer') return 'dashboard-volunteer';
    if (user.role === 'admin') return 'dashboard-admin';
    return 'marketplace';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'provider') return 'Provider Dashboard';
    if (user.role === 'ngo') return 'NGO Distribution Hub';
    if (user.role === 'volunteer') return 'Volunteer Hub';
    if (user.role === 'admin') return 'Admin Console';
    return 'Dashboard';
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Available Food' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'impact', label: 'Impact' },
    { id: 'food-safety', label: 'Food Safety' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D6E4DC] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#064C33] to-[#168052] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#064C33] tracking-tight block leading-tight">
                Food Share
              </span>
              <span className="text-[11px] text-[#61766D] font-medium block leading-none">
                Reduce Waste, Feed Need
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-xs font-semibold transition-colors py-1.5 relative ${
                    isActive
                      ? 'text-[#168052] font-bold'
                      : 'text-[#183B2C]/80 hover:text-[#168052]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168052] rounded-full" />
                  )}
                </button>
              );
            })}

            {user && (
              <button
                onClick={() => onNavigate(getDashboardPath())}
                className={`text-xs font-bold transition-colors py-1.5 flex items-center gap-1.5 ${
                  currentView.startsWith('dashboard')
                    ? 'text-[#075C3C]'
                    : 'text-[#168052] hover:text-[#075C3C]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right-Side Utility Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Test Runner Button */}
            <button
              onClick={onOpenTestRunner}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 transition-colors text-xs font-semibold shadow-2xs"
              title="Open automated system tests and test runner"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#168052]" />
              <span className="hidden sm:inline">Test Runner</span>
            </button>

            {/* Authenticated User Utility Elements */}
            {user ? (
              <>
                {/* Contextual Action Button based on logged in role */}
                {user.role === 'provider' && (
                  <button
                    onClick={() => onNavigate('create-donation')}
                    className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Surplus</span>
                  </button>
                )}

                {user.role === 'ngo' && (
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Find Food</span>
                  </button>
                )}

                {user.role === 'volunteer' && (
                  <button
                    onClick={() => onNavigate('dashboard-volunteer')}
                    className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Rescue Tasks</span>
                  </button>
                )}

                {/* Notification Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-xl text-[#183B2C] hover:bg-[#F5F9F6] border border-transparent hover:border-[#D6E4DC] transition-colors"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Account / Profile Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-[#F5F9F6] transition-colors border border-[#D6E4DC] hover:border-[#168052]"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#EDF9F1] text-[#075C3C] font-bold text-xs flex items-center justify-center border border-[#D6E4DC]">
                      {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block text-left pr-1">
                      <span className="block text-xs font-bold text-[#183B2C] max-w-[100px] truncate leading-tight">
                        {user.fullName}
                      </span>
                      <span className="block text-[10px] text-[#61766D] capitalize leading-none">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {/* Popover Dropdown */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#D6E4DC] py-2 z-50 animate-in fade-in-50 duration-150">
                      {/* User Header */}
                      <div className="px-4 py-2.5 border-b border-[#D6E4DC]">
                        <p className="text-xs font-bold text-[#183B2C] truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#61766D] truncate">{user.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#168052] bg-[#EDF9F1] px-2 py-0.5 rounded-md">
                            {user.role}
                          </span>
                          {user.role === 'ngo' && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              user.isNgoVerified
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {user.isNgoVerified ? 'Verified' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Navigation Actions */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate(getDashboardPath());
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#183B2C] hover:bg-[#EDF9F1] flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#168052]" />
                          <span>{getDashboardLabel()}</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-[#183B2C] hover:bg-[#EDF9F1] flex items-center gap-2"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-[#61766D]" />
                          <span>My Account Profile</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-1 border-t border-[#D6E4DC]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-[#183B2C] hover:text-[#168052] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#168052] text-white hover:bg-[#075C3C] rounded-xl shadow-xs transition-all"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#183B2C] hover:bg-[#F5F9F6] border border-[#D6E4DC] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D6E4DC] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl ${
                currentView === link.id
                  ? 'bg-[#EDF9F1] text-[#168052] font-bold'
                  : 'text-[#183B2C] hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {user && (
            <button
              onClick={() => {
                onNavigate(getDashboardPath());
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-white bg-[#064C33] rounded-xl flex items-center justify-between"
            >
              <span>{getDashboardLabel()}</span>
              <span className="text-[10px] font-bold uppercase bg-[#168052] px-2 py-0.5 rounded-md">
                {user.role}
              </span>
            </button>
          )}

          <div className="pt-3 border-t border-[#D6E4DC] space-y-2">
            <button
              onClick={() => {
                onOpenTestRunner();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-800 bg-[#EDF9F1] rounded-xl flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#168052]" />
              <span>Automated Test Runner</span>
            </button>

            {user ? (
              <div className="space-y-2 pt-2 border-t border-[#D6E4DC]">
                <div className="p-3 bg-[#F5F9F6] rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#183B2C] block">{user.fullName}</span>
                    <span className="text-[11px] text-[#61766D]">{user.email}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#168052] bg-white border border-[#D6E4DC] px-2 py-0.5 rounded-md">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#183B2C] hover:bg-gray-50 rounded-xl"
                >
                  My Account Profile
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-center border border-[#D6E4DC] rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onNavigate('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-[#168052] text-white rounded-xl text-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
