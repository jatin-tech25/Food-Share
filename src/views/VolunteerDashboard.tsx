import React, { useState, useEffect } from 'react';
import { User, VolunteerAssignment } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Phone,
  RefreshCw,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface VolunteerDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  user,
  onNavigate,
  onShowToast,
}) => {
  const [myTasks, setMyTasks] = useState<VolunteerAssignment[]>([]);
  const [openTasks, setOpenTasks] = useState<VolunteerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assignments');
      if (!res.ok) throw new Error('Failed to load assignments');
      const data = await res.json();
      setMyTasks(data.myTasks || []);
      setOpenTasks(data.openTasks || []);
    } catch (err: any) {
      onShowToast(err.message || 'Error loading assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaim = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/claim`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to claim');
      onShowToast('Mission claimed! Thank you for volunteering.', 'success');
      fetchTasks();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePickup = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/pickup`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      onShowToast('Food marked as Picked Up! Safe delivery.', 'success');
      fetchTasks();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliver = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/deliver`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      onShowToast('Marked as Delivered! Waiting for NGO confirmation.', 'success');
      fetchTasks();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const activeDeliveries = myTasks.filter((t) => t.status === 'Assigned' || t.status === 'Picked Up');
  const completedDeliveries = myTasks.filter((t) => t.status === 'Delivered' || t.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Volunteer Rescue Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1">
            Welcome, {user.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#61766D] mt-1">
            Pick up surplus meals from local donors and deliver them to community kitchens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#EDF9F1] rounded-2xl border border-[#D6E4DC] flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#168052]" />
            <div>
              <span className="block text-xs font-bold text-[#183B2C]">{completedDeliveries.length} Missions</span>
              <span className="block text-[10px] text-[#61766D]">Completed by you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Missions Card */}
      <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC]">
          <div>
            <h2 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#168052]" />
              <span>My Active Missions ({activeDeliveries.length})</span>
            </h2>
            <p className="text-xs text-[#61766D]">Step-by-step progress tracking for your claimed deliveries</p>
          </div>
          <button onClick={fetchTasks} className="p-1.5 text-gray-400 hover:text-[#168052] rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#61766D]">
            You have no active deliveries in progress. Check the available open opportunities below!
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeliveries.map((asg) => (
              <div
                key={asg.id}
                className="p-5 rounded-2xl border-2 border-[#168052]/30 bg-[#F5F9F6] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#183B2C]">
                      {asg.donation?.foodName || 'Food Item'}
                    </span>
                    <StatusBadge status={asg.status} size="md" />
                  </div>
                  <span className="text-xs font-bold text-[#168052]">
                    {asg.donation?.quantity} {asg.donation?.unit}
                  </span>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-[#D6E4DC]">
                  <div>
                    <span className="text-[10px] font-bold text-[#168052] uppercase block mb-1">
                      1. Pickup Origin (Donor)
                    </span>
                    <p className="font-bold text-[#183B2C]">{asg.donation?.providerName}</p>
                    <p className="text-[#61766D] mt-0.5">{asg.pickupAddress}</p>
                    {asg.donation?.providerPhone && (
                      <p className="text-[#075C3C] flex items-center gap-1 mt-1 font-semibold">
                        <Phone className="w-3 h-3" /> {asg.donation.providerPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">
                      2. Delivery Destination (Recipient)
                    </span>
                    <p className="font-bold text-[#183B2C]">{asg.request?.ngoName || 'NGO Partner'}</p>
                    <p className="text-[#61766D] mt-0.5">{asg.deliveryAddress}</p>
                    {asg.request?.ngoPhone && (
                      <p className="text-indigo-800 flex items-center gap-1 mt-1 font-semibold">
                        <Phone className="w-3 h-3" /> {asg.request.ngoPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-[#61766D] italic">{asg.notes}</p>

                  <div className="flex gap-2">
                    {asg.status === 'Assigned' && (
                      <button
                        onClick={() => handlePickup(asg.id)}
                        disabled={actionLoading === asg.id}
                        className="px-4 py-2 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-xs"
                      >
                        {actionLoading === asg.id ? 'Updating...' : 'Mark as Picked Up'}
                      </button>
                    )}

                    {asg.status === 'Picked Up' && (
                      <button
                        onClick={() => handleDeliver(asg.id)}
                        disabled={actionLoading === asg.id}
                        className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 shadow-xs"
                      >
                        {actionLoading === asg.id ? 'Updating...' : 'Mark as Delivered'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open Pickup Missions (Available to claim) */}
      <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC]">
          <div>
            <h2 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#168052]" />
              <span>Open Pickup Opportunities ({openTasks.length})</span>
            </h2>
            <p className="text-xs text-[#61766D]">Rescue missions waiting for transport assistance</p>
          </div>
        </div>

        {openTasks.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#61766D]">
            All current delivery missions are covered! Check back soon for new surplus pickups.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl border border-[#D6E4DC] bg-white hover:border-[#168052] transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#183B2C]">
                      {task.donation?.foodName || 'Donation Item'}
                    </span>
                    <span className="text-[11px] font-bold bg-[#EDF9F1] text-[#075C3C] px-2 py-0.5 rounded-full">
                      {task.donation?.category}
                    </span>
                  </div>

                  <div className="text-xs text-[#61766D] space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#168052]" />
                      <strong>From:</strong> {task.donation?.providerName} ({task.donation?.city})
                    </p>
                    <p className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      <strong>To:</strong> {task.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <strong>Pickup:</strong> {new Date(task.donation?.pickupDeadline || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleClaim(task.id)}
                  disabled={actionLoading === task.id}
                  className="w-full py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-colors shadow-xs"
                >
                  {actionLoading === task.id ? 'Claiming...' : 'Claim Delivery Mission'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Missions History */}
      {completedDeliveries.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 shadow-xs">
          <h3 className="font-bold text-sm text-[#183B2C] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#168052]" />
            <span>Completed Missions Archive</span>
          </h3>
          <div className="divide-y divide-[#D6E4DC]/60 text-xs">
            {completedDeliveries.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#183B2C]">{m.donation?.foodName}</span>
                  <p className="text-[#61766D] text-[11px] mt-0.5">
                    Delivered to {m.deliveryAddress}
                  </p>
                </div>
                <StatusBadge status={m.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
