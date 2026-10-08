import React, { useState } from 'react';
import { ImpactStats } from '../types';
import {
  Utensils,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Users,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  Building2,
  Award,
} from 'lucide-react';

interface HomeViewProps {
  stats: ImpactStats | null;
  onNavigate: (view: string) => void;
  onSelectRole: (role: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  stats,
  onNavigate,
  onSelectRole,
  onSelectCategory,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCategoryClick = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    onNavigate('marketplace');
  };

  const faqs = [
    {
      q: 'Who can register as a Food Provider?',
      a: 'Any entity with safe, consumable surplus food—including restaurants, hotels, hostels, college canteens, banquet halls, supermarkets, and household donors with prepared batch meals.',
    },
    {
      q: 'How do NGOs get verified on Food Share?',
      a: 'Registered non-profit organizations and registered food banks submit their legal non-profit details upon registration. Our platform administrators review the credentials and grant verified status, ensuring all food goes to legitimate causes.',
    },
    {
      q: 'What role do Volunteers play?',
      a: 'Volunteers assist in transporting food donations from providers to NGO centers or community kitchens, particularly when donors cannot deliver or recipients lack immediate transport.',
    },
    {
      q: 'How does Food Share ensure food safety?',
      a: 'We require accurate preparation times, storage advice (temperature controls), packaging specifications, and allergen disclosures on every listing. Donors must certify information accuracy, and recipients inspect packaging upon pickup.',
    },
    {
      q: 'How are meal portions and impact calculated?',
      a: 'Every metric shown on our platform is dynamically calculated from actual database records—counting completed donations, fulfilled requests, and real portion counts entered by food providers.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-[#EDF9F1] via-[#F5F9F6] to-[#F5F9F6]">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#168052]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#075C3C]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D6E4DC] text-xs font-bold text-[#075C3C] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Reduce Waste, Feed Need • Real Impact</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#064C33] tracking-tight leading-[1.1]">
                Good Food Deserves a <span className="text-[#168052]">Second Chance.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#61766D] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Food Share bridges the gap between restaurants, canteens, and caterers with surplus food, and local NGOs, shelters, and volunteers ready to distribute meals to families in need.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('create-donation')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#168052] text-white text-sm font-bold hover:bg-[#075C3C] shadow-md hover:shadow-lg transition-all"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Donate Food</span>
                </button>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#D6E4DC] text-[#183B2C] text-sm font-bold hover:bg-[#F5F9F6] hover:border-[#168052] shadow-2xs transition-all"
                >
                  <span>Find Food Marketplace</span>
                  <ArrowRight className="w-4 h-4 text-[#168052]" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#61766D] font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#168052]" />
                  <span>Verified NGO Distribution</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#168052]" />
                  <span>Volunteer Delivery Routing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#168052]" />
                  <span>Strict Food Safety Rules</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
                    alt="Volunteers sharing nutritious meals with community members"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-5 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#168052] uppercase tracking-wider">
                          Active Community Mission
                        </span>
                        <h4 className="font-bold text-sm text-[#183B2C]">
                          Metro City Food Rescue Network
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#EDF9F1] text-[#075C3C] px-2.5 py-1 rounded-full border border-[#D6E4DC]">
                        Live Coordination
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating metric badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#D6E4DC] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center font-black">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-[#183B2C]">
                      {stats?.totalPortionsDistributed ?? 0}
                    </span>
                    <span className="block text-[11px] text-[#61766D] font-medium">
                      Meals Portions Distributed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database-Backed Impact Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D6E4DC] shadow-lg">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
              Measured Social Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183B2C]">
              Platform Metrics from Actual Database Records
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D6E4DC]/60">
              <span className="block text-3xl sm:text-4xl font-black text-[#168052]">
                {stats?.completedDonations ?? 0}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-[#183B2C] mt-1">
                Completed Donations
              </span>
              <span className="block text-[11px] text-[#61766D] mt-0.5">
                Confirmed received by NGOs
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D6E4DC]/60">
              <span className="block text-3xl sm:text-4xl font-black text-[#168052]">
                {stats?.totalPortionsDistributed ?? 0}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-[#183B2C] mt-1">
                Portions Shared
              </span>
              <span className="block text-[11px] text-[#61766D] mt-0.5">
                Nutritious meal servings
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D6E4DC]/60">
              <span className="block text-3xl sm:text-4xl font-black text-[#168052]">
                {stats?.activeProviders ?? 0}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-[#183B2C] mt-1">
                Food Providers
              </span>
              <span className="block text-[11px] text-[#61766D] mt-0.5">
                Bistros, bakeries & caterers
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F9F6] border border-[#D6E4DC]/60">
              <span className="block text-3xl sm:text-4xl font-black text-[#168052]">
                {stats?.participatingNgos ?? 0}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-[#183B2C] mt-1">
                Verified NGOs & Shelters
              </span>
              <span className="block text-[11px] text-[#61766D] mt-0.5">
                Active recipient partners
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Variety of Rescued Foods Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
              Diverse Food Recovery
            </span>
            <h2 className="text-3xl font-black text-[#183B2C] mt-1">
              Variety of Foods We Rescue Every Day
            </h2>
            <p className="text-sm text-[#61766D] mt-1 max-w-2xl">
              From hot banquet buffets and artisan breads to crisp farm produce and packaged pantry goods, our network coordinates all varieties of safe, consumable surplus.
            </p>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs shrink-0"
          >
            <span>Explore All in Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Item 1 */}
          <div
            onClick={() => handleCategoryClick('Cooked Meals')}
            className="group bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#168052] transition-all cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
                alt="Fresh Cooked Meals & Rice Dishes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#064C33]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                Cooked Meals
              </span>
              <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Vegetarian
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-[#183B2C] group-hover:text-[#168052] transition-colors">
                Hot Luncheon & Dinner Entrees
              </h3>
              <p className="text-xs text-[#61766D] leading-relaxed">
                Wholesome steamed basmati rice, seasoned lentil curries, roasted vegetables, and warm pasta dishes held above 60°C in thermal carriers.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#168052] font-semibold border-t border-[#D6E4DC]/60">
                <span>Typical Portion: 25 - 100 servings</span>
                <span className="text-[#075C3C] group-hover:underline">Browse Category →</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => handleCategoryClick('Bakery Products')}
            className="group bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#168052] transition-all cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                alt="Artisan Sourdough and Fresh Breads"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#064C33]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                Bakery Products
              </span>
              <span className="absolute top-3 right-3 bg-amber-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Daily Surplus
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-[#183B2C] group-hover:text-[#168052] transition-colors">
                Artisan Sourdough & Croissants
              </h3>
              <p className="text-xs text-[#61766D] leading-relaxed">
                Crisp multigrain sourdough loaves, French baguettes, morning butter croissants, and whole-wheat dinner rolls baked earlier the same day.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#168052] font-semibold border-t border-[#D6E4DC]/60">
                <span>Typical Portion: 30 - 80 items</span>
                <span className="text-[#075C3C] group-hover:underline">Browse Category →</span>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => handleCategoryClick('Fruits & Vegetables')}
            className="group bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#168052] transition-all cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80"
                alt="Fresh Organic Farm Produce"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#064C33]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                Fruits & Vegetables
              </span>
              <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Farm Crisp
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-[#183B2C] group-hover:text-[#168052] transition-colors">
                Fresh Produce & Seasonal Melons
              </h3>
              <p className="text-xs text-[#61766D] leading-relaxed">
                Sweet crisp apples, oranges, seasonal cantaloupes, fresh tomatoes, bell peppers, and crisp salad greens ready for immediate community consumption.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#168052] font-semibold border-t border-[#D6E4DC]/60">
                <span>Typical Portion: 20 - 50 kg crates</span>
                <span className="text-[#075C3C] group-hover:underline">Browse Category →</span>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => handleCategoryClick('Packaged Food')}
            className="group bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#168052] transition-all cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80"
                alt="Packaged Pantry Goods"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#064C33]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                Packaged Food
              </span>
              <span className="absolute top-3 right-3 bg-blue-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Shelf-Stable
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-[#183B2C] group-hover:text-[#168052] transition-colors">
                Supermarket Pantry & Cereals
              </h3>
              <p className="text-xs text-[#61766D] leading-relaxed">
                Intact sealed boxes of fortified breakfast cereals, dried pastas, whole grains, and healthy canned legumes from local supermarket surpluses.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#168052] font-semibold border-t border-[#D6E4DC]/60">
                <span>Typical Portion: 40 - 150 packets</span>
                <span className="text-[#075C3C] group-hover:underline">Browse Category →</span>
              </div>
            </div>
          </div>

          {/* Item 5 */}
          <div
            onClick={() => handleCategoryClick('Dairy Products')}
            className="group bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#168052] transition-all cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80"
                alt="Chilled Dairy & Yogurts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#064C33]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                Dairy Products
              </span>
              <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Chilled &lt;4°C
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-[#183B2C] group-hover:text-[#168052] transition-colors">
                Dairy, Milk Cartons & Yogurts
              </h3>
              <p className="text-xs text-[#61766D] leading-relaxed">
                Pasteurized whole and skim milk cartons, probiotic Greek yogurts, and sealed cheeses transported strictly under cold chain requirements.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#168052] font-semibold border-t border-[#D6E4DC]/60">
                <span>Typical Portion: 20 - 60 units</span>
                <span className="text-[#075C3C] group-hover:underline">Browse Category →</span>
              </div>
            </div>
          </div>

          {/* Item 6 */}
          <div
            onClick={() => handleCategoryClick('Other')}
            className="group bg-white rounded-3xl border border-[#D6E4DC] overflow-hidden shadow-xs hover:shadow-md hover:border-[#168052] transition-all cursor-pointer"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                alt="Banquet Platters and Sandwiches"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#064C33]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                Catering & Sandwiches
              </span>
              <span className="absolute top-3 right-3 bg-purple-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Event Surplus
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-base text-[#183B2C] group-hover:text-[#168052] transition-colors">
                Gourmet Wraps & Banquet Trays
              </h3>
              <p className="text-xs text-[#61766D] leading-relaxed">
                Unserved corporate luncheon sandwich platters, vegetarian wraps, and catering trays sealed with tamper-evident film immediately following events.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#168052] font-semibold border-t border-[#D6E4DC]/60">
                <span>Typical Portion: 30 - 75 servings</span>
                <span className="text-[#075C3C] group-hover:underline">Browse Category →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Simple, Transparent Workflow
          </span>
          <h2 className="text-3xl font-black text-[#183B2C] mt-1">
            How Food Share Works
          </h2>
          <p className="text-sm text-[#61766D] mt-2">
            A frictionless, accountable end-to-end lifecycle designed to ensure fresh surplus food reaches those in need safely and promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#D6E4DC] relative">
            <span className="w-8 h-8 rounded-full bg-[#168052] text-white text-xs font-black flex items-center justify-center mb-4">
              1
            </span>
            <h3 className="font-bold text-base text-[#183B2C] mb-2">Donate Surplus Food</h3>
            <p className="text-xs text-[#61766D] leading-relaxed">
              Providers post unserved banquet food, fresh bakery items, or produce with portion counts, allergens, and safe collection deadlines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D6E4DC] relative">
            <span className="w-8 h-8 rounded-full bg-[#168052] text-white text-xs font-black flex items-center justify-center mb-4">
              2
            </span>
            <h3 className="font-bold text-base text-[#183B2C] mb-2">NGOs Request Food</h3>
            <p className="text-xs text-[#61766D] leading-relaxed">
              Verified food banks and shelters search nearby listings and request exact needed portions with their community distribution plan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D6E4DC] relative">
            <span className="w-8 h-8 rounded-full bg-[#168052] text-white text-xs font-black flex items-center justify-center mb-4">
              3
            </span>
            <h3 className="font-bold text-base text-[#183B2C] mb-2">Volunteer Pickup</h3>
            <p className="text-xs text-[#61766D] leading-relaxed">
              When transportation assistance is required, community volunteers claim the pickup mission, collecting and delivering the food safely.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D6E4DC] relative">
            <span className="w-8 h-8 rounded-full bg-[#168052] text-white text-xs font-black flex items-center justify-center mb-4">
              4
            </span>
            <h3 className="font-bold text-base text-[#183B2C] mb-2">Receipt & Impact</h3>
            <p className="text-xs text-[#61766D] leading-relaxed">
              The recipient NGO confirms delivery receipt, updating the donation to completed and incrementing public impact statistics.
            </p>
          </div>
        </div>
      </section>

      {/* Role Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EDF9F1]/60 rounded-3xl p-8 sm:p-12 border border-[#D6E4DC]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
              A Platform For Everyone
            </span>
            <h2 className="text-3xl font-black text-[#183B2C] mt-1">
              Choose Your Role in Food Share
            </h2>
            <p className="text-sm text-[#61766D] mt-2">
              Every participant plays an essential part in creating an efficient, compassionate food recovery ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Provider card */}
            <div className="bg-white rounded-2xl p-6 border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#183B2C] mb-2">Food Providers</h3>
                <p className="text-xs text-[#61766D] mb-4 leading-relaxed">
                  Restaurants, hotels, caterers, college hostels, and canteens who want to eliminate disposal costs, support their community, and prevent food from going to waste.
                </p>
                <ul className="text-xs text-[#183B2C] space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Quick listing creation in &lt;2 mins
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Review & approve NGO requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Automatic portion reservation
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  onSelectRole('provider');
                  onNavigate('register');
                }}
                className="w-full py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-colors"
              >
                Join as Food Provider
              </button>
            </div>

            {/* NGO card */}
            <div className="bg-white rounded-2xl p-6 border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#183B2C] mb-2">NGOs & Food Banks</h3>
                <p className="text-xs text-[#61766D] mb-4 leading-relaxed">
                  Shelters, community kitchens, charitable trusts, and humanitarian organizations looking for steady, nutritious surplus meals for vulnerable populations.
                </p>
                <ul className="text-xs text-[#183B2C] space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Filter by meal type & location
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Verified organization credential
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Delivery tracking & receipt
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  onSelectRole('ngo');
                  onNavigate('register');
                }}
                className="w-full py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-colors"
              >
                Join as NGO Partner
              </button>
            </div>

            {/* Volunteer card */}
            <div className="bg-white rounded-2xl p-6 border border-[#D6E4DC] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EDF9F1] text-[#168052] flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#183B2C] mb-2">Community Volunteers</h3>
                <p className="text-xs text-[#61766D] mb-4 leading-relaxed">
                  Passionate individuals with vehicles or bicycles ready to bridge the logistical gap by collecting food from donors and delivering it to distribution points.
                </p>
                <ul className="text-xs text-[#183B2C] space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Flexible local rescue missions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Step-by-step route coordinates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#168052]" /> Real-time status update tools
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  onSelectRole('volunteer');
                  onNavigate('register');
                }}
                className="w-full py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-colors"
              >
                Join as Volunteer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl font-black text-[#183B2C] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#D6E4DC] overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#183B2C] flex items-center justify-between gap-4 hover:bg-[#F5F9F6]"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#168052] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#61766D] leading-relaxed border-t border-[#D6E4DC]/40 bg-[#F5F9F6]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#064C33] to-[#168052] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ready to turn surplus food into social impact?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Join dozens of restaurants, volunteers, and organizations across the city. Registration takes less than 60 seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3 rounded-xl bg-white text-[#064C33] font-bold text-xs hover:bg-[#EDF9F1] shadow-md transition-all text-center"
            >
              Register Now
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-6 py-3 rounded-xl bg-emerald-800/80 text-white border border-emerald-400 font-semibold text-xs hover:bg-emerald-700 transition-all text-center"
            >
              Browse Available Food
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
