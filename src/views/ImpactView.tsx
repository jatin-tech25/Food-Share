import React, { useState, useEffect } from 'react';
import { ImpactStats } from '../types';
import {
  HeartHandshake,
  Users,
  Utensils,
  Leaf,
  Truck,
  Building2,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Award,
  Globe,
} from 'lucide-react';

interface ImpactViewProps {
  onNavigate: (view: string) => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/impact')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
          Social & Environmental Accountability
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#183B2C]">
          Platform Impact Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#61766D] leading-relaxed">
          Every figure below is dynamically calculated from actual completed donations and verified receipts stored in our database. We measure real meals rescued, not estimates or theoretical surplus.
        </p>
      </div>

      {/* Primary Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#61766D] uppercase">Meal Portions Rescued</span>
            <span className="text-3xl sm:text-4xl font-black text-[#183B2C] mt-2 block">
              {stats?.totalPortionsDistributed ?? 0}
            </span>
          </div>
          <p className="text-xs text-[#168052] font-semibold mt-4">
            Delivered directly to local food banks & community shelters
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#61766D] uppercase">CO2 Emissions Avoided</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 mt-2 block">
              {stats?.estimatedCo2SavedKg ?? 0} <span className="text-lg font-bold text-gray-500">kg</span>
            </span>
          </div>
          <p className="text-xs text-[#61766D] mt-4">
            Calculated at ~2.1 kg CO2e per kg/portion of landfill diversion
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#61766D] uppercase">Volunteer Missions</span>
            <span className="text-3xl sm:text-4xl font-black text-[#183B2C] mt-2 block">
              {stats?.completedAssignments ?? 0}
            </span>
          </div>
          <p className="text-xs text-[#61766D] mt-4">
            Direct pickups coordinated and completed across the city
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#61766D] uppercase">Active Partners</span>
            <span className="text-3xl sm:text-4xl font-black text-[#183B2C] mt-2 block">
              {(stats?.activeProviders || 0) + (stats?.participatingNgos || 0)}
            </span>
          </div>
          <p className="text-xs text-[#61766D] mt-4">
            {stats?.activeProviders} Donors & {stats?.participatingNgos} Community NGOs
          </p>
        </div>
      </div>

      {/* Secondary Analytics: Breakdown by category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#168052]" />
            <span>Food Recovery by Category</span>
          </h3>
          <p className="text-xs text-[#61766D]">
            Distribution of surplus food types processed through Food Share.
          </p>

          <div className="space-y-3 pt-2">
            {stats && stats.categoryCounts ? (
              Object.entries(stats.categoryCounts).map(([cat, count]) => {
                const total = stats.totalDonationsPosted || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#183B2C]">{cat}</span>
                      <span className="text-[#61766D]">
                        {count} listings ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#D6E4DC] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#168052] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#61766D]">Loading breakdown data...</p>
            )}
          </div>
        </div>

        {/* Methodology & UN SDGs */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#183B2C] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#168052]" />
            <span>Contribution to UN Sustainable Development Goals</span>
          </h3>
          <p className="text-xs text-[#61766D] leading-relaxed">
            Our data model adheres strictly to responsible food recovery principles to advance the United Nations 2030 Agenda.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#EDF9F1]/70 border border-[#D6E4DC] flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#075C3C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                12.3
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#183B2C]">SDG 12: Halving Food Waste</h4>
                <p className="text-[11px] text-[#61766D] mt-0.5 leading-relaxed">
                  By connecting commercial food businesses directly with local community organizations, Food Share prevents edible food from entering landfills.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EDF9F1]/70 border border-[#D6E4DC] flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                2.1
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#183B2C]">SDG 2: Zero Hunger</h4>
                <p className="text-[11px] text-[#61766D] mt-0.5 leading-relaxed">
                  Surplus nutritious meals reach under-resourced shelters, elderly centers, and children's food programs within safe consumption windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
