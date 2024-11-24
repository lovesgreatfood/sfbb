export interface User {
  id: string;
  email: string;
  businessName: string;
  role: 'admin' | 'staff';
}

export interface Business {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  hacppDocumentUrl?: string;
}

export interface Temperature {
  id: string;
  businessId: string;
  date: Date;
  itemName: string;
  temperature: number;
  checkedBy: string;
  location: string;
  type: 'fridge' | 'freezer' | 'cooking' | 'hot-holding';
}

export interface Cleaning {
  id: string;
  businessId: string;
  date: Date;
  area: string;
  completedBy: string;
  verified: boolean;
  verifiedBy?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  products: string[];
  certifications: string[];
}

export interface DeliveryRecord {
  id: string;
  businessId: string;
  date: Date;
  supplierId: string;
  temperature?: number;
  acceptedBy: string;
  items: {
    name: string;
    quantity: number;
    temperature?: number;
  }[];
  notes?: string;
}

export interface TrainingRecord {
  id: string;
  businessId: string;
  staffId: string;
  trainingType: 'food-safety' | 'haccp' | 'allergens' | 'cleaning' | 'other';
  completionDate: Date;
  expiryDate?: Date;
  certificateUrl?: string;
  notes?: string;
  verifiedBy?: string;
  status: 'completed' | 'expired' | 'upcoming';
}

export interface Staff {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: string;
  startDate: Date;
  phone?: string;
  emergencyContact?: string;
  foodHygieneLevel?: number;
  active: boolean;
}</content>