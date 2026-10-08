import React, { useState, useEffect } from 'react';
import { Donation, DonationStatusHistory, FoodRequest, User } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  Flag,
  Send,
  X,
  PackageCheck,
} from 'lucide-react';

interface DonationDetailViewProps {
  donationId: string;
  user: User | null;
  onBack: () => void;
  onNavigate: (view: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DonationDetailView: React.FC<DonationDetailViewProps> = ({
  donationId,
  user,
  onBack,
  onNavigate,
  onShowToast,
}) => {
  const [donation, setDonation] = useState<Donation | null>(null);
  const [statusHistory, setStatusHistory] = useState<DonationStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedQuantity, setRequestedQuantity] = useState<number>(1);
  const [requestMessage, setRequestMessage] = useState('');
  const [distributionPlan, setDistributionPlan] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Improper Storage / Temperature');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/donations/${donationId}`);
      if (!res.ok) throw new Error('Failed to load donation details');
      const data = await res.json();
      setDonation(data.donation);
      setStatusHistory(data.statusHistory || []);
      if (data.donation) {
        setRequestedQuantity(Math.min(data.donation.remainingQuantity, 10));
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error loading donation', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [donationId]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donation) return;

    if (requestedQuantity <= 0 || requestedQuantity > donation.remainingQuantity) {
      onShowToast(`Requested quantity must be between 1 and ${donation.remainingQuantity}`, 'error');
      return;
    }

    setSubmittingRequest(true);
    try {
      const res = await fetch(`/api/donations/${donation.id}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedQuantity,
          message: requestMessage,
          distributionPlan,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      onShowToast('Food request submitted to provider!', 'success');
      setRequestModalOpen(false);
      fetchDetails();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donation) return;

    setSubmittingReport(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donationId: donation.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to file report');

      onShowToast('Report submitted for admin review. Thank you for ensuring safety.', 'success');
      setReportModalOpen(false);
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-semibold text-[#183B2C]">Loading listing details...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-base font-bold text-[#183B2C]">Donation listing not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#168052] text-white text-xs font-bold rounded-xl">
          Back to Listings
        </button>
      </div>
    );
  }

  const prepDate = new Date(donation.preparationTime);
  const deadlineDate = new Date(donation.pickupDeadline);
  const percentage = Math.round((donation.remainingQuantity / donation.quantity) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183B2C] hover:text-[#168052] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Available Food</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Image Card */}
          <div className="bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs">
            <div className="relative h-72 sm:h-96 w-full bg-slate-100">
              <img
                src={donation.imagePath}
                alt={donation.foodName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <StatusBadge status={donation.status} size="lg" />
                {donation.isVegetarian && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-700/90 text-white px-3 py-1 rounded-full backdrop-blur-xs">
                    <Leaf className="w-3.5 h-3.5" /> Vegetarian
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white/95 text-[#075C3C] text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                  {donation.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C]">
                  {donation.foodName}
                </h1>
                <div className="text-xs text-[#61766D] font-medium flex items-center gap-1">
                  <span>Published</span>
                  <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F5F9F6] rounded-2xl border border-[#D6E4DC]/60 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#168052] uppercase tracking-wider block">
                    Food Provider
                  </span>
                  <span className="text-sm font-bold text-[#183B2C] block">
                    {donation.providerName}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#61766D] uppercase tracking-wider mb-2">
                  Food Description
                </h3>
                <p className="text-sm text-[#183B2C] leading-relaxed whitespace-pre-line">
                  {donation.description}
                </p>
              </div>

              {/* Food Safety & Handling Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D6E4DC]">
                <div className="p-4 rounded-2xl bg-[#EDF9F1]/40 border border-[#D6E4DC]">
                  <h4 className="text-xs font-bold text-[#075C3C] flex items-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#168052]" /> Storage & Temperature
                  </h4>
                  <p className="text-xs text-[#183B2C] leading-relaxed">
                    {donation.storageInformation}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EDF9F1]/40 border border-[#D6E4DC]">
                  <h4 className="text-xs font-bold text-[#075C3C] flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Known Allergens
                  </h4>
                  <p className="text-xs text-[#183B2C] leading-relaxed">
                    {donation.allergenInformation || 'No allergens declared.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EDF9F1]/40 border border-[#D6E4DC]">
                  <h4 className="text-xs font-bold text-[#075C3C] flex items-center gap-1.5 mb-1.5">
                    <PackageCheck className="w-4 h-4 text-[#168052]" /> Packaging Standards
                  </h4>
                  <p className="text-xs text-[#183B2C] leading-relaxed">
                    {donation.packagingDetails || 'Standard sanitary containers.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EDF9F1]/40 border border-[#D6E4DC]">
                  <h4 className="text-xs font-bold text-[#075C3C] flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-4 h-4 text-[#168052]" /> Collection Instructions
                  </h4>
                  <p className="text-xs text-[#183B2C] leading-relaxed">
                    {donation.specialInstructions || 'Standard pickup protocol at location.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="bg-white rounded-3xl p-6 border border-[#D6E4DC] shadow-xs">
            <h3 className="font-bold text-sm text-[#183B2C] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#168052]" />
              <span>Donation Lifecycle & Status Audit Trail</span>
            </h3>
            <div className="space-y-4">
              {statusHistory.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-[#EDF9F1] text-[#168052] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#183B2C]">
                        {item.newStatus}
                      </span>
                      <span className="text-[#61766D] text-[11px]">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#61766D] mt-0.5">{item.reason}</p>
                    <span className="text-[10px] text-[#168052] font-semibold">
                      By: {item.changedByUserName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reservation / Request Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#D6E4DC] shadow-md sticky top-24 space-y-6">
            {/* Remaining Quantity Meter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#61766D] uppercase">Portion Availability</span>
                <span className="text-xs font-bold text-[#168052]">
                  {donation.remainingQuantity} / {donation.quantity} {donation.unit}
                </span>
              </div>
              <div className="w-full bg-[#D6E4DC] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#168052] h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-[#61766D] mt-2">
                Approx. {donation.estimatedPortions} meal portions originally prepared.
              </p>
            </div>

            {/* Time windows */}
            <div className="space-y-3 p-4 bg-[#F5F9F6] rounded-2xl border border-[#D6E4DC]/60 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#168052] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#183B2C] block">Cooked / Prepared</span>
                  <span className="text-[#61766D]">{prepDate.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#183B2C] block">Safe Collection Deadline</span>
                  <span className="text-amber-800 font-semibold">{deadlineDate.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#168052] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#183B2C] block">Pickup Location</span>
                  <span className="text-[#61766D]">
                    {donation.pickupAddress}, {donation.city} {donation.postalCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              {user?.role === 'ngo' ? (
                donation.remainingQuantity > 0 && donation.status !== 'Completed' ? (
                  <button
                    onClick={() => setRequestModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request Food for Distribution</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs font-semibold text-gray-500">
                    This donation is fully allocated or completed.
                  </div>
                )
              ) : !user ? (
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-3 px-4 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all text-center"
                >
                  Log In as NGO to Request Food
                </button>
              ) : user.role === 'provider' && user.id === donation.providerId ? (
                <div className="space-y-2">
                  <button
                    onClick={() => onNavigate('dashboard-provider')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#183B2C] text-white text-xs font-bold hover:bg-[#075C3C] text-center"
                  >
                    Manage Requests on Provider Dashboard
                  </button>
                </div>
              ) : null}

              {/* Report button */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="w-full py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Food Safety or Quality Concern</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal for NGOs */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D6E4DC] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC] mb-4">
              <div>
                <h3 className="font-bold text-base text-[#183B2C]">Submit Food Request</h3>
                <p className="text-xs text-[#61766D]">{donation.foodName}</p>
              </div>
              <button onClick={() => setRequestModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Requested Quantity ({donation.unit})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={donation.remainingQuantity}
                    value={requestedQuantity}
                    onChange={(e) => setRequestedQuantity(parseFloat(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C] focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
                    required
                  />
                  <span className="text-xs text-[#61766D] shrink-0 font-medium">
                    Max: {donation.remainingQuantity} {donation.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Community Distribution Plan
                </label>
                <input
                  type="text"
                  value={distributionPlan}
                  onChange={(e) => setDistributionPlan(e.target.value)}
                  placeholder="e.g., Community kitchen lunch service for 25 families"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C] focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Message to Food Provider
                </label>
                <textarea
                  rows={3}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Describe your pickup arrangements or volunteer transport needs..."
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C] focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
                />
              </div>

              <div className="p-3 bg-[#F5F9F6] rounded-xl border border-[#D6E4DC] text-[11px] text-[#61766D] leading-relaxed">
                By submitting, you agree to inspect the food quality upon pickup and follow safe food handling regulations.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D6E4DC] text-[#183B2C] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#168052] text-white hover:bg-[#075C3C] shadow-xs"
                >
                  {submittingRequest ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D6E4DC] animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC] mb-4">
              <div>
                <h3 className="font-bold text-base text-rose-800 flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-rose-600" /> Report Food Listing
                </h3>
                <p className="text-xs text-[#61766D]">Confidential review by Food Share administrators</p>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Reason for Concern
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C]"
                >
                  <option value="Improper Storage / Temperature">Improper Storage / Temperature</option>
                  <option value="Expired or Stale Food">Expired or Stale Food</option>
                  <option value="Undeclared Allergens">Undeclared Allergens</option>
                  <option value="Inaccurate Quantity / Fake Listing">Inaccurate Quantity / Fake Listing</option>
                  <option value="Damaged Packaging">Damaged Packaging</option>
                  <option value="Other Safety Violation">Other Safety Violation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Detailed Observations
                </label>
                <textarea
                  rows={4}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide specific details about the condition, packaging, or safety concern..."
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D6E4DC] text-[#183B2C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
