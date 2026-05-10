const axios = require('axios');

class MovieAPIClient {
  constructor() {
    this.baseURL = 'https://movieapi.giftedtech.co.ke/api/v2';
    
    // Get API key from environment variables
    this.apiKey = process.env.GIFTED_API_KEY;
    
    if (!this.apiKey) {
      console.error('❌ ERROR: GIFTED_API_KEY environment variable is NOT set');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('API') || k.includes('KEY')));
    } else {
      // Log masked API key for debugging (first 20 chars + last 5)
      const masked = this.apiKey.substring(0, 20) + '...' + this.apiKey.substring(this.apiKey.length - 5);
      console.log('✅ API Key loaded:', masked);
      console.log('✅ API Key length:', this.apiKey.length);
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
    
    // Log axios interceptor to see actual requests
    this.client.interceptors.request.use(config => {
      console.log('📤 Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        hasAuthHeader: !!config.headers.Authorization,
        authHeaderStart: config.headers.Authorization ? config.headers.Authorization.substring(0, 30) : 'NONE'
      });
      return config;
    });
    
    this.client.interceptors.response.use(
      response => {
        console.log('📥 Response Success:', { status: response.status, url: response.config.url });
        return response;
      },
      error => {
        if (error.response) {
          console.log('❌ Response Error:', {
            status: error.response.status,
            url: error.config.url,
            message: error.response.data?.message || error.message
          });
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint, params = {}) {
    try {
      console.log('🔍 Fetching:', { endpoint, params });
      const response = await this.client.get(endpoint, { params });
      console.log('✅ Success:', { endpoint, status: response.status });
      return response.data;
    } catch (error) {
      console.error(`❌ API Error (${endpoint}):`, error.message);
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      }
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
