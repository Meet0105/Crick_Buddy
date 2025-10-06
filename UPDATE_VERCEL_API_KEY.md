# 🔑 Update Vercel with New API Key

## ✅ Good News!
Your new API key works! I tested it and it's returning data.

**New API Key:** `a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a`

---

## 🚀 Update Vercel (5 minutes)

### Step 1: Go to Vercel Environment Variables

1. Visit: https://vercel.com
2. Select project: `crick-buddy-backend-v`
3. Go to: Settings → Environment Variables

### Step 2: Update RAPIDAPI_KEY

1. Find the variable: `RAPIDAPI_KEY`
2. Click the "..." menu (three dots) next to it
3. Click "Edit"
4. Replace the old value with:
   ```
   a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a
   ```
5. Make sure all 3 environments are selected:
   - ✓ Production
   - ✓ Preview  
   - ✓ Development
6. Click "Save"

### Step 3: Redeploy

1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes

---

## 🧪 Test After Redeployment

Wait 2-3 minutes, then run:

```bash
curl https://crick-buddy-backend-v.vercel.app/api/matches/live
```

**Expected:** Should return match data (not empty array)

---

## ⚡ Quick Command to Update via CLI

If you have Vercel CLI installed:

```bash
# Set the new API key
vercel env add RAPIDAPI_KEY production

# When prompted, paste:
a2c7e93e5dmsh5aa3e5fe3833633p16893ajsn5987862cca9a

# Redeploy
cd backend
vercel --prod
```

---

## ✅ Success Indicators

After updating and redeploying:

1. **Backend returns data:**
   ```bash
   curl https://crick-buddy-backend-v.vercel.app/api/matches/live
   # Should return: [{matchId: "...", teams: [...]}]
   ```

2. **Frontend shows matches:**
   - Visit: https://crick-buddy-frontend-v.vercel.app
   - Match cards should display
   - Click on a match → details should load

---

## 🆘 If Still Not Working

Run this diagnostic:

```bash
node diagnose-issue.js
```

Should show:
```
✅ Backend is running
✅ Backend returns X matches
✅ RapidAPI working
```

---

**Next Step:** Update the RAPIDAPI_KEY on Vercel and redeploy!
