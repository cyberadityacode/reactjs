const axios = require('axios');
const logger = require('../utils/logger');

class RealtimeDatabaseService {
  constructor() {
    this.baseUrl = 'https://firebase.googleapis.com/v1beta1';
    this.databaseUrl = 'https://firebasedatabase.googleapis.com/v1beta';
  }

  /**
   * Create a Real-time Database instance
   */
  async createDatabase(accessToken, projectId, databaseConfig = {}) {
    try {
      const {
        databaseId = 'default',
        region = 'us-central1',
        type = 'DEFAULT_DATABASE'
      } = databaseConfig;

      const requestBody = {
        databaseId,
        region,
        type
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

      logger.info(`Real-time Database created: ${databaseId} in project: ${projectId}`);
      return response.data;

    } catch (error) {
      logger.error('Error creating Real-time Database:', error);
      if (error.response?.status === 409) {
        throw new Error('Real-time Database already exists for this project');
      }
      throw new Error(`Failed to create Real-time Database: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get Real-time Database instance details
   */
  async getDatabase(accessToken, projectId, databaseId = 'default') {
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
      logger.error('Error getting Real-time Database:', error);
      throw new Error(`Failed to get Real-time Database: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * List all Real-time Database instances in a project
   */
  async listDatabases(accessToken, projectId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/projects/${projectId}/databases`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.instances || [];
    } catch (error) {
      logger.error('Error listing Real-time Databases:', error);
      throw new Error(`Failed to list Real-time Databases: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Set security rules for Real-time Database
   */
  async setSecurityRules(accessToken, projectId, rules, databaseId = 'default') {
    try {
      const requestBody = {
        rules: {
          rules
        }
      };

      const response = await axios.put(
        `${this.databaseUrl}/projects/${projectId}/databases/${databaseId}/rules`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Security rules updated for database: ${databaseId} in project: ${projectId}`);
      return response.data;

    } catch (error) {
      logger.error('Error setting Real-time Database security rules:', error);
      throw new Error(`Failed to set security rules: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get current security rules for Real-time Database
   */
  async getSecurityRules(accessToken, projectId, databaseId = 'default') {
    try {
      const response = await axios.get(
        `${this.databaseUrl}/projects/${projectId}/databases/${databaseId}/rules`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error getting Real-time Database security rules:', error);
      throw new Error(`Failed to get security rules: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Delete Real-time Database instance
   */
  async deleteDatabase(accessToken, projectId, databaseId = 'default') {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/projects/${projectId}/databases/${databaseId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      logger.info(`Real-time Database deleted: ${databaseId} in project: ${projectId}`);
      return response.data;

    } catch (error) {
      logger.error('Error deleting Real-time Database:', error);
      throw new Error(`Failed to delete Real-time Database: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Initialize database with sample data structure
   */
  async initializeDatabaseStructure(accessToken, projectId, databaseId = 'default', structure = null) {
    try {
      // Get database URL
      const database = await this.getDatabase(accessToken, projectId, databaseId);
      const databaseUrl = database.databaseUrl;

      const defaultStructure = {
        users: {
          '.info': 'User profiles and data'
        },
        posts: {
          '.info': 'Application posts or content'
        },
        settings: {
          appName: 'My Firebase App',
          version: '1.0.0',
          initialized: new Date().toISOString()
        }
      };

      const dataToWrite = structure || defaultStructure;

      const response = await axios.put(
        `${databaseUrl}.json`,
        dataToWrite,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Database structure initialized for: ${databaseId} in project: ${projectId}`);
      return response.data;

    } catch (error) {
      logger.error('Error initializing database structure:', error);
      throw new Error(`Failed to initialize database structure: ${error.message}`);
    }
  }

  /**
   * Get predefined security rule templates
   */
  getSecurityRuleTemplates() {
    return {
      open: {
        name: 'Open Access (Development Only)',
        description: 'Allows read and write access to all users. Only use for development.',
        rules: JSON.stringify({
          "rules": {
            ".read": true,
            ".write": true
          }
        }, null, 2)
      },
      authenticated: {
        name: 'Authenticated Users Only',
        description: 'Requires users to be authenticated to read/write data.',
        rules: JSON.stringify({
          "rules": {
            ".read": "auth != null",
            ".write": "auth != null"
          }
        }, null, 2)
      },
      userBased: {
        name: 'User-based Access',
        description: 'Users can only access their own data under /users/{uid}.',
        rules: JSON.stringify({
          "rules": {
            "users": {
              "$uid": {
                ".read": "$uid === auth.uid",
                ".write": "$uid === auth.uid"
              }
            }
          }
        }, null, 2)
      },
      readOnly: {
        name: 'Read Only',
        description: 'Allows read access to authenticated users, no write access.',
        rules: JSON.stringify({
          "rules": {
            ".read": "auth != null",
            ".write": false
          }
        }, null, 2)
      },
      closed: {
        name: 'Closed Access',
        description: 'Denies all read and write access. Use with caution.',
        rules: JSON.stringify({
          "rules": {
            ".read": false,
            ".write": false
          }
        }, null, 2)
      }
    };
  }

  /**
   * Validate security rules format
   */
  validateSecurityRules(rules) {
    try {
      if (typeof rules === 'string') {
        JSON.parse(rules);
      } else if (typeof rules === 'object') {
        JSON.stringify(rules);
      } else {
        throw new Error('Rules must be a valid JSON string or object');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid security rules format: ' + error.message);
    }
  }

  /**
   * Create database with initial configuration
   */
  async createDatabaseWithConfig(accessToken, projectId, config) {
    try {
      const {
        databaseId = 'default',
        region = 'us-central1',
        securityRulesTemplate = 'authenticated',
        customRules = null,
        initializeStructure = true,
        initialData = null
      } = config;

      // Step 1: Create the database
      const database = await this.createDatabase(accessToken, projectId, {
        databaseId,
        region
      });

      // Step 2: Set security rules
      let rulesToApply;
      if (customRules) {
        this.validateSecurityRules(customRules);
        rulesToApply = typeof customRules === 'string' ? customRules : JSON.stringify(customRules);
      } else {
        const templates = this.getSecurityRuleTemplates();
        rulesToApply = templates[securityRulesTemplate]?.rules || templates.authenticated.rules;
      }

      await this.setSecurityRules(accessToken, projectId, rulesToApply, databaseId);

      // Step 3: Initialize structure if requested
      if (initializeStructure) {
        await this.initializeDatabaseStructure(accessToken, projectId, databaseId, initialData);
      }

      logger.info(`Real-time Database fully configured: ${databaseId} in project: ${projectId}`);

      return {
        database,
        rulesApplied: rulesToApply,
        structureInitialized: initializeStructure
      };

    } catch (error) {
      logger.error('Error creating database with configuration:', error);
      throw error;
    }
  }
}

module.exports = new RealtimeDatabaseService();