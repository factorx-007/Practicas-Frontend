import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from '@/types/common';
import { ExperienciaLaboral } from '@/types/user';

// Usuario types from backend documentation
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | 'ADMIN';
  avatar?: string;
  telefono?: string;
  biografia?: string;
  ubicacion?: string;
  emailVerificado: boolean;
  perfilCompleto: boolean;
  activo: boolean;
  fechaCreacion: string;
  estudiante?: PerfilEstudiante;
  empresa?: PerfilEmpresa;
  institucion?: PerfilInstitucion;
  _count: {
    seguidores: number;
    siguiendo: number;
    postulaciones?: number;
    ofertas?: number;
  };
  isFollowing?: boolean;
}

export interface PerfilEstudiante {
  carrera?: string;
  universidad?: string;
  anio_ingreso?: number;
  anio_egreso?: number;
  telefono?: string;
  habilidades: string[];
  experiencia?: ExperienciaLaboral[]; // JSON field for work experiences
  portafolio?: string;
  linkedin?: string;
  github?: string;
  ubicacion?: string;
  cv?: string;
  tipo?: string;
}

export interface PerfilEmpresa {
  ruc: string;
  nombre_empresa: string;
  rubro: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  website?: string;
  logo_url?: string;
  verificada: boolean;
}

export interface PerfilInstitucion {
  codigo?: string;
  tipo?: string;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
  website?: string;
}

export interface UserSearchFilters {
  query?: string;
  rol?: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION';
  ubicacion?: string;
  carrera?: string;
  universidad?: string;
  habilidades?: string[];
  page?: number;
  limit?: number;
  activo?: boolean;
}

export interface UserSearchResponse {
  data: Usuario[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export class UsersService {
  /**
   * Get current user profile
   */
  static async getMyProfile(): Promise<ApiResponse<Usuario>> {
    return api.get<Usuario>(API_ENDPOINTS.USERS.PROFILE);
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<ApiResponse<Usuario>> {
    return api.get<Usuario>(`/users/${userId}`);
  }

  /**
   * Search users with filters
   */
  static async searchUsers(filters: UserSearchFilters = {}): Promise<ApiResponse<UserSearchResponse>> {
    const searchParams = new URLSearchParams();

    // Set default values
    searchParams.append('page', (filters.page || 1).toString());
    searchParams.append('limit', (filters.limit || 20).toString());

    // Add filters
    if (filters.query) searchParams.append('query', filters.query);
    if (filters.rol) searchParams.append('rol', filters.rol);
    if (filters.ubicacion) searchParams.append('ubicacion', filters.ubicacion);
    if (filters.carrera) searchParams.append('carrera', filters.carrera);
    if (filters.universidad) searchParams.append('universidad', filters.universidad);
    // if (filters.activo !== undefined) searchParams.append('activo', filters.activo.toString()); // Re-introducir filtro activo

    // Handle skills array
    if (filters.habilidades && filters.habilidades.length > 0) {
      filters.habilidades.forEach(skill => {
        searchParams.append('habilidades', skill);
      });
    }

    return api.get<UserSearchResponse>(`${API_ENDPOINTS.USERS.SEARCH}?${searchParams.toString()}`);
  }

  /**
   * Follow a user
   */
  static async followUser(userId: string): Promise<ApiResponse<void>> {
    return api.post(`/users/${userId}/follow`);
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(userId: string): Promise<ApiResponse<void>> {
    return api.delete(`/users/${userId}/follow`);
  }

  /**
   * Update basic user profile
   */
  static async updateProfile(data: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    biografia?: string;
    ubicacion?: string;
  }): Promise<ApiResponse<Usuario>> {
    return api.put<Usuario>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
  }

  /**
   * Update student profile with full support for nested operations
   */
  static async updateStudentProfile(data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> {
    return api.put<Record<string, unknown>>(API_ENDPOINTS.USERS.UPDATE_STUDENT_PROFILE, data);
  }

  /**
   * Update company profile
   */
  static async updateCompanyProfile(data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> {
    return api.put<Record<string, unknown>>(API_ENDPOINTS.USERS.UPDATE_COMPANY_PROFILE, data);
  }

  /**
   * Upload CV
   */
  static async uploadCV(file: File): Promise<ApiResponse<{ cv_url: string }>> {
    return api.uploadFile<{ cv_url: string }>(
      API_ENDPOINTS.USERS.UPLOAD_CV,
      file,
      'cv'
    );
  }

  /**
   * Upload image to company gallery
   */
  static async uploadGalleryImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    return api.uploadFile<{ imageUrl: string }>(
      '/users/me/company/gallery',
      file,
      'image'
    );
  }

  /**
   * Delete image from company gallery
   */
  static async deleteGalleryImage(imageUrl: string): Promise<ApiResponse<Record<string, unknown>>> {
    return api.delete('/users/me/company/gallery', {
      data: { imageUrl }
    });
  }

  /**
   * Add benefit to company
   */
  static async addCompanyBenefit(beneficioId: string, descripcion?: string): Promise<ApiResponse<Record<string, unknown>>> {
    return api.post('/users/me/company/benefits', {
      beneficioId,
      descripcion
    });
  }

  /**
   * Get company benefits
   */
  static async getCompanyBenefits(): Promise<ApiResponse<Record<string, unknown>[]>> {
    return api.get('/users/me/company/benefits');
  }

  /**
   * Delete company benefit
   */
  static async deleteCompanyBenefit(benefitId: string): Promise<ApiResponse<Record<string, unknown>>> {
    return api.delete(`/users/me/company/benefits/${benefitId}`);
  }

  /**
   * Get users for chat (available users to start conversations)
   * This is a simplified version that searches for users
   */
  static async getUsersForChat(filters: UserSearchFilters = {}): Promise<ApiResponse<UserSearchResponse>> {
    const chatFilters = {
      ...filters,
      limit: filters.limit || 50, // Get more users for chat selection
      // activo: true, // Por defecto, obtener solo usuarios activos para el chat
    };

    // Eliminar activo del filtro para evitar el error del backend
    delete chatFilters.activo;

    return this.searchUsers(chatFilters);
  }
}

export default UsersService;