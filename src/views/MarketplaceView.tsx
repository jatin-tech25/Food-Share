import React, { useState, useEffect } from 'react';
import { Donation, FoodCategory, User } from '../types';
import { DonationCard } from '../components/DonationCard';
import {
  Search,
  Filter,
  Leaf,
  MapPin,
  RefreshCw,
  PlusCircle,
  SlidersHorizontal,
  X,
  AlertCircle,
} from 'lucide-react';

interface MarketplaceViewProps {
  user: User | null;
  onSelectDonation: (donation: Donation) => void;
  onRequestDonation: (donation: Donation) => void;
  onNavigate: (view: string) => void;
}

const CATEGORIES: Array<FoodCategory | 'All'> = [
  'All',
  'Cooked Meals',
  'Bakery Products',
  'Fruits & Vegetables',
  'Packaged Food',
  'Dairy Products',
  'Beverages',
  'Other',
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  user,
  onSelectDonation,
  onRequestDonation,
  onNavigate,
}) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'available' | 'all'>('available');

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedCity !== 'All') params.append('city', selectedCity);
      if (isVegetarian) params.append('isVegetarian', 'true');
      if (statusFilter === 'all') params.append('status', 'all');

      const res = await fetch(`/api/donations?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load listings');
      const data = await res.json();
      setDonations(data.donations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [selectedCategory, selectedCity, isVegetarian, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonations();
  };

  // Dynamically compute unique cities from actual database listings
  const availableCities = [
    'All',
    ...Array.from(new Set(donations.map((d) => d.city?.trim()).filter(Boolean))),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D6E4DC] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Surplus Food Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1">
            Discover Available Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-[#61766D] mt-1">
            Browse surplus meals and produce available for immediate community collection.
          </p>
        </div>

        {user?.role === 'provider' && (
          <button
            onClick={() => onNavigate('create-donation')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] transition-all shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Donation</span>
          </button>
        )}
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#D6E4DC] shadow-xs space-y-4">
        {/* Search row */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by food name, provider, city, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchDonations();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#183B2C] text-white text-xs font-bold hover:bg-[#075C3C] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D6E4DC]/60">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-bold text-[#61766D] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#168052]" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#168052] text-white shadow-2xs'
                    : 'bg-[#F5F9F6] text-[#61766D] hover:bg-[#EDF9F1] hover:text-[#183B2C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#183B2C]">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="w-4 h-4 rounded text-[#168052] focus:ring-[#168052]"
              />
              <span className="flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" /> Vegetarian Only
              </span>
            </label>

            {/* Dynamic City Filter */}
            {availableCities.length > 1 && (
              <div className="flex items-center gap-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#168052]" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-[#D6E4DC] bg-white text-[#183B2C] focus:outline-none focus:ring-1 focus:ring-[#168052]"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Cities' : c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-[#D6E4DC] bg-white text-[#183B2C] focus:outline-none focus:ring-1 focus:ring-[#168052]"
            >
              <option value="available">Available & Reserved</option>
              <option value="all">Include Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Donations */}
      <div>
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#D6E4DC]">
            <RefreshCw className="w-8 h-8 text-[#168052] animate-spin mx-auto mb-3" />
            <p className="font-bold text-sm text-[#183B2C]">Loading available food listings...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-[#D6E4DC]">
            <div className="w-16 h-16 rounded-full bg-[#EDF9F1] text-[#168052] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="font-bold text-base text-[#183B2C] mb-1">No matching food listings found</h3>
            <p className="text-xs text-[#61766D] max-w-sm mx-auto mb-6">
              Try adjusting your category filters or search keywords. New listings are published frequently by donors.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setIsVegetarian(false);
                setStatusFilter('available');
              }}
              className="px-4 py-2 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onSelect={onSelectDonation}
                onRequest={onRequestDonation}
                isNgo={user?.role === 'ngo'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
