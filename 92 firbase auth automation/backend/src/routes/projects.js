const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { authenticateToken, requireGoogleAuth, requireFirebaseScopes } = require('../middleware/auth');
const firebaseManagement = require('../services/firebaseManagement');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireGoogleAuth);
router.use(requireFirebaseScopes);

/**
 * @route   GET /api/projects/cloud
 * @desc    Get list of Google Cloud projects
 * @access  Private
 */
router.get('/cloud', async (req, res) => {
  try {
    const projects = await firebaseManagement.listCloudProjects(req.googleTokens.access_token);
    
    res.json({
      success: true,
      projects: projects.map(project => ({
        projectId: project.projectId,
        name: project.name,
        lifecycleState: project.lifecycleState,
        createTime: project.createTime
      }))
    });
  } catch (error) {
    logger.error('Error listing cloud projects:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/projects/firebase
 * @desc    Get list of Firebase projects
 * @access  Private
 */
router.get('/firebase', async (req, res) => {
  try {
    const projects = await firebaseManagement.listFirebaseProjects(req.googleTokens.access_token);
    
    res.json({
      success: true,
      projects: projects.map(project => ({
        projectId: project.projectId,
        displayName: project.displayName,
        state: project.state,
        resources: project.resources
      }))
    });
  } catch (error) {
    logger.error('Error listing Firebase projects:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/projects/firebase/:projectId
 * @desc    Get specific Firebase project details
 * @access  Private
 */
router.get('/firebase/:projectId', [
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
    const project = await firebaseManagement.getFirebaseProject(req.googleTokens.access_token, projectId);
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    logger.error('Error getting Firebase project:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/projects/create
 * @desc    Create a new Firebase project
 * @access  Private
 */
router.post('/create', [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .matches(/^[a-z][a-z0-9-]*[a-z0-9]$/)
    .withMessage('Project ID must start with a letter, contain only lowercase letters, numbers, and hyphens, and end with a letter or number')
    .isLength({ min: 6, max: 30 })
    .withMessage('Project ID must be between 6 and 30 characters'),
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Project name must be between 1 and 50 characters'),
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be between 1 and 50 characters'),
  body('labels')
    .optional()
    .isObject()
    .withMessage('Labels must be an object')
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

    const { projectId, name, displayName, labels } = req.body;

    logger.info(`Creating Firebase project: ${projectId} for user: ${req.user.email}`);

    const result = await firebaseManagement.createCompleteFirebaseProject(
      req.googleTokens.access_token,
      {
        projectId,
        name: name || projectId,
        displayName: displayName || projectId,
        labels
      }
    );

    res.status(201).json({
      success: true,
      message: 'Firebase project created successfully',
      project: result
    });

  } catch (error) {
    logger.error('Error creating Firebase project:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/add-firebase
 * @desc    Add Firebase to existing Google Cloud project
 * @access  Private
 */
router.post('/:projectId/add-firebase', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be between 1 and 50 characters')
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
    const { displayName } = req.body;

    logger.info(`Adding Firebase to project: ${projectId} for user: ${req.user.email}`);

    // First enable required APIs
    await firebaseManagement.enableFirebaseAPIs(req.googleTokens.access_token, projectId);

    // Then add Firebase
    const result = await firebaseManagement.addFirebaseToProject(
      req.googleTokens.access_token,
      projectId,
      displayName
    );

    res.json({
      success: true,
      message: 'Firebase added to project successfully',
      project: result
    });

  } catch (error) {
    logger.error('Error adding Firebase to project:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/projects/firebase/:projectId
 * @desc    Delete Firebase project
 * @access  Private
 */
router.delete('/firebase/:projectId', [
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

    logger.info(`Deleting Firebase project: ${projectId} for user: ${req.user.email}`);

    await firebaseManagement.deleteFirebaseProject(req.googleTokens.access_token, projectId);

    res.json({
      success: true,
      message: 'Firebase project deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting Firebase project:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/projects/validate
 * @desc    Validate project ID availability
 * @access  Private
 */
router.post('/validate', [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .matches(/^[a-z][a-z0-9-]*[a-z0-9]$/)
    .withMessage('Project ID must start with a letter, contain only lowercase letters, numbers, and hyphens, and end with a letter or number')
    .isLength({ min: 6, max: 30 })
    .withMessage('Project ID must be between 6 and 30 characters')
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

    const { projectId } = req.body;

    try {
      // Try to get the project - if it exists, the ID is taken
      await firebaseManagement.getFirebaseProject(req.googleTokens.access_token, projectId);
      
      res.json({
        success: false,
        available: false,
        message: 'Project ID is already taken'
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('404')) {
        res.json({
          success: true,
          available: true,
          message: 'Project ID is available'
        });
      } else {
        throw error;
      }
    }

  } catch (error) {
    logger.error('Error validating project ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate project ID'
    });
  }
});

module.exports = router;