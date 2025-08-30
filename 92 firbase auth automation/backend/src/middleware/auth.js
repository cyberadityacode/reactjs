const googleAuth = require('../config/googleAuth');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = googleAuth.verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware to check if user has valid Google tokens
 */
const requireGoogleAuth = async (req, res, next) => {
  try {
    const { googleTokens } = req.user;
    
    if (!googleTokens || !googleTokens.access_token) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication required'
      });
    }

    // Check if access token is still valid
    try {
      await googleAuth.getUserInfo(googleTokens.access_token);
      req.googleTokens = googleTokens;
      next();
    } catch (error) {
      // Try to refresh token if we have a refresh token
      if (googleTokens.refresh_token) {
        try {
          const newTokens = await googleAuth.refreshToken(googleTokens.refresh_token);
          req.googleTokens = newTokens;
          
          // Update user tokens in session (you might want to update in database)
          req.user.googleTokens = newTokens;
          
          next();
        } catch (refreshError) {
          logger.error('Token refresh error:', refreshError);
          return res.status(401).json({
            success: false,
            message: 'Google authentication expired. Please re-authenticate.'
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: 'Google authentication expired. Please re-authenticate.'
        });
      }
    }
  } catch (error) {
    logger.error('Google auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware to check if user has required Firebase scopes
 */
const requireFirebaseScopes = (req, res, next) => {
  try {
    const { googleTokens } = req;
    
    if (!googleAuth.hasRequiredScopes(googleTokens)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for Firebase operations'
      });
    }
    
    next();
  } catch (error) {
    logger.error('Firebase scope check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Permission check failed'
    });
  }
};

module.exports = {
  authenticateToken,
  requireGoogleAuth,
  requireFirebaseScopes
};