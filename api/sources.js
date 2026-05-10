const apiClient = require('../utils/apiClient');
const { setCorsHeaders, handleCorsPreFlight } = require('../utils/corsHeaders');

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
    const { id, season, episode } = req.query;
    
    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'ID parameter is required'
      });
    }

    let params = {};
    if (season) params.season = season;
    if (episode) params.episode = episode;

    const data = await apiClient.get(`/sources/${id}`, params);
    
    // Extract and include direct video URLs if available
    const response = {
      status: 200,
      success: true,
      creator: "Max",
      id: id,
      ...data
    };
    
    // If the API returns sources with URLs, include them with proxy options
    if (data.sources && Array.isArray(data.sources)) {
      response.sources_with_proxy = data.sources.map(source => ({
        ...source,
        // Add a proxy URL option for each source (client can choose direct or proxied)
        proxy_url: source.url ? `/api/proxy?url=${encodeURIComponent(source.url)}` : null
      }));
    }
    
    return res.status(200).json(response);
    
  } catch (error) {
    const statusCode = error.status || 500;
    const errorResponse = {
      status: statusCode,
      success: false,
      message: error.message || 'Internal server error'
    };
    
    if (error.code) {
      errorResponse.code = error.code;
    }
    
    return res.status(statusCode).json(errorResponse);
  }
};
