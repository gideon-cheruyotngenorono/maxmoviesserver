const axios = require('axios');

class MovieAPIClient {
  constructor() {
    this.baseURL = 'https://movieapi.giftedtech.co.ke/api/v2';
    
    // Get API key from environment variables
    this.apiKey = process.env.GIFTED_API_KEY;
    
    if (!this.apiKey) {
      console.error('Warning: GIFTED_API_KEY environment variable is not set');
    }
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      
      // Handle authentication errors specifically
      if (status === 401 || status === 403) {
        return {
          status: status,
          message: 'Authentication failed. Please check your API key.',
          code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN',
          data: error.response.data
        };
      }
      
      return {
        status: status,
        message: error.response.data?.message || 'API request failed',
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 503,
        message: 'No response from movie API',
        code: 'SERVICE_UNAVAILABLE'
      };
    } else {
      // Something happened in setting up the request
      return {
        status: 500,
        message: 'Error setting up request',
        code: 'INTERNAL_ERROR'
      };
    }
  }
}

module.exports = new MovieAPIClient();
