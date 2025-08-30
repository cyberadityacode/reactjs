const express = require('express');
const { body, validationResult } = require('express-validator');
const googleAuth = require('../config/googleAuth');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Get Google OAuth authorization URL
 * @access  Public
 */
router.get('/google', (req, res) => {
  try {
    const authUrl = googleAuth.getAuthUrl();
    
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    logger.error('Error generating auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authorization URL'
    });
  }
});

/**
 * @route   POST /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.post('/google/callback', [
  body('code').notEmpty().withMessage('Authorization code is required')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { code } = req.body;

    // Exchange code for tokens
    const tokens = await googleAuth.getTokens(code);
    
    // Get user information
    const userInfo = await googleAuth.getUserInfo(tokens.access_token);
    
    // Verify ID token
    let idTokenPayload = null;
    if (tokens.id_token) {
      idTokenPayload = await googleAuth.verifyIdToken(tokens.id_token);
    }

    // Create user session data
    const userData = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      verified_email: userInfo.verified_email,
      googleTokens: tokens
    };

    // Generate JWT for session management
    const jwtToken = googleAuth.generateJWT(userData);

    logger.info(`User authenticated: ${userInfo.email}`);

    res.json({
      success: true,
      message: 'Authentication successful',
      token: jwtToken,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email
      }
    });

  } catch (error) {
    logger.error('OAuth callback error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Private
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const { googleTokens } = req.user;
    
    if (!googleTokens || !googleTokens.refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'No refresh token available'
      });
    }

    const newTokens = await googleAuth.refreshToken(googleTokens.refresh_token);
    
    // Update user data with new tokens
    const updatedUserData = {
      ...req.user,
      googleTokens: newTokens
    };

    // Generate new JWT
    const newJwtToken = googleAuth.generateJWT(updatedUserData);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token: newJwtToken
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to refresh token'
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { googleTokens } = req.user;
    
    // Get fresh user info from Google
    const userInfo = await googleAuth.getUserInfo(googleTokens.access_token);
    
    res.json({
      success: true,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        verified_email: userInfo.verified_email
      }
    });

  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

/**
 * @route   GET /api/auth/status
 * @desc    Check authentication status
 * @access  Private
 */
router.get('/status', authenticateToken, (req, res) => {
  try {
    const { googleTokens } = req.user;
    const hasRequiredScopes = googleAuth.hasRequiredScopes(googleTokens);
    
    res.json({
      success: true,
      authenticated: true,
      hasFirebaseAccess: hasRequiredScopes,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    logger.error('Auth status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check authentication status'
    });
  }
});

module.exports = router;