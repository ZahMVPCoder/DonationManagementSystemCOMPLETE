# Testing Checklist for DonorHub

Complete this checklist to verify everything works before deploying to Vercel.

## 1. Local Development Environment ✅

### Start the app:
```bash
npm run dev:full
```

You should see:
- ✅ **Terminal 1:** "Server is running on http://localhost:5000"
- ✅ **Terminal 2:** "Local: http://localhost:5173"

### Browser Check:
- ✅ Visit `http://localhost:5173` in your browser
- ✅ Should see Login page with DonorHub logo
- ✅ No errors in browser console (press F12)

---

## 2. Database Connectivity 🗄️

### Test Neon Connection:
```bash
# Check if Prisma can connect to Neon
npx prisma studio
```

Expected:
- ✅ Prisma Studio opens in browser at `http://localhost:5555`
- ✅ Can see all tables: User, Donor, Donation, Campaign, Task
- ✅ Can see seeded data (1 user, 6 donors, 5 donations, etc.)

If it fails:
- Verify `DATABASE_URL` in `.env` is correct
- Check Neon console that database exists
- Verify connection string has `?sslmode=require`

---

## 3. Authentication Flow 🔐

### Test Login (Success Case):
1. Go to `http://localhost:5173/login`
2. Enter credentials:
   - **Email:** `test@donorhub.com`
   - **Password:** `password123`
3. Click "Sign In"

Expected:
- ✅ Form submits without error
- ✅ Redirects to `/dashboard`
- ✅ Sees Dashboard with metrics
- ✅ Token stored in localStorage (DevTools → Application → Local Storage)

### Test Login (Failure Case):
1. Enter wrong credentials (e.g., `wrong@email.com`)
2. Click "Sign In"

Expected:
- ✅ Shows error message: "Invalid email or password"
- ✅ Stays on login page
- ✅ No token created

### Test Already Logged In:
1. Login successfully
2. Visit `/login`

Expected:
- ✅ Automatically redirects to `/dashboard`
- ✅ Doesn't show login form

---

## 4. API Endpoints 📡

### Test Backend Health Check:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-01-07T..."
}
```

### Test Auth Endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donorhub.com","password":"password123"}'
```

Expected:
- ✅ Returns JWT token
- ✅ Returns user data

### Test Protected Endpoint (Donors):
```bash
# First, login to get token (from previous command)
# Replace TOKEN with actual token from login response

curl -X GET http://localhost:5000/api/donors \
  -H "Authorization: Bearer TOKEN"
```

Expected:
- ✅ Returns list of 6 donors
- ✅ Each donor has: id, name, email, phone, status

---

## 5. Frontend Features 🎨

### Test Dashboard:
After login, verify:
- ✅ **Metrics Cards** show:
  - Total Raised: $4,050
  - New Donors: 1
  - Active Donors: 4
  - Lapsed Donors: 1
- ✅ **Campaign Progress** shows "Winter Appeal 2025"
- ✅ **Recent Donations** shows 5 donations
- ✅ **Upcoming Tasks** shows 5 tasks

### Test Navigation:
- ✅ Click "Donors" → Shows 6 donors
- ✅ Click "Tasks" → Shows 5 tasks
- ✅ Click on a donor → Shows donor details page
- ✅ Click "View All Donors" → Shows donors list

### Test Logout:
- ✅ Click logout button
- ✅ Redirects to `/login`
- ✅ Token removed from localStorage
- ✅ Can't access `/dashboard` (redirects to login)

---

## 6. Error Handling 🚨

### Test Network Error:
1. Stop the backend server (Ctrl+C in backend terminal)
2. Try to login

Expected:
- ✅ Shows error message about connection failure
- ✅ Doesn't crash the app

### Test Invalid Route:
1. Visit `http://localhost:5173/invalid-route`

Expected:
- ✅ Redirects to `/login` (catch-all route)

### Test API Error:
1. Login successfully
2. Open DevTools Network tab
3. Try to create a new donor (if available)

Expected:
- ✅ Can see API request in Network tab
- ✅ Response shows proper error format

---

## 7. Browser DevTools Verification 🔍

### Console Tab (F12):
- ✅ No red errors
- ✅ No unhandled promise rejections
- ✅ Warnings are OK (CSS-in-JS libraries might warn)

### Network Tab:
- ✅ API calls to `http://localhost:5000/api/*`
- ✅ Responses are 200/201 (success) or 401 (unauthorized as expected)
- ✅ No 500 errors

### Application Tab:
- ✅ localStorage has `token` after login
- ✅ localStorage has `user` with email and id
- ✅ localStorage cleared after logout

### Performance Tab:
- ✅ Page loads in < 2 seconds
- ✅ API calls complete in < 500ms

---

## 8. Full User Journey Test 🎯

Complete this full flow without errors:

```
1. Visit http://localhost:5173
   ↓
2. Redirects to /login
   ↓
3. See login form with DonorHub branding
   ↓
4. Login with test@donorhub.com / password123
   ↓
5. Redirects to /dashboard
   ↓
6. See dashboard with metrics (Total Raised: $4,050)
   ↓
7. Click "Donors" link
   ↓
8. See list of 6 donors
   ↓
9. Click on Sarah Johnson donor
   ↓
10. See donor profile page
   ↓
11. Click "Back to Dashboard"
   ↓
12. See dashboard again
   ↓
13. Click "Tasks"
   ↓
14. See 5 tasks with different priorities
   ↓
15. Click logout
   ↓
16. Redirected to login page
   ↓
17. Try to visit /dashboard directly
   ↓
18. Redirected back to login (protected!)
   ✅ SUCCESS!
```

---

## 9. Quick Test Script 🚀

Run this to test all API endpoints at once:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "1. Testing health check..."
curl $BASE_URL/health

echo -e "\n2. Testing login..."
TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donorhub.com","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

echo -e "\n3. Testing donors list..."
curl -s -X GET $BASE_URL/donors \
  -H "Authorization: Bearer $TOKEN" | head -c 200

echo -e "\n4. Testing campaigns list..."
curl -s -X GET $BASE_URL/campaigns \
  -H "Authorization: Bearer $TOKEN" | head -c 200

echo -e "\n5. Testing tasks list..."
curl -s -X GET $BASE_URL/tasks \
  -H "Authorization: Bearer $TOKEN" | head -c 200

echo -e "\n✅ All endpoints tested!"
```

---

## 10. Common Issues & Fixes 🔧

| Issue | Fix |
|-------|-----|
| Blank white screen on localhost:5173 | Check you're visiting `:5173` not `:3000` or `:5000` |
| "Cannot reach database" | Verify DATABASE_URL in .env, check Neon is active |
| Login fails | Try deleting localStorage: `localStorage.clear()` in console |
| Donor list is empty | Run `npm run prisma:seed` to populate test data |
| API returns 401 | Token might be expired, try logging out and back in |
| Frontend can't reach backend | Make sure backend is running: `npm run dev:server` |
| CORS errors | Check backend has `cors()` middleware enabled |

---

## 11. Performance Test ⚡

### Measure Frontend Load Time:
```javascript
// In browser console
performance.mark('start');
// Then navigate, and check:
performance.mark('end');
performance.measure('load', 'start', 'end');
performance.getEntriesByType('measure')[0].duration // in ms
```

Expected: < 2000ms (2 seconds)

### Measure API Response Time:
Open DevTools → Network tab → Look at "Time" column

Expected:
- Health check: < 100ms
- Login: < 200ms
- List endpoints: < 300ms

---

## 12. Ready for Vercel? ✅

Before deploying, verify ALL of these:

- [ ] Local login works
- [ ] Dashboard shows all metrics
- [ ] Can navigate to Donors, Tasks, Campaigns
- [ ] API health check returns OK
- [ ] No console errors
- [ ] No network errors (404, 500)
- [ ] Logout redirects to login
- [ ] Protected routes redirect to login when not authenticated
- [ ] Test credentials work: test@donorhub.com / password123
- [ ] Full user journey completes without errors

**If all checkboxes pass → You're ready to deploy to Vercel! 🚀**

---

## Need Help?

If tests fail:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify .env file has correct DATABASE_URL
4. Try: `npm run prisma:seed` to reseed database
5. Restart both frontend and backend
