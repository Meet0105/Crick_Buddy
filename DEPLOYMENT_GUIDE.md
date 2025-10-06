# 🚀 Deployment Guide - CrickBuddy Application

## Issues Found & Fixed

### 1. **Backend Not Fetching Data from RapidAPI**
**Problem:** Environment variables not set on Vercel
**Solution:** Configure environment variables in Vercel dashboard

### 2. **MongoDB Connection Timeout**
**Problem:** Serverless functions timing out on MongoDB connection
**Solution:** Implemented connection caching for serverless

### 3. **CORS Issues**
**Problem:** Frontend can't access backend API
**Solution:** Updated CORS to allow frontend domain

---

## 📋 Backend Deployment Steps (Vercel)

### Step 1: Build the Backend
```bash
cd backend
npm run build
```

### Step 2: Configure Environment Variables on Vercel

Go to your Vercel project settings → Environment Variables and add:

```env
# MongoDB
MONGO_URI=mongodb+srv://Meet:Meet%402701@payload-cluster.ywnbayx.mongodb.net/?retryWrites=true&w=majority&appName=payload-cluster

# RapidAPI Configuration
RAPIDAPI_KEY=09db55d3ffmsheeb4e4aa2dad1b6p140863jsn15fdd9eced26
RAPIDAPI_HOST=cricbuzz-cricket.p.rapidapi.com

# RapidAPI Endpoints
RAPIDAPI_MATCHES_LIVE_URL=https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live
RAPIDAPI_MATCHES_UPCOMING_URL=https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming
RAPIDAPI_MATCHES_RECENT_URL=https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent
RAPIDAPI_MATCHES_INFO_URL=https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1
RAPIDAPI_SERIES_LIST_URL=https://cricbuzz-cricket.p.rapidapi.com/series/v1/international
RAPIDAPI_SERIES_SQUADS_URL=https://cricbuzz-cricket.p.rapidapi.com/series/v1
RAPIDAPI_SERIES_POINTS_TABLE_URL=https://cricbuzz-cricket.p.rapidapi.com/stats/v1/series
RAPIDAPI_PLAYERS_SEARCH_URL=https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search
RAPIDAPI_PLAYERS_TRENDING_URL=https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/trending
RAPIDAPI_PLAYERS_INFO_URL=https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player
RAPIDAPI_TEAMS_LIST_URL=https://cricbuzz-cricket.p.rapidapi.com/teams/v1/international
RAPIDAPI_NEWS_LIST_URL=https://cricbuzz-cricket.p.rapidapi.com/news/v1/index
RAPIDAPI_VENUES_INFO_URL=https://cricbuzz-cricket.p.rapidapi.com/venues/v1
RAPIDAPI_STATS_ICC_RANKINGS_URL=https://cricbuzz-cricket.p.rapidapi.com/stats/v1/rankings/batsmen
RAPIDAPI_PHOTOS_LIST_URL=https://cricbuzz-cricket.p.rapidapi.com/photos/v1/index

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://crick-buddy-frontend-v.vercel.app
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
cd backend
npm install -g vercel
vercel --prod
```

**Option B: Using Git Integration**
1. Push your code to GitHub
2. Import the repository in Vercel
3. Set root directory to `backend`
4. Vercel will auto-detect and deploy

### Step 4: Verify Deployment

Test these endpoints:
```bash
# Health check
curl https://crick-buddy-backend-v.vercel.app/

# Live matches
curl https://crick-buddy-backend-v.vercel.app/api/matches/live

# Recent matches
curl https://crick-buddy-backend-v.vercel.app/api/matches/recent
```

---

## 📋 Frontend Deployment Steps (Vercel)

### Step 1: Update Environment Variables

Create/update `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://crick-buddy-backend-v.vercel.app
```

### Step 2: Build and Deploy

**Option A: Using Vercel CLI**
```bash
cd frontend
vercel --prod
```

**Option B: Using Git Integration**
1. Push your code to GitHub
2. Import the repository in Vercel
3. Set root directory to `frontend`
4. Add environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = `https://crick-buddy-backend-v.vercel.app`

---

## 🔧 Troubleshooting

### Issue: Backend returns empty arrays

**Check:**
1. Environment variables are set on Vercel
2. MongoDB connection is working
3. RapidAPI key is valid and has credits

**Solution:**
```bash
# Check Vercel logs
vercel logs https://crick-buddy-backend-v.vercel.app

# Test API directly
curl -H "x-rapidapi-key: YOUR_KEY" -H "x-rapidapi-host: cricbuzz-cricket.p.rapidapi.com" https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live
```

### Issue: CORS errors

**Check:**
- Frontend URL is added to CORS whitelist in `backend/src/server.ts`
- `FRONTEND_URL` environment variable is set on Vercel

**Solution:**
Update CORS configuration in `backend/src/server.ts` to include your frontend domain.

### Issue: MongoDB connection timeout

**Check:**
- MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Connection string is correct
- Database user has proper permissions

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
3. Verify database user credentials

### Issue: Match details page not loading

**Check:**
1. Backend API is returning data
2. Frontend is calling correct API endpoint
3. Match ID is valid

**Test:**
```bash
# Test specific match
curl https://crick-buddy-backend-v.vercel.app/api/matches/YOUR_MATCH_ID

# Test scorecard
curl https://crick-buddy-backend-v.vercel.app/api/matches/YOUR_MATCH_ID/scorecard
```

---

## 🎯 Quick Fix Commands

### Rebuild and Redeploy Backend
```bash
cd backend
npm run build
vercel --prod
```

### Rebuild and Redeploy Frontend
```bash
cd frontend
npm run build
vercel --prod
```

### Clear Vercel Cache
```bash
vercel --prod --force
```

---

## 📊 Monitoring

### Check Backend Logs
```bash
vercel logs https://crick-buddy-backend-v.vercel.app --follow
```

### Check Frontend Logs
```bash
vercel logs https://crick-buddy-frontend-v.vercel.app --follow
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check returns success
- [ ] Live matches endpoint returns data
- [ ] Recent matches endpoint returns data
- [ ] Match details page loads correctly
- [ ] Scorecard displays properly
- [ ] No CORS errors in browser console
- [ ] MongoDB connection is stable
- [ ] RapidAPI calls are working
- [ ] Frontend can fetch data from backend
- [ ] All environment variables are set

---

## 🔐 Security Notes

**Important:** Never commit `.env` files to Git!

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.development
```

For production, always use Vercel's environment variables dashboard.

---

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test RapidAPI endpoints directly
4. Check MongoDB Atlas connection
5. Review browser console for errors
