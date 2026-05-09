const axios = require('axios');
const { setCorsHeaders, handleCorsPreFlight } = require('../utils/corsHeaders');

/**
 * Proxy endpoint that fetches video content from a URL and streams it back
 * with CORS headers. Useful for bypassing CORS issues with external video hosts.
 * 
 * Usage: GET /api/proxy?url=https://example.com/video.mp4
 */
module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);
  
  // Handle CORS preflight requests
  const corsResult = handleCorsPreFlight(req, res);
  if (corsResult !== null) return corsResult;

  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 405,
      success: false,
      message: 'Method not allowed. Use GET.'
    });
  }

  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'URL query parameter is required'
      });
    }

    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Only http and https URLs are allowed'
      });
    }

    console.log(`Proxying video stream from: ${url}`);

    // Fetch the video with proper headers
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Set appropriate headers for video streaming
    const contentType = response.headers['content-type'] || 'video/mp4';
    const contentLength = response.headers['content-length'];
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Accept-Ranges', 'bytes');
    
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Pipe the response data to the client
    response.data.pipe(res);

  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'URL not found or domain does not exist'
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        status: 503,
        success: false,
        message: 'Cannot connect to the video source'
      });
    }
    
    if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        status: 504,
        success: false,
        message: 'Video source request timed out'
      });
    }

    return res.status(502).json({
      status: 502,
      success: false,
      message: 'Failed to proxy video stream',
      error: error.message
    });
  }
};
