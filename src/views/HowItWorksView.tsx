import React from 'react';
import {
  Utensils,
  HeartHandshake,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (view: string) => void;
  onSelectRole: (role: string) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate, onSelectRole }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
          Transparent Operations
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#183B2C]">
          How Food Share Connects Communities
        </h1>
        <p className="text-xs sm:text-sm text-[#61766D] leading-relaxed">
          From kitchen surplus to community meal table: our platform coordinates donors, verified non-profits, and volunteers in a closed, accountable feedback loop.
        </p>
      </div>

      {/* Role Tabs/Guides */}
      <div className="space-y-10">
        {/* Step 1: For Providers */}
        <div className="bg-white rounded-3xl p-8 border border-[#D6E4DC] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold text-[#168052] uppercase bg-[#EDF9F1] px-3 py-1 rounded-full border border-[#D6E4DC]">
              Step 1 • For Food Providers
            </span>
            <h2 className="text-2xl font-black text-[#183B2C]">
              Publish Surplus in Under 2 Minutes
            </h2>
            <p className="text-xs text-[#61766D] leading-relaxed">
              Restaurants, banquet halls, and canteens log in and create a listing. Specify portion estimates, preparation time, safe collection deadlines, and packaging containers.
            </p>
            <div className="space-y-2 text-xs text-[#183B2C]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#168052]" />
                <span>Select from preset food categories or custom dishes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#168052]" />
                <span>Certify adherence to hygienic preparation & storage standards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#168052]" />
                <span>Review and approve incoming non-profit requests</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-[#F5F9F6] p-6 rounded-2xl border border-[#D6E4DC] text-center">
            <Utensils className="w-12 h-12 text-[#168052] mx-auto mb-3" />
            <h3 className="font-bold text-sm text-[#183B2C] mb-1">Caterer / Restaurant</h3>
            <p className="text-xs text-[#61766D] mb-4">
              "We turned 50 daily unserved luncheon meals into community smiles."
            </p>
            <button
              onClick={() => {
                onSelectRole('provider');
                onNavigate('register');
              }}
              className="px-4 py-2 bg-[#168052] text-white text-xs font-bold rounded-xl hover:bg-[#075C3C]"
            >
              Join as Food Provider
            </button>
          </div>
        </div>

        {/* Step 2: For NGOs */}
        <div className="bg-white rounded-3xl p-8 border border-[#D6E4DC] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold text-emerald-800 uppercase bg-emerald-100 px-3 py-1 rounded-full">
              Step 2 • For Non-Profits & Shelters
            </span>
            <h2 className="text-2xl font-black text-[#183B2C]">
              Discover & Request Needed Food
            </h2>
            <p className="text-xs text-[#61766D] leading-relaxed">
              Verified NGOs search listings by city and meal type. Request exact quantities needed for afternoon shelters or community pantries.
            </p>
            <div className="space-y-2 text-xs text-[#183B2C]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Live portion reservation to prevent overselling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Track volunteer transport with live ETA notes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Confirm receipt upon delivery to close the accountability loop</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-[#EDF9F1]/50 p-6 rounded-2xl border border-[#D6E4DC] text-center">
            <HeartHandshake className="w-12 h-12 text-[#168052] mx-auto mb-3" />
            <h3 className="font-bold text-sm text-[#183B2C] mb-1">Community NGO</h3>
            <p className="text-xs text-[#61766D] mb-4">
              "Directly feeds 120 families weekly through local kitchen coordination."
            </p>
            <button
              onClick={() => {
                onSelectRole('ngo');
                onNavigate('register');
              }}
              className="px-4 py-2 bg-[#168052] text-white text-xs font-bold rounded-xl hover:bg-[#075C3C]"
            >
              Join as Verified NGO
            </button>
          </div>
        </div>

        {/* Step 3: For Volunteers */}
        <div className="bg-white rounded-3xl p-8 border border-[#D6E4DC] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold text-indigo-800 uppercase bg-indigo-100 px-3 py-1 rounded-full">
              Step 3 • For Community Volunteers
            </span>
            <h2 className="text-2xl font-black text-[#183B2C]">
              Pick Up & Transport Deliveries
            </h2>
            <p className="text-xs text-[#61766D] leading-relaxed">
              When donors and recipients cannot arrange direct transport, volunteers pick up the food in clean thermal carriers and drive it to the destination.
            </p>
            <div className="space-y-2 text-xs text-[#183B2C]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>One-tap mission claiming with accurate pickup addresses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>Update status instantly from pickup to delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>Earn volunteer impact badges and community service hours</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200 text-center">
            <Truck className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-[#183B2C] mb-1">Local Volunteer Driver</h3>
            <p className="text-xs text-[#61766D] mb-4">
              "Flexible 30-minute evening delivery trips that make a tangible difference."
            </p>
            <button
              onClick={() => {
                onSelectRole('volunteer');
                onNavigate('register');
              }}
              className="px-4 py-2 bg-indigo-700 text-white text-xs font-bold rounded-xl hover:bg-indigo-800"
            >
              Join as Volunteer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
