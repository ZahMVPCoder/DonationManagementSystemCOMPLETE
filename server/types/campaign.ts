export interface CreateCampaignRequest {
  name: string;
  description?: string;
  goal: number;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate?: string; // ISO 8601 format (YYYY-MM-DD)
  status?: 'active' | 'completed' | 'paused'; // default: 'active'
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  goal?: number;
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  status?: 'active' | 'completed' | 'paused';
}

export interface DonationSummary {
  id: string;
  amount: number;
  date: string;
  method: string;
  donorId: string;
  thanked: boolean;
}

export interface CampaignResponse {
  id: string;
  name: string;
  description: string | null;
  goal: number;
  raised: number; // Calculated dynamically from donations
  startDate: string;
  endDate: string | null;
  status: string;
  donationCount: number;
  donations?: DonationSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignWithDonations extends CampaignResponse {
  donations: DonationSummary[];
}
