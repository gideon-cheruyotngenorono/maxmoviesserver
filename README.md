# MaxMovies Backend - GiftedTech API Proxy

A fully-functional serverless proxy backend for the GiftedTech Movie API, deployed on Vercel with Bearer token authentication, CORS support, and video streaming capabilities.

## Features

✅ **Bearer Token Authentication** - Secure API key management via environment variables  
✅ **CORS Enabled** - All endpoints have proper CORS headers for cross-origin requests  
✅ **Video Proxy** - Stream videos from direct URLs with CORS bypass  
✅ **Error Handling** - Proper 401/403 auth error handling and detailed error messages  
✅ **Serverless** - Deploy to Vercel with zero configuration  
✅ **Environment Variables** - Never hardcode API keys again  

## Architecture

### API Endpoints

All endpoints forward requests to `https://movieapi.giftedtech.co.ke/api/v2/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v2/homepage` | GET | Get homepage content |
| `/api/v2/trending` | GET | Get trending movies |
| `/api/v2/search` | GET | Search for movies (requires `query` param) |
| `/api/v2/info/:id` | GET | Get detailed info about a movie |
| `/api/v2/sources/:id` | GET | Get video sources for a movie |
| `/api/proxy` | GET | Proxy video streams (requires `url` query param) |

### Project Structure

```
maxmoviesbackend/
├── api/
│   ├── homepage.js      # Homepage endpoint
│   ├── info.js          # Movie info endpoint
│   ├── search.js        # Search endpoint
│   ├── trending.js      # Trending endpoint
│   ├── sources.js       # Video sources endpoint
│   ├── proxy.js         # Video proxy endpoint
│   └── test.js          # Test endpoint
├── utils/
│   ├── apiClient.js     # GiftedTech API client with Bearer auth
│   └── corsHeaders.js   # CORS helper functions
├── package.json         # Dependencies
├── vercel.json          # Vercel configuration
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- Node.js 16+ (for local testing)
- Vercel account (for deployment)
- GiftedTech API key from https://movieapi.giftedtech.co.ke

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd maxmoviesbackend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env.local` for local testing**
```bash
cp .env.example .env.local
```

4. **Add your API key**
Edit `.env.local` and replace `your_gifted_api_key_here` with your actual API key:
```env
GIFTED_API_KEY=gifted_movieapi_378ry3dq7qdlqdgdqg8ordqg78qd0
```

5. **Run local development server**
```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Deployment to Vercel

1. **Push your code to GitHub** (Vercel works with GitHub repos)
```bash
git add .
git commit -m "Setup bearer auth and proxy"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com/new
- Select your GitHub repository
- Click "Import"

3. **Add Environment Variables**
- In the Vercel dashboard, go to Settings → Environment Variables
- Add the following:
  - **Name**: `GIFTED_API_KEY`
  - **Value**: Your actual GiftedTech API key
- Click "Save"

4. **Deploy**
- Vercel will automatically deploy when you push to main
- Your API will be available at `https://your-project.vercel.app`

## API Usage Examples

### Get Homepage
```bash
curl https://your-project.vercel.app/api/v2/homepage
```

### Search for Movies
```bash
curl "https://your-project.vercel.app/api/v2/search?query=avengers&page=1"
```

### Get Movie Info
```bash
curl "https://your-project.vercel.app/api/v2/info?id=movie_id"
```

### Get Video Sources
```bash
curl "https://your-project.vercel.app/api/v2/sources?id=movie_id"
```

### Stream Video via Proxy
```bash
curl "https://your-project.vercel.app/api/proxy?url=https://example.com/video.mp4"
```

## Error Handling

### Authentication Errors (401/403)

If you receive a 403 Forbidden error:

```json
{
  "status": 403,
  "success": false,
  "message": "Authentication failed. Please check your API key.",
  "code": "FORBIDDEN"
}
```

**Solutions:**
1. Verify your `GIFTED_API_KEY` is correct in Vercel environment variables
2. Check that the API key format is valid (should be like `gifted_movieapi_...`)
3. Ensure the Bearer token is properly formatted: `Authorization: Bearer YOUR_KEY`
4. Verify your API key hasn't expired or been revoked

### API Unavailable (503/502)

If you get a 503 or 502 error, the GiftedTech API is likely down. Check:
- https://movieapi.giftedtech.co.ke status
- Your internet connection
- API rate limits

## Bearer Token Format

The proxy automatically formats your API key as a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

You don't need to add this header yourself - the `apiClient.js` handles it automatically.

## CORS Configuration

All endpoints have the following CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-CSRF-Token
Access-Control-Allow-Credentials: true
```

This allows the API to be called from web browsers and other clients.

## Video Proxy Usage

The `/api/proxy` endpoint allows you to stream videos through your server, bypassing CORS restrictions:

**Endpoint**: `GET /api/proxy?url=<video_url>`

**Parameters:**
- `url` (required): The full HTTPS URL of the video to stream

**Example:**
```javascript
// In your frontend
const videoUrl = 'https://example.com/video.mp4';
const proxyUrl = `https://your-project.vercel.app/api/proxy?url=${encodeURIComponent(videoUrl)}`;

// Use in video player
<video src={proxyUrl} controls></video>
```

**Security Notes:**
- Only http and https URLs are allowed
- Invalid URLs are rejected with a 400 error
- The proxy has a 30-second timeout to prevent hanging connections

## Troubleshooting

### Getting 403 errors

1. Check environment variable is set:
```bash
# In Vercel, this is in Settings → Environment Variables
```

2. Verify the API key format in your Vercel settings matches exactly what you were given

3. Test locally with `.env.local` first:
```bash
GIFTED_API_KEY=your_key_here npm run dev
```

### Getting CORS errors

- Ensure you're using the proxy endpoints (e.g., `/api/v2/search`)
- Check that CORS headers are present in the response
- Browser console will show the exact CORS error

### Video not loading

- Test the video URL directly in a browser
- Check that the URL is publicly accessible
- Use the `/api/proxy?url=...` endpoint for CORS-protected videos

## Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Rotate keys regularly** - Change your API key periodically
3. **Use HTTPS only** - All requests go through HTTPS
4. **Monitor usage** - Check GiftedTech API logs for suspicious activity
5. **Validate URLs** - The proxy validates URLs before fetching

## Performance Tips

- Cache responses in your frontend (5-10 minute TTL recommended)
- Use pagination for search results
- Don't make duplicate requests for the same content
- Consider using a CDN cache layer in front of Vercel

## Support

For issues with:
- **This proxy**: Create an issue on GitHub
- **GiftedTech API**: Contact https://giftedtech.co.ke
- **Vercel deployment**: Check Vercel docs at https://vercel.com/docs

## License

MIT
