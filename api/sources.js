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
    
    // Rewrite stream/download URLs to use proxy
    let results = data.results || [];
    if (results && Array.isArray(results)) {
      results = results.map(r => ({
        id: r.id,
        quality: r.quality,
        size: r.size,
        format: r.format,
        stream_url: r.stream_url ? `/api/proxy?url=${encodeURIComponent(r.stream_url)}` : null,
        download_url: r.download_url ? `/api/proxy?url=${encodeURIComponent(r.download_url)}` : null
      }));
    }

    return res.status(200).json({
      status: 200,
      success: true,
      creator: "Max",
      id: id,
      results: results,
      subtitles: data.subtitles || []
    });
    
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: statusCode,
      success: false,
      creator: "Max",
      error: error.message || 'Internal server error'
    });
  }
};
