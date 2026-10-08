import React from 'react';
import { Donation } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, Users, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';

interface DonationCardProps {
  donation: Donation;
  onSelect: (donation: Donation) => void;
  onRequest?: (donation: Donation) => void;
  isNgo?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  onSelect,
  onRequest,
  isNgo,
}) => {
  const percentageRemaining = Math.max(
    0,
    Math.min(100, Math.round((donation.remainingQuantity / donation.quantity) * 100))
  );

  const deadlineDate = new Date(donation.pickupDeadline);
  const now = new Date();
  const diffHours = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = diffHours > 0 && diffHours <= 4;
  const isExpired = diffHours <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Card Image & Badges */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={donation.imagePath}
            alt={donation.foodName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <StatusBadge status={donation.status} size="sm" />
            {donation.isVegetarian && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-700/90 text-white px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                <Leaf className="w-3 h-3" /> Veg
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-xs text-[#075C3C] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
              {donation.category}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg text-[#183B2C] line-clamp-1 group-hover:text-[#168052] transition-colors">
              {donation.foodName}
            </h3>
          </div>

          <p className="text-xs text-[#61766D] mb-3 flex items-center gap-1 font-medium">
            <span>By</span>
            <span className="text-[#183B2C] font-semibold">{donation.providerName}</span>
          </p>

          <p className="text-xs text-[#61766D] line-clamp-2 mb-4 leading-relaxed">
            {donation.description}
          </p>

          {/* Portion Availability Meter */}
          <div className="bg-[#F5F9F6] p-3 rounded-xl border border-[#D6E4DC]/60 mb-4">
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-[#61766D] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#168052]" /> Remaining Portions
              </span>
              <span className="text-[#183B2C]">
                <strong className="text-[#168052] text-sm">{donation.remainingQuantity}</strong> / {donation.quantity} {donation.unit}
              </span>
            </div>
            <div className="w-full bg-[#D6E4DC] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentageRemaining > 50
                    ? 'bg-[#168052]'
                    : percentageRemaining > 20
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${percentageRemaining}%` }}
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#61766D] mb-4">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#168052] shrink-0" />
              <span className="truncate">{donation.city}</span>
            </div>
            <div className={`flex items-center gap-1.5 truncate ${isUrgent ? 'text-amber-700 font-semibold' : ''}`}>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {isExpired ? 'Deadline passed' : `${diffHours} hrs left`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 pt-0 flex gap-2">
        <button
          onClick={() => onSelect(donation)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#D6E4DC] text-[#183B2C] hover:bg-[#F5F9F6] hover:border-[#168052] transition-colors"
        >
          View Details
        </button>

        {isNgo && donation.remainingQuantity > 0 && donation.status !== 'Completed' && (
          <button
            onClick={() => onRequest?.(donation)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-[#168052] text-white hover:bg-[#075C3C] shadow-xs hover:shadow-sm transition-all"
          >
            Request Food <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
