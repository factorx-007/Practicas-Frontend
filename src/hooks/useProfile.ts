import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/services/profile';
import { UserProfile } from '@/types/user';
import { useAuth } from './useAuth';

// Hook principal para obtener los datos del perfil del usuario autenticado.
export function useProfile() {
  const { user } = useAuth();

  return useQuery<UserProfile | null>({ // Especificamos el tipo de dato esperado
    queryKey: ['profile', user?.id], // La query key depende del ID de usuario
    queryFn: () => ProfileService.getProfile(),
    enabled: !!user, // Solo se ejecuta si hay un usuario autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });
}

// Hook de mutación para actualizar la información básica del perfil de usuario (no estudiante).
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileService.updateProfile,
    onSuccess: (updatedProfile: UserProfile) => {
      // Actualiza el cache del perfil usando el ID del perfil
      if (updatedProfile?.id) {
        queryClient.setQueryData(['profile', updatedProfile.id], updatedProfile);
      } else {
        // Fallback: invalidar si no se puede determinar una key específica
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error) => {
      console.error('Error actualizando el perfil:', error);
    },
  });
}

// Hook de mutación para actualizar CUALQUIER parte del perfil del estudiante.
// Utiliza el endpoint unificado PUT /api/users/me/student
export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProfileService.updateStudentProfile, // Llama al servicio que hace el PUT
    onSuccess: (updatedProfile: UserProfile) => {
      // Actualiza el cache de React Query con los nuevos datos del perfil
      queryClient.setQueryData(['profile', updatedProfile.id], updatedProfile);
      // Opcionalmente, se puede invalidar para forzar un refetch completo
      // queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Error actualizando el perfil de estudiante:', error);
      // Aquí se podría mostrar una notificación de error al usuario
    },
  });
}

// Hook para subir el avatar del usuario
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ProfileService.uploadAvatar,
    onSuccess: () => {
      // Invalida las queries para forzar un refetch de los datos del perfil y la sesión
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Error subiendo el avatar:', error);
    }
  });

  return {
    uploadAvatar: mutation.mutate,
    isUploading: mutation.isPending,
    error: mutation.error
  };
}