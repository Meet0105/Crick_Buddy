# ✅ How to Verify Environment Variables on Vercel

## 🎯 The Problem:

Your backend returns empty arrays because **environment variables are NOT set on Vercel**.

---

## 📸 Step-by-Step Visual Guide:

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com
2. Sign in to your account
3. Find your project: `crick-buddy-backend-v`
4. Click on it

### Step 2: Navigate to Environment Variables

1. Click "Settings" tab (top navigation)
2. Click "Environment Variables" in left sidebar
3. You should see a list of variables

### Step 3: Check if Variables Exist

**You MUST see these 9 variables:**

```
✓ RAPIDAPI_KEY
✓ RAPIDAPI_HOST
✓ RAPIDAPI_MATCHES_LIVE_URL
✓ RAPIDAPI_MATCHES_RECENT_URL
✓ RAPIDAPI_MATCHES_UPCOMING_URL
✓ RAPIDAPI_MATCHES_INFO_URL
✓ MONGO_URI
✓ FRONTEND_URL
✓ NODE_ENV
```

**Each variable should show:**
- Name: (variable name)
- Value: (Encrypted) 🔒
- Environments: Production, Preview, Development ✓✓✓

---

## ❌ If Variables Are Missing:

### Add Each Variable:

1. Click "Add New" button
2. Fill in:
   - **Name:** `RAPIDAPI_KEY`
   - **Value:** `09db55d3ffmsheeb4e4aa2dad1b6p140863jsn15fdd9eced26`
   - **Environments:** Check all 3 boxes (Production, Preview, Development)
3. Click "Save"
4. Repeat for all 9 variables

### Complete List to Add:

```env
Name: RAPIDAPI_KEY
Value: 09db55d3ffmsheeb4e4aa2dad1b6p140863jsn15fdd9eced26
Environments: ✓ Production ✓ Preview ✓ Development

Name: RAPIDAPI_HOST
Value: cricbuzz-cricket.p.rapidapi.com
Environments: ✓ Production ✓ Preview ✓ Development

Name: RAPIDAPI_MATCHES_LIVE_URL
Value: https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live
Environments: ✓ Production ✓ Preview ✓ Development

Name: RAPIDAPI_MATCHES_RECENT_URL
Value: https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent
Environments: ✓ Production ✓ Preview ✓ Development

Name: RAPIDAPI_MATCHES_UPCOMING_URL
Value: https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming
Environments: ✓ Production ✓ Preview ✓ Development

Name: RAPIDAPI_MATCHES_INFO_URL
Value: https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1
Environments: ✓ Production ✓ Preview ✓ Development

Name: MONGO_URI
Value: mongodb+srv://Meet:Meet%402701@payload-cluster.ywnbayx.mongodb.net/?retryWrites=true&w=majority&appName=payload-cluster
Environments: ✓ Production ✓ Preview ✓ Development

Name: FRONTEND_URL
Value: https://crick-buddy-frontend-v.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development

Name: NODE_ENV
Value: production
Environments: ✓ Production only
```

---

## 🔄 Step 4: Redeploy After Adding Variables

**IMPORTANT:** Environment variables only take effect after redeployment!

### Method 1: Redeploy from Dashboard
1. Go to "Deployments" tab
2. Find the latest deployment
3. Click the "..." menu (three dots)
4. Click "Redeploy"
5. Confirm redeployment
6. Wait 2-3 minutes

### Method 2: Redeploy via Git
```bash
cd backend
git add .
git commit -m "trigger redeploy" --allow-empty
git push
```

### Method 3: Redeploy via CLI
```bash
cd backend
vercel --prod
```

---

## 🧪 Step 5: Verify It Worked

### Test 1: Check Vercel Logs

```bash
vercel logs https://crick-buddy-backend-v.vercel.app --follow
```

**Look for:**
```
✅ RAPIDAPI_KEY: SET
✅ RAPIDAPI_HOST: SET
✅ MongoDB Connected
```

**NOT:**
```
❌ RAPIDAPI_KEY: NOT SET
❌ RAPIDAPI_HOST: NOT SET
```

### Test 2: Test API Endpoint

```bash
curl https://crick-buddy-backend-v.vercel.app/api/matches/recent
```

**Should return:** Array of match objects (not empty)

### Test 3: Run Diagnostic Script

```bash
node diagnose-issue.js
```

**Should show:**
```
✅ Backend is running
✅ Backend returns X matches (not empty)
```

---

## 🚨 Common Mistakes:

### Mistake 1: Not Selecting All Environments
- ❌ Only selected "Production"
- ✅ Must select: Production, Preview, Development

### Mistake 2: Not Redeploying
- ❌ Added variables but didn't redeploy
- ✅ Must redeploy after adding variables

### Mistake 3: Typos in Variable Names
- ❌ `RAPID_API_KEY` (wrong)
- ✅ `RAPIDAPI_KEY` (correct)

### Mistake 4: Typos in Variable Values
- ❌ Extra spaces or missing characters
- ✅ Copy-paste exactly from .env file

### Mistake 5: Not Waiting for Deployment
- ❌ Testing immediately after clicking redeploy
- ✅ Wait 2-3 minutes for deployment to complete

---

## 📊 How to Know if Variables Are Set:

### ✅ Variables ARE Set:
```
Vercel Dashboard shows:
- 9 variables listed
- Each shows "Encrypted" 🔒
- Each has 3 checkmarks (or 1 for NODE_ENV)

Backend logs show:
- "RAPIDAPI_KEY: SET"
- "MongoDB Connected"

API returns:
- Match data (or empty if no matches/rate limit)
```

### ❌ Variables NOT Set:
```
Vercel Dashboard shows:
- No variables listed
- Or missing some variables

Backend logs show:
- "RAPIDAPI_KEY: NOT SET"
- "RapidAPI config is missing"

API returns:
- Empty array []
- No attempt to call RapidAPI
```

---

## 🎯 Quick Checklist:

Before testing, verify:

- [ ] Opened Vercel dashboard
- [ ] Found project: crick-buddy-backend-v
- [ ] Went to Settings → Environment Variables
- [ ] See 9 variables listed
- [ ] Each variable shows "Encrypted"
- [ ] Each variable has correct environments selected
- [ ] Clicked "Redeploy" after adding variables
- [ ] Waited 2-3 minutes for deployment
- [ ] Checked Vercel logs for "SET" messages
- [ ] Tested API endpoint

---

## 🆘 Still Not Working?

### Double-Check:

1. **Screenshot your Vercel environment variables page**
   - Count the variables (should be 9)
   - Check each name matches exactly

2. **Check deployment status**
   - Go to Deployments tab
   - Latest deployment should show "Ready" ✓
   - Not "Building" or "Error"

3. **Check Vercel logs**
   ```bash
   vercel logs https://crick-buddy-backend-v.vercel.app
   ```
   - Look for error messages
   - Look for "NOT SET" messages

4. **Try deleting and re-adding variables**
   - Sometimes Vercel has caching issues
   - Delete all variables
   - Re-add them one by one
   - Redeploy

---

## ✅ Success Indicators:

You'll know it's working when:

1. **Vercel shows:** 9 environment variables
2. **Logs show:** "RAPIDAPI_KEY: SET"
3. **API returns:** Match data (when rate limit resets)
4. **Frontend shows:** Match cards with data

---

**Next:** After verifying variables are set, wait 1 hour for RapidAPI rate limit to reset, then test again.
