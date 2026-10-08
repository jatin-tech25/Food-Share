import React, { useState } from 'react';
import { User, FoodCategory } from '../types';
import {
  Utensils,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  PackageCheck,
  Info,
  CheckCircle,
  Leaf,
  ArrowLeft,
  Image,
} from 'lucide-react';

interface CreateDonationViewProps {
  user: User | null;
  onSuccess: (donationId: string) => void;
  onCancel: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CATEGORIES: FoodCategory[] = [
  'Cooked Meals',
  'Bakery Products',
  'Fruits & Vegetables',
  'Packaged Food',
  'Dairy Products',
  'Beverages',
  'Other',
];

const PRESET_IMAGES: Record<FoodCategory, string> = {
  'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'Bakery Products': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  'Fruits & Vegetables': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  'Packaged Food': 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80',
  'Dairy Products': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  'Other': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
};

export const CreateDonationView: React.FC<CreateDonationViewProps> = ({
  user,
  onSuccess,
  onCancel,
  onShowToast,
}) => {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(20);
  const [unit, setUnit] = useState('portions');
  const [estimatedPortions, setEstimatedPortions] = useState<number>(20);
  const [isVegetarian, setIsVegetarian] = useState(true);

  // Time fields
  const now = new Date();
  const formatDatetime = (d: Date) => d.toISOString().slice(0, 16);
  const [preparationTime, setPreparationTime] = useState(formatDatetime(now));
  const [pickupStart, setPickupStart] = useState(formatDatetime(now));
  const [pickupDeadline, setPickupDeadline] = useState(
    formatDatetime(new Date(now.getTime() + 6 * 3600 * 1000))
  );

  // Location (populated from authenticated user profile or empty)
  const [pickupAddress, setPickupAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');

  // Safety & handling
  const [storageInformation, setStorageInformation] = useState(
    'Keep hot above 60°C or chill below 4°C within 2 hours of collection.'
  );
  const [allergenInformation, setAllergenInformation] = useState('None declared.');
  const [packagingDetails, setPackagingDetails] = useState('Insulated thermal food-grade containers.');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imagePath, setImagePath] = useState(PRESET_IMAGES['Cooked Meals']);
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCategoryChange = (newCat: FoodCategory) => {
    setCategory(newCat);
    setImagePath(PRESET_IMAGES[newCat]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pledgeAccepted) {
      onShowToast('You must accept the food safety pledge to publish a donation.', 'error');
      return;
    }

    if (quantity <= 0) {
      onShowToast('Quantity must be greater than zero.', 'error');
      return;
    }

    const deadline = new Date(pickupDeadline);
    if (deadline.getTime() <= Date.now()) {
      onShowToast('Pickup deadline must be in the future.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName,
          category,
          description,
          quantity,
          unit,
          estimatedPortions,
          isVegetarian,
          preparationTime: new Date(preparationTime).toISOString(),
          pickupStart: new Date(pickupStart).toISOString(),
          pickupDeadline: deadline.toISOString(),
          pickupAddress,
          city,
          postalCode,
          storageInformation,
          allergenInformation,
          packagingDetails,
          specialInstructions,
          imagePath,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post donation');

      onShowToast('Donation published successfully to marketplace!', 'success');
      onSuccess(data.donation.id);
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top bar */}
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183B2C] hover:text-[#168052]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return</span>
      </button>

      <div className="bg-white rounded-3xl border border-[#D6E4DC] p-6 sm:p-10 shadow-sm">
        <div className="mb-8">
          <span className="text-xs font-bold text-[#168052] uppercase tracking-wider">
            Surplus Food Donation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#183B2C] mt-1">
            Publish New Surplus Food Listing
          </h1>
          <p className="text-xs sm:text-sm text-[#61766D] mt-1">
            Provide precise portions, temperature storage, allergen disclosures, and collection times so NGOs and volunteers can safely coordinate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Food Basics */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2C] flex items-center gap-2 mb-4 pb-2 border-b border-[#D6E4DC]">
              <Utensils className="w-4 h-4 text-[#168052]" />
              <span>1. Food Item Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Food Name / Dish Title *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., Vegetable Biryani & Raita or Fresh Sourdough Bread"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C] focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as FoodCategory)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Dietary Classification
                </label>
                <div className="flex items-center gap-4 h-10 px-3 border border-[#D6E4DC] rounded-xl bg-[#F5F9F6]">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#183B2C]">
                    <input
                      type="radio"
                      name="dietary"
                      checked={isVegetarian}
                      onChange={() => setIsVegetarian(true)}
                      className="text-[#168052]"
                    />
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Vegetarian
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#183B2C]">
                    <input
                      type="radio"
                      name="dietary"
                      checked={!isVegetarian}
                      onChange={() => setIsVegetarian(false)}
                      className="text-[#168052]"
                    />
                    Non-Vegetarian
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Description & Quality Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State preparation context (e.g. prepared today for a banquet, unserved, cooled safely in kitchen containers)..."
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                />
              </div>

              {/* Quantities */}
              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 1;
                    setQuantity(val);
                    if (unit === 'portions') setEstimatedPortions(val);
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-bold text-[#183B2C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#183B2C] mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C]"
                  >
                    <option value="portions">portions</option>
                    <option value="kg">kg</option>
                    <option value="items">items</option>
                    <option value="packets">packets</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183B2C] mb-1">
                    Estimated Portions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedPortions}
                    onChange={(e) => setEstimatedPortions(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Times & Location */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2C] flex items-center gap-2 mb-4 pb-2 border-b border-[#D6E4DC]">
              <Clock className="w-4 h-4 text-[#168052]" />
              <span>2. Timeline & Pickup Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Preparation Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Collection Ready From
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupStart}
                  onChange={(e) => setPickupStart(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1 text-amber-800">
                  Safe Pickup Deadline *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pickupDeadline}
                  onChange={(e) => setPickupDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-xs font-bold text-amber-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Collection Address *
                </label>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g., 142 Market Street, Kitchen Loading Bay"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  City & Postal Code *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                  />
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Zip"
                    className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Food Safety & Packaging */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2C] flex items-center gap-2 mb-4 pb-2 border-b border-[#D6E4DC]">
              <ShieldCheck className="w-4 h-4 text-[#168052]" />
              <span>3. Safety Standards, Packaging & Allergens</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Required Storage Temperature / Holding
                </label>
                <input
                  type="text"
                  value={storageInformation}
                  onChange={(e) => setStorageInformation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Known Allergen Disclosures
                </label>
                <input
                  type="text"
                  value={allergenInformation}
                  onChange={(e) => setAllergenInformation(e.target.value)}
                  placeholder="e.g. Contains dairy, gluten, peanuts"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Packaging Details
                </label>
                <input
                  type="text"
                  value={packagingDetails}
                  onChange={(e) => setPackagingDetails(e.target.value)}
                  placeholder="e.g. 3 sealed stainless food-grade tubs"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Special Pickup Instructions
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Ring side doorbell, ask for chef Marco"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Food Photo Preview */}
          <div className="p-4 bg-[#F5F9F6] rounded-2xl border border-[#D6E4DC]">
            <label className="block text-xs font-bold text-[#183B2C] mb-2 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-[#168052]" /> Photo Preview (Category Optimized)
            </label>
            <div className="flex items-center gap-4">
              <img
                src={imagePath}
                alt="Selected category food preview"
                className="w-24 h-24 rounded-2xl object-cover border border-[#D6E4DC]"
              />
              <div className="flex-1">
                <input
                  type="url"
                  value={imagePath}
                  onChange={(e) => setImagePath(e.target.value)}
                  placeholder="Custom image URL (optional)"
                  className="w-full p-2 rounded-xl border border-[#D6E4DC] text-xs bg-white text-[#183B2C]"
                />
                <p className="text-[11px] text-[#61766D] mt-1">
                  High-resolution photo automatically chosen based on {category}. You can paste an alternative URL if desired.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Food Safety Certification Pledge */}
          <div className="p-5 rounded-2xl bg-[#EDF9F1] border border-[#168052]/30 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="pledge"
                checked={pledgeAccepted}
                onChange={(e) => setPledgeAccepted(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-[#168052] focus:ring-[#168052]"
                required
              />
              <label htmlFor="pledge" className="text-xs text-[#075C3C] leading-relaxed cursor-pointer">
                <strong>Donor Food Safety Certification:</strong> I hereby certify that the surplus food listed above was prepared under clean, hygienic conditions, has been kept at safe holding temperatures, and that all allergen and preparation timestamps are true to the best of my knowledge. I understand that Food Share provides coordination and relies on honest, safe food handling practices.
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D6E4DC]">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-[#D6E4DC] text-xs font-semibold text-[#183B2C] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !pledgeAccepted}
              className="px-6 py-2.5 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-sm disabled:opacity-50 transition-all"
            >
              {submitting ? 'Publishing...' : 'Publish Food Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
