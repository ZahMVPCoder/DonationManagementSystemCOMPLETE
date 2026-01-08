// Types for Donor operations
export interface CreateDonorRequest {
  name: string;
  email: string;
  phone?: string;
  status?: 'active' | 'lapsed' | 'new';
  notes?: string;
}

export interface UpdateDonorRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'lapsed' | 'new';
  notes?: string;
}

export interface DonorWithDonations {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  donations: Array<{
    id: number;
    amount: number;
    date: Date;
    method: string;
    recurring: boolean;
    thanked: boolean;
    notes?: string;
  }>;
  _count?: {
    donations: number;
  };
}
