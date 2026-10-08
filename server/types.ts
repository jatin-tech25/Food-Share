export type UserRole = 'provider' | 'ngo' | 'volunteer' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  accountStatus: AccountStatus;
  organizationName?: string;
  organizationType?: string;
  isNgoVerified?: boolean;
  address?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type FoodCategory =
  | 'Cooked Meals'
  | 'Bakery Products'
  | 'Fruits & Vegetables'
  | 'Packaged Food'
  | 'Dairy Products'
  | 'Beverages'
  | 'Other';

export type DonationStatus =
  | 'Available'
  | 'Partially Reserved'
  | 'Fully Reserved'
  | 'Pickup Arranged'
  | 'Picked Up'
  | 'Delivered'
  | 'Completed'
  | 'Expired'
  | 'Cancelled';

export interface Donation {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone?: string;
  providerEmail?: string;
  foodName: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  remainingQuantity: number;
  unit: string; // e.g. "kg", "servings", "packets", "boxes"
  estimatedPortions: number;
  isVegetarian: boolean;
  preparationTime: string;
  pickupStart: string;
  pickupDeadline: string;
  pickupAddress: string;
  city: string;
  postalCode: string;
  storageInformation: string;
  allergenInformation: string;
  packagingDetails: string;
  imagePath: string;
  specialInstructions?: string;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Fulfilled';

export interface FoodRequest {
  id: string;
  donationId: string;
  ngoId: string;
  ngoName: string;
  ngoPhone?: string;
  ngoEmail?: string;
  requestedQuantity: number;
  status: RequestStatus;
  message: string;
  distributionPlan?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentStatus =
  | 'Available'
  | 'Assigned'
  | 'Picked Up'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface VolunteerAssignment {
  id: string;
  donationId: string;
  requestId: string;
  volunteerId?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  status: AssignmentStatus;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  pickupAddress: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DonationStatusHistory {
  id: string;
  donationId: string;
  previousStatus: string;
  newStatus: string;
  changedByUserId: string;
  changedByUserName: string;
  reason?: string;
  timestamp: string;
}

export interface Report {
  id: string;
  donationId?: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedByUserId: string;
  performedByUserName: string;
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
