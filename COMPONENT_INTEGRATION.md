# Component Integration Guide

## Overview

Step-by-step instructions to connect each component to the backend API endpoints.

---

## 1. DonorList Component

### Current State
- Shows mock donor data
- No API integration

### Integration Steps

```typescript
import { useState, useEffect } from 'react';
import { donorApi } from '../utils/api';

export function DonorList() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  // Fetch donors when component mounts or filters change
  useEffect(() => {
    fetchDonors();
  }, [search, status, currentPage]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const result = await donorApi.list({
        search: search || undefined,
        status: status || undefined,
        limit,
        offset
      });
      setDonors(result.donors);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donor?')) return;
    
    try {
      await donorApi.delete(id);
      await fetchDonors();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Render UI with donors, search, status filter, delete buttons
  // Update API calls when implementing
}
```

**Key Changes:**
1. Import `donorApi` from utils
2. Use `useEffect` to fetch on mount
3. Call `donorApi.list()` instead of mock data
4. Add filters to API call
5. Add delete handler

---

## 2. DonorForm / DonorProfile Component

### Current State
- Form fields for creating/editing
- No API calls

### Integration Steps

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorApi } from '../utils/api';

export function DonorForm({ donorId }: { donorId?: string }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If editing, fetch existing donor
  useEffect(() => {
    if (donorId) {
      fetchDonor();
    }
  }, [donorId]);

  const fetchDonor = async () => {
    try {
      const donor = await donorApi.get(donorId!);
      setFormData(donor);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      if (donorId) {
        // Update existing
        await donorApi.update(donorId, formData);
      } else {
        // Create new
        await donorApi.create(formData);
      }
      
      navigate('/donors');
    } catch (err: any) {
      setError(err.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render form with fields and submit button
  // Update API calls when implementing
}
```

**Key Changes:**
1. Fetch donor data on mount if editing
2. Call `donorApi.update()` for edit
3. Call `donorApi.create()` for new
4. Handle errors from API
5. Redirect on success

---

## 3. DonationForm Component

### Current State
- Form fields for donations
- No API integration

### Integration Steps

```typescript
import { useState, useEffect } from 'react';
import { donationApi, donorApi, campaignApi } from '../utils/api';

export function DonationForm() {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'credit_card',
    donorId: '',
    campaignId: ''
  });
  const [donors, setDonors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch donors and campaigns
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [donorResult, campaignResult] = await Promise.all([
        donorApi.list({ limit: 100 }),
        campaignApi.list({ limit: 100 })
      ]);
      setDonors(donorResult.donors);
      setCampaigns(campaignResult.campaigns);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const result = await donationApi.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Success message
      // Show thank-you task created info
      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'credit_card',
        donorId: '',
        campaignId: ''
      });
    } catch (err: any) {
      setError(err.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render form with donor/campaign dropdowns
  // Update API calls when implementing
}
```

**Key Changes:**
1. Fetch donors and campaigns on mount
2. Populate dropdowns
3. Parse amount as number
4. Call `donationApi.create()`
5. Handle auto-created thank-you task response
6. Reset form on success

---

## 4. Campaign Component

### Current State
- Campaign list/detail views
- No API integration

### Integration Steps

```typescript
import { useState, useEffect } from 'react';
import { campaignApi } from '../utils/api';

export function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, [status]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const result = await campaignApi.list({
        status: status || undefined,
        limit: 20
      });
      setCampaigns(result.campaigns);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render campaign cards showing:
  // - Campaign name, description
  // - Progress bar: raised / goal
  // - Status badge
  // - Edit/Delete buttons (for admin)
  
  // Calculate progress: (raised / goal) * 100
}

export function CampaignDetail({ campaignId }: { campaignId: string }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const data = await campaignApi.get(campaignId);
      setCampaign(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render campaign details with:
  // - Full description
  // - Progress tracking
  // - Donations list (call donationApi.list({ campaignId }))
  // - Edit form
}
```

**Key Changes:**
1. Fetch campaigns with status filter
2. Calculate and display progress percentage
3. Show raised amount from API
4. Fetch campaign details on mount
5. Update campaign when form submitted

---

## 5. TasksView Component

### Current State
- Task list view
- No API integration

### Integration Steps

```typescript
import { useState, useEffect } from 'react';
import { taskApi } from '../utils/api';

export function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters
  const [showCompleted, setShowCompleted] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [donorFilter, setDonorFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [showCompleted, priorityFilter, donorFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await taskApi.list({
        completed: showCompleted,
        priority: priorityFilter || undefined,
        donorId: donorFilter || undefined,
        limit: 50
      });
      setTasks(result.tasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      await taskApi.update(taskId, { completed: true });
      await fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete task?')) return;
    
    try {
      await taskApi.delete(taskId);
      await fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Render task list showing:
  // - Task type, description
  // - Due date (highlight if overdue)
  // - Priority badge (color-coded)
  // - Donor name (if available)
  // - Completion checkbox / Mark Complete button
  // - Delete button
  
  // Tasks are auto-sorted by completion status, due date, priority
}
```

**Key Changes:**
1. Fetch tasks with multiple filters
2. Handle mark complete action
3. Handle delete action
4. Filter by pending/completed
5. Filter by priority level
6. Filter by donor
7. Show donor information from API

---

## 6. Dashboard Component

### Current State
- Dashboard layout
- Mock statistics

### Integration Steps

```typescript
import { useState, useEffect } from 'react';
import { donorApi, donationApi, campaignApi, taskApi } from '../utils/api';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeDonors: 0,
    totalDonations: 0,
    totalRaised: 0,
    activeCampaigns: 0,
    pendingTasks: 0
  });
  
  const [recentDonations, setRecentDonations] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [donorsResult, donationsResult, campaignsResult, tasksResult] = 
        await Promise.all([
          donorApi.list({ limit: 1 }),  // Just for count
          donationApi.list({ limit: 1 }),
          campaignApi.list({ limit: 1 }),
          taskApi.list({ completed: false, limit: 5 })  // Recent pending tasks
        ]);

      // Get recent donations
      const recent = await donationApi.list({ 
        limit: 5,
        offset: 0 
      });

      setStats({
        totalDonors: donorsResult.total,
        activeDonors: donorsResult.total,  // Can improve with specific count
        totalDonations: donationsResult.total,
        totalRaised: donationsResult.donations?.reduce((sum, d) => sum + d.amount, 0) || 0,
        activeCampaigns: campaignsResult.total,
        pendingTasks: tasksResult.total
      });

      setRecentDonations(recent.donations);
      setPendingTasks(tasksResult.tasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render dashboard with:
  // - Stats cards (total donors, donations, raised amount, etc.)
  // - Recent donations list
  // - Pending tasks list
  // - Charts/graphs (optional)
}
```

**Key Changes:**
1. Fetch stats from multiple endpoints
2. Calculate total raised from donations
3. Show recent donations
4. Show pending tasks
5. Use parallel fetch with Promise.all()

---

## 7. DonorProfile Component

### Current State
- Profile view layout
- Mock data

### Integration Steps

```typescript
import { useState, useEffect } from 'react';
import { donorApi, donationApi } from '../utils/api';
import { useParams } from 'react-router-dom';

export function DonorProfile() {
  const { donorId } = useParams();
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (donorId) {
      fetchDonorData();
    }
  }, [donorId]);

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      
      const [donorData, donationsData] = await Promise.all([
        donorApi.get(donorId!),
        donationApi.list({ donorId, limit: 50 })
      ]);

      setDonor(donorData);
      setDonations(donationsData.donations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!donor) return <div>Loading...</div>;

  // Render profile showing:
  // - Donor name, email, phone
  // - Status badge
  // - Notes/history
  // - Total donations, average gift
  // - Donation history table
  // - Add donation button
  // - Edit button
}
```

**Key Changes:**
1. Fetch donor details
2. Fetch donor's donations
3. Calculate stats from donations
4. Show donation history
5. Link to edit form

---

## 8. ProtectedRoute Component

### Current State
- Checks user from AuthContext
- No additional changes needed

### Verify Implementation

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

**Status:** ✅ Already works with new AuthContext

---

## Integration Checklist

- [ ] DonorList - Fetch and display donors
- [ ] DonorForm - Create and update donors
- [ ] DonationForm - Create donations with donor/campaign dropdowns
- [ ] CampaignPage - List campaigns with progress
- [ ] CampaignDetail - Show campaign details and donations
- [ ] TasksView - List and manage tasks with filters
- [ ] Dashboard - Show statistics and recent data
- [ ] DonorProfile - Show donor details and history
- [ ] Error handling in all components
- [ ] Loading states in all components
- [ ] Success notifications

---

## Testing Components

### Manual Testing Flow

1. **Start Server**
   ```bash
   npm run server
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

3. **Register New User**
   - Go to Login page
   - Register with email + password
   - Should redirect to Dashboard

4. **Test Donor Flow**
   - Go to Donors
   - Should load from API
   - Create new donor
   - Edit donor
   - Delete donor

5. **Test Donation Flow**
   - Go to Donations/Create
   - Dropdown should populate from API
   - Submit donation
   - Should see auto-created task

6. **Test Tasks**
   - Go to Tasks
   - See auto-created thank-you task
   - Mark task complete
   - Filter tasks

7. **Check Network Tab**
   - All requests have `Authorization: Bearer` header
   - Status 200 for successful calls
   - Proper error status codes

---

## Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution:** Check localStorage for token
```javascript
// In browser console
localStorage.getItem('token')  // Should exist
localStorage.getItem('user')   // Should exist
```

### Issue: CORS Error
**Solution:** Ensure backend is running and API_URL is correct
```env
VITE_API_URL=http://localhost:5000/api
```

### Issue: Blank dropdown
**Solution:** Check network tab - ensure API returns data
```typescript
// Add error logging
console.log('Donors:', result.donors);
console.log('Campaigns:', result.campaigns);
```

### Issue: Changes don't show
**Solution:** Call fetch function after mutations
```typescript
await donorApi.create(data);
await fetchDonors(); // Refresh list
```

---

## Next Steps

1. Pick one component to integrate first
2. Test API calls in browser console
3. Verify responses in Network tab
4. Implement loading/error states
5. Add success notifications
6. Move to next component

**Start with DonorList for simplest integration!** 🚀
