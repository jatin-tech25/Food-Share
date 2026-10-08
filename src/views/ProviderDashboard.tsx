import React, { useState, useEffect } from 'react';
import { User, Donation, FoodRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Utensils,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Building2,
  Calendar,
  Send,
  Eye,
  Trash2,
} from 'lucide-react';

interface ProviderDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  onSelectDonation: (donation: Donation) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  user,
  onNavigate,
  onSelectDonation,
  onShowToast,
}) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donRes, reqRes] = await Promise.all([
        fetch(`/api/donations?providerId=${user.id}&status=all`),
        fetch('/api/requests'),
      ]);

      const donData = await donRes.json();
      const reqData = await reqRes.json();

      setDonations(donData.donations || []);
      setRequests(reqData.requests || []);
    } catch (err: any) {
      onShowToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/accept`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to accept request');
      onShowToast('Request accepted! Quantity reserved & volunteer mission generated.', 'success');
      fetchData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt('Optional reason for rejection:') || 'Unavailable';
    setActionLoading(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject request');
      onShowToast('Request marked as rejected.', 'info');
      fetchData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to cancel this listing?')) return;
    try {
      const res = await fetch(`/api/donations/${donationId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');
      onShowToast('Donation cancelled.', 'info');
      fetchData();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    }
  };

  // Metrics
  const totalDonations = donations.length;
  const availableDonations = donations.filter((d) => d.status === 'Available' || d.status === 'Partially Reserved').length;
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const completedDonations = donations.filter((d) => d.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Food Provider Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1">
            Welcome, {user.organizationName || user.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#61766D] mt-1">
            Manage your surplus food donations, approve recipient requests, and coordinate pickups.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-donation')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Food Donation</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-[#61766D] block">Total Listings</span>
          <span className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1 block">
            {totalDonations}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Posted on platform</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-emerald-800 block">Available Now</span>
          <span className="text-2xl sm:text-3xl font-black text-[#168052] mt-1 block">
            {availableDonations}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Active on marketplace</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-amber-800 block">Pending Requests</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
            {pendingRequests}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Requires your review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-teal-800 block">Completed Rescue</span>
          <span className="text-2xl sm:text-3xl font-black text-teal-700 mt-1 block">
            {completedDonations}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Delivered & verified</span>
        </div>
      </div>

      {/* Section 1: Incoming NGO Requests */}
      <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC]">
          <div>
            <h2 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#168052]" />
              <span>Incoming NGO Requests & Allocations</span>
            </h2>
            <p className="text-xs text-[#61766D]">Review requested portions and accept or decline</p>
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 text-gray-400 hover:text-[#168052] rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#61766D]">
            No incoming food requests at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-[#D6E4DC] bg-[#F5F9F6]/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#183B2C]">{req.ngoName}</span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <p className="text-xs text-[#183B2C] font-semibold">
                    Requested: <strong className="text-[#168052]">{req.requestedQuantity}</strong> for "{req.donation?.foodName || 'Food Item'}"
                  </p>
                  <p className="text-xs text-[#61766D] italic">"{req.message}"</p>
                  {req.distributionPlan && (
                    <p className="text-[11px] text-[#075C3C]">Plan: {req.distributionPlan}</p>
                  )}
                  {req.assignment && (
                    <div className="mt-2 text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg inline-block border border-indigo-200">
                      Transport Status: <strong>{req.assignment.status}</strong>
                      {req.assignment.volunteerName && ` (${req.assignment.volunteerName})`}
                    </div>
                  )}
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      disabled={actionLoading === req.id}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      disabled={actionLoading === req.id}
                      className="px-4 py-1.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-xs"
                    >
                      {actionLoading === req.id ? 'Processing...' : 'Accept Request'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: My Food Donations Table */}
      <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC]">
          <div>
            <h2 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#168052]" />
              <span>My Donation Listings</span>
            </h2>
            <p className="text-xs text-[#61766D]">Manage food inventory, quantities, and status</p>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#61766D]">
            You have not posted any donations yet. Click "New Food Donation" above to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F9F6] text-[#61766D] uppercase text-[10px] font-bold border-y border-[#D6E4DC]">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available / Total</th>
                  <th className="py-3 px-4">Pickup Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E4DC]/60">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F5F9F6]/40">
                    <td className="py-3.5 px-4 font-bold text-[#183B2C]">{d.foodName}</td>
                    <td className="py-3.5 px-4 text-[#61766D]">{d.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#168052]">{d.remainingQuantity}</span> / {d.quantity} {d.unit}
                    </td>
                    <td className="py-3.5 px-4 text-[#61766D]">
                      {new Date(d.pickupDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectDonation(d)}
                        className="p-1.5 rounded-lg border border-[#D6E4DC] hover:bg-[#EDF9F1] text-[#183B2C]"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {d.status !== 'Completed' && d.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelDonation(d.id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                          title="Cancel Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
