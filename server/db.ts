import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  Donation,
  FoodRequest,
  VolunteerAssignment,
  Notification,
  DonationStatusHistory,
  Report,
  AuditLog,
} from './types';

export interface DatabaseSchema {
  users: User[];
  donations: Donation[];
  foodRequests: FoodRequest[];
  assignments: VolunteerAssignment[];
  notifications: Notification[];
  statusHistory: DonationStatusHistory[];
  reports: Report[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'foodshare.db.json');

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_foodshare_salt_2026').digest('hex');
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

class Database {
  private data: DatabaseSchema = {
    users: [],
    donations: [],
    foodRequests: [],
    assignments: [],
    notifications: [],
    statusHistory: [],
    reports: [],
    auditLogs: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all arrays exist
        if (!this.data.users) this.data.users = [];
        if (!this.data.donations) this.data.donations = [];
        if (!this.data.foodRequests) this.data.foodRequests = [];
        if (!this.data.assignments) this.data.assignments = [];
        if (!this.data.notifications) this.data.notifications = [];
        if (!this.data.statusHistory) this.data.statusHistory = [];
        if (!this.data.reports) this.data.reports = [];
        if (!this.data.auditLogs) this.data.auditLogs = [];
        return;
      } catch (err) {
        console.error('Error reading db file, reseeding...', err);
      }
    }

    this.seedInitialData();
    this.save();
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  public seedInitialData() {
    const defaultPasswordHash = hashPassword('password123');
    const now = new Date();
    const isoNow = now.toISOString();

    const futureHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
    const pastHours = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();

    const users: User[] = [
      {
        id: 'usr_admin',
        fullName: 'Eleanor Vance',
        email: 'admin@foodshare.org',
        phone: '+1 (555) 019-2831',
        passwordHash: defaultPasswordHash,
        role: 'admin',
        accountStatus: 'active',
        createdAt: pastHours(100),
        updatedAt: pastHours(100),
      },
      {
        id: 'usr_provider_1',
        fullName: 'Chef Marco Rossi',
        email: 'provider@foodshare.org',
        phone: '+1 (555) 438-9201',
        passwordHash: defaultPasswordHash,
        role: 'provider',
        accountStatus: 'active',
        organizationName: 'Green Garden Bistro & Catering',
        organizationType: 'Restaurant & Banquet Hall',
        address: '142 Market Street, Downtown',
        city: 'Metro City',
        postalCode: '90001',
        createdAt: pastHours(80),
        updatedAt: pastHours(80),
      },
      {
        id: 'usr_provider_2',
        fullName: 'Sarah Jenkins',
        email: 'bakery@foodshare.org',
        phone: '+1 (555) 872-1144',
        passwordHash: defaultPasswordHash,
        role: 'provider',
        accountStatus: 'active',
        organizationName: 'Sunrise Artisan Bakery',
        organizationType: 'Bakery',
        address: '88 Oakridge Avenue',
        city: 'Metro City',
        postalCode: '90004',
        createdAt: pastHours(60),
        updatedAt: pastHours(60),
      },
      {
        id: 'usr_ngo_1',
        fullName: 'David Kalu',
        email: 'ngo@foodshare.org',
        phone: '+1 (555) 923-4412',
        passwordHash: defaultPasswordHash,
        role: 'ngo',
        accountStatus: 'active',
        organizationName: 'Hope & Care Food Bank',
        organizationType: 'Non-Profit Food Pantry',
        isNgoVerified: true,
        address: '500 Community Plaza',
        city: 'Metro City',
        postalCode: '90002',
        createdAt: pastHours(70),
        updatedAt: pastHours(70),
      },
      {
        id: 'usr_ngo_2',
        fullName: 'Priya Sharma',
        email: 'shelter@foodshare.org',
        phone: '+1 (555) 761-3990',
        passwordHash: defaultPasswordHash,
        role: 'ngo',
        accountStatus: 'active',
        organizationName: 'Haven Youth Shelter',
        organizationType: 'Community Shelter',
        isNgoVerified: false,
        address: '210 Elm Street',
        city: 'Metro City',
        postalCode: '90003',
        createdAt: pastHours(10),
        updatedAt: pastHours(10),
      },
      {
        id: 'usr_volunteer_1',
        fullName: 'Alex Rivera',
        email: 'volunteer@foodshare.org',
        phone: '+1 (555) 302-8819',
        passwordHash: defaultPasswordHash,
        role: 'volunteer',
        accountStatus: 'active',
        address: '77 Pine Street, Apt 4B',
        city: 'Metro City',
        postalCode: '90001',
        createdAt: pastHours(50),
        updatedAt: pastHours(50),
      },
    ];

    const donations: Donation[] = [
      {
        id: 'don_1',
        providerId: 'usr_provider_1',
        providerName: 'Green Garden Bistro & Catering',
        providerPhone: '+1 (555) 438-9201',
        providerEmail: 'provider@foodshare.org',
        foodName: 'Fresh Vegetable Medley & Basmati Rice',
        category: 'Cooked Meals',
        description: 'Prepared for a corporate luncheon today. Cleanly packed in sanitized thermal food-grade containers immediately after cooking. Wholesome steamed basmati rice with fragrant spiced vegetable curry.',
        quantity: 45,
        remainingQuantity: 15,
        unit: 'portions',
        estimatedPortions: 45,
        isVegetarian: true,
        preparationTime: pastHours(3),
        pickupStart: pastHours(1),
        pickupDeadline: futureHours(5),
        pickupAddress: '142 Market Street, Downtown, Back Kitchen Bay',
        city: 'Metro City',
        postalCode: '90001',
        storageInformation: 'Keep hot above 60°C or chill below 4°C within 2 hours. Thermal containers provided.',
        allergenInformation: 'Contains mustard seeds. Prepared in a nut-free kitchen.',
        packagingDetails: '3 insulated 15-portion food grade containers with secure tamper-evident seals.',
        imagePath: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        specialInstructions: 'Ring doorbell at delivery dock behind the main dining hall. Ask for Chef Marco.',
        status: 'Partially Reserved',
        createdAt: pastHours(3),
        updatedAt: pastHours(1),
      },
      {
        id: 'don_2',
        providerId: 'usr_provider_2',
        providerName: 'Sunrise Artisan Bakery',
        providerPhone: '+1 (555) 872-1144',
        providerEmail: 'bakery@foodshare.org',
        foodName: 'Fresh Sourdough Loaves & Croissants',
        category: 'Bakery Products',
        description: 'Daily surplus artisan sourdough breads, seeded multigrain baguettes, and assorted freshly baked morning croissants. Baked earlier today, crisp crust and fluffy texture.',
        quantity: 60,
        remainingQuantity: 60,
        unit: 'items',
        estimatedPortions: 60,
        isVegetarian: true,
        preparationTime: pastHours(6),
        pickupStart: pastHours(2),
        pickupDeadline: futureHours(8),
        pickupAddress: '88 Oakridge Avenue, Side Door',
        city: 'Metro City',
        postalCode: '90004',
        storageInformation: 'Dry room temperature, away from moisture.',
        allergenInformation: 'Contains wheat gluten, dairy (butter in croissants).',
        packagingDetails: 'Individually wrapped in food-safe craft paper bags inside large stackable cartons.',
        imagePath: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        specialInstructions: 'Parking available right in front of the side door for quick loading.',
        status: 'Available',
        createdAt: pastHours(5),
        updatedAt: pastHours(5),
      },
      {
        id: 'don_3',
        providerId: 'usr_provider_1',
        providerName: 'Green Garden Bistro & Catering',
        providerPhone: '+1 (555) 438-9201',
        providerEmail: 'provider@foodshare.org',
        foodName: 'Chilled Fruit Crates (Melons, Apples, Oranges)',
        category: 'Fruits & Vegetables',
        description: 'Uncut, pristine fresh seasonal fruits purchased for banquet styling. Washed, crisp, and ready for immediate consumption or juicing.',
        quantity: 25,
        remainingQuantity: 25,
        unit: 'kg',
        estimatedPortions: 80,
        isVegetarian: true,
        preparationTime: pastHours(8),
        pickupStart: pastHours(1),
        pickupDeadline: futureHours(16),
        pickupAddress: '142 Market Street, Downtown',
        city: 'Metro City',
        postalCode: '90001',
        storageInformation: 'Chilled produce storage recommended.',
        allergenInformation: 'None.',
        packagingDetails: '3 sturdy wooden produce crates with side ventilation.',
        imagePath: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
        specialInstructions: 'Crates can be wheeled directly to your trunk on our loading dolly.',
        status: 'Available',
        createdAt: pastHours(7),
        updatedAt: pastHours(7),
      },
      {
        id: 'don_4',
        providerId: 'usr_provider_1',
        providerName: 'Green Garden Bistro & Catering',
        providerPhone: '+1 (555) 438-9201',
        providerEmail: 'provider@foodshare.org',
        foodName: 'Grilled Herb Chicken & Roasted Potatoes',
        category: 'Cooked Meals',
        description: 'Hot roasted chicken quarters with lemon rosemary herbs and roasted butter potatoes. Complete balanced meal portions.',
        quantity: 50,
        remainingQuantity: 0,
        unit: 'portions',
        estimatedPortions: 50,
        isVegetarian: false,
        preparationTime: pastHours(24),
        pickupStart: pastHours(22),
        pickupDeadline: pastHours(18),
        pickupAddress: '142 Market Street, Downtown',
        city: 'Metro City',
        postalCode: '90001',
        storageInformation: 'Delivered in thermal carriers and distributed directly.',
        allergenInformation: 'Contains poultry, butter.',
        packagingDetails: 'Commercial insulated thermal tubs.',
        imagePath: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
        specialInstructions: 'Delivered successfully to Hope & Care Food Bank.',
        status: 'Completed',
        createdAt: pastHours(26),
        updatedAt: pastHours(18),
      },
    ];

    const foodRequests: FoodRequest[] = [
      {
        id: 'req_1',
        donationId: 'don_1',
        ngoId: 'usr_ngo_1',
        ngoName: 'Hope & Care Food Bank',
        ngoPhone: '+1 (555) 923-4412',
        ngoEmail: 'ngo@foodshare.org',
        requestedQuantity: 30,
        status: 'Accepted',
        message: 'We have 30 families arriving at our afternoon community kitchen session. We would love to distribute these hot meals.',
        distributionPlan: 'Direct distribution at Hope & Care Community Center between 2:00 PM and 4:00 PM.',
        createdAt: pastHours(2),
        updatedAt: pastHours(1),
      },
      {
        id: 'req_2',
        donationId: 'don_4',
        ngoId: 'usr_ngo_1',
        ngoName: 'Hope & Care Food Bank',
        ngoPhone: '+1 (555) 923-4412',
        ngoEmail: 'ngo@foodshare.org',
        requestedQuantity: 50,
        status: 'Fulfilled',
        message: 'Needed for evening hot meal shelter service.',
        distributionPlan: 'Served hot to 50 residents yesterday evening.',
        createdAt: pastHours(25),
        updatedAt: pastHours(18),
      },
    ];

    const assignments: VolunteerAssignment[] = [
      {
        id: 'asg_1',
        donationId: 'don_1',
        requestId: 'req_1',
        volunteerId: 'usr_volunteer_1',
        volunteerName: 'Alex Rivera',
        volunteerPhone: '+1 (555) 302-8819',
        status: 'Assigned',
        assignedAt: pastHours(1),
        pickupAddress: '142 Market Street, Downtown, Back Kitchen Bay',
        deliveryAddress: '500 Community Plaza, Hope & Care Food Bank',
        notes: 'Volunteer Alex is en route to collect thermal containers.',
        createdAt: pastHours(1),
        updatedAt: pastHours(1),
      },
      {
        id: 'asg_2',
        donationId: 'don_4',
        requestId: 'req_2',
        volunteerId: 'usr_volunteer_1',
        volunteerName: 'Alex Rivera',
        volunteerPhone: '+1 (555) 302-8819',
        status: 'Completed',
        assignedAt: pastHours(24),
        pickedUpAt: pastHours(20),
        deliveredAt: pastHours(19),
        completedAt: pastHours(18),
        pickupAddress: '142 Market Street, Downtown',
        deliveryAddress: '500 Community Plaza',
        notes: 'Safely delivered with temperature intact.',
        createdAt: pastHours(24),
        updatedAt: pastHours(18),
      },
    ];

    const notifications: Notification[] = [
      {
        id: 'notif_1',
        userId: 'usr_provider_1',
        title: 'New Food Request Received',
        message: 'Hope & Care Food Bank requested 30 portions of Vegetable Medley & Basmati Rice.',
        type: 'info',
        linkUrl: '/dashboard/provider',
        isRead: false,
        createdAt: pastHours(2),
      },
      {
        id: 'notif_2',
        userId: 'usr_ngo_1',
        title: 'Food Request Accepted!',
        message: 'Green Garden Bistro accepted your request for 30 portions of Vegetable Medley.',
        type: 'success',
        linkUrl: '/dashboard/ngo',
        isRead: false,
        createdAt: pastHours(1),
      },
      {
        id: 'notif_3',
        userId: 'usr_volunteer_1',
        title: 'Pickup Mission Available',
        message: 'A new food rescue mission is ready for pickup in Downtown Metro City.',
        type: 'info',
        linkUrl: '/dashboard/volunteer',
        isRead: false,
        createdAt: pastHours(1),
      },
    ];

    const statusHistory: DonationStatusHistory[] = [
      {
        id: 'sh_1',
        donationId: 'don_1',
        previousStatus: 'None',
        newStatus: 'Available',
        changedByUserId: 'usr_provider_1',
        changedByUserName: 'Chef Marco Rossi',
        reason: 'Donation created and verified',
        timestamp: pastHours(3),
      },
      {
        id: 'sh_2',
        donationId: 'don_1',
        previousStatus: 'Available',
        newStatus: 'Partially Reserved',
        changedByUserId: 'usr_provider_1',
        changedByUserName: 'Chef Marco Rossi',
        reason: 'Accepted request of 30 portions for Hope & Care Food Bank',
        timestamp: pastHours(1),
      },
      {
        id: 'sh_3',
        donationId: 'don_4',
        previousStatus: 'Delivered',
        newStatus: 'Completed',
        changedByUserId: 'usr_ngo_1',
        changedByUserName: 'David Kalu',
        reason: 'Confirmed food receipt and safe distribution to shelter beneficiaries.',
        timestamp: pastHours(18),
      },
    ];

    const reports: Report[] = [];

    const auditLogs: AuditLog[] = [
      {
        id: 'aud_1',
        action: 'USER_REGISTERED',
        performedByUserId: 'usr_ngo_1',
        performedByUserName: 'David Kalu',
        targetEntity: 'User',
        targetId: 'usr_ngo_1',
        details: 'Registered as NGO organization: Hope & Care Food Bank',
        timestamp: pastHours(70),
      },
      {
        id: 'aud_2',
        action: 'NGO_VERIFIED',
        performedByUserId: 'usr_admin',
        performedByUserName: 'Eleanor Vance',
        targetEntity: 'User',
        targetId: 'usr_ngo_1',
        details: 'Admin verified 501(c)(3) community status for Hope & Care Food Bank',
        timestamp: pastHours(68),
      },
      {
        id: 'aud_3',
        action: 'DONATION_CREATED',
        performedByUserId: 'usr_provider_1',
        performedByUserName: 'Chef Marco Rossi',
        targetEntity: 'Donation',
        targetId: 'don_1',
        details: 'Created listing: Fresh Vegetable Medley & Basmati Rice (45 portions)',
        timestamp: pastHours(3),
      },
    ];

    this.data = {
      users,
      donations,
      foodRequests,
      assignments,
      notifications,
      statusHistory,
      reports,
      auditLogs,
    };
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: generateId('usr'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.addAuditLog({
      action: 'USER_REGISTERED',
      performedByUserId: newUser.id,
      performedByUserName: newUser.fullName,
      targetEntity: 'User',
      targetId: newUser.id,
      details: `New account registered as ${newUser.role}`,
    });
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  // --- DONATIONS ---
  public getDonations(): Donation[] {
    return this.data.donations;
  }

  public findDonationById(id: string): Donation | undefined {
    return this.data.donations.find((d) => d.id === id);
  }

  public createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Donation {
    const newDonation: Donation = {
      ...donation,
      id: generateId('don'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.donations.unshift(newDonation);

    this.data.statusHistory.unshift({
      id: generateId('sh'),
      donationId: newDonation.id,
      previousStatus: 'None',
      newStatus: newDonation.status,
      changedByUserId: newDonation.providerId,
      changedByUserName: newDonation.providerName,
      reason: 'Donation published to marketplace',
      timestamp: newDonation.createdAt,
    });

    this.addAuditLog({
      action: 'DONATION_CREATED',
      performedByUserId: newDonation.providerId,
      performedByUserName: newDonation.providerName,
      targetEntity: 'Donation',
      targetId: newDonation.id,
      details: `Created listing: ${newDonation.foodName} (${newDonation.quantity} ${newDonation.unit})`,
    });

    // Notify volunteers and NGOs about new food
    const ngos = this.data.users.filter((u) => u.role === 'ngo');
    ngos.forEach((ngo) => {
      this.addNotification({
        userId: ngo.id,
        title: 'New Food Donation Available!',
        message: `${newDonation.providerName} posted ${newDonation.foodName} (${newDonation.estimatedPortions} portions) in ${newDonation.city}.`,
        type: 'info',
        linkUrl: `/donations/${newDonation.id}`,
      });
    });

    this.save();
    return newDonation;
  }

  public updateDonation(id: string, updates: Partial<Donation>, actorId?: string, actorName?: string): Donation | undefined {
    const donation = this.findDonationById(id);
    if (!donation) return undefined;

    const oldStatus = donation.status;
    Object.assign(donation, updates, { updatedAt: new Date().toISOString() });

    if (updates.status && updates.status !== oldStatus) {
      this.data.statusHistory.unshift({
        id: generateId('sh'),
        donationId: donation.id,
        previousStatus: oldStatus,
        newStatus: updates.status,
        changedByUserId: actorId || donation.providerId,
        changedByUserName: actorName || donation.providerName,
        reason: `Status transition from ${oldStatus} to ${updates.status}`,
        timestamp: new Date().toISOString(),
      });
    }

    this.save();
    return donation;
  }

  // --- FOOD REQUESTS & TRANSACTIONS ---
  public getFoodRequests(): FoodRequest[] {
    return this.data.foodRequests;
  }

  public findFoodRequestById(id: string): FoodRequest | undefined {
    return this.data.foodRequests.find((r) => r.id === id);
  }

  public createFoodRequest(req: Omit<FoodRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): { request?: FoodRequest; error?: string } {
    const donation = this.findDonationById(req.donationId);
    if (!donation) return { error: 'Donation not found' };

    if (donation.status === 'Completed' || donation.status === 'Cancelled' || donation.status === 'Expired') {
      return { error: `Donation is ${donation.status.toLowerCase()} and cannot accept requests.` };
    }

    if (req.requestedQuantity <= 0) {
      return { error: 'Requested quantity must be greater than zero.' };
    }

    if (req.requestedQuantity > donation.remainingQuantity) {
      return { error: `Requested quantity (${req.requestedQuantity}) exceeds remaining available food (${donation.remainingQuantity} ${donation.unit}).` };
    }

    const newRequest: FoodRequest = {
      ...req,
      id: generateId('req'),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.foodRequests.unshift(newRequest);

    // Notify provider
    this.addNotification({
      userId: donation.providerId,
      title: 'New Food Request Received',
      message: `${req.ngoName} requested ${req.requestedQuantity} ${donation.unit} of ${donation.foodName}.`,
      type: 'info',
      linkUrl: `/dashboard/provider`,
    });

    this.addAuditLog({
      action: 'REQUEST_SUBMITTED',
      performedByUserId: req.ngoId,
      performedByUserName: req.ngoName,
      targetEntity: 'FoodRequest',
      targetId: newRequest.id,
      details: `Requested ${req.requestedQuantity} of ${donation.foodName}`,
    });

    this.save();
    return { request: newRequest };
  }

  public acceptFoodRequest(requestId: string, providerId: string): { success: boolean; error?: string; request?: FoodRequest; assignment?: VolunteerAssignment } {
    const request = this.findFoodRequestById(requestId);
    if (!request) return { success: false, error: 'Request not found' };

    const donation = this.findDonationById(request.donationId);
    if (!donation) return { success: false, error: 'Associated donation not found' };

    if (donation.providerId !== providerId) {
      return { success: false, error: 'Unauthorized: Only the donation provider can accept this request' };
    }

    if (request.status !== 'Pending') {
      return { success: false, error: `Request cannot be accepted from '${request.status}' status.` };
    }

    // Atomic allocation check
    if (request.requestedQuantity > donation.remainingQuantity) {
      return { success: false, error: `Insufficient food remaining. Remaining: ${donation.remainingQuantity}, Requested: ${request.requestedQuantity}` };
    }

    // Deduct remaining quantity
    donation.remainingQuantity -= request.requestedQuantity;
    const oldDonationStatus = donation.status;
    if (donation.remainingQuantity === 0) {
      donation.status = 'Fully Reserved';
    } else {
      donation.status = 'Partially Reserved';
    }

    donation.updatedAt = new Date().toISOString();
    request.status = 'Accepted';
    request.updatedAt = new Date().toISOString();

    // Create volunteer assignment opportunity
    const assignment: VolunteerAssignment = {
      id: generateId('asg'),
      donationId: donation.id,
      requestId: request.id,
      status: 'Available',
      pickupAddress: donation.pickupAddress,
      deliveryAddress: request.distributionPlan || 'NGO Distribution Center',
      notes: `Transport for ${request.requestedQuantity} ${donation.unit} from ${donation.providerName} to ${request.ngoName}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.assignments.unshift(assignment);

    // Record status history
    this.data.statusHistory.unshift({
      id: generateId('sh'),
      donationId: donation.id,
      previousStatus: oldDonationStatus,
      newStatus: donation.status,
      changedByUserId: providerId,
      changedByUserName: donation.providerName,
      reason: `Accepted request of ${request.requestedQuantity} ${donation.unit} for ${request.ngoName}`,
      timestamp: new Date().toISOString(),
    });

    // Notify NGO
    this.addNotification({
      userId: request.ngoId,
      title: 'Food Request Approved! 🎉',
      message: `${donation.providerName} approved your request for ${request.requestedQuantity} ${donation.unit} of ${donation.foodName}. Pickup coordination is now active!`,
      type: 'success',
      linkUrl: `/dashboard/ngo`,
    });

    // Notify Volunteers of open mission
    const volunteers = this.data.users.filter((u) => u.role === 'volunteer');
    volunteers.forEach((v) => {
      this.addNotification({
        userId: v.id,
        title: 'New Volunteer Delivery Opportunity! 🚗',
        message: `Pickup available: ${donation.foodName} in ${donation.city} for ${request.ngoName}.`,
        type: 'info',
        linkUrl: `/dashboard/volunteer`,
      });
    });

    this.addAuditLog({
      action: 'REQUEST_ACCEPTED',
      performedByUserId: providerId,
      performedByUserName: donation.providerName,
      targetEntity: 'FoodRequest',
      targetId: request.id,
      details: `Accepted request for ${request.requestedQuantity} ${donation.unit}. Remaining: ${donation.remainingQuantity}`,
    });

    this.save();
    return { success: true, request, assignment };
  }

  public rejectFoodRequest(requestId: string, providerId: string, reason?: string): { success: boolean; error?: string } {
    const request = this.findFoodRequestById(requestId);
    if (!request) return { success: false, error: 'Request not found' };

    const donation = this.findDonationById(request.donationId);
    if (!donation) return { success: false, error: 'Donation not found' };

    if (donation.providerId !== providerId) {
      return { success: false, error: 'Unauthorized' };
    }

    if (request.status !== 'Pending') {
      return { success: false, error: `Request cannot be rejected from status '${request.status}'` };
    }

    request.status = 'Rejected';
    request.updatedAt = new Date().toISOString();

    this.addNotification({
      userId: request.ngoId,
      title: 'Food Request Update',
      message: `${donation.providerName} was unable to accept your request for ${donation.foodName}.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'warning',
      linkUrl: `/dashboard/ngo`,
    });

    this.addAuditLog({
      action: 'REQUEST_REJECTED',
      performedByUserId: providerId,
      performedByUserName: donation.providerName,
      targetEntity: 'FoodRequest',
      targetId: request.id,
      details: `Rejected request from ${request.ngoName}`,
    });

    this.save();
    return { success: true };
  }

  // --- VOLUNTEER ASSIGNMENTS ---
  public getAssignments(): VolunteerAssignment[] {
    return this.data.assignments;
  }

  public findAssignmentById(id: string): VolunteerAssignment | undefined {
    return this.data.assignments.find((a) => a.id === id);
  }

  public claimAssignment(assignmentId: string, volunteer: User): { success: boolean; error?: string; assignment?: VolunteerAssignment } {
    const asg = this.findAssignmentById(assignmentId);
    if (!asg) return { success: false, error: 'Assignment not found' };

    if (asg.status !== 'Available') {
      return { success: false, error: `Assignment already claimed or closed (status: ${asg.status})` };
    }

    asg.status = 'Assigned';
    asg.volunteerId = volunteer.id;
    asg.volunteerName = volunteer.fullName;
    asg.volunteerPhone = volunteer.phone;
    asg.assignedAt = new Date().toISOString();
    asg.updatedAt = new Date().toISOString();

    const donation = this.findDonationById(asg.donationId);
    if (donation) {
      this.updateDonation(donation.id, { status: 'Pickup Arranged' }, volunteer.id, volunteer.fullName);

      // Notify provider & NGO
      this.addNotification({
        userId: donation.providerId,
        title: 'Volunteer Assigned for Pickup!',
        message: `${volunteer.fullName} has accepted the transport mission for ${donation.foodName}. Phone: ${volunteer.phone}`,
        type: 'info',
        linkUrl: `/dashboard/provider`,
      });

      const request = this.findFoodRequestById(asg.requestId);
      if (request) {
        this.addNotification({
          userId: request.ngoId,
          title: 'Volunteer Assigned to Your Delivery!',
          message: `${volunteer.fullName} is handling pickup of ${donation.foodName} from ${donation.providerName}.`,
          type: 'info',
          linkUrl: `/dashboard/ngo`,
        });
      }
    }

    this.addAuditLog({
      action: 'ASSIGNMENT_CLAIMED',
      performedByUserId: volunteer.id,
      performedByUserName: volunteer.fullName,
      targetEntity: 'VolunteerAssignment',
      targetId: asg.id,
      details: `Claimed pickup assignment for donation ${asg.donationId}`,
    });

    this.save();
    return { success: true, assignment: asg };
  }

  public markAssignmentPickedUp(assignmentId: string, volunteerId: string): { success: boolean; error?: string; assignment?: VolunteerAssignment } {
    const asg = this.findAssignmentById(assignmentId);
    if (!asg) return { success: false, error: 'Assignment not found' };

    if (asg.volunteerId !== volunteerId) {
      return { success: false, error: 'Unauthorized: You are not assigned to this delivery' };
    }

    if (asg.status !== 'Assigned') {
      return { success: false, error: `Cannot mark picked up from status: ${asg.status}` };
    }

    asg.status = 'Picked Up';
    asg.pickedUpAt = new Date().toISOString();
    asg.updatedAt = new Date().toISOString();

    const donation = this.findDonationById(asg.donationId);
    if (donation) {
      this.updateDonation(donation.id, { status: 'Picked Up' }, volunteerId, asg.volunteerName);

      const request = this.findFoodRequestById(asg.requestId);
      if (request) {
        this.addNotification({
          userId: request.ngoId,
          title: 'Food Has Been Picked Up! 🚚',
          message: `${asg.volunteerName} picked up ${donation.foodName} and is en route to you!`,
          type: 'info',
          linkUrl: `/dashboard/ngo`,
        });
      }
    }

    this.addAuditLog({
      action: 'FOOD_PICKED_UP',
      performedByUserId: volunteerId,
      performedByUserName: asg.volunteerName || 'Volunteer',
      targetEntity: 'VolunteerAssignment',
      targetId: asg.id,
      details: 'Food safely collected from provider',
    });

    this.save();
    return { success: true, assignment: asg };
  }

  public markAssignmentDelivered(assignmentId: string, volunteerId: string): { success: boolean; error?: string; assignment?: VolunteerAssignment } {
    const asg = this.findAssignmentById(assignmentId);
    if (!asg) return { success: false, error: 'Assignment not found' };

    if (asg.volunteerId !== volunteerId) {
      return { success: false, error: 'Unauthorized: You are not assigned to this delivery' };
    }

    if (asg.status !== 'Picked Up') {
      return { success: false, error: `Cannot mark delivered from status: ${asg.status}` };
    }

    asg.status = 'Delivered';
    asg.deliveredAt = new Date().toISOString();
    asg.updatedAt = new Date().toISOString();

    const donation = this.findDonationById(asg.donationId);
    if (donation) {
      this.updateDonation(donation.id, { status: 'Delivered' }, volunteerId, asg.volunteerName);

      const request = this.findFoodRequestById(asg.requestId);
      if (request) {
        this.addNotification({
          userId: request.ngoId,
          title: 'Food Has Arrived! Please Confirm Receipt',
          message: `${asg.volunteerName} delivered ${donation.foodName}. Please verify quality and confirm receipt.`,
          type: 'success',
          linkUrl: `/dashboard/ngo`,
        });
      }
    }

    this.addAuditLog({
      action: 'FOOD_DELIVERED',
      performedByUserId: volunteerId,
      performedByUserName: asg.volunteerName || 'Volunteer',
      targetEntity: 'VolunteerAssignment',
      targetId: asg.id,
      details: 'Food arrived at delivery destination',
    });

    this.save();
    return { success: true, assignment: asg };
  }

  public confirmReceiptByNgo(requestId: string, ngoId: string): { success: boolean; error?: string } {
    const request = this.findFoodRequestById(requestId);
    if (!request) return { success: false, error: 'Request not found' };

    if (request.ngoId !== ngoId) {
      return { success: false, error: 'Unauthorized: Only the recipient NGO can confirm receipt' };
    }

    request.status = 'Fulfilled';
    request.updatedAt = new Date().toISOString();

    // Complete associated assignment
    const asg = this.data.assignments.find((a) => a.requestId === requestId);
    if (asg) {
      asg.status = 'Completed';
      asg.completedAt = new Date().toISOString();
      asg.updatedAt = new Date().toISOString();

      if (asg.volunteerId) {
        this.addNotification({
          userId: asg.volunteerId,
          title: 'Mission Completed! Thank You! 🌟',
          message: `${request.ngoName} confirmed safe receipt of the food delivery. Great work!`,
          type: 'success',
          linkUrl: `/dashboard/volunteer`,
        });
      }
    }

    const donation = this.findDonationById(request.donationId);
    if (donation) {
      // Check if all accepted requests are fulfilled and remaining quantity is 0
      const activeRequests = this.data.foodRequests.filter((r) => r.donationId === donation.id && r.status === 'Accepted');
      if (activeRequests.length === 0 && donation.remainingQuantity === 0) {
        this.updateDonation(donation.id, { status: 'Completed' }, ngoId, request.ngoName);
      } else {
        this.updateDonation(donation.id, { status: 'Completed' }, ngoId, request.ngoName);
      }

      this.addNotification({
        userId: donation.providerId,
        title: 'Donation Completed! 🎉',
        message: `${request.ngoName} has confirmed receipt of ${donation.foodName}. Your donation made a real difference!`,
        type: 'success',
        linkUrl: `/dashboard/provider`,
      });
    }

    this.addAuditLog({
      action: 'DONATION_COMPLETED',
      performedByUserId: ngoId,
      performedByUserName: request.ngoName,
      targetEntity: 'FoodRequest',
      targetId: request.id,
      details: 'Recipient NGO confirmed successful receipt and distribution',
    });

    this.save();
    return { success: true };
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): Notification[] {
    if (userId) {
      return this.data.notifications.filter((n) => n.userId === userId);
    }
    return this.data.notifications;
  }

  public addNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
    const newNotif: Notification = {
      ...notif,
      id: generateId('notif'),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  public markNotificationRead(id: string, userId: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id && n.userId === userId);
    if (notif) {
      notif.isRead = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId: string): void {
    this.data.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    this.save();
  }

  // --- STATUS HISTORY ---
  public getStatusHistory(donationId?: string): DonationStatusHistory[] {
    if (donationId) {
      return this.data.statusHistory.filter((sh) => sh.donationId === donationId);
    }
    return this.data.statusHistory;
  }

  // --- REPORTS ---
  public getReports(): Report[] {
    return this.data.reports;
  }

  public createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Report {
    const newReport: Report = {
      ...report,
      id: generateId('rep'),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.reports.unshift(newReport);
    this.addAuditLog({
      action: 'REPORT_SUBMITTED',
      performedByUserId: report.reportedByUserId,
      performedByUserName: report.reportedByUserName,
      targetEntity: 'Report',
      targetId: newReport.id,
      details: `Report filed: ${report.reason}`,
    });
    this.save();
    return newReport;
  }

  public resolveReport(reportId: string, adminUser: User, status: 'resolved' | 'dismissed', notes?: string): Report | undefined {
    const report = this.data.reports.find((r) => r.id === reportId);
    if (!report) return undefined;
    report.status = status;
    report.adminNotes = notes;
    report.updatedAt = new Date().toISOString();

    this.addAuditLog({
      action: 'REPORT_RESOLVED',
      performedByUserId: adminUser.id,
      performedByUserName: adminUser.fullName,
      targetEntity: 'Report',
      targetId: report.id,
      details: `Marked as ${status}. Notes: ${notes || 'None'}`,
    });
    this.save();
    return report;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: generateId('aud'),
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(newLog);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    return newLog;
  }

  // --- IMPACT ANALYTICS (Real DB-calculated) ---
  public getImpactStats() {
    const completedDonations = this.data.donations.filter((d) => d.status === 'Completed');
    const availableDonations = this.data.donations.filter(
      (d) => d.status === 'Available' || d.status === 'Partially Reserved'
    );
    const activeProviders = new Set(this.data.donations.map((d) => d.providerId)).size;
    const participatingNgos = new Set(
      this.data.foodRequests.filter((r) => r.status === 'Accepted' || r.status === 'Fulfilled').map((r) => r.ngoId)
    ).size;
    const completedAssignments = this.data.assignments.filter((a) => a.status === 'Completed').length;

    // Portions distributed calculated from fulfilled or accepted requests & completed donations
    const totalPortionsDistributed = completedDonations.reduce((acc, curr) => acc + (curr.estimatedPortions || curr.quantity || 0), 0);

    // Categories breakdown
    const categoryCounts: Record<string, number> = {};
    this.data.donations.forEach((d) => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    // Approximate CO2e offset: Average 2.5 kg CO2e saved per 1 kg / portion of food rescued
    const estimatedCo2SavedKg = Math.round(totalPortionsDistributed * 2.1);

    return {
      totalDonationsPosted: this.data.donations.length,
      completedDonations: completedDonations.length,
      availableDonationsCount: availableDonations.length,
      totalPortionsDistributed,
      activeProviders,
      participatingNgos,
      completedAssignments,
      estimatedCo2SavedKg,
      categoryCounts,
    };
  }
}

export const db = new Database();
