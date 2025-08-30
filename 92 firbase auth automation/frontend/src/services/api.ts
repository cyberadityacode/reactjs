import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Project {
  projectId: string;
  displayName?: string;
  name?: string;
  state?: string;
  resources?: any;
  lifecycleState?: string;
  createTime?: string;
}

export interface Database {
  name: string;
  databaseId: string;
  region?: string;
  type?: string;
  state?: string;
  databaseUrl?: string;
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    this.loadToken();
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private loadToken(): void {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  // Authentication
  async getGoogleAuthUrl(): Promise<string> {
    const response = await this.api.get<ApiResponse<{ authUrl: string }>>('/auth/google');
    return response.data.data?.authUrl || '';
  }

  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/google/callback', { code });
    if (response.data.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/refresh');
    if (response.data.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    const response = await this.api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response.data.data?.user || ({} as User);
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    this.clearToken();
  }

  async checkAuthStatus(): Promise<any> {
    const response = await this.api.get<ApiResponse>('/auth/status');
    return response.data;
  }

  // Project management
  async listCloudProjects(): Promise<Project[]> {
    const response = await this.api.get<ApiResponse<{ projects: Project[] }>>('/projects/cloud');
    return response.data.data?.projects || [];
  }

  async listFirebaseProjects(): Promise<Project[]> {
    const response = await this.api.get<ApiResponse<{ projects: Project[] }>>('/projects/firebase');
    return response.data.data?.projects || [];
  }

  async getFirebaseProject(projectId: string): Promise<Project> {
    const response = await this.api.get<ApiResponse<{ project: Project }>>(`/projects/firebase/${projectId}`);
    return response.data.data?.project || ({} as Project);
  }

  async createFirebaseProject(projectData: {
    projectId: string;
    name?: string;
    displayName?: string;
    labels?: Record<string, string>;
  }): Promise<any> {
    const response = await this.api.post<ApiResponse>('/projects/create', projectData);
    return response.data;
  }

  async addFirebaseToProject(projectId: string, displayName?: string): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/projects/${projectId}/add-firebase`, {
      displayName,
    });
    return response.data;
  }

  async deleteFirebaseProject(projectId: string): Promise<void> {
    await this.api.delete(`/projects/firebase/${projectId}`);
  }

  async validateProjectId(projectId: string): Promise<{ available: boolean; message: string }> {
    const response = await this.api.post<ApiResponse<{ available: boolean; message: string }>>('/projects/validate', {
      projectId,
    });
    return response.data.data || { available: false, message: 'Unknown error' };
  }

  // Real-time Database
  async createRealtimeDatabase(projectId: string, config: any): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/database/${projectId}/create`, config);
    return response.data;
  }

  async listRealtimeDatabases(projectId: string): Promise<Database[]> {
    const response = await this.api.get<ApiResponse<{ databases: Database[] }>>(`/database/${projectId}/list`);
    return response.data.data?.databases || [];
  }

  async getRealtimeDatabase(projectId: string, databaseId: string): Promise<Database> {
    const response = await this.api.get<ApiResponse<{ database: Database }>>(`/database/${projectId}/${databaseId}`);
    return response.data.data?.database || ({} as Database);
  }

  async setRealtimeDatabaseRules(projectId: string, databaseId: string, rules: string): Promise<any> {
    const response = await this.api.put<ApiResponse>(`/database/${projectId}/${databaseId}/rules`, { rules });
    return response.data;
  }

  async getRealtimeDatabaseRules(projectId: string, databaseId: string): Promise<any> {
    const response = await this.api.get<ApiResponse>(`/database/${projectId}/${databaseId}/rules`);
    return response.data.data?.rules || {};
  }

  async initializeRealtimeDatabase(projectId: string, databaseId: string, structure?: any): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/database/${projectId}/${databaseId}/initialize`, {
      structure,
    });
    return response.data;
  }

  async deleteRealtimeDatabase(projectId: string, databaseId: string): Promise<void> {
    await this.api.delete(`/database/${projectId}/${databaseId}`);
  }

  async getRealtimeDatabaseRuleTemplates(): Promise<any> {
    const response = await this.api.get<ApiResponse>('/database/templates/security-rules');
    return response.data.data?.templates || {};
  }

  // Firestore
  async createFirestore(projectId: string, config: any): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/firestore/${projectId}/create`, config);
    return response.data;
  }

  async listFirestoreDatabases(projectId: string): Promise<Database[]> {
    const response = await this.api.get<ApiResponse<{ databases: Database[] }>>(`/firestore/${projectId}/list`);
    return response.data.data?.databases || [];
  }

  async getFirestoreDatabase(projectId: string, databaseId: string): Promise<Database> {
    const response = await this.api.get<ApiResponse<{ database: Database }>>(`/firestore/${projectId}/${databaseId}`);
    return response.data.data?.database || ({} as Database);
  }

  async setFirestoreRules(projectId: string, rules: string): Promise<any> {
    const response = await this.api.put<ApiResponse>(`/firestore/${projectId}/rules`, { rules });
    return response.data;
  }

  async getFirestoreRules(projectId: string): Promise<any> {
    const response = await this.api.get<ApiResponse>(`/firestore/${projectId}/rules`);
    return response.data.data?.rules || {};
  }

  async validateFirestoreRules(projectId: string, rules: string): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/firestore/${projectId}/rules/validate`, { rules });
    return response.data.data?.validation || {};
  }

  async testFirestoreRules(projectId: string, rules: string, testCases: any[]): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/firestore/${projectId}/rules/test`, {
      rules,
      testCases,
    });
    return response.data.data?.testResults || {};
  }

  async initializeFirestoreCollections(projectId: string, databaseId: string, collections: any[]): Promise<any> {
    const response = await this.api.post<ApiResponse>(`/firestore/${projectId}/${databaseId}/collections/initialize`, {
      collections,
    });
    return response.data;
  }

  async getFirestoreRuleTemplates(): Promise<any> {
    const response = await this.api.get<ApiResponse>('/firestore/templates/rules');
    return response.data.data?.templates || {};
  }

  async getFirestoreCollectionTemplates(): Promise<any> {
    const response = await this.api.get<ApiResponse>('/firestore/templates/collections');
    return response.data.data?.templates || {};
  }
}

export const apiService = new ApiService();
export default apiService;