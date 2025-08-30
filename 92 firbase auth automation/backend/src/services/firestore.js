const axios = require('axios');
const logger = require('../utils/logger');

class FirestoreService {
  constructor() {
    this.baseUrl = 'https://firestore.googleapis.com/v1';
    this.rulesUrl = 'https://firebaserules.googleapis.com/v1';
  }

  /**
   * Create Firestore database
   */
  async createFirestoreDatabase(accessToken, projectId, databaseConfig = {}) {
    try {
      const {
        databaseId = '(default)',
        locationId = 'nam5', // Multi-region location
        type = 'FIRESTORE_NATIVE'
      } = databaseConfig;

      const requestBody = {
        database: {
          name: `projects/${projectId}/databases/${databaseId}`,
          locationId,
          type
        },
        databaseId
      };

      const response = await axios.post(
        `${this.baseUrl}/projects/${projectId}/databases`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Firestore database created: ${databaseId} in project: ${projectId}`);
      return response.data;

    } catch (error) {
      logger.error('Error creating Firestore database:', error);
      if (error.response?.status === 409) {
        throw new Error('Firestore database already exists for this project');
      }
      throw new Error(`Failed to create Firestore database: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get Firestore database details
   */
  async getFirestoreDatabase(accessToken, projectId, databaseId = '(default)') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/projects/${projectId}/databases/${databaseId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error getting Firestore database:', error);
      throw new Error(`Failed to get Firestore database: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * List Firestore databases in project
   */
  async listFirestoreDatabases(accessToken, projectId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/projects/${projectId}/databases`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.databases || [];
    } catch (error) {
      logger.error('Error listing Firestore databases:', error);
      throw new Error(`Failed to list Firestore databases: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Create or update Firestore security rules
   */
  async setFirestoreRules(accessToken, projectId, rulesContent, databaseId = '(default)') {
    try {
      // First, create a ruleset
      const rulesetResponse = await axios.post(
        `${this.rulesUrl}/projects/${projectId}/rulesets`,
        {
          source: {
            files: [
              {
                name: 'firestore.rules',
                content: rulesContent
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const rulesetName = rulesetResponse.data.name;

      // Then, release the ruleset to the database
      const releaseResponse = await axios.post(
        `${this.rulesUrl}/projects/${projectId}/releases`,
        {
          name: `projects/${projectId}/releases/cloud.firestore`,
          rulesetName: rulesetName
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Firestore rules updated for database: ${databaseId} in project: ${projectId}`);
      return {
        ruleset: rulesetResponse.data,
        release: releaseResponse.data
      };

    } catch (error) {
      logger.error('Error setting Firestore rules:', error);
      throw new Error(`Failed to set Firestore rules: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get current Firestore security rules
   */
  async getFirestoreRules(accessToken, projectId) {
    try {
      // Get the current release
      const releaseResponse = await axios.get(
        `${this.rulesUrl}/projects/${projectId}/releases/cloud.firestore`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const rulesetName = releaseResponse.data.rulesetName;

      // Get the ruleset content
      const rulesetResponse = await axios.get(
        `${this.rulesUrl}/${rulesetName}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return {
        release: releaseResponse.data,
        ruleset: rulesetResponse.data,
        rules: rulesetResponse.data.source?.files?.[0]?.content || ''
      };

    } catch (error) {
      logger.error('Error getting Firestore rules:', error);
      throw new Error(`Failed to get Firestore rules: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Test Firestore security rules
   */
  async testFirestoreRules(accessToken, projectId, rulesContent, testCases) {
    try {
      const response = await axios.post(
        `${this.rulesUrl}/projects/${projectId}:test`,
        {
          source: {
            files: [
              {
                name: 'firestore.rules',
                content: rulesContent
              }
            ]
          },
          testSuite: {
            testCases: testCases
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error testing Firestore rules:', error);
      throw new Error(`Failed to test Firestore rules: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Create initial collections with sample documents
   */
  async initializeFirestoreCollections(accessToken, projectId, collections, databaseId = '(default)') {
    try {
      const results = [];

      for (const collection of collections) {
        const { name, documents } = collection;

        for (const document of documents) {
          const { id, data } = document;
          
          const response = await axios.patch(
            `${this.baseUrl}/projects/${projectId}/databases/${databaseId}/documents/${name}/${id}`,
            {
              fields: this.convertToFirestoreFields(data)
            },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          results.push(response.data);
        }
      }

      logger.info(`Firestore collections initialized in project: ${projectId}`);
      return results;

    } catch (error) {
      logger.error('Error initializing Firestore collections:', error);
      throw new Error(`Failed to initialize Firestore collections: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Convert JavaScript objects to Firestore field format
   */
  convertToFirestoreFields(obj) {
    const fields = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        fields[key] = { stringValue: value };
      } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          fields[key] = { integerValue: value.toString() };
        } else {
          fields[key] = { doubleValue: value };
        }
      } else if (typeof value === 'boolean') {
        fields[key] = { booleanValue: value };
      } else if (value instanceof Date) {
        fields[key] = { timestampValue: value.toISOString() };
      } else if (Array.isArray(value)) {
        fields[key] = {
          arrayValue: {
            values: value.map(item => {
              if (typeof item === 'string') return { stringValue: item };
              if (typeof item === 'number') return Number.isInteger(item) ? { integerValue: item.toString() } : { doubleValue: item };
              if (typeof item === 'boolean') return { booleanValue: item };
              return { stringValue: item.toString() };
            })
          }
        };
      } else if (typeof value === 'object' && value !== null) {
        fields[key] = { mapValue: { fields: this.convertToFirestoreFields(value) } };
      } else {
        fields[key] = { nullValue: null };
      }
    }

    return fields;
  }

  /**
   * Get predefined Firestore security rule templates
   */
  getFirestoreRuleTemplates() {
    return {
      open: {
        name: 'Open Access (Development Only)',
        description: 'Allows read and write access to all users. Only use for development.',
        rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`
      },
      authenticated: {
        name: 'Authenticated Users Only',
        description: 'Requires users to be authenticated to read/write data.',
        rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`
      },
      userBased: {
        name: 'User-based Access',
        description: 'Users can only access their own data in user-specific collections.',
        rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own posts
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Public read access to certain collections
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`
      },
      readOnly: {
        name: 'Read Only',
        description: 'Allows read access to authenticated users, no write access.',
        rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}`
      },
      rolesBased: {
        name: 'Roles-based Access',
        description: 'Access control based on user roles stored in Firestore.',
        rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Admin access to everything
    match /{document=**} {
      allow read, write: if request.auth != null && getUserRole() == 'admin';
    }
    
    // Users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Content management for editors
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (getUserRole() in ['admin', 'editor'] || request.auth.uid == resource.data.authorId);
    }
  }
}`
      },
      closed: {
        name: 'Closed Access',
        description: 'Denies all read and write access. Use with caution.',
        rules: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`
      }
    };
  }

  /**
   * Validate Firestore security rules syntax
   */
  async validateFirestoreRules(accessToken, projectId, rulesContent) {
    try {
      // Create a test ruleset to validate syntax
      const response = await axios.post(
        `${this.rulesUrl}/projects/${projectId}/rulesets`,
        {
          source: {
            files: [
              {
                name: 'firestore.rules',
                content: rulesContent
              }
            ]
          },
          testOnly: true
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        valid: true,
        issues: response.data.issues || []
      };

    } catch (error) {
      logger.error('Error validating Firestore rules:', error);
      return {
        valid: false,
        error: error.response?.data?.error?.message || error.message,
        issues: error.response?.data?.error?.details || []
      };
    }
  }

  /**
   * Create Firestore database with initial configuration
   */
  async createFirestoreWithConfig(accessToken, projectId, config) {
    try {
      const {
        databaseId = '(default)',
        locationId = 'nam5',
        rulesTemplate = 'authenticated',
        customRules = null,
        initializeCollections = true,
        collections = []
      } = config;

      // Step 1: Create Firestore database
      const database = await this.createFirestoreDatabase(accessToken, projectId, {
        databaseId,
        locationId
      });

      // Step 2: Set security rules
      let rulesToApply;
      if (customRules) {
        rulesToApply = customRules;
      } else {
        const templates = this.getFirestoreRuleTemplates();
        rulesToApply = templates[rulesTemplate]?.rules || templates.authenticated.rules;
      }

      const rulesResult = await this.setFirestoreRules(accessToken, projectId, rulesToApply, databaseId);

      // Step 3: Initialize collections if requested
      let collectionsResult = null;
      if (initializeCollections && collections.length > 0) {
        collectionsResult = await this.initializeFirestoreCollections(accessToken, projectId, collections, databaseId);
      }

      logger.info(`Firestore database fully configured: ${databaseId} in project: ${projectId}`);

      return {
        database,
        rules: rulesResult,
        collections: collectionsResult,
        rulesApplied: rulesToApply
      };

    } catch (error) {
      logger.error('Error creating Firestore with configuration:', error);
      throw error;
    }
  }
}

module.exports = new FirestoreService();