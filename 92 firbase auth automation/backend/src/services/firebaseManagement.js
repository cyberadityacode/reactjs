const { google } = require('googleapis');
const axios = require('axios');
const logger = require('../utils/logger');

class FirebaseManagementService {
  constructor() {
    this.baseUrl = 'https://firebase.googleapis.com/v1beta1';
    this.resourceManagerUrl = 'https://cloudresourcemanager.googleapis.com/v1';
  }

  /**
   * Initialize Google APIs client with user tokens
   */
  initializeClient(accessToken) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    
    return {
      firebase: google.firebase({ version: 'v1beta1', auth }),
      resourceManager: google.cloudresourcemanager({ version: 'v1', auth }),
      serviceUsage: google.serviceusage({ version: 'v1', auth }),
      auth
    };
  }

  /**
   * List available Google Cloud projects
   */
  async listCloudProjects(accessToken) {
    try {
      const { resourceManager } = this.initializeClient(accessToken);
      
      const response = await resourceManager.projects.list();
      
      return response.data.projects || [];
    } catch (error) {
      logger.error('Error listing cloud projects:', error);
      throw new Error('Failed to list Google Cloud projects');
    }
  }

  /**
   * Create a new Google Cloud project
   */
  async createCloudProject(accessToken, projectData) {
    try {
      const { resourceManager } = this.initializeClient(accessToken);
      
      const projectRequest = {
        projectId: projectData.projectId,
        name: projectData.name || projectData.projectId,
        labels: projectData.labels || {}
      };

      const response = await resourceManager.projects.create({
        requestBody: projectRequest
      });

      // Wait for project creation to complete
      await this.waitForOperation(accessToken, response.data.name);
      
      return response.data;
    } catch (error) {
      logger.error('Error creating cloud project:', error);
      throw new Error(`Failed to create Google Cloud project: ${error.message}`);
    }
  }

  /**
   * Wait for long-running operation to complete
   */
  async waitForOperation(accessToken, operationName, maxWaitTime = 300000) {
    const { resourceManager } = this.initializeClient(accessToken);
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const operation = await resourceManager.operations.get({
          name: operationName
        });
        
        if (operation.data.done) {
          if (operation.data.error) {
            throw new Error(`Operation failed: ${operation.data.error.message}`);
          }
          return operation.data.response;
        }
        
        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        logger.error('Error checking operation status:', error);
        throw error;
      }
    }
    
    throw new Error('Operation timeout');
  }

  /**
   * Enable required APIs for Firebase project
   */
  async enableFirebaseAPIs(accessToken, projectId) {
    try {
      const { serviceUsage } = this.initializeClient(accessToken);
      
      const requiredAPIs = [
        'firebase.googleapis.com',
        'firebaserules.googleapis.com',
        'firebaseremoteconfig.googleapis.com',
        'firebasedatabase.googleapis.com',
        'firestore.googleapis.com',
        'identitytoolkit.googleapis.com'
      ];

      const enablePromises = requiredAPIs.map(api => 
        serviceUsage.services.enable({
          name: `projects/${projectId}/services/${api}`
        })
      );

      await Promise.all(enablePromises);
      logger.info(`Enabled Firebase APIs for project: ${projectId}`);
      
      return true;
    } catch (error) {
      logger.error('Error enabling Firebase APIs:', error);
      throw new Error(`Failed to enable Firebase APIs: ${error.message}`);
    }
  }

  /**
   * Add Firebase to an existing Google Cloud project
   */
  async addFirebaseToProject(accessToken, projectId, displayName) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/projects/${projectId}:addFirebase`,
        {
          displayName: displayName || projectId
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Wait for Firebase setup to complete
      if (response.data.name) {
        await this.waitForFirebaseOperation(accessToken, response.data.name);
      }

      logger.info(`Firebase added to project: ${projectId}`);
      return response.data;
    } catch (error) {
      logger.error('Error adding Firebase to project:', error);
      throw new Error(`Failed to add Firebase to project: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Wait for Firebase operation to complete
   */
  async waitForFirebaseOperation(accessToken, operationName, maxWaitTime = 300000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await axios.get(
          `${this.baseUrl}/operations/${operationName.split('/').pop()}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (response.data.done) {
          if (response.data.error) {
            throw new Error(`Operation failed: ${response.data.error.message}`);
          }
          return response.data.response;
        }
        
        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        if (error.response?.status === 404) {
          // Operation might be completed already
          break;
        }
        logger.error('Error checking Firebase operation status:', error);
        throw error;
      }
    }
  }

  /**
   * Get Firebase project configuration
   */
  async getFirebaseProject(accessToken, projectId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/projects/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error getting Firebase project:', error);
      throw new Error(`Failed to get Firebase project: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * List Firebase projects for the authenticated user
   */
  async listFirebaseProjects(accessToken) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/projects`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.results || [];
    } catch (error) {
      logger.error('Error listing Firebase projects:', error);
      throw new Error(`Failed to list Firebase projects: ${error.message}`);
    }
  }

  /**
   * Create a complete Firebase project (Cloud project + Firebase setup + API enablement)
   */
  async createCompleteFirebaseProject(accessToken, projectConfig) {
    try {
      const { projectId, name, displayName, labels } = projectConfig;
      
      logger.info(`Starting Firebase project creation: ${projectId}`);

      // Step 1: Create Google Cloud project
      await this.createCloudProject(accessToken, {
        projectId,
        name,
        labels
      });

      logger.info(`Cloud project created: ${projectId}`);

      // Step 2: Enable required APIs
      await this.enableFirebaseAPIs(accessToken, projectId);

      // Step 3: Add Firebase to the project
      const firebaseProject = await this.addFirebaseToProject(accessToken, projectId, displayName);

      logger.info(`Firebase project creation completed: ${projectId}`);

      return {
        cloudProject: { projectId, name },
        firebaseProject,
        status: 'completed'
      };

    } catch (error) {
      logger.error('Error creating complete Firebase project:', error);
      throw error;
    }
  }

  /**
   * Delete Firebase project
   */
  async deleteFirebaseProject(accessToken, projectId) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/projects/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      logger.info(`Firebase project deleted: ${projectId}`);
      return response.data;
    } catch (error) {
      logger.error('Error deleting Firebase project:', error);
      throw new Error(`Failed to delete Firebase project: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = new FirebaseManagementService();