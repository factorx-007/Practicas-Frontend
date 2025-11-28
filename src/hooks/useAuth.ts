import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUser, useIsAuthenticated, useAuthLoading } from '@/store/authStore';
import { API_ENDPOINTS } from '@/constants';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { LoginData, RegisterData, UpdateProfileData } from '@/types/user';

// Main useAuth hook for components
export function useAuth() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}

// Login hook
export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      await login(credentials);
    },
    onSuccess: () => {
      toast.success('¡Bienvenido de vuelta!');
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al iniciar sesión');
    },
  });
}

// Register hook
export function useRegister() {
  const register = useAuthStore((state) => state.register);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      await register(data);
      return data; // Return data to access rol in onSuccess
    },
    onSuccess: (data) => {
      toast.success('¡Cuenta creada exitosamente!');
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Redirect to dashboard based on role
      const roleDashboards: { [key: string]: string } = {
        ESTUDIANTE: '/dashboard/estudiante',
        EMPRESA: '/dashboard/empresa',
        INSTITUCION: '/dashboard/institucion',
      };

      const targetPath = roleDashboards[data.rol] || '/dashboard';

      // Use window.location for full page reload to ensure auth state is fresh
      setTimeout(() => {
        window.location.href = targetPath;
      }, 500);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la cuenta');
    },
  });
}

// Logout hook
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      toast.success('Sesión cerrada correctamente');
      // Clear all queries on logout
      queryClient.clear();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cerrar sesión');
    },
  });
}

// Change password hook
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await api.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Contraseña cambiada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cambiar la contraseña');
    },
  });
}

// Verify email hook
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Email verificado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al verificar el email');
    },
  });
}

// Hook de acciones de autenticación
export function useAuthActions() {
  const updateProfileAction = useAuthStore((state) => state.updateProfile);
  const logoutAction = useAuthStore((state) => state.logout);

  const updateProfile = async (profileData: UpdateProfileData) => {
    try {
      // Actualizar en el backend
      const response = await api.put('/users/profile', profileData);

      if (response.success && response.data) {
        // Actualizar en el store local
        updateProfileAction(response.data);
        toast.success('Perfil actualizado exitosamente');
        return true;
      } else {
        toast.error('Error al actualizar el perfil');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil');
      return false;
    }
  };

  return {
    updateProfile,
    logout: logoutAction,
  };
}

// Export all auth-related hooks from authStore
export {
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useUserRole,
  useIsRole,
  useIsStudent,
  useIsCompany,
  useIsInstitution,
  useIsAdmin,
  useCanCreateOffers,
  useCanApplyToOffers,
  useCanManageUsers,
  useCanModerateContent,
} from '@/store/authStore';
