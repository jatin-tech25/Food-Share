import React, { useState, useEffect } from 'react';
import { User, FoodRequest, Donation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  HeartHandshake,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Package,
} from 'lucide-react';

interface NgoDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  onSelectDonation: (donation: Donation) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({
  user,
  onNavigate,
  onSelectDonation,
  onShowToast,
}) => {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      if (!res.ok) throw new Error('Failed to load requests');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err: any) {
      onShowToast(err.message || 'Error loading requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmReceipt = async (requestId: string) => {
    setConfirmingId(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/confirm-receipt`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to confirm receipt');
      onShowToast('Receipt confirmed! Donation marked as completed.', 'success');
      fetchRequests();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const acceptedCount = requests.filter((r) => r.status === 'Accepted').length;
  const fulfilledCount = requests.filter((r) => r.status === 'Fulfilled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
              NGO Distribution Portal
            </span>
            {user.isNgoVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Non-Profit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" /> Verification Pending Review
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C]">
            {user.organizationName || user.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#61766D] mt-1">
            Track requested food donations, coordinate delivery missions, and confirm community meal receipts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('marketplace')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs shrink-0"
        >
          <span>Find Available Food</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-amber-800 block">Pending Provider Approval</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 block">
            {pendingCount}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Awaiting donor response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-emerald-800 block">Approved & In Transit</span>
          <span className="text-2xl sm:text-3xl font-black text-[#168052] mt-1 block">
            {acceptedCount}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Ready for pickup or delivering</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-2xs">
          <span className="text-xs font-bold text-teal-800 block">Fulfilled Distributions</span>
          <span className="text-2xl sm:text-3xl font-black text-teal-700 mt-1 block">
            {fulfilledCount}
          </span>
          <span className="text-[11px] text-[#61766D] mt-1 block">Successfully received & served</span>
        </div>
      </div>

      {/* Active Requests List */}
      <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC]">
          <div>
            <h2 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#168052]" />
              <span>Food Requests & Deliveries</span>
            </h2>
            <p className="text-xs text-[#61766D]">Monitor requests and verify safe food receipt</p>
          </div>
          <button onClick={fetchRequests} className="p-1.5 text-gray-400 hover:text-[#168052] rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#61766D]">
            <p className="font-bold text-sm text-[#183B2C] mb-1">No food requests made yet</p>
            <p className="mb-4">Browse our Available Food marketplace to request fresh surplus meals for your community.</p>
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-4 py-2 bg-[#168052] text-white text-xs font-bold rounded-xl"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-[#D6E4DC] bg-[#F5F9F6]/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#183B2C]">
                      {req.donation?.foodName || 'Donation Item'}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    {req.donation?.status && (
                      <span className="text-[11px] text-[#61766D] font-medium">
                        Donation Status: <strong>{req.donation.status}</strong>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#183B2C]">
                    Donor: <strong>{req.donation?.providerName || 'Provider'}</strong> • Requested: <strong>{req.requestedQuantity} {req.donation?.unit || 'portions'}</strong>
                  </p>

                  <p className="text-xs text-[#61766D]">
                    Distribution: {req.distributionPlan || 'Direct Community Kitchen'}
                  </p>

                  {req.assignment && (
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span>
                          Transport: <strong>{req.assignment.status}</strong>
                        </span>
                        {req.assignment.volunteerName && (
                          <span className="ml-2 font-medium">
                            • Driver: {req.assignment.volunteerName} ({req.assignment.volunteerPhone})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Receipt Action */}
                <div className="shrink-0 flex items-center gap-2">
                  {req.donation && (
                    <button
                      onClick={() => onSelectDonation(req.donation!)}
                      className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#D6E4DC] text-[#183B2C] hover:bg-white"
                    >
                      View Food
                    </button>
                  )}

                  {req.status === 'Accepted' && (
                    <button
                      onClick={() => handleConfirmReceipt(req.id)}
                      disabled={confirmingId === req.id}
                      className="px-4 py-2 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{confirmingId === req.id ? 'Confirming...' : 'Confirm Food Received'}</span>
                    </button>
                  )}

                  {req.status === 'Fulfilled' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600" /> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
