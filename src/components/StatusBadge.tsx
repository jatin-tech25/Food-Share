import React from 'react';
import { DonationStatus, RequestStatus, AssignmentStatus } from '../types';

interface StatusBadgeProps {
  status: DonationStatus | RequestStatus | AssignmentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
  let dotColor = 'bg-gray-400';

  if (normalized === 'available') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500 animate-pulse';
  } else if (normalized === 'partially reserved') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'fully reserved' || normalized === 'pickup arranged') {
    colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (normalized === 'assigned' || normalized === 'picked up') {
    colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-200';
    dotColor = 'bg-indigo-500';
  } else if (normalized === 'delivered') {
    colorClasses = 'bg-purple-50 text-purple-800 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (normalized === 'completed' || normalized === 'fulfilled' || normalized === 'accepted') {
    colorClasses = 'bg-teal-50 text-teal-800 border-teal-200';
    dotColor = 'bg-teal-600';
  } else if (normalized === 'pending') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'rejected' || normalized === 'cancelled' || normalized === 'expired' || normalized === 'suspended') {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (normalized === 'active') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${colorClasses} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
