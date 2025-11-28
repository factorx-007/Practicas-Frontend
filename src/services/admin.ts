import axios from '@/lib/axios';
import { 
  AdminUser, 
  UserDetails, 
  UserListResponse, 
  Offer, 
  OfferListResponse, 
  SystemStats, 
  SystemSettings, 
  FileUploadResponse,
  OfferStatus,
  FileType
} from '@/types/admin';
import { AxiosError } from 'axios';

interface AdminApiErrorData {
  message?: string;
  error?: { message: string };
}

// Interfaces para solicitudes
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserFilterParams {
  page?: number;
  limit?: number;
  rol?: string;
  activo?: boolean;
  search?: string;
  sort?: string;
}

export interface OfferFilterParams {
  page?: number;
  limit?: number;
  estado?: OfferStatus;
  empresa?: string;
  sort?: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: string;
  detalles?: Record<string, unknown>;
}

export interface UserUpdateRequest {
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  avatar?: string;
  detalles?: Record<string, unknown>;
}

export interface OfferStatusUpdateRequest {
  estado: OfferStatus;
  comentario?: string;
}

export interface SettingsUpdateRequest {
  general?: Partial<SystemSettings['general']>;
  correo?: Partial<SystemSettings['correo']>;
  notificaciones?: Partial<SystemSettings['notificaciones']>;
}

export const adminService = {
  // Autenticación
  async login(credentials: LoginRequest): Promise<{ data: { token: string; user: AdminUser } }> {
    try {
      const response = await axios.post<{ data: { token: string; user: AdminUser } }>('/admin/auth/login', credentials);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error de inicio de sesión');
    }
  },

  async getCurrentAdmin(): Promise<AdminUser> {
    try {
      const response = await axios.get<{ data: AdminUser }>('/admin/me');
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'No se pudo obtener el perfil del administrador');
    }
  },

  // Gestión de Usuarios
  async listUsers(params?: UserFilterParams): Promise<UserListResponse> {
    try {
      const response = await axios.get<{ data: UserListResponse }>('/admin/users', { params });
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al obtener lista de usuarios');
    }
  },

  async getUserDetails(userId: string): Promise<UserDetails> {
    try {
      const response = await axios.get<{ data: UserDetails }>(`/admin/users/${userId}`);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'No se pudieron obtener los detalles del usuario');
    }
  },

  async createUser(userData: UserCreateRequest): Promise<UserDetails> {
    try {
      const response = await axios.post<{ data: UserDetails }>('/admin/users', userData);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al crear usuario');
    }
  },

  async updateUser(userId: string, userData: UserUpdateRequest): Promise<UserDetails> {
    try {
      const response = await axios.put<{ data: UserDetails }>(`/admin/users/${userId}`, userData);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al actualizar usuario');
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await axios.delete(`/admin/users/${userId}`);
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al eliminar usuario');
    }
  },

  // Gestión de Ofertas
  async listOffers(params?: OfferFilterParams): Promise<OfferListResponse> {
    try {
      const response = await axios.get<{ data: OfferListResponse }>('/admin/offers', { params });
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al obtener lista de ofertas');
    }
  },

  async getOfferDetails(offerId: string): Promise<Offer> {
    try {
      const response = await axios.get<{ data: Offer }>(`/admin/offers/${offerId}`);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'No se pudieron obtener los detalles de la oferta');
    }
  },

  async updateOfferStatus(offerId: string, statusData: OfferStatusUpdateRequest): Promise<Offer> {
    try {
      const response = await axios.put<{ data: Offer }>(`/admin/offers/${offerId}/status`, statusData);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al actualizar estado de oferta');
    }
  },

  async deleteOffer(offerId: string): Promise<void> {
    try {
      await axios.delete(`/admin/offers/${offerId}`);
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al eliminar oferta');
    }
  },

  // Estadísticas del Sistema
  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await axios.get<{ data: SystemStats }>('/admin/stats');
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al obtener estadísticas');
    }
  },

  // Configuraciones del Sistema
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await axios.get<{ data: SystemSettings }>('/admin/settings');
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al obtener configuraciones');
    }
  },

  async updateSystemSettings(settings: SettingsUpdateRequest): Promise<SystemSettings> {
    try {
      const response = await axios.put<{ data: SystemSettings }>('/admin/settings', settings);
      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al actualizar configuraciones');
    }
  },

  // Gestión de Archivos
  async uploadFile(file: File, tipo: FileType, descripcion?: string): Promise<FileUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', tipo);
      if (descripcion) {
        formData.append('descripcion', descripcion);
      }

      const response = await axios.post<{ data: FileUploadResponse }>('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data) {
        throw new Error('No se recibieron datos en la respuesta del servidor');
      }

      return response.data.data;
    } catch (error: unknown) {
      throw new Error(((error as AxiosError).response?.data as AdminApiErrorData)?.error?.message || 'Error al subir archivo');
    }
  }
};
