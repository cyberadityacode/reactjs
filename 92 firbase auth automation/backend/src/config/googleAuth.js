const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class GoogleAuth {
  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/firebase',
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/firebase.database',
      'https://www.googleapis.com/auth/datastore'
    ];
  }

  /**
   * Generate authorization URL for OAuth flow
   */
  getAuthUrl() {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.scopes,
      include_granted_scopes: true
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      logger.error('Error getting tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Verify and decode ID token
   */
  async verifyIdToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      return ticket.getPayload();
    } catch (error) {
      logger.error('Error verifying ID token:', error);
      throw new Error('Invalid ID token');
    }
  }

  /**
   * Get user info using access token
   */
  async getUserInfo(accessToken) {
    try {
      this.client.setCredentials({ access_token: accessToken });
      
      const response = await this.client.request({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo'
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error getting user info:', error);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      this.client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.client.refreshAccessToken();
      return credentials;
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Generate JWT token for session management
   */
  generateJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  /**
   * Verify JWT token
   */
  verifyJWT(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      logger.error('JWT verification error:', error);
      throw new Error('Invalid or expired JWT token');
    }
  }

  /**
   * Check if token has required scopes for Firebase operations
   */
  hasRequiredScopes(tokenInfo) {
    const requiredScopes = [
      'https://www.googleapis.com/auth/firebase',
      'https://www.googleapis.com/auth/cloud-platform'
    ];
    
    const userScopes = tokenInfo.scope ? tokenInfo.scope.split(' ') : [];
    return requiredScopes.every(scope => userScopes.includes(scope));
  }
}

module.exports = new GoogleAuth();