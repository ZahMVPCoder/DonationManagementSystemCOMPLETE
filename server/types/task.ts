export interface CreateTaskRequest {
  type: string; // 'thank-you', 'reminder', 'follow-up', custom
  description: string;
  donorId: string;
  dueDate?: string; // ISO 8601 format (YYYY-MM-DD)
  priority?: 'low' | 'medium' | 'high'; // default: 'medium'
}

export interface UpdateTaskRequest {
  type?: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}

export interface TaskResponse {
  id: string;
  type: string;
  description: string;
  donorId: string;
  donorName?: string; // From related donor
  dueDate: string | null;
  priority: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskWithDonor extends TaskResponse {
  donorName: string;
  donorEmail?: string;
}
