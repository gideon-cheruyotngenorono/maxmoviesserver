/**
 * Apply CORS headers to a response object
 * @param {Object} res - The HTTP response object
 * @returns {Object} The response object for chaining
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-CSRF-Token');
  res.setHeader('Content-Type', 'application/json');
  return res;
}

/**
 * Handle CORS preflight requests
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {boolean} True if preflight was handled, false otherwise
 */
function handleCorsPreFlight(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(200).end();
  }
  return null;
}

module.exports = {
  setCorsHeaders,
  handleCorsPreFlight
};
