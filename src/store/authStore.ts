import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { api, AuthManager } from '@/lib/api';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '@/constants';
import { UserProfile, LoginData, RegisterData } from '@/types/user';
import { AxiosError } from 'axios';

interface AuthResponse {
  user: UserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface AuthState {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials: LoginData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);

            if (response.success && response.data) {
              const { user } = response.data;

              // Store tokens
              AuthManager.setTokens();

              // Update state
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });

            } else {
              throw new Error(response.message || 'Error en el login');
            }
          } catch (error: unknown) {
            const errorMessage = ((error as AxiosError).response?.data as { message?: string })?.message || (error as Error).message || 'Error en el login';

            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
              user: null,
            });

            throw new Error(errorMessage);
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);

            if (response.success && response.data) {
              const { user } = response.data;

              // Store tokens
              AuthManager.setTokens();

              // Update state
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });

            } else {
              throw new Error(response.message || 'Error en el registro');
            }
          } catch (error: unknown) {
            const errorMessage = ((error as AxiosError).response?.data as { message?: string })?.message || (error as Error).message || 'Error en el registro';

            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
              user: null,
            });

            throw new Error(errorMessage);
          }
        },

        logout: async () => {
          console.log('🚪 [authStore] logout called');
          try {
            // Call backend logout to clear httpOnly cookies
            await AuthManager.logout();
            console.log('✅ [authStore] Backend logout successful');
          } catch {
            console.warn('⚠️ [authStore] Backend logout failed');
          }

          // Clear local tokens and user data
          console.log('🗑️ [authStore] Clearing local tokens and user data');
          AuthManager.clearTokens();

          // Reset state
          console.log('🔄 [authStore] Resetting auth state to null');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Redirect to login (if in browser)
          if (typeof window !== 'undefined') {
            console.log('🔀 [authStore] Redirecting to login page');
            window.location.href = '/auth/login';
          }

        },

        updateProfile: (data: Partial<UserProfile>) => {
          const currentUser = get().user;
          console.log('📝 [authStore] updateProfile called with data:', data);
          console.log('📝 [authStore] Current user:', currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'null');
          if (currentUser) {
            const updatedUser = { ...currentUser, ...data };
            console.log('✅ [authStore] Setting updated user:', updatedUser.nombre, updatedUser.apellido);
            set({ user: updatedUser });

            // Also update localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
              console.log('💾 [authStore] Updated user saved to localStorage');
            }
          }
        },

        refreshUser: async () => {
          // For httpOnly cookies, we can't check authentication client-side
          // Let the API call handle authentication verification
          console.log('🔄 [authStore] refreshUser called');
          try {
            const response = await api.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE);

            if (response.success && response.data) {
              console.log('🔍 [authStore] Raw API response.data:', response.data);

              // The API returns a nested structure with 'usuario' property
              // Extract the user object properly
              let userToSet: UserProfile;

              if ('usuario' in response.data && response.data.usuario) {
                // Response has nested usuario object
                userToSet = response.data.usuario as UserProfile;
                console.log('✅ [authStore] Extracted nested user from API:', userToSet.nombre, userToSet.apellido);
              } else if ('nombre' in response.data && 'apellido' in response.data) {
                // Response is already a UserProfile
                userToSet = response.data;
                console.log('✅ [authStore] Got direct user from API:', userToSet.nombre, userToSet.apellido);
              } else {
                console.error('❌ [authStore] Unexpected response structure:', response.data);
                return;
              }

              set({ user: userToSet });

              // Update localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userToSet));
                console.log('💾 [authStore] User data saved to localStorage after refresh');
              }
            }
          } catch (error) {
            console.error('❌ [authStore] refreshUser failed:', error);
            // If refresh fails and it's an auth error, logout
            if (((error as AxiosError).response?.status) === 401) {
              console.log('🚪 [authStore] 401 error, logging out');
              get().logout();
            }
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        initializeAuth: async () => {
          console.log('🚀 [authStore] initializeAuth called');
          set({ isLoading: true });

          try {
            // First, try to get user data from localStorage for immediate feedback
            if (typeof window !== 'undefined') {
              const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
              console.log('🔍 [authStore] Stored user in localStorage:', storedUser ? 'Found' : 'Not found');
              if (storedUser) {
                try {
                  const userFromStorage = JSON.parse(storedUser) as UserProfile | { usuario?: UserProfile };
                  let userToSet: UserProfile | null = null;

                  if (userFromStorage) {
                    // Handle full profile object with nested user
                    if ('usuario' in userFromStorage && userFromStorage.usuario && userFromStorage.usuario.id) {
                      userToSet = userFromStorage.usuario;
                      console.log('✅ [authStore] Found nested user in storage:', userToSet.nombre, userToSet.apellido);
                    }
                    // Handle direct user object - check for required UserProfile properties
                    else if ('id' in userFromStorage && userFromStorage.id && 'email' in userFromStorage && userFromStorage.email && 'nombre' in userFromStorage && 'apellido' in userFromStorage) {
                      userToSet = userFromStorage as UserProfile;
                      console.log('✅ [authStore] Found direct user in storage:', userToSet.nombre, userToSet.apellido);
                    } else {
                      console.warn('⚠️ [authStore] Stored data has unexpected structure:', userFromStorage);
                    }
                  }

                  if (userToSet) {
                    console.log('💾 [authStore] Setting user from localStorage (temporary)');
                    set({
                      user: userToSet,
                      isAuthenticated: true,
                      isLoading: true // Keep loading while we verify with server
                    });
                  } else {
                    console.warn('⚠️ [authStore] Invalid user data in localStorage, removing');
                    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
                  }
                } catch (e) {
                  console.error('❌ [authStore] Failed to parse stored user:', e);
                  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
                }
              }
            }

            // Then check with server
            console.log('🔐 [authStore] Checking authentication with server...');
            const isAuthenticated = await AuthManager.checkAuth();
            console.log('🔐 [authStore] Server auth check result:', isAuthenticated);

            if (isAuthenticated) {
              // Server confirmed auth, now get fresh user data
              console.log('✅ [authStore] Authenticated, refreshing user data');
              await get().refreshUser();
              set({ isLoading: false });
              console.log('✅ [authStore] Auth initialization complete');
            } else {
              // Not authenticated according to server, clear everything
              console.warn('❌ [authStore] Server rejected authentication (checkAuth returned false)');
              console.warn('❌ [authStore] This usually means cookies are missing or invalid.');
              console.warn('❌ [authStore] Clearing local session...');

              AuthManager.clearTokens();
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } catch (e) {
            console.error('❌ [authStore] initializeAuth error:', e);
            // On error, assume not authenticated but don't clear stored data immediately
            set({
              isLoading: false,
              error: 'Failed to initialize authentication',
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => {
          console.log('💾 [authStore] Starting rehydration from localStorage');
          return (state, error) => {
            if (error) {
              console.error('❌ [authStore] Rehydration failed:', error);
            } else {
              console.log('✅ [authStore] Rehydration complete. User:', state?.user ? `${state.user.nombre} ${state.user.apellido}` : 'null');
            }
          };
        },
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Utility hooks for specific auth data
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Role-based hooks
export const useUserRole = () => {
  const user = useUser();
  return user?.rol;
};

export const useIsRole = (role: string) => {
  const userRole = useUserRole();
  return userRole === role;
};

export const useIsStudent = () => useIsRole('ESTUDIANTE');
export const useIsCompany = () => useIsRole('EMPRESA');
export const useIsInstitution = () => useIsRole('INSTITUCION');
export const useIsAdmin = () => useIsRole('ADMIN');

// Permission-based hooks
export const useCanCreateOffers = () => {
  const role = useUserRole();
  return role === 'EMPRESA' || role === 'ADMIN';
};

export const useCanApplyToOffers = () => {
  const role = useUserRole();
  return role === 'ESTUDIANTE';
};

export const useCanManageUsers = () => {
  const role = useUserRole();
  return role === 'ADMIN';
};

export const useCanModerateContent = () => {
  const role = useUserRole();
  return role === 'ADMIN' || role === 'INSTITUCION';
};

// Initialize auth on store creation (browser only)
if (typeof window !== 'undefined') {
  // Subscribe to all state changes to debug user changes
  let previousUser: UserProfile | null = null;
  useAuthStore.subscribe(
    (state) => {
      const currentUser = state.user;
      if (currentUser !== previousUser) {
        console.log('🔔 [authStore] User state changed!');
        console.log('  Previous user:', previousUser ? `${previousUser.nombre} ${previousUser.apellido}` : 'null');
        console.log('  New user:', currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'null');
        console.log('  Stack trace:', new Error().stack);
        previousUser = currentUser;
      }
    }
  );

  // Small delay to ensure the store is fully initialized
  setTimeout(() => {
    useAuthStore.getState().initializeAuth();
  }, 100);
}