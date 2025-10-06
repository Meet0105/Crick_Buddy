# 🚨 Quick Fix - Match Card & Details Not Fetching Data

## Root Cause
Your backend is deployed but **environment variables are not set on Vercel**, so RapidAPI calls are failing silently.

## ⚡ Immediate Fix (5 minutes)

### Step 1: Set Environment Variables on Vercel

1. Go to: https://vercel.com/your-username/crick-buddy-backend-v/settings/environment-variables

2. Add these variables (copy from your `backend/.env` file):

```
MONGO_URI=mongodb+srv://Meet:Meet%402701@payload-cluster.ywnbayx.mongodb.net/?retryWrites=true&w=majority&appName=payload-cluster
RAPIDAPI_KEY=09db55d3ffmsheeb4e4aa2dad1b6p140863jsn15fdd9eced26
RAPIDAPI_HOST=cricbuzz-cricket.p.rapidapi.com
RAPIDAPI_MATCHES_LIVE_URL=https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live
RAPIDAPI_MATCHES_RECENT_URL=https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent
RAPIDAPI_MATCHES_UPCOMING_URL=https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming
RAPIDAPI_MATCHES_INFO_URL=https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1
FRONTEND_URL=https://crick-buddy-frontend-v.vercel.app
NODE_ENV=production
```

### Step 2: Redeploy Backend

After adding environment variables, trigger a new deployment:

**Option A: Via Vercel Dashboard**
- Go to Deployments tab
- Click "Redeploy" on the latest deployment

**Option B: Via Git**
```bash
cd backend
git add .
git commit -m "fix: update server for vercel deployment"
git push
```

**Option C: Via Vercel CLI**
```bash
cd backend
npm run build
vercel --prod
```

### Step 3: Verify It's Working

Wait 2-3 minutes, then test:

```bash
# Should return match data (not empty array)
curl https://crick-buddy-backend-v.vercel.app/api/matches/live
```

---

## 🔍 Why This Happened

1. **Local `.env` file** works on your machine
2. **Vercel doesn't read `.env` files** - you must set them in dashboard
3. Without API keys, the backend returns empty arrays instead of errors

---

## ✅ Verification Steps

After redeployment, check:

1. **Backend API Test:**
   ```bash
   curl https://crick-buddy-backend-v.vercel.app/api/matches/live
   ```
   Should return: Array of match objects (not empty `[]`)

2. **Frontend Test:**
   - Visit: https://crick-buddy-frontend-v.vercel.app
   - Check if match cards appear
   - Click on a match to see details

3. **Browser Console:**
   - Open DevTools (F12)
   - Check for any errors
   - Network tab should show successful API calls

---

## 🎯 Expected Results

**Before Fix:**
- Backend returns: `[]` (empty array)
- Frontend shows: "No matches available"
- Match details: "Match not found"

**After Fix:**
- Backend returns: Array of match objects with scores
- Frontend shows: Match cards with team names and scores
- Match details: Full scorecard, commentary, etc.

---

## 🆘 If Still Not Working

### Check 1: Environment Variables Are Set
```bash
# In Vercel dashboard, verify all variables are present
# They should show as "Encrypted" with a green checkmark
```

### Check 2: MongoDB Connection
```bash
# Test if MongoDB is accessible
curl https://crick-buddy-backend-v.vercel.app/
# Should return: {"message":"Cricket backend (TypeScript) is running"}
```

### Check 3: RapidAPI Key Valid
```bash
# Test RapidAPI directly
curl -H "x-rapidapi-key: 09db55d3ffmsheeb4e4aa2dad1b6p140863jsn15fdd9eced26" \
     -H "x-rapidapi-host: cricbuzz-cricket.p.rapidapi.com" \
     https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live
```

### Check 4: Vercel Logs
```bash
vercel logs https://crick-buddy-backend-v.vercel.app --follow
```

Look for errors like:
- "RAPIDAPI_KEY is missing"
- "MongoDB connection failed"
- "API rate limit exceeded"

---

## 📝 Summary

**Problem:** Backend deployed but not configured
**Solution:** Add environment variables to Vercel
**Time:** 5 minutes
**Result:** Match cards and details will load properly

---

Need help? Check the full DEPLOYMENT_GUIDE.md for detailed troubleshooting.
