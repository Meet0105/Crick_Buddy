# ✅ Deployment Checklist - CrickBuddy

## 🚀 Quick Start (Follow in Order)

### Step 1: Set Environment Variables on Vercel (5 min)

Go to: https://vercel.com/your-username/crick-buddy-backend-v/settings/environment-variables

Copy-paste these (from your `backend/.env`):

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

**Important:** Add each variable separately in Vercel dashboard!

---

### Step 2: Build Backend (2 min)

```bash
cd backend
npm run build
```

**Expected output:**
```
✓ Compiled successfully
```

---

### Step 3: Deploy Backend (3 min)

**Option A: Git Push (Recommended)**
```bash
git add .
git commit -m "fix: configure backend for vercel"
git push
```

**Option B: Vercel CLI**
```bash
vercel --prod
```

**Option C: Vercel Dashboard**
- Go to Deployments tab
- Click "Redeploy" on latest deployment

---

### Step 4: Wait for Deployment (2-3 min)

Watch the deployment progress in Vercel dashboard.

**Status should show:**
- ✅ Building
- ✅ Deploying
- ✅ Ready

---

### Step 5: Test Backend (1 min)

Run the test script:
```bash
node test-backend.js
```

**Expected output:**
```
✅ Health Check - SUCCESS
✅ Live Matches - SUCCESS (returned X items)
✅ Recent Matches - SUCCESS (returned X items)
✅ Upcoming Matches - SUCCESS (returned X items)

🎉 All tests passed!
```

**If you see empty arrays:**
- ⚠️ Environment variables not set correctly
- Go back to Step 1

---

### Step 6: Test Frontend (1 min)

Visit: https://crick-buddy-frontend-v.vercel.app

**Check:**
- [ ] Home page loads
- [ ] Match cards display
- [ ] Team names visible
- [ ] Scores showing
- [ ] Click on a match
- [ ] Match details page loads
- [ ] Scorecard displays

---

## 🔍 Verification Commands

### Test Backend Health
```bash
curl https://crick-buddy-backend-v.vercel.app/
```
**Expected:** `{"message":"Cricket backend (TypeScript) is running"}`

### Test Live Matches
```bash
curl https://crick-buddy-backend-v.vercel.app/api/matches/live
```
**Expected:** Array of match objects (NOT empty `[]`)

### Test Recent Matches
```bash
curl https://crick-buddy-backend-v.vercel.app/api/matches/recent
```
**Expected:** Array of completed matches

### Test Specific Match
```bash
curl https://crick-buddy-backend-v.vercel.app/api/matches/YOUR_MATCH_ID
```
**Expected:** Match object with details

---

## 🚨 Troubleshooting

### Issue: Empty Arrays Returned

**Cause:** Environment variables not set

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Verify ALL variables are present
3. They should show as "Encrypted" with green checkmark
4. Redeploy after adding variables

### Issue: "FUNCTION_INVOCATION_FAILED"

**Cause:** MongoDB connection timeout or API error

**Fix:**
1. Check MongoDB Atlas is running
2. Verify network access allows 0.0.0.0/0
3. Check Vercel logs: `vercel logs URL --follow`

### Issue: CORS Errors

**Cause:** Frontend domain not whitelisted

**Fix:**
1. Check `FRONTEND_URL` environment variable is set
2. Verify CORS configuration in `backend/src/server.ts`
3. Redeploy backend

### Issue: "Match not found"

**Cause:** Match ID invalid or not in database

**Fix:**
1. Test with a valid match ID from live matches endpoint
2. Sync match details: `POST /api/matches/:id/sync-details`

---

## 📊 Success Criteria

### Backend ✅
- [ ] Health check returns success
- [ ] Live matches returns data (not empty)
- [ ] Recent matches returns data
- [ ] Upcoming matches returns data
- [ ] Match details endpoint works
- [ ] Scorecard endpoint works
- [ ] No errors in Vercel logs

### Frontend ✅
- [ ] Home page loads without errors
- [ ] Match cards display properly
- [ ] Team names and scores visible
- [ ] Live indicator shows for live matches
- [ ] Match details page loads
- [ ] Scorecard displays innings data
- [ ] Commentary shows (if available)
- [ ] No CORS errors in browser console

### Database ✅
- [ ] MongoDB connection successful
- [ ] Matches saved to database
- [ ] Data persists between requests
- [ ] No connection timeout errors

### API ✅
- [ ] RapidAPI calls successful
- [ ] Data fetched from Cricbuzz
- [ ] Rate limits not exceeded
- [ ] API key valid and active

---

## 🎯 Quick Test Script

Save this as `quick-test.sh`:

```bash
#!/bin/bash

echo "Testing CrickBuddy Backend..."
echo ""

echo "1. Health Check:"
curl -s https://crick-buddy-backend-v.vercel.app/ | jq
echo ""

echo "2. Live Matches:"
curl -s https://crick-buddy-backend-v.vercel.app/api/matches/live | jq '. | length'
echo ""

echo "3. Recent Matches:"
curl -s https://crick-buddy-backend-v.vercel.app/api/matches/recent | jq '. | length'
echo ""

echo "Done!"
```

Run with: `bash quick-test.sh`

---

## 📝 Environment Variables Checklist

Copy this list and check off as you add each variable to Vercel:

**Required (Critical):**
- [ ] MONGO_URI
- [ ] RAPIDAPI_KEY
- [ ] RAPIDAPI_HOST
- [ ] RAPIDAPI_MATCHES_INFO_URL
- [ ] NODE_ENV

**Recommended:**
- [ ] RAPIDAPI_MATCHES_LIVE_URL
- [ ] RAPIDAPI_MATCHES_RECENT_URL
- [ ] RAPIDAPI_MATCHES_UPCOMING_URL
- [ ] FRONTEND_URL

**Optional (for full functionality):**
- [ ] RAPIDAPI_SERIES_LIST_URL
- [ ] RAPIDAPI_PLAYERS_SEARCH_URL
- [ ] RAPIDAPI_TEAMS_LIST_URL
- [ ] RAPIDAPI_NEWS_LIST_URL
- [ ] RAPIDAPI_VENUES_INFO_URL

---

## 🔄 Redeployment Steps

If you need to redeploy:

1. **Make changes to code**
2. **Build:** `npm run build`
3. **Commit:** `git add . && git commit -m "your message"`
4. **Push:** `git push`
5. **Wait:** 2-3 minutes
6. **Test:** `node test-backend.js`

---

## 📞 Need Help?

1. **Read:** `QUICK_FIX.md` - Immediate solutions
2. **Read:** `DEPLOYMENT_GUIDE.md` - Detailed guide
3. **Read:** `FIXES_APPLIED.md` - What was changed
4. **Run:** `node test-backend.js` - Diagnose issues
5. **Check:** Vercel logs for errors

---

## ✨ Final Check

Before considering deployment complete:

```bash
# Run all tests
node test-backend.js

# Check frontend
open https://crick-buddy-frontend-v.vercel.app

# Verify match details work
# Click on any match card and check if details load
```

**If all tests pass and frontend works:** 🎉 **Deployment Successful!**

---

**Time Required:** ~15 minutes total
**Difficulty:** Easy (just follow steps)
**Result:** Fully working cricket application!
