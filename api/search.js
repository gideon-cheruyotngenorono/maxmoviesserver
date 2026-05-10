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
    const { query } = req.query;
    const page = req.query.page || 1;
    
    if (!query) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Query parameter is required'
      });
    }

    const data = await apiClient.get(`/search/${encodeURIComponent(query)}`, { page });
    
    // Remove GiftedTech creator from API response
    const { creator, ...restData } = data;
    
    return res.status(200).json({
      status: 200,
      success: true,
      creator: "Max",
      query: query,
      page: parseInt(page),
      ...restData
    });
    
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
