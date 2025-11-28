import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/constants';
import { ApiResponse } from '@/types/common';

import toast from 'react-hot-toast';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {},
  withCredentials: true, // Enable sending cookies with requests
});

// Auth Manager Class - Updated for HTTP-only cookies
export class AuthManager {
  // Authentication state management
  static async checkAuth(): Promise<boolean> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.CHECK);
      return response.data.success && response.data.data.authenticated;
    } catch (error: unknown) {
      // If it's a network error or 500, might be server down
      const response = (error as AxiosError).response;
      if (!response || response.status >= 500) {
        console.warn('Server might be down, assuming not authenticated');
      }
      return false;
    }
  }

  static isAuthenticated(): boolean {
    // For HTTP-only cookies, we need to check with the server
    // This will be handled by the auth initialization process
    // For now, we'll rely on the auth store state
    return false; // Will be overridden by store initialization
  }

  static setTokens(): void {
    // Tokens are now managed via HTTP-only cookies by the backend
    // This method is kept for API compatibility but does nothing
    console.log('✅ Tokens managed via HTTP-only cookies');
  }

  static clearTokens(): void {
    console.log('🗑️ [AuthManager] clearTokens called');
    if (typeof window === 'undefined') {
      console.log('⚠️ [AuthManager] Not in browser, skipping');
      return;
    }
    // Clear only user data from localStorage
    const hadUserData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    console.log('✅ [AuthManager] Local user data cleared. Had data:', hadUserData ? 'Yes' : 'No');
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.warn('Logout request failed, but continuing with local logout:', error);
    }
  }
}

// Request interceptor - cookies are handled automatically
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
    // No need to manually add Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh tokens via the backend endpoint
        const response = await apiClient.post(
          API_ENDPOINTS.AUTH.REFRESH,
          {} // Empty body since refresh token is in HTTP-only cookie
        );

        if (response.data.success) {
          // Tokens are automatically updated in cookies by the backend
          // Retry original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        AuthManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Class with typed methods
export class ApiClient {
  // Generic request method
  private static async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    console.log(`🌐 API ${method} request to:`, url);
    console.log('🌐 Request data:', data);
    
    try {
      const response = await apiClient.request({
        method,
        url,
        data,
        ...config,
      });
      console.log(`✅ API ${method} response from ${url}:`, response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error) as ApiResponse<T>;
    }
  }

  // Error handler
  private static handleError(error: unknown): ApiResponse<unknown> {
    console.error('API Error:', error);

    const response = (error as AxiosError).response;
    if (response) {
      const { status, data } = response;
      const errorData = data as { message?: string; error?: string; errors?: Record<string, string[]> };

      // Show user-friendly error messages
      if (status >= 500) {
        toast.error('Error del servidor. Por favor, inténtalo más tarde.');
      } else if (status === 404) {
        toast.error('Recurso no encontrado.');
      } else if (status === 403) {
        toast.error('No tienes permisos para realizar esta acción.');
      } else if (errorData?.message) {
        toast.error(errorData.message);
      }

      return {
        success: false,
        message: errorData?.message || 'Error en la solicitud',
        error: errorData?.error,
        errors: errorData?.errors,
      };
    } else if ((error as AxiosError).request) {
      // Network error
      toast.error('Error de conexión. Verifica tu conexión a internet.');
      return {
        success: false,
        message: 'Error de conexión',
        error: 'NETWORK_ERROR',
      };
    } else {
      // Other error
      toast.error('Error inesperado.');
      return {
        success: false,
        message: (error as Error).message || 'Error inesperado',
        error: 'UNKNOWN_ERROR',
      };
    }
  }

  // HTTP Methods
  static async get<T>(url: string, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config);
  }

  static async post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config);
  }

  static async put<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config);
  }

  static async patch<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config);
  }

  static async delete<T>(url: string, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  // File upload method
  static async uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, unknown>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
    }

    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      return this.handleError(error) as ApiResponse<T>;
    }
  }

  // Download file method
  static async downloadFile(
    url: string,
    filename?: string,
    config?: Record<string, unknown>
  ): Promise<void> {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob',
        ...config,
      });

      // Create blob link to download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Health check method
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch {
      return false;
    }
  }
}

// Export the configured api client for direct use if needed
export const api = ApiClient;

// Auto token refresh setup - simplified for HTTP-only cookies
if (typeof window !== 'undefined') {
  // Periodically check auth status with the server
  setInterval(() => {
    // Make a lightweight request to check auth status
    // The backend will automatically refresh tokens if needed
    api.get(API_ENDPOINTS.AUTH.ME).catch(() => {
      // If this fails, user will be redirected to login by the interceptor
    });
  }, 10 * 60 * 1000); // Check every 10 minutes
}

export default api;