import React, { useState, useEffect } from 'react';
import { User, Report, AuditLog } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  FileText,
  RotateCcw,
  RefreshCw,
  Search,
  AlertTriangle,
  Lock,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onShowToast }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ngos' | 'users' | 'reports' | 'audit'>('ngos');
  const [userSearch, setUserSearch] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes, aRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/audit-logs'),
      ]);

      const uData = await uRes.json();
      const rData = await rRes.json();
      const aData = await aRes.json();

      setUsers(uData.users || []);
      setReports(rData.reports || []);
      setAuditLogs(aData.auditLogs || []);
    } catch (err: any) {
      onShowToast(err.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyNgo = async (userId: string, isVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/organizations/${userId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onShowToast(isVerified ? 'NGO verified successfully!' : 'NGO unverified.', 'success');
      fetchAdminData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!confirm(`Are you sure you want to change user account status to ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onShowToast(`User status set to ${newStatus}.`, 'info');
      fetchAdminData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    const notes = prompt('Admin resolution notes:') || 'Reviewed by admin.';
    try {
      const res = await fetch(`/api/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onShowToast(`Report marked as ${status}.`, 'info');
      fetchAdminData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    }
  };

  const handleReseedDb = async () => {
    if (!confirm('Reset and reseed database with fresh demonstration records?')) return;
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      onShowToast('Database reset and reseeded with demo data!', 'success');
      fetchAdminData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    }
  };

  // Metrics
  const ngoList = users.filter((u) => u.role === 'ngo');
  const providerList = users.filter((u) => u.role === 'provider');
  const volunteerList = users.filter((u) => u.role === 'volunteer');
  const pendingNgos = ngoList.filter((n) => !n.isNgoVerified);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1">
            Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-[#61766D] mt-1">
            Supervise user accounts, authenticate non-profit organizations, review reported content, and monitor audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReseedDb}
            className="px-3.5 py-2 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C] hover:bg-[#F5F9F6] flex items-center gap-1.5"
            title="Reset database to initial seed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
          <button
            onClick={fetchAdminData}
            className="p-2 text-gray-500 hover:text-[#168052] rounded-xl hover:bg-[#EDF9F1]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-[#61766D] block">Total Registered Users</span>
          <span className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1 block">{users.length}</span>
          <span className="text-[11px] text-[#61766D] mt-1 block">
            {providerList.length} Providers • {ngoList.length} NGOs • {volunteerList.length} Volunteers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-amber-800 block">Pending NGO Verifications</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
            {pendingNgos.length}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Awaiting official approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-rose-800 block">Flagged Reports</span>
          <span className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 block">
            {reports.filter((r) => r.status === 'pending').length}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Food safety investigations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-teal-800 block">System Audit Logs</span>
          <span className="text-2xl sm:text-3xl font-black text-teal-700 mt-1 block">
            {auditLogs.length}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Immutable records captured</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#D6E4DC] gap-4">
        <button
          onClick={() => setActiveTab('ngos')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'ngos'
              ? 'text-[#168052] border-b-2 border-[#168052]'
              : 'text-[#61766D] hover:text-[#183B2C]'
          }`}
        >
          NGO Verification ({pendingNgos.length} pending)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'users'
              ? 'text-[#168052] border-b-2 border-[#168052]'
              : 'text-[#61766D] hover:text-[#183B2C]'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'reports'
              ? 'text-[#168052] border-b-2 border-[#168052]'
              : 'text-[#61766D] hover:text-[#183B2C]'
          }`}
        >
          Reports & Moderation ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'audit'
              ? 'text-[#168052] border-b-2 border-[#168052]'
              : 'text-[#61766D] hover:text-[#183B2C]'
          }`}
        >
          Security Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: NGO Verification */}
      {activeTab === 'ngos' && (
        <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-[#183B2C]">
            Non-Profit Organization Verification Center
          </h2>
          <p className="text-xs text-[#61766D]">
            Verify 501(c)(3) or charitable trust status before granting elevated platform privileges.
          </p>

          <div className="divide-y divide-[#D6E4DC]/60">
            {ngoList.map((ngo) => (
              <div key={ngo.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#183B2C]">
                      {ngo.organizationName || ngo.fullName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ngo.isNgoVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ngo.isNgoVerified ? '✓ Verified Partner' : 'Verification Required'}
                    </span>
                  </div>
                  <p className="text-xs text-[#61766D]">
                    Contact: {ngo.fullName} • {ngo.email} • {ngo.phone}
                  </p>
                  <p className="text-xs text-[#61766D]">
                    Location: {ngo.address}, {ngo.city}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ngo.isNgoVerified ? (
                    <button
                      onClick={() => handleVerifyNgo(ngo.id, false)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50"
                    >
                      Revoke Verification
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyNgo(ngo.id, true)}
                      className="px-4 py-1.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-xs"
                    >
                      Verify Organization
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-[#183B2C]">Platform User Directory</h2>
              <p className="text-xs text-[#61766D]">Search, review, and moderate user credentials</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D6E4DC] w-64 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F9F6] text-[#61766D] uppercase text-[10px] font-bold border-y border-[#D6E4DC]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone / City</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E4DC]/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F5F9F6]/40">
                    <td className="py-3 px-4">
                      <strong className="text-[#183B2C]">{u.fullName}</strong>
                      <span className="block text-[11px] text-[#61766D]">{u.email}</span>
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-[#183B2C]">{u.role}</td>
                    <td className="py-3 px-4 text-[#61766D]">
                      {u.phone} • {u.city || 'Metro City'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={u.accountStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.accountStatus)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            u.accountStatus === 'active'
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.accountStatus === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-[#183B2C]">Food Safety & Quality Reports</h2>
          <p className="text-xs text-[#61766D]">Investigate and resolve community-flagged items</p>

          {reports.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#61766D]">
              No reports filed yet. The community is operating safely!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl border border-[#D6E4DC] bg-[#F5F9F6]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#183B2C]">{rep.reason}</span>
                      <StatusBadge status={rep.status} size="sm" />
                    </div>
                    <p className="text-[#61766D]">{rep.details}</p>
                    <p className="text-[11px] text-[#075C3C]">
                      Reported by {rep.reportedByUserName} on {new Date(rep.createdAt).toLocaleString()}
                    </p>
                    {rep.adminNotes && (
                      <p className="text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-[#D6E4DC]">
                        Admin Notes: {rep.adminNotes}
                      </p>
                    )}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolved')}
                        className="px-4 py-1.5 rounded-xl bg-[#168052] text-white font-bold"
                      >
                        Resolve & Action
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-[#183B2C]">Security & Operational Audit Logs</h2>
              <p className="text-xs text-[#61766D]">Immutable record of all critical state transitions</p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#F5F9F6] rounded-xl border border-[#D6E4DC]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-[#183B2C] font-mono mr-2 bg-white px-2 py-0.5 rounded border border-[#D6E4DC]">
                    {log.action}
                  </span>
                  <span className="text-[#61766D]">{log.details}</span>
                  <p className="text-[11px] text-[#168052] mt-0.5 font-semibold">
                    Actor: {log.performedByUserName} ({log.targetEntity}: {log.targetId})
                  </p>
                </div>
                <span className="text-[11px] text-gray-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
