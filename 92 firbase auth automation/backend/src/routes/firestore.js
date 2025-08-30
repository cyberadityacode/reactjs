const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { authenticateToken, requireGoogleAuth, requireFirebaseScopes } = require('../middleware/auth');
const firestoreService = require('../services/firestore');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireGoogleAuth);
router.use(requireFirebaseScopes);

/**
 * @route   POST /api/firestore/:projectId/create
 * @desc    Create Firestore database for project
 * @access  Private
 */
router.post('/:projectId/create', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  body('databaseId')
    .optional()
    .matches(/^[a-z][a-z0-9-]*$/)
    .withMessage('Database ID must start with a letter and contain only lowercase letters, numbers, and hyphens'),
  body('locationId')
    .optional()
    .isIn(['nam5', 'eur3', 'asia-northeast1', 'us-central1', 'us-east1', 'us-west1', 'europe-west1', 'asia-southeast1'])
    .withMessage('Invalid location ID'),
  body('rulesTemplate')
    .optional()
    .isIn(['open', 'authenticated', 'userBased', 'readOnly', 'rolesBased', 'closed'])
    .withMessage('Invalid rules template'),
  body('customRules')
    .optional()
    .isString()
    .withMessage('Custom rules must be a string'),
  body('initializeCollections')
    .optional()
    .isBoolean()
    .withMessage('Initialize collections must be a boolean'),
  body('collections')
    .optional()
    .isArray()
    .withMessage('Collections must be an array')
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

    logger.info(`Creating Firestore database for project: ${projectId} by user: ${req.user.email}`);

    const result = await firestoreService.createFirestoreWithConfig(
      req.googleTokens.access_token,
      projectId,
      config
    );

    res.status(201).json({
      success: true,
      message: 'Firestore database created successfully',
      firestore: result
    });

  } catch (error) {
    logger.error('Error creating Firestore database:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/firestore/:projectId/list
 * @desc    List all Firestore databases in project
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

    const databases = await firestoreService.listFirestoreDatabases(
      req.googleTokens.access_token,
      projectId
    );

    res.json({
      success: true,
      databases
    });

  } catch (error) {
    logger.error('Error listing Firestore databases:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/firestore/:projectId/:databaseId
 * @desc    Get specific Firestore database details
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

    const database = await firestoreService.getFirestoreDatabase(
      req.googleTokens.access_token,
      projectId,
      databaseId
    );

    res.json({
      success: true,
      database
    });

  } catch (error) {
    logger.error('Error getting Firestore database:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/firestore/:projectId/rules
 * @desc    Update Firestore security rules
 * @access  Private
 */
router.put('/:projectId/rules', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  body('rules')
    .notEmpty()
    .withMessage('Security rules are required')
    .isString()
    .withMessage('Rules must be a string')
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
    const { rules } = req.body;

    logger.info(`Updating Firestore rules for project: ${projectId} by user: ${req.user.email}`);

    // Validate rules first
    const validation = await firestoreService.validateFirestoreRules(
      req.googleTokens.access_token,
      projectId,
      rules
    );

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Firestore rules',
        error: validation.error,
        issues: validation.issues
      });
    }

    const result = await firestoreService.setFirestoreRules(
      req.googleTokens.access_token,
      projectId,
      rules
    );

    res.json({
      success: true,
      message: 'Firestore rules updated successfully',
      rules: result
    });

  } catch (error) {
    logger.error('Error updating Firestore rules:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/firestore/:projectId/rules
 * @desc    Get current Firestore security rules
 * @access  Private
 */
router.get('/:projectId/rules', [
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

    const rules = await firestoreService.getFirestoreRules(
      req.googleTokens.access_token,
      projectId
    );

    res.json({
      success: true,
      rules
    });

  } catch (error) {
    logger.error('Error getting Firestore rules:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/firestore/:projectId/rules/validate
 * @desc    Validate Firestore security rules
 * @access  Private
 */
router.post('/:projectId/rules/validate', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  body('rules')
    .notEmpty()
    .withMessage('Security rules are required')
    .isString()
    .withMessage('Rules must be a string')
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
    const { rules } = req.body;

    const validation = await firestoreService.validateFirestoreRules(
      req.googleTokens.access_token,
      projectId,
      rules
    );

    res.json({
      success: true,
      validation
    });

  } catch (error) {
    logger.error('Error validating Firestore rules:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/firestore/:projectId/rules/test
 * @desc    Test Firestore security rules
 * @access  Private
 */
router.post('/:projectId/rules/test', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  body('rules')
    .notEmpty()
    .withMessage('Security rules are required')
    .isString()
    .withMessage('Rules must be a string'),
  body('testCases')
    .isArray()
    .withMessage('Test cases must be an array')
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
    const { rules, testCases } = req.body;

    const testResults = await firestoreService.testFirestoreRules(
      req.googleTokens.access_token,
      projectId,
      rules,
      testCases
    );

    res.json({
      success: true,
      testResults
    });

  } catch (error) {
    logger.error('Error testing Firestore rules:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/firestore/:projectId/:databaseId/collections/initialize
 * @desc    Initialize Firestore collections with sample data
 * @access  Private
 */
router.post('/:projectId/:databaseId/collections/initialize', [
  param('projectId').notEmpty().withMessage('Project ID is required'),
  param('databaseId').notEmpty().withMessage('Database ID is required'),
  body('collections')
    .isArray()
    .withMessage('Collections must be an array')
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
    const { collections } = req.body;

    logger.info(`Initializing Firestore collections for: ${databaseId} in project: ${projectId} by user: ${req.user.email}`);

    const result = await firestoreService.initializeFirestoreCollections(
      req.googleTokens.access_token,
      projectId,
      collections,
      databaseId
    );

    res.json({
      success: true,
      message: 'Firestore collections initialized successfully',
      collections: result
    });

  } catch (error) {
    logger.error('Error initializing Firestore collections:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/firestore/templates/rules
 * @desc    Get predefined Firestore security rule templates
 * @access  Private
 */
router.get('/templates/rules', (req, res) => {
  try {
    const templates = firestoreService.getFirestoreRuleTemplates();

    res.json({
      success: true,
      templates
    });

  } catch (error) {
    logger.error('Error getting Firestore rule templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Firestore rule templates'
    });
  }
});

/**
 * @route   GET /api/firestore/templates/collections
 * @desc    Get predefined collection templates
 * @access  Private
 */
router.get('/templates/collections', (req, res) => {
  try {
    const templates = {
      ecommerce: {
        name: 'E-commerce Store',
        description: 'Collections for an e-commerce application',
        collections: [
          {
            name: 'products',
            documents: [
              {
                id: 'sample-product-1',
                data: {
                  name: 'Sample Product',
                  description: 'This is a sample product',
                  price: 29.99,
                  category: 'electronics',
                  inStock: true,
                  createdAt: new Date(),
                  tags: ['sample', 'product', 'electronics']
                }
              }
            ]
          },
          {
            name: 'orders',
            documents: [
              {
                id: 'sample-order-1',
                data: {
                  userId: 'user123',
                  items: [],
                  total: 0,
                  status: 'pending',
                  createdAt: new Date()
                }
              }
            ]
          },
          {
            name: 'users',
            documents: [
              {
                id: 'sample-user-1',
                data: {
                  email: 'user@example.com',
                  displayName: 'Sample User',
                  role: 'customer',
                  createdAt: new Date()
                }
              }
            ]
          }
        ]
      },
      blog: {
        name: 'Blog Platform',
        description: 'Collections for a blog platform',
        collections: [
          {
            name: 'posts',
            documents: [
              {
                id: 'sample-post-1',
                data: {
                  title: 'Welcome to our blog',
                  content: 'This is a sample blog post',
                  authorId: 'author123',
                  published: true,
                  tags: ['welcome', 'blog'],
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              }
            ]
          },
          {
            name: 'authors',
            documents: [
              {
                id: 'sample-author-1',
                data: {
                  name: 'John Doe',
                  email: 'john@example.com',
                  bio: 'A sample author',
                  socialLinks: {
                    twitter: '@johndoe',
                    linkedin: 'johndoe'
                  },
                  createdAt: new Date()
                }
              }
            ]
          },
          {
            name: 'comments',
            documents: [
              {
                id: 'sample-comment-1',
                data: {
                  postId: 'sample-post-1',
                  authorName: 'Jane Reader',
                  content: 'Great post!',
                  approved: true,
                  createdAt: new Date()
                }
              }
            ]
          }
        ]
      },
      social: {
        name: 'Social Media App',
        description: 'Collections for a social media application',
        collections: [
          {
            name: 'users',
            documents: [
              {
                id: 'sample-user-1',
                data: {
                  username: 'john_doe',
                  email: 'john@example.com',
                  displayName: 'John Doe',
                  bio: 'Hello, I am John!',
                  profilePicture: '',
                  followers: 0,
                  following: 0,
                  createdAt: new Date()
                }
              }
            ]
          },
          {
            name: 'posts',
            documents: [
              {
                id: 'sample-post-1',
                data: {
                  userId: 'sample-user-1',
                  content: 'My first post!',
                  imageUrl: '',
                  likes: 0,
                  comments: 0,
                  createdAt: new Date()
                }
              }
            ]
          },
          {
            name: 'follows',
            documents: [
              {
                id: 'sample-follow-1',
                data: {
                  followerId: 'user1',
                  followingId: 'user2',
                  createdAt: new Date()
                }
              }
            ]
          }
        ]
      }
    };

    res.json({
      success: true,
      templates
    });

  } catch (error) {
    logger.error('Error getting collection templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get collection templates'
    });
  }
});

module.exports = router;