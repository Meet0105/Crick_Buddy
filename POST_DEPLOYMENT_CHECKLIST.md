# Post-Deployment Checklist

## ✅ Code Pushed
- [x] Backend scorecard fix pushed to GitHub
- [x] Vercel will auto-deploy from GitHub

## 🔍 What to Check After Deployment

### 1. Wait for Vercel Deployment
- Go to your Vercel dashboard
- Wait for both backend and frontend deployments to complete (usually 2-3 minutes)
- Check deployment logs for any errors

### 2. Verify Backend is Working
Test these endpoints:
```bash
# Live matches
curl https://crick-buddy-backend-v.vercel.app/api/matches/live

# Recent matches  
curl https://crick-buddy-backend-v.vercel.app/api/matches/recent

# Upcoming matches
curl https://crick-buddy-backend-v.vercel.app/api/matches/upcoming

# Specific match details
curl https://crick-buddy-backend-v.vercel.app/api/matches/113670
```

### 3. Test Frontend Pages
Visit these URLs in your browser:
- ✅ Homepage: `https://crick-buddy-frontend-v.vercel.app/`
- ✅ Live matches: `https://crick-buddy-frontend-v.vercel.app/formats/live`
- ✅ Recent matches: `https://crick-buddy-frontend-v.vercel.app/formats/recent`
- ✅ Upcoming matches: `https://crick-buddy-frontend-v.vercel.app/formats/upcoming`
- ✅ Match details: `https://crick-buddy-frontend-v.vercel.app/matches/113670`

### 4. Check for Issues

#### If matches are NOT showing on Vercel:

**A. Check Frontend Environment Variable**
1. Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` is set to: `https://crick-buddy-backend-v.vercel.app`
3. If missing or wrong, add/update it and redeploy

**B. Check Backend Environment Variables**
1. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
2. Verify these are set:
   - `RAPIDAPI_KEY` = `a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a`
   - `MONGO_URI` = Your MongoDB connection string
   - `RAPIDAPI_HOST` = `cricbuzz-cricket.p.rapidapi.com`
   - All other RAPIDAPI_* URLs

**C. Check Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any API errors or CORS issues
4. Check Network tab to see if API calls are being made

**D. Check Vercel Logs**
1. Go to Vercel Dashboard → Your Backend Project → Deployments
2. Click on the latest deployment
3. Click "View Function Logs"
4. Look for errors in the logs

### 5. Common Issues & Solutions

#### Issue: "Failed to fetch" or "Network Error"
**Solution:** Frontend can't reach backend
- Check `NEXT_PUBLIC_API_URL` in frontend Vercel settings
- Make sure backend is deployed and running

#### Issue: "API rate limit exceeded"
**Solution:** RapidAPI rate limit hit
- Wait a few minutes
- Or update to a different API key

#### Issue: Empty match arrays
**Solution:** Backend is running but not fetching data
- Check backend logs in Vercel
- Verify `RAPIDAPI_KEY` is set correctly
- Test backend endpoints directly with curl

#### Issue: Scores showing as "0/0"
**Solution:** Scorecard data not processed
- This should be fixed with the latest deployment
- Clear browser cache and refresh
- Check if match has actual scorecard data available

## 📊 Expected Results

After successful deployment, you should see:
- ✅ Live matches displaying on homepage and /formats/live
- ✅ Recent matches displaying on /formats/recent
- ✅ Upcoming matches displaying on /formats/upcoming
- ✅ Match details showing team scores (e.g., "634/9")
- ✅ Scorecard tab showing innings with team names and runs

## 🚨 If Still Not Working

1. Share the error messages from:
   - Browser console
   - Vercel backend logs
   - Vercel frontend logs

2. Test the backend directly:
   ```bash
   curl https://crick-buddy-backend-v.vercel.app/api/matches/live
   ```

3. Check if the issue is:
   - Backend not fetching data (check backend logs)
   - Frontend not calling backend (check browser network tab)
   - Environment variables not set (check Vercel settings)
