# Frontend API Integration - Quick Reference

## 🔌 Import API Module

```typescript
import { authApi, donorApi, donationApi, campaignApi, taskApi } from '../utils/api';
```

---

## 👤 Authentication

### Login
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    navigate('/dashboard');
  } else {
    showError(result.error);
  }
};
```

### Logout
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout(); // Automatically redirects to login
};
```

### Check Auth Status
```typescript
const { user, isAuthenticated } = useAuth();

if (isAuthenticated) {
  // Show dashboard
} else {
  // Show login
}
```

---

## 👥 Donor Management

### List Donors
```typescript
// Get all donors
const { donors, total } = await donorApi.list();

// With filters
const result = await donorApi.list({
  search: 'John Doe',        // Search by name/email
  status: 'active',          // Filter: active|lapsed|new
  limit: 10,                 // Pagination
  offset: 0
});
```

### Get Single Donor
```typescript
const donor = await donorApi.get('donor_123');
```

### Create Donor
```typescript
const newDonor = await donorApi.create({
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '555-1234',
  status: 'new',
  notes: 'Initial contact'
});
```

### Update Donor
```typescript
const updated = await donorApi.update('donor_123', {
  status: 'active',
  notes: 'Interested in Q2 campaign'
});
```

### Delete Donor
```typescript
await donorApi.delete('donor_123');
```

### Complete Example
```typescript
import { useState, useEffect } from 'react';
import { donorApi } from '../utils/api';

export function DonorList() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const data = await donorApi.list({ limit: 20 });
        setDonors(data.donors);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {donors.map(donor => (
        <li key={donor.id}>{donor.name} - {donor.email}</li>
      ))}
    </ul>
  );
}
```

---

## 💰 Donations

### List Donations
```typescript
// Get all donations
const { donations, total } = await donationApi.list();

// Filter by donor
const result = await donationApi.list({
  donorId: 'donor_123'
});

// Filter by campaign
const result = await donationApi.list({
  campaignId: 'campaign_456'
});

// Filter by date range
const result = await donationApi.list({
  startDate: '2026-01-01',
  endDate: '2026-01-31'
});
```

### Get Single Donation
```typescript
const donation = await donationApi.get('donation_789');
```

### Create Donation
```typescript
const newDonation = await donationApi.create({
  amount: 1000,
  date: '2026-01-07',
  method: 'credit_card',  // credit_card|bank_transfer|cash|check
  donorId: 'donor_123',
  campaignId: 'campaign_456'  // Optional
});
// Returns: { donation, taskCreated: true, thankYouTaskId: '...' }
```

### Update Donation
```typescript
const updated = await donationApi.update('donation_789', {
  amount: 1500,
  method: 'bank_transfer'
});
```

### Delete Donation
```typescript
await donationApi.delete('donation_789');
```

---

## 📢 Campaigns

### List Campaigns
```typescript
// Get all campaigns
const { campaigns, total } = await campaignApi.list();

// Filter by status
const result = await campaignApi.list({
  status: 'active'  // active|completed|paused
});
```

### Get Single Campaign
```typescript
const campaign = await campaignApi.get('campaign_456');
// Returns: { id, name, description, goal, raised, status, ... }
```

### Create Campaign
```typescript
const newCampaign = await campaignApi.create({
  name: 'Building Fund 2026',
  description: 'Help us expand facilities',
  goal: 50000,
  status: 'active'
});
```

### Update Campaign
```typescript
const updated = await campaignApi.update('campaign_456', {
  status: 'completed',
  name: 'Building Fund 2026 - CLOSED'
});
```

---

## ✅ Tasks

### List Tasks
```typescript
// Get all tasks
const { tasks, total } = await taskApi.list();

// Get pending tasks only
const result = await taskApi.list({
  completed: false
});

// Get high priority tasks
const result = await taskApi.list({
  priority: 'high'  // low|medium|high
});

// Get tasks for specific donor
const result = await taskApi.list({
  donorId: 'donor_123'
});

// Combine filters
const result = await taskApi.list({
  completed: false,
  priority: 'high',
  donorId: 'donor_123',
  limit: 10
});
```

### Get Single Task
```typescript
const task = await taskApi.get('task_001');
// Returns: { id, type, description, donorId, donorName, dueDate, priority, completed, ... }
```

### Create Task
```typescript
const newTask = await taskApi.create({
  type: 'follow-up',
  description: 'Check on campaign interest',
  donorId: 'donor_123',
  dueDate: '2026-01-14',
  priority: 'medium'  // low|medium|high
});
```

### Mark Task Complete
```typescript
await taskApi.update('task_001', {
  completed: true
});
```

### Update Task
```typescript
await taskApi.update('task_001', {
  priority: 'high',
  dueDate: '2026-01-10'
});
```

### Delete Task
```typescript
await taskApi.delete('task_001');
```

---

## 🎯 Common Patterns

### Fetch Data on Mount
```typescript
useEffect(() => {
  const fetch = async () => {
    try {
      const data = await donorApi.list();
      setDonors(data.donors);
    } catch (err) {
      setError(err.message);
    }
  };
  fetch();
}, []);
```

### Form Submission
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const result = await donorApi.create(formData);
    // Success
    setFormData({});
    fetchDonors(); // Refresh list
  } catch (err: any) {
    setError(err.data?.message || 'Failed to save');
  } finally {
    setLoading(false);
  }
};
```

### Delete with Confirmation
```typescript
const handleDelete = async (id) => {
  if (window.confirm('Are you sure?')) {
    try {
      await donorApi.delete(id);
      fetchDonors(); // Refresh
    } catch (err: any) {
      setError(err.message);
    }
  }
};
```

### Search/Filter
```typescript
const [search, setSearch] = useState('');

const handleSearch = async (e) => {
  const value = e.target.value;
  setSearch(value);
  
  try {
    const result = await donorApi.list({ search: value });
    setDonors(result.donors);
  } catch (err) {
    setError(err.message);
  }
};

return (
  <>
    <input 
      value={search}
      onChange={handleSearch}
      placeholder="Search donors..."
    />
    <DonorList donors={donors} />
  </>
);
```

---

## ⚠️ Error Handling

### API Errors Have Structure
```typescript
try {
  await donorApi.create(data);
} catch (err: any) {
  // err.status - HTTP status code (400, 404, 500, etc.)
  // err.message - Error message
  // err.data - Response body with details
  
  if (err.status === 404) {
    setError('Donor not found');
  } else if (err.status === 400) {
    setError(err.data?.message || 'Invalid data');
  } else {
    setError('Something went wrong');
  }
}
```

### 401 Unauthorized
```typescript
// Automatically handled by API utility:
// 1. Token cleared
// 2. 'unauthorized' event fired
// 3. AuthContext catches it
// 4. Redirects to /login
// No need to handle manually!
```

---

## 🔍 Debug Tips

### Check Token
```javascript
// In browser console
localStorage.getItem('token')   // View JWT token
localStorage.getItem('user')    // View user data
```

### Monitor Network
1. Open DevTools → Network tab
2. Filter by XHR/Fetch
3. Click API call
4. Headers tab shows: `Authorization: Bearer {token}`
5. Response tab shows API response

### Monitor API Logs
```javascript
// API utility logs to console
// Example: API Error [GET /donors]: Error: Not Found
```

---

## 📌 Important Notes

### Token Auto-Injection
- API utility automatically adds `Authorization: Bearer {token}` header
- No manual header setup needed
- Works for all authenticated endpoints

### 401 Auto-Redirect
- Invalid/expired token triggers logout + redirect
- Happens automatically, no component code needed
- User sees clean redirect to login

### Parameter Encoding
- API utility handles URL encoding
- Just pass objects to `list()` methods
- Example: `donorApi.list({ search: 'John Doe' })`

### Pagination
- Default limit: 10
- Max limit: 100 (enforced by API)
- Example: `await donorApi.list({ limit: 20, offset: 20 })`

---

## 🎓 Example: Complete Component

```typescript
import { useState, useEffect } from 'react';
import { donorApi } from '../utils/api';

export function DonorManager() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await donorApi.list({ 
        search, 
        limit: 20 
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <input 
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearch}
      />
      
      <ul>
        {donors.map(donor => (
          <li key={donor.id}>
            <span>{donor.name} ({donor.email})</span>
            <button onClick={() => handleDelete(donor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## ✅ Ready to Go!

All API endpoints are pre-wired and ready to use in your components. Just:

1. Import the API module
2. Call the functions
3. Handle errors
4. Update state

**Start integrating components!** 🚀
