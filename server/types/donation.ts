// Types for Donation operations
export interface CreateDonationRequest {
  amount: number;
  date: string; // ISO date string
  method: string; // credit card, bank transfer, cash, etc.
  donorId: number;
  campaignId?: number;
  recurring?: boolean;
  notes?: string;
}

export interface UpdateDonationRequest {
  amount?: number;
  date?: string;
  method?: string;
  campaignId?: number;
  recurring?: boolean;
  thanked?: boolean;
  notes?: string;
}

export interface DonationResponse {
  id: number;
  amount: number;
  date: Date;
  method: string;
  recurring: boolean;
  thanked: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  donorId: number;
  donor?: {
    id: number;
    name: string;
    email: string;
  };
  campaignId?: number;
  campaign?: {
    id: number;
    name: string;
    goal: number;
    raised: number;
  };
}

export interface TaskCreatedResponse {
  taskId: number;
  type: string;
  description: string;
  dueDate: Date;
}
