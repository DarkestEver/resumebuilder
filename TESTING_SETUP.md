# Testing Setup Guide

## ✅ UPDATED: New API-Based Approach

The original UI-based tests failed because:
1. Backend wasn't running (port 5000 unreachable)
2. Profile creation flow requires manual button clicks
3. Form fields don't use standard `name` attributes

**Solution**: Created new API-based tests that directly call backend endpoints to populate data. This is faster, more reliable, and doesn't depend on UI interactions.

---

## 🚀 Quick Start (Recommended)

### 1. Start Backend Server
```bash
cd C:\Users\dell\Desktop\ProfileBuilder
node server.js
```

### 2. Run API-Based Tests
```bash
npm run test:populate:api
```

This will:
- Login to 3 test accounts via API
- Create complete profiles with all sections
- Create resumes for each account
- Verify data via UI login

Expected duration: **~30 seconds** (much faster than UI tests!)

---

## 🚀 Required Steps Before Running Tests

### 1. Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Check if MongoDB is running
mongod --version

# If not running, start it (depends on your installation)
# Windows: Start MongoDB service from Services
# Linux/Mac: sudo systemctl start mongodb
```

### 2. Start Backend Server
Open a **new terminal** and run:
```bash
cd C:\Users\dell\Desktop\ProfileBuilder
node server.js
```

Expected output:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:5000
```

### 3. Start Frontend Server
Open **another new terminal** and run:
```bash
cd C:\Users\dell\Desktop\ProfileBuilder\frontend
npm run dev
```

Expected output:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Ready in X.Xs
```

### 4. Verify Servers Are Running
Check both servers are accessible:

**Backend Check:**
```powershell
Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet
# Should return: True
```

**Frontend Check:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
# Should return: True
```

### 5. Run Playwright Tests
Once both servers are running:
```bash
npm run test:populate
```

---

## 📊 Test Failure Analysis

### What Failed:
- **All 4 tests failed** with `TimeoutError: page.waitForURL: Timeout 10000ms exceeded`
- Tests couldn't navigate to dashboard after login
- Root cause: **Backend not running** (port 5000 unreachable)

### Failed Tests:
1. ❌ Populate john.dev@test.com
2. ❌ Populate sarah.content@test.com
3. ❌ Populate dr.smith@test.com
4. ❌ Verify all accounts have data

### Error Location:
```typescript
// Line 240 in populate-sample-data.spec.ts
await page.waitForURL('**/dashboard', { timeout: 10000 });
```

The login form submission succeeded, but navigation to dashboard failed because the API couldn't authenticate (server not responding).

---

## 🎯 Quick Start Checklist

- [ ] MongoDB is running
- [ ] Backend started (`node server.js` in root directory)
- [ ] Frontend started (`npm run dev` in frontend directory)
- [ ] Both servers are accessible (check ports 5000 and 3000)
- [ ] Run tests: `npm run test:populate`

---

## 📸 Test Report Available

The Playwright HTML report is currently served at:
**http://localhost:9323**

You can view:
- Screenshots of failed login attempts
- Video recordings of each test
- Detailed error traces
- Network logs

---

## 🔧 Alternative: Manual Testing

If you prefer to test manually without automation:

1. Start backend and frontend (steps above)
2. Open browser to http://localhost:3000
3. Login with test accounts from `TEST_ACCOUNTS.md`:
   - Email: `john.dev@test.com`
   - Password: `Test123!@#`
4. Manually fill profile data, create resumes, etc.

---

## ⚠️ Important Notes

- **Do not kill Node processes** - The instructions prohibit terminating running servers
- **Do not start servers automatically** - User must start them manually
- Tests require **sequential execution** - configured to run one at a time
- Each test takes ~2-3 minutes per account

---

## 📝 Next Steps

1. **Start both servers** (backend + frontend)
2. **Verify they're running** (check ports)
3. **Re-run tests**: `npm run test:populate`
4. **View results** in HTML report
5. **Login manually** to verify populated data

Expected test duration: **~10 minutes** for all 3 accounts
