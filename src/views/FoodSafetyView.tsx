import React from 'react';
import {
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  PackageCheck,
  Clock,
  HeartHandshake,
  CheckCircle,
  FileText,
  Flag,
} from 'lucide-react';

interface FoodSafetyViewProps {
  onNavigate: (view: string) => void;
}

export const FoodSafetyView: React.FC<FoodSafetyViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
          Safety First
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#183B2C]">
          Food Safety & Responsible Handling Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-[#61766D] leading-relaxed">
          The integrity of surplus food sharing relies on strict adherence to hygiene, temperature preservation, allergen disclosure, and timely transport.
        </p>
      </div>

      {/* Safety Notice Box */}
      <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-900 space-y-2">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Operational Disclosure & Good Samaritan Coordination</span>
        </h3>
        <p className="text-xs leading-relaxed">
          Food Share functions strictly as a coordination platform. Food donors and recipients must observe applicable public health and food safety standards. Food Share does not perform chemical testing or independent microbiological laboratory analysis. When in doubt regarding odor, temperature abuse, or seal integrity, <strong>never distribute or consume the food</strong>.
        </p>
      </div>

      {/* 4 Pillars of Safe Food Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-bold">
            <Thermometer className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#183B2C]">1. Strict Temperature Controls</h3>
          <p className="text-xs text-[#61766D] leading-relaxed">
            The bacterial danger zone is between <strong>4°C (40°F)</strong> and <strong>60°C (140°F)</strong>.
          </p>
          <ul className="text-xs text-[#183B2C] space-y-1.5 list-disc list-inside">
            <li><strong>Hot cooked meals:</strong> Must be held above 60°C or cooled rapidly to below 4°C within 2 hours.</li>
            <li><strong>Chilled produce & dairy:</strong> Must remain constantly under 4°C in insulated containers with ice packs.</li>
            <li><strong>Transport windows:</strong> Must never exceed 90 minutes without active thermal refrigeration.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-bold">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#183B2C]">2. Packaging & Tamper-Evident Seals</h3>
          <p className="text-xs text-[#61766D] leading-relaxed">
            Protect food during every leg of transit from contamination, spills, and dust.
          </p>
          <ul className="text-xs text-[#183B2C] space-y-1.5 list-disc list-inside">
            <li>Only food-grade stainless, food-safe plastic, or craft paper packaging.</li>
            <li>Secure containers with lids or tamper-evident seals before handover.</li>
            <li>Never mix cooked foods with raw ingredients or uncooked poultry.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-bold text-base text-[#183B2C]">3. Full Allergen Transparency</h3>
          <p className="text-xs text-[#61766D] leading-relaxed">
            Allergen reactions can be life-threatening. Transparency is mandatory on every listing.
          </p>
          <ul className="text-xs text-[#183B2C] space-y-1.5 list-disc list-inside">
            <li>Disclose presence of milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, and soybeans.</li>
            <li>Flag shared kitchen equipment or potential cross-contamination risks.</li>
            <li>Recipients must clearly relay allergen warnings to the final community beneficiaries.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#D6E4DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#183B2C]">4. Expiry & Pickup Deadlines</h3>
          <p className="text-xs text-[#61766D] leading-relaxed">
            Time is the critical dimension in surplus food rescue.
          </p>
          <ul className="text-xs text-[#183B2C] space-y-1.5 list-disc list-inside">
            <li>Donors must state the exact preparation timestamp.</li>
            <li>Collection deadlines are strictly enforced; expired listings are automatically closed.</li>
            <li>Immediate consumption or freezing required upon recipient delivery.</li>
          </ul>
        </div>
      </div>

      {/* Community Reporting Action */}
      <div className="bg-white rounded-3xl p-8 border border-[#D6E4DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-lg text-[#183B2C] flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-600" />
            <span>Witnessed a Safety Issue?</span>
          </h3>
          <p className="text-xs text-[#61766D] mt-1 max-w-xl">
            If you receive or observe food that fails visual inspection, lacks proper temperature control, or contains undeclared allergens, report it immediately to our administrative moderation team.
          </p>
        </div>

        <button
          onClick={() => onNavigate('marketplace')}
          className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shrink-0"
        >
          View Listings & Report
        </button>
      </div>
    </div>
  );
};
