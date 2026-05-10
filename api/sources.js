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
  const seasonParam = req.query.season || season;
  const episodeParam = req.query.episode || episode;
    
    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'ID parameter is required'
      });
    }

    let params = {};
    if (seasonParam) params.season = seasonParam;
    if (episodeParam) params.episode = episodeParam;

    const data = await apiClient.get(`/sources/${id}`, params);
    
    // Remove GiftedTech creator field from API response
    const { creator, ...restData } = data;

    // If there are results, rewrite their stream/download URLs to point to our proxy
    let results = restData.results;
    if (results && Array.isArray(results)) {
      results = results.map(r => {
        const originalStream = r.stream_url || null;
        const originalDownload = r.download_url || null;
        const proxiedStream = originalStream ? `/api/proxy?url=${encodeURIComponent(originalStream)}` : null;
        const proxiedDownload = originalDownload ? `/api/proxy?url=${encodeURIComponent(originalDownload)}` : null;

        return {
          ...r,
          original_stream_url: originalStream,
          original_download_url: originalDownload,
          stream_url: proxiedStream,
          download_url: proxiedDownload
        };
      });
    }

    // Build the response with rewritten result URLs
    const response = {
      status: 200,
      success: true,
      creator: "Max",
      id: id,
      ...restData,
      results
    };

    // Also include sources_with_proxy if the API returned sources
    if (data.sources && Array.isArray(data.sources)) {
      response.sources_with_proxy = data.sources.map(source => ({
        ...source,
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
