import { api } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import {
  UserProfile,
  UpdateProfileData,
  ExperienciaLaboral,
  EducacionAcademica,
  Certificacion,
  Proyecto,
  EstudianteIdioma as Idioma,
} from '@/types/user';
import { UpdateStudentProfileRequest, ExperienciaLaboralInput } from '@/types/profile.types';

// A
// PI Service for Profile Management
export class ProfileService {
  // Get user profile
  static async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE);

    // Handle API response structure
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Error al obtener perfil');
  }

  // Update basic profile information
  static async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
  const response = await api.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Error al actualizar perfil');
  }

  // Update student profile
  static async updateStudentProfile(data: Partial<UpdateStudentProfileRequest>): Promise<UserProfile> {
    console.log('🟡 ProfileService.updateStudentProfile called with data:', data);
    console.log('🟡 API endpoint:', API_ENDPOINTS.USERS.UPDATE_STUDENT_PROFILE);

    // Debug: JSON serialize and check what's being sent
    console.log('🟡 JSON.stringify(data):', JSON.stringify(data));
    console.log('🟡 data.experiencias type:', typeof data.experiencias);
    console.log('🟡 data.experiencias array check:', Array.isArray(data.experiencias));
    if (data.experiencias && Array.isArray(data.experiencias)) {
      console.log('🟡 First experience object:', data.experiencias[0]);
      console.log('🟡 First experience JSON:', JSON.stringify(data.experiencias[0]));
      const firstExp = data.experiencias[0] as ExperienciaLaboral | string;
      console.log('🟡 Experience validation:', {
        hasId: typeof firstExp === 'object' ? !!firstExp?.id : false,
        hasEmpresa: typeof firstExp === 'object' ? !!firstExp?.empresa : false,
        hasPuesto: typeof firstExp === 'object' ? !!(firstExp as ExperienciaLaboral)?.cargo : false,
        isString: typeof firstExp === 'string',
        stringValue: typeof firstExp === 'string' ? firstExp : 'N/A'
      });
    }

    // Additional check: Verify data is not corrupted BEFORE sending
    if (data.experiencias && Array.isArray(data.experiencias)) {
      const hasCorruptedStrings = (data.experiencias as (ExperienciaLaboral | string)[]).some(exp =>
        typeof exp === 'string' && (exp === '[object Object]' || exp.includes('[object Object]'))
      );
      if (hasCorruptedStrings) {
        console.error('🚨 CORRUPTION DETECTED IN FRONTEND BEFORE SENDING:', data.experiencias);
        throw new Error('Data corruption detected in frontend before sending to API');
      }
    }

    try {
      const response = await api.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE_STUDENT_PROFILE, data);
      console.log('🟡 API response:', response);

      if (response.success && response.data) {
        console.log('✅ updateStudentProfile successful, returning:', response.data);
        return response.data;
      }

      console.error('❌ updateStudentProfile failed:', response.message);
      throw new Error(response.message || 'Error al actualizar perfil de estudiante');
    } catch (error) {
      console.error('❌ updateStudentProfile error:', error);
      throw error;
    }
  }

  // Upload avatar (not implemented in backend yet)
  static async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<{ avatar: string }>(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Error al subir avatar');
  }

  // Experience endpoints - using updateStudentProfile until backend supports multiple experiences
  static async addExperience(data: ExperienciaLaboralInput): Promise<UserProfile> {
    console.log('🔵 ProfileService.addExperience called with data:', data);
    try {
      return await this.updateStudentProfile({ 
        experiencias: { create: [data] }
      });
    } catch (error) {
      console.error('❌ Error in addExperience:', error);
      throw error;
    }
  }

  static async updateExperience(id: string, data: Partial<ExperienciaLaboralInput>): Promise<UserProfile> {
    console.log('🔵 ProfileService.updateExperience called with id:', id, 'data:', data);
    try {
      return await this.updateStudentProfile({ 
        experiencias: { update: [{ where: { id }, data }] }
      });
    } catch (error) {
      console.error('❌ Error in updateExperience:', error);
      throw error;
    }
  }

  static async deleteExperience(id: string): Promise<UserProfile> {
    console.log('🔵 ProfileService.deleteExperience called with id:', id);
    try {
      return await this.updateStudentProfile({ 
        experiencias: { delete: [{ id }] }
      });
    } catch (error) {
      console.error('❌ Error in deleteExperience:', error);
      throw error;
    }
  }

  // Education endpoints (not implemented in backend yet - these would be part of student profile)
  static async addEducation(): Promise<EducacionAcademica> {
    throw new Error('Education management not implemented yet. Use updateStudentProfile instead.');
  }

  static async updateEducation(): Promise<EducacionAcademica> {
    throw new Error('Education management not implemented yet. Use updateStudentProfile instead.');
  }

  static async deleteEducation(): Promise<void> {
    throw new Error('Education management not implemented yet. Use updateStudentProfile instead.');
  }

  // Certification endpoints (not implemented in backend yet - these would be part of student profile)
  static async addCertification(): Promise<Certificacion> {
    throw new Error('Certification management not implemented yet. Use updateStudentProfile instead.');
  }

  static async updateCertification(): Promise<Certificacion> {
    throw new Error('Certification management not implemented yet. Use updateStudentProfile instead.');
  }

  static async deleteCertification(): Promise<void> {
    throw new Error('Certification management not implemented yet. Use updateStudentProfile instead.');
  }

  // Project endpoints (not implemented in backend yet - these would be part of student profile)
  static async addProject(): Promise<Proyecto> {
    throw new Error('Project management not implemented yet. Use updateStudentProfile instead.');
  }

  static async updateProject(): Promise<Proyecto> {
    throw new Error('Project management not implemented yet. Use updateStudentProfile instead.');
  }

  static async deleteProject(): Promise<void> {
    throw new Error('Project management not implemented yet. Use updateStudentProfile instead.');
  }

  // Skills endpoints (part of student profile update)
  static async updateSkills(habilidades: string[]): Promise<{ habilidades: string[] }> {
    const response = await api.put<{ habilidades: string[] }>(
      '/users/me/student',
      { habilidades }
    );
    
    // La respuesta tiene la estructura { success: boolean, message: string, data: { habilidades: string[] } }
    if (response.data && 'habilidades' in response.data) {
      return { habilidades: response.data.habilidades };
    }
    
    // Si la respuesta no tiene el formato esperado, devolver las habilidades originales
    return { habilidades };
  }

  // Languages endpoints (not implemented in backend yet)
  static async updateLanguages(): Promise<{ idiomas: Idioma[] }> {
    throw new Error('Language management not implemented yet. Use updateStudentProfile instead.');
  }

  // Profile visibility settings (not implemented in backend yet)
  static async updateVisibility(): Promise<void> {
    throw new Error('Visibility settings not implemented yet. Use updateStudentProfile instead.');
  }

  // Upload CV/Resume (not implemented in backend yet)
  static async uploadCV(file: File): Promise<{ cvUrl: string }> {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await api.post<{ cvUrl: string }>(API_ENDPOINTS.USERS.UPLOAD_CV, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Error al subir CV');
  }

  // Download CV (not implemented in backend yet)
  static async downloadCV(): Promise<Blob> {
    throw new Error('CV download not implemented yet.');
  }

  // Generate profile completion score (not implemented in backend yet)
  static async getProfileCompletionScore(): Promise<{
    score: number;
    suggestions: string[];
    breakdown: Record<string, { completed: boolean; weight: number }>;
  }> {
    throw new Error('Profile completion score not implemented yet.');
  }
}