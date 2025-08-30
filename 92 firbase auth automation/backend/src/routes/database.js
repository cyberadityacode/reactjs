const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { authenticateToken, requireGoogleAuth, requireFirebaseScopes } = require('../middleware/auth');
const realtimeDatabaseService = require('../services/realtimeDatabase');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireGoogleAuth);
router.use(requireFirebaseScopes);

/**
 * @route   POST /api/database/:projectId/create
 * @desc    Create Real-time Database for project
 * @access  Private
 */
router.post('/:projectId/create', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  body('databaseId')
    .optional()
    .matches(/^[a-z][a-z0-9-]*$/)
    .withMessage('Database ID must start with a letter and contain only lowercase letters, numbers, and hyphens'),
  body('region')
    .optional()
    .isIn(['us-central1', 'europe-west1', 'asia-southeast1'])
    .withMessage('Invalid region'),
  body('securityRulesTemplate')
    .optional()
    .isIn(['open', 'authenticated', 'userBased', 'readOnly', 'closed'])
    .withMessage('Invalid security rules template'),
  body('customRules')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          if (typeof value === 'string') {
            JSON.parse(value);
          }
          return true;
        } catch (error) {
          throw new Error('Custom rules must be valid JSON');
        }
      }
      return true;
    }),
  body('initializeStructure')
    .optional()
    .isBoolean()
    .withMessage('Initialize structure must be a boolean'),
  body('initialData')
    .optional()
    .isObject()
    .withMessage('Initial data must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId } = req.params;
    const config = req.body;

    logger.info(`Creating Real-time Database for project: ${projectId} by user: ${req.user.email}`);

    const result = await realtimeDatabaseService.createDatabaseWithConfig(
      req.googleTokens.access_token,
      projectId,
      config
    );

    res.status(201).json({
      success: true,
      message: 'Real-time Database created successfully',
      database: result
    });

  } catch (error) {
    logger.error('Error creating Real-time Database:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/database/:projectId/list
 * @desc    List all Real-time Databases in project
 * @access  Private
 */
router.get('/:projectId/list', [
  param('projectId').notEmpty().withMessage('Project ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId } = req.params;

    const databases = await realtimeDatabaseService.listDatabases(
      req.googleTokens.access_token,
      projectId
    );

    res.json({
      success: true,
      databases
    });

  } catch (error) {
    logger.error('Error listing Real-time Databases:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/database/:projectId/:databaseId
 * @desc    Get specific Real-time Database details
 * @access  Private
 */
router.get('/:projectId/:databaseId', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  param('databaseId').notEmpty().withMessage('Database ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId, databaseId } = req.params;

    const database = await realtimeDatabaseService.getDatabase(
      req.googleTokens.access_token,
      projectId,
      databaseId
    );

    res.json({
      success: true,
      database
    });

  } catch (error) {
    logger.error('Error getting Real-time Database:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/database/:projectId/:databaseId/rules
 * @desc    Update security rules for Real-time Database
 * @access  Private
 */
router.put('/:projectId/:databaseId/rules', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  param('databaseId').notEmpty().withMessage('Database ID is required'),
  body('rules')
    .notEmpty()
    .withMessage('Security rules are required')
    .custom((value) => {
      try {
        if (typeof value === 'string') {
          JSON.parse(value);
        }
        return true;
      } catch (error) {
        throw new Error('Rules must be valid JSON');
      }
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId, databaseId } = req.params;
    const { rules } = req.body;

    logger.info(`Updating security rules for database: ${databaseId} in project: ${projectId} by user: ${req.user.email}`);

    const result = await realtimeDatabaseService.setSecurityRules(
      req.googleTokens.access_token,
      projectId,
      rules,
      databaseId
    );

    res.json({
      success: true,
      message: 'Security rules updated successfully',
      rules: result
    });

  } catch (error) {
    logger.error('Error updating security rules:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/database/:projectId/:databaseId/rules
 * @desc    Get current security rules for Real-time Database
 * @access  Private
 */
router.get('/:projectId/:databaseId/rules', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  param('databaseId').notEmpty().withMessage('Database ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId, databaseId } = req.params;

    const rules = await realtimeDatabaseService.getSecurityRules(
      req.googleTokens.access_token,
      projectId,
      databaseId
    );

    res.json({
      success: true,
      rules
    });

  } catch (error) {
    logger.error('Error getting security rules:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/database/:projectId/:databaseId/initialize
 * @desc    Initialize database structure with sample data
 * @access  Private
 */
router.post('/:projectId/:databaseId/initialize', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  param('databaseId').notEmpty().withMessage('Database ID is required'),
  body('structure')
    .optional()
    .isObject()
    .withMessage('Structure must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId, databaseId } = req.params;
    const { structure } = req.body;

    logger.info(`Initializing database structure for: ${databaseId} in project: ${projectId} by user: ${req.user.email}`);

    const result = await realtimeDatabaseService.initializeDatabaseStructure(
      req.googleTokens.access_token,
      projectId,
      databaseId,
      structure
    );

    res.json({
      success: true,
      message: 'Database structure initialized successfully',
      data: result
    });

  } catch (error) {
    logger.error('Error initializing database structure:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/database/:projectId/:databaseId
 * @desc    Delete Real-time Database
 * @access  Private
 */
router.delete('/:projectId/:databaseId', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  param('databaseId').notEmpty().withMessage('Database ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { projectId, databaseId } = req.params;

    logger.info(`Deleting Real-time Database: ${databaseId} in project: ${projectId} by user: ${req.user.email}`);

    await realtimeDatabaseService.deleteDatabase(
      req.googleTokens.access_token,
      projectId,
      databaseId
    );

    res.json({
      success: true,
      message: 'Real-time Database deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting Real-time Database:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/database/templates/security-rules
 * @desc    Get predefined security rule templates
 * @access  Private
 */
router.get('/templates/security-rules', (req, res) => {
  try {
    const templates = realtimeDatabaseService.getSecurityRuleTemplates();

    res.json({
      success: true,
      templates
    });

  } catch (error) {
    logger.error('Error getting security rule templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get security rule templates'
    });
  }
});

module.exports = router;