# Deployment Guide - MaxMovies Backend

Complete step-by-step instructions for deploying the MaxMovies proxy to Vercel.

## Quick Start (5 minutes)

### Step 1: Prepare Your GitHub Repository

1. Make sure all changes are committed:
```bash
git add .
git commit -m "Setup MaxMovies proxy with Bearer auth"
git push origin main
```

### Step 2: Create Vercel Project

1. Visit [vercel.com/new](https://vercel.com/new)
2. Click **"Add GitHub App"** and authorize Vercel
3. Find your `maxmoviesbackend` repository
4. Click **"Import"**

### Step 3: Add Environment Variables

1. You'll see the "Configure Project" page
2. Scroll down to **"Environment Variables"**
3. Click **"Add Environment Variable"**
4. Fill in:
   - **Name**: `GIFTED_API_KEY`
   - **Value**: Your actual GiftedTech API key (e.g., `gifted_movieapi_378ry3dq7...`)
5. Click **"Add"**
6. Click **"Deploy"**

Vercel will now build and deploy your project automatically!

## Detailed Setup

### Getting Your GiftedTech API Key

1. Visit https://movieapi.giftedtech.co.ke
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Generate or copy your API key
5. The key will look like: `gifted_movieapi_378ry3dq7qdlqdgdqg8ordqg78qd0`

### Vercel Environment Variables Setup

**Option 1: During Import (Recommended)**
- Add the environment variable during the initial import process
- This is the fastest way

**Option 2: After Deployment**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New Variable"**
5. Set `GIFTED_API_KEY` to your API key
6. Select which environments (Production, Preview, Development)
7. Click **"Save"**
8. Vercel will automatically redeploy with the new variables

## Testing the Deployment

After deployment, test your endpoints:

### Homepage Test
```bash
curl https://your-project.vercel.app/api/v2/homepage
```

### Search Test
```bash
curl "https://your-project.vercel.app/api/v2/search?query=matrix&page=1"
```

### Expected Response (Success)
```json
{
  "status": 200,
  "success": true,
  "creator": "GiftedTech",
  "results": [...]
}
```

### Expected Response (Auth Error)
```json
{
  "status": 403,
  "success": false,
  "message": "Authentication failed. Please check your API key.",
  "code": "FORBIDDEN"
}
```

If you get a 403 error, your API key is not set correctly.

## Verifying Deployment

### Check Deployment Status
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Click **"Deployments"** tab
4. Look for the latest deployment
5. Status should be **"Ready"** (green checkmark)

### View Logs
1. In the Deployments tab
2. Click on the deployment
3. Click **"Logs"** tab
4. You can see real-time logs as requests come in

### View Function Logs
1. In the project dashboard
2. Click **"Functions"** tab
3. Click on any API endpoint (e.g., `api/homepage`)
4. See execution logs and errors

## Troubleshooting Deployment

### Deployment Fails

**Error: "Function failed to build"**
- Check that all files are syntactically correct
- Verify `package.json` has all required dependencies
- Check for missing files or circular imports

**Solution:**
```bash
# Test locally first
npm install
npm run dev
# Make sure no errors appear
```

### API Returns 403 After Deployment

**Problem:** Getting 403 Forbidden errors from the GiftedTech API

**Causes:**
1. Environment variable not set
2. API key is invalid
3. API key is expired

**Solutions:**
1. Check environment variables are set in Vercel:
   - Dashboard → Settings → Environment Variables
   - Verify `GIFTED_API_KEY` exists and has a value

2. Verify the API key format:
   - Should start with `gifted_movieapi_`
   - Should not have spaces or special characters

3. Check Vercel logs:
   - Dashboard → Deployments → [Latest] → Logs
   - Look for errors mentioning authorization

4. Test locally with the same key:
   ```bash
   GIFTED_API_KEY=your_key npm run dev
   curl http://localhost:3000/api/v2/homepage
   ```

### CORS Errors

**Problem:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
- All endpoints now include proper CORS headers
- Make sure you're using the `/api/v2/*` paths
- Check that `vercel.json` headers are properly formatted
- Redeploy if you recently changed `vercel.json`

## Updating the API Key

If you need to change your API key:

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Click the **x** next to `GIFTED_API_KEY`
5. Click **"Add New Variable"**
6. Enter the new key
7. Click **"Save"**
8. Vercel automatically redeploys

## Custom Domain Setup

To use a custom domain instead of `vercel.app`:

1. Go to project Settings
2. Click **"Domains"**
3. Enter your domain name
4. Follow instructions to update DNS records
5. Wait for DNS propagation (up to 48 hours)

Example:
- Default: `maxmovies-api.vercel.app`
- Custom: `api.maxmovies.com`

## Monitoring and Maintenance

### Check Usage
- Dashboard → Analytics tab
- See requests, errors, response times

### View Errors
- Dashboard → Logs tab
- Filter by status code
- Real-time error monitoring

### Performance
- Analytics → Response time trends
- Check for slow endpoints
- Monitor database/API call times

## Scaling and Limits

Vercel limits for hobby tier:
- **Serverless Functions**: 100 concurrent executions
- **API Response**: Max 10 seconds per request
- **Memory**: 512MB per function
- **Cold start**: ~1 second on first request

The proxy is optimized for these limits:
- Streaming responses reduce memory usage
- 30-second timeout for video streaming (configured in vercel.json)
- Proper error handling to avoid hanging connections

## Rollback to Previous Version

If something breaks after deployment:

1. Go to Deployments tab
2. Find the previous working deployment
3. Click "..." menu
4. Click "Promote to Production"

The previous version is now live again.

## Security Checklist

- ✅ API key is in environment variables (not in code)
- ✅ Never commit `.env.local` or API keys to GitHub
- ✅ All endpoints use HTTPS
- ✅ CORS headers are configured
- ✅ Proxy validates URLs before fetching
- ✅ Rate limiting via GiftedTech API
- ✅ Error messages don't expose sensitive info

## Getting Help

### Check Vercel Docs
- https://vercel.com/docs

### Check This Project's README
- Full API documentation
- Usage examples
- Error handling guide

### GiftedTech Support
- https://giftedtech.co.ke
- Check API status page

---

**Your deployment is complete!** 🎉

Your MaxMovies backend is now running at:
```
https://your-project.vercel.app
```

All endpoints are ready to use with proper Bearer authentication, CORS support, and video streaming capabilities.
