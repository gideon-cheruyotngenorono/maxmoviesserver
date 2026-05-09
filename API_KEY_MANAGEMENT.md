# API Key Management Guide

Complete guide for managing your GiftedTech API key securely.

## Understanding Bearer Token Authentication

Your API key is used as a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

The `apiClient.js` automatically adds this header to all requests to GiftedTech.

## API Key Format

A valid GiftedTech API key looks like:
```
gifted_movieapi_378ry3dq7qdlqdgdqg8ordqg78qd0
```

**Characteristics:**
- Starts with `gifted_movieapi_`
- Contains alphanumeric characters and underscores
- Usually 40+ characters long
- No spaces or special characters

## Getting Your API Key

1. Visit https://movieapi.giftedtech.co.ke
2. Create an account or log in
3. Go to **API Keys** or **Developer Settings**
4. Click **"Generate New Key"** or find your existing key
5. Copy the entire key string
6. Store it securely

## Setting Up Locally

### Create `.env.local`

For local development, create a `.env.local` file:

```bash
# In your project root
touch .env.local
```

### Add Your API Key

Edit `.env.local`:

```
GIFTED_API_KEY=gifted_movieapi_378ry3dq7qdlqdgdqg8ordqg78qd0
```

### Test Locally

```bash
# Run development server
npm run dev

# In another terminal, test the API
curl http://localhost:3000/api/v2/homepage
```

## Setting Up in Vercel

### Method 1: During Project Creation (Recommended)

1. Import your project on vercel.com
2. During import, add environment variables:
   - Name: `GIFTED_API_KEY`
   - Value: Your actual API key
3. Click "Deploy"

### Method 2: After Deployment

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings**
4. Go to **Environment Variables**
5. Click **"Add New Variable"**
6. Name: `GIFTED_API_KEY`
7. Value: Your actual API key
8. Select environments (Production, Preview, Development)
9. Click **"Save"**

### Method 3: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Set environment variable
vercel env add GIFTED_API_KEY
# (Paste your key when prompted)

# Deploy
vercel deploy --prod
```

## Verifying Your Setup

### Local Test

```bash
# Set your API key
export GIFTED_API_KEY=your_actual_key_here

# Run dev server
npm run dev

# Test in another terminal
curl http://localhost:3000/api/v2/homepage

# You should see: { "status": 200, "success": true, ... }
```

### Vercel Test

```bash
# After deploying to Vercel, test your live API
curl https://your-project.vercel.app/api/v2/homepage

# Should return the same response
```

## Troubleshooting API Key Issues

### Error: "403 Forbidden"

This means your API key is not working.

**Check 1: Is the environment variable set?**
```bash
# Vercel Dashboard → Settings → Environment Variables
# Should see GIFTED_API_KEY with a value
```

**Check 2: Is the key value correct?**
```bash
# Check Vercel logs:
# Dashboard → Deployments → [Latest] → Logs
# Look for error messages about authentication
```

**Check 3: Is the key format valid?**
```
✓ Correct: gifted_movieapi_378ry3dq7qdlqdgdqg8ordqg78qd0
✗ Wrong: gifted_movieapi_378ry3dq7qdlqdgdqg8ordqg78qd0 (extra spaces)
✗ Wrong: gifted_movieapi (incomplete)
✗ Wrong: your_actual_key_here (placeholder not replaced)
```

**Check 4: Test with curl**
```bash
# Test the actual API directly
curl -H "Authorization: Bearer YOUR_KEY" \
  https://movieapi.giftedtech.co.ke/api/v2/homepage

# If this works, your key is valid
# If this fails with 403, your key is invalid
```

### Error: "401 Unauthorized"

The API key is missing or invalid format.

**Solutions:**
1. Verify environment variable is set in Vercel
2. Check key has no leading/trailing spaces
3. Verify you copied the entire key
4. Make sure you didn't edit the key

### Error: "GIFTED_API_KEY environment variable is not set"

You'll see a warning in Vercel logs if the environment variable is missing.

**Solutions:**
1. Go to Vercel Settings → Environment Variables
2. Click "Add New Variable"
3. Name: `GIFTED_API_KEY`
4. Value: Your key
5. Click "Save"
6. Redeploy

## Security Best Practices

### DO

✅ Store API keys in environment variables  
✅ Use `.env.local` for local development (don't commit)  
✅ Add `.env.local` to `.gitignore`  
✅ Rotate keys periodically  
✅ Use different keys for dev/production if possible  
✅ Monitor API usage  
✅ Review GiftedTech API logs regularly  

### DON'T

❌ Commit API keys to GitHub  
❌ Share API keys in Slack/Discord  
❌ Use the same key for multiple projects  
❌ Hardcode keys in JavaScript  
❌ Log API keys in console.log()  
❌ Put keys in public config files  

## Managing Multiple Keys

If you have multiple environments:

### Development Key
```
GIFTED_API_KEY_DEV=gifted_movieapi_...
```

### Production Key
```
GIFTED_API_KEY_PROD=gifted_movieapi_...
```

Then in `apiClient.js`:
```javascript
this.apiKey = process.env.NODE_ENV === 'production' 
  ? process.env.GIFTED_API_KEY_PROD
  : process.env.GIFTED_API_KEY_DEV;
```

## Key Rotation

Rotate your API key periodically:

1. Generate a new key in GiftedTech dashboard
2. Add it to Vercel as `GIFTED_API_KEY`
3. Verify the new key works
4. Revoke or delete the old key
5. Delete the old key from environment variables

## Monitoring API Key Usage

### In Vercel Dashboard

1. Go to **Deployments**
2. Click **[Latest Deployment]**
3. Click **Logs**
4. Watch for authentication errors

### In GiftedTech Dashboard

1. Log in to GiftedTech
2. Go to **API Usage** or **Analytics**
3. Monitor:
   - Request count
   - Errors
   - Response times
   - Quota usage

## What If Your Key Is Compromised?

If you suspect someone has your API key:

1. **Immediately revoke the key** in GiftedTech dashboard
2. **Generate a new key**
3. **Update Vercel environment variables** with the new key
4. **Check GiftedTech logs** for unauthorized usage
5. **Review billing** for unexpected charges
6. **Monitor your project** for suspicious activity

## Key Expiration

Some API providers require key rotation after a certain period:

1. Check GiftedTech documentation for key expiration policy
2. Set calendar reminders to rotate keys
3. Before expiration:
   - Generate new key
   - Update environment variables
   - Test the new key
   - Revoke old key

## Testing API Key Format

Quick validation script:

```bash
#!/bin/bash
# save as test-api-key.sh

API_KEY="${1:?Please provide API key as argument}"

# Check if key starts with gifted_movieapi_
if [[ $API_KEY == gifted_movieapi_* ]]; then
    echo "✓ API key format looks valid"
else
    echo "✗ API key format looks invalid"
    exit 1
fi

# Check length (should be at least 40 chars)
if [ ${#API_KEY} -ge 40 ]; then
    echo "✓ API key length looks valid"
else
    echo "✗ API key might be truncated"
    exit 1
fi

# Test the key
echo "Testing API key..."
curl -s -H "Authorization: Bearer $API_KEY" \
  https://movieapi.giftedtech.co.ke/api/v2/homepage \
  -o /dev/null -w "HTTP Status: %{http_code}\n"
```

Run it:
```bash
bash test-api-key.sh "your_actual_key_here"
```

## Support

For issues with your API key:

- **GiftedTech Support**: https://giftedtech.co.ke
- **Vercel Documentation**: https://vercel.com/docs
- **This Project**: Check README.md

---

Your API key is now secure and properly configured! 🔐
