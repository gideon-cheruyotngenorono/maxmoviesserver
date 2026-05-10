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
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'ID parameter is required'
      });
    }

    const data = await apiClient.get(`/info/${id}`);
    return res.status(200).json({
      status: 200,
      success: true,
      creator: "Max",
      ...data
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
