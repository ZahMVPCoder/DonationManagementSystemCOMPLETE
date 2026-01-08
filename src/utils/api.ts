/**
 * API Utility Module
 * 
 * Provides centralized HTTP request handling with automatic JWT authentication,
 * error handling, and token refresh logic.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get the JWT token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Store JWT token in localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

/**
 * Clear JWT token from localStorage
 */
export function clearToken(): void {
  localStorage.removeItem('token');
}

/**
 * Common fetch wrapper with auth header and error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      clearToken();
      // Dispatch custom event for AuthContext to listen to
      window.dispatchEvent(new CustomEvent('unauthorized'));
      throw new Error('Unauthorized - please login again');
    }

    // Handle other error status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `HTTP Error: ${response.status}`
      );
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    // Parse and return response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

/**
 * GET request
 */
export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH request
 */
export async function patch<T>(
  endpoint: string,
  data: Record<string, any>
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE' });
}

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Register new user
   * POST /auth/register
   */
  register: (email: string, password: string) =>
    post<{ token: string; user: { id: string; email: string } }>(
      '/auth/register',
      { email, password }
    ),

  /**
   * Login user
   * POST /auth/login
   */
  login: (email: string, password: string) =>
    post<{ token: string; user: { id: string; email: string } }>(
      '/auth/login',
      { email, password }
    ),

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: () => post<{ message: string }>('/auth/logout', {}),
};

/**
 * Donor API endpoints
 */
export const donorApi = {
  /**
   * Get all donors with search/filter
   * GET /donors?search=&status=&limit=&offset=
   */
  list: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return get<{
      donors: Array<any>;
      total: number;
      limit: number;
      offset: number;
    }>(`/donors${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get single donor
   * GET /donors/:id
   */
  get: (id: string) => get<any>(`/donors/${id}`),

  /**
   * Create donor
   * POST /donors
   */
  create: (data: Record<string, any>) => post<any>('/donors', data),

  /**
   * Update donor
   * PATCH /donors/:id
   */
  update: (id: string, data: Record<string, any>) =>
    patch<any>(`/donors/${id}`, data),

  /**
   * Delete donor
   * DELETE /donors/:id
   */
  delete: (id: string) => del<{ message: string }>(`/donors/${id}`),
};

/**
 * Donation API endpoints
 */
export const donationApi = {
  /**
   * Get all donations with filters
   * GET /donations?donorId=&campaignId=&startDate=&endDate=&limit=&offset=
   */
  list: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return get<{
      donations: Array<any>;
      total: number;
      limit: number;
      offset: number;
    }>(`/donations${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get single donation
   * GET /donations/:id
   */
  get: (id: string) => get<any>(`/donations/${id}`),

  /**
   * Create donation
   * POST /donations
   */
  create: (data: Record<string, any>) => post<any>('/donations', data),

  /**
   * Update donation
   * PATCH /donations/:id
   */
  update: (id: string, data: Record<string, any>) =>
    patch<any>(`/donations/${id}`, data),

  /**
   * Delete donation
   * DELETE /donations/:id
   */
  delete: (id: string) => del<{ message: string }>(`/donations/${id}`),
};

/**
 * Campaign API endpoints
 */
export const campaignApi = {
  /**
   * Get all campaigns with filters
   * GET /campaigns?status=&limit=&offset=
   */
  list: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return get<{
      campaigns: Array<any>;
      total: number;
      limit: number;
      offset: number;
    }>(`/campaigns${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get single campaign
   * GET /campaigns/:id
   */
  get: (id: string) => get<any>(`/campaigns/${id}`),

  /**
   * Create campaign
   * POST /campaigns
   */
  create: (data: Record<string, any>) => post<any>('/campaigns', data),

  /**
   * Update campaign
   * PATCH /campaigns/:id
   */
  update: (id: string, data: Record<string, any>) =>
    patch<any>(`/campaigns/${id}`, data),
};

/**
 * Task API endpoints
 */
export const taskApi = {
  /**
   * Get all tasks with filters
   * GET /tasks?completed=&priority=&donorId=&limit=&offset=
   */
  list: (params?: Record<string, any>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    return get<{
      tasks: Array<any>;
      total: number;
      limit: number;
      offset: number;
    }>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get single task
   * GET /tasks/:id
   */
  get: (id: string) => get<any>(`/tasks/${id}`),

  /**
   * Create task
   * POST /tasks
   */
  create: (data: Record<string, any>) => post<any>('/tasks', data),

  /**
   * Update task
   * PATCH /tasks/:id
   */
  update: (id: string, data: Record<string, any>) =>
    patch<any>(`/tasks/${id}`, data),

  /**
   * Delete task
   * DELETE /tasks/:id
   */
  delete: (id: string) => del<{ message: string }>(`/tasks/${id}`),
};

export default {
  get,
  post,
  patch,
  del,
  authApi,
  donorApi,
  donationApi,
  campaignApi,
  taskApi,
  getToken,
  setToken,
  clearToken,
};
