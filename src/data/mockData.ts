export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'lapsed' | 'new';
  totalGiving: number;
  lastGiftDate: string;
  lastGiftAmount: number;
  donationCount: number;
  notes: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  date: string;
  method: 'credit_card' | 'check' | 'cash' | 'bank_transfer';
  campaignId: string | null;
  campaignName: string | null;
  recurring: boolean;
  thanked: boolean;
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
}

export interface Task {
  id: string;
  type: 'follow_up' | 'thank_you' | 'call' | 'email';
  donorId: string;
  donorName: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export const mockDonors: Donor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    status: 'active',
    totalGiving: 15000,
    lastGiftDate: '2025-12-15',
    lastGiftAmount: 500,
    donationCount: 12,
    notes: 'Major donor. Interested in education programs.',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    status: 'active',
    totalGiving: 8500,
    lastGiftDate: '2026-01-02',
    lastGiftAmount: 250,
    donationCount: 8,
    notes: 'Monthly recurring donor.',
    createdAt: '2023-06-20',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 345-6789',
    status: 'new',
    totalGiving: 1000,
    lastGiftDate: '2026-01-05',
    lastGiftAmount: 1000,
    donationCount: 1,
    notes: 'First-time donor from holiday campaign.',
    createdAt: '2026-01-05',
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.t@email.com',
    phone: '(555) 456-7890',
    status: 'lapsed',
    totalGiving: 3200,
    lastGiftDate: '2024-08-10',
    lastGiftAmount: 200,
    donationCount: 6,
    notes: 'Last donation over 1 year ago. Needs follow-up.',
    createdAt: '2022-03-12',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '(555) 567-8901',
    status: 'active',
    totalGiving: 22000,
    lastGiftDate: '2025-12-28',
    lastGiftAmount: 2000,
    donationCount: 15,
    notes: 'Legacy donor. Member of planned giving circle.',
    createdAt: '2020-05-01',
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '(555) 678-9012',
    status: 'active',
    totalGiving: 5400,
    lastGiftDate: '2025-11-30',
    lastGiftAmount: 300,
    donationCount: 9,
    notes: 'Prefers check donations.',
    createdAt: '2022-09-15',
  },
];

export const mockDonations: Donation[] = [
  {
    id: '1',
    donorId: '2',
    donorName: 'Michael Chen',
    amount: 250,
    date: '2026-01-02',
    method: 'credit_card',
    campaignId: '1',
    campaignName: 'Winter Appeal 2025',
    recurring: true,
    thanked: true,
    notes: 'Monthly recurring donation',
  },
  {
    id: '2',
    donorId: '3',
    donorName: 'Emily Rodriguez',
    amount: 1000,
    date: '2026-01-05',
    method: 'bank_transfer',
    campaignId: '1',
    campaignName: 'Winter Appeal 2025',
    recurring: false,
    thanked: false,
    notes: 'First donation - needs thank you call',
  },
  {
    id: '3',
    donorId: '1',
    donorName: 'Sarah Johnson',
    amount: 500,
    date: '2025-12-15',
    method: 'credit_card',
    campaignId: '1',
    campaignName: 'Winter Appeal 2025',
    recurring: false,
    thanked: true,
    notes: '',
  },
  {
    id: '4',
    donorId: '5',
    donorName: 'Lisa Anderson',
    amount: 2000,
    date: '2025-12-28',
    method: 'check',
    campaignId: '1',
    campaignName: 'Winter Appeal 2025',
    recurring: false,
    thanked: true,
    notes: 'Year-end contribution',
  },
  {
    id: '5',
    donorId: '6',
    donorName: 'James Wilson',
    amount: 300,
    date: '2025-11-30',
    method: 'check',
    campaignId: null,
    campaignName: null,
    recurring: false,
    thanked: true,
    notes: 'General fund',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Winter Appeal 2025',
    goal: 50000,
    raised: 38750,
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    status: 'active',
    description: 'Annual winter fundraising campaign to support our community programs.',
  },
  {
    id: '2',
    name: 'Spring Gala 2026',
    goal: 75000,
    raised: 0,
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    status: 'upcoming',
    description: 'Annual gala event and silent auction.',
  },
  {
    id: '3',
    name: 'Summer Education Fund',
    goal: 30000,
    raised: 32500,
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'completed',
    description: 'Scholarship fund for summer educational programs.',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    type: 'thank_you',
    donorId: '3',
    donorName: 'Emily Rodriguez',
    description: 'Send thank you letter for first donation',
    dueDate: '2026-01-08',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    type: 'follow_up',
    donorId: '4',
    donorName: 'David Thompson',
    description: 'Follow-up call - lapsed donor outreach',
    dueDate: '2026-01-10',
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    type: 'call',
    donorId: '1',
    donorName: 'Sarah Johnson',
    description: 'Quarterly update call with major donor',
    dueDate: '2026-01-15',
    priority: 'high',
    completed: false,
  },
  {
    id: '4',
    type: 'email',
    donorId: '5',
    donorName: 'Lisa Anderson',
    description: 'Send planned giving information packet',
    dueDate: '2026-01-12',
    priority: 'medium',
    completed: false,
  },
  {
    id: '5',
    type: 'thank_you',
    donorId: '2',
    donorName: 'Michael Chen',
    description: 'Monthly recurring donor appreciation email',
    dueDate: '2026-01-07',
    priority: 'low',
    completed: true,
  },
];
