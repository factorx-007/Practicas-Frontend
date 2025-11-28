import { useState, useEffect } from 'react';
import { UsersService, Usuario } from '@/services/users.service';

interface UserCache {
  [userId: string]: Usuario | null;
}

// Cache global para usuarios
const userCache: UserCache = {};

export const useUserInfo = (userId?: string) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || typeof userId !== 'string') {
      setUser(null);
      setLoading(false);
      return;
    }

    // Check cache first
    if (userCache[userId]) {
      setUser(userCache[userId]);
      setLoading(false);
      console.log(`💾 [useUserInfo] Cache hit for: ${userId}`);
      return;
    }

    // Fetch user info with race condition protection
    let isCurrentRequest = true;

    const fetchUser = async () => {
      setLoading(true);
      try {
        console.log(`🔄 [useUserInfo] Fetching user info for: ${userId}`);
        const response = await UsersService.getUserProfile(userId);

        if (isCurrentRequest) {
          if (response.success && response.data) {
            // Normalize the user data
            const userData = normalizeUserData(response.data);
            if (userData) {
              userCache[userId] = userData;
              setUser(userData);
              console.log(`✅ [useUserInfo] User info loaded for ${userId}:`, userData.nombre, userData.apellido);
              console.log('📦 [useUserInfo] Full user data:', userData);
            } else {
              console.warn(`⚠️ [useUserInfo] Could not normalize user data for ${userId}`);
              setUser(null);
            }
          } else {
            console.warn(`⚠️ [useUserInfo] Failed to load user ${userId}:`, response);
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.error(`❌ [useUserInfo] Error fetching user ${userId}:`, error);
          setUser(null);
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Cleanup function to prevent race conditions
    return () => {
      isCurrentRequest = false;
    };
  }, [userId]);

  return { user, loading };
};

// Helper function to normalize user data from different API responses
const normalizeUserData = (userData: unknown): Usuario | null => {
  if (!userData) return null;

  // Case 1: Already normalized user data (from conversations API)
  if ((userData as Usuario).nombre && (userData as Usuario).apellido && (userData as Usuario).id) {
    console.log('💾 [normalizeUserData] Already normalized user data:', userData);
    return userData as Usuario;
  }

  // Case 2: Profile API response with nested 'usuario' property
  if ((userData as { usuario?: Usuario }).usuario) {
    console.log('🔄 [normalizeUserData] Extracting from nested structure:', (userData as { usuario: Usuario }).usuario);
    return (userData as { usuario: Usuario }).usuario;
  }

  // Case 3: Direct user data
  console.log('💾 [normalizeUserData] Using direct user data:', userData);
  return userData as Usuario;
};

// Helper function to get user display name with better formatting
export const getUserDisplayName = (user?: Usuario | null): string => {
  if (!user) return 'Usuario desconocido';

  // Normalize the user data first
  const actualUser = normalizeUserData(user);
  if (!actualUser) return 'Usuario desconocido';

  console.log('🔍 [getUserDisplayName] Processing normalized user:', actualUser);

  // For companies, prioritize company name from the empresa object
  if (actualUser.rol === 'EMPRESA' && actualUser.empresa?.nombre_empresa) {
    console.log('✅ [getUserDisplayName] Returning company name:', actualUser.empresa.nombre_empresa);
    return actualUser.empresa.nombre_empresa;
  }

  // For institutions, use the best available identifier
  if (actualUser.rol === 'INSTITUCION') {
    // Use the user's name as a fallback for institution name
    if (actualUser.nombre) {
      console.log('✅ [getUserDisplayName] Using user name as institution name:', actualUser.nombre);
      return actualUser.nombre;
    }
    // If no name is available, return a generic institution name
    console.log('ℹ️ [getUserDisplayName] No specific institution name available, using generic name');
    return 'Institución';
  }

  // For regular users and students, use full name
  if (actualUser.nombre && actualUser.apellido) {
    const displayName = `${actualUser.nombre.trim()} ${actualUser.apellido.trim()}`;
    console.log('✅ [getUserDisplayName] Returning full name:', displayName);
    return displayName;
  }

  // Fallback to just first name or email
  if (actualUser.nombre) {
    console.log('✅ [getUserDisplayName] Returning first name:', actualUser.nombre.trim());
    return actualUser.nombre.trim();
  }

  if (actualUser.email) {
    const emailName = actualUser.email.split('@')[0];
    console.log('✅ [getUserDisplayName] Returning email name:', emailName);
    return emailName;
  }

  console.log('⚠️ [getUserDisplayName] Returning fallback: Usuario');
  return 'Usuario';
};

// Function to preload user info into cache with better error handling
export const preloadUserInfo = async (userId: string): Promise<Usuario | null> => {
  if (!userId || typeof userId !== 'string') {
    console.warn('[preloadUserInfo] Invalid userId:', userId);
    return null;
  }

  // Return cached user immediately
  if (userCache[userId]) {
    console.log(`💾 [preloadUserInfo] Cache hit for: ${userId}`);
    return userCache[userId];
  }

  try {
    console.log(`🔄 [preloadUserInfo] Fetching user: ${userId}`);
    const response = await UsersService.getUserProfile(userId);

    if (response.success && response.data) {
      // Normalize the user data
      const userData = normalizeUserData(response.data);
      if (userData) {
        userCache[userId] = userData;
        const userName = getUserDisplayName(userData);
        console.log(`✅ [preloadUserInfo] Cached user: ${userId} -> ${userName}`);
        console.log('📦 [preloadUserInfo] Stored user data:', userData);
        return userData;
      }
    } else {
      console.warn(`⚠️ [preloadUserInfo] API returned unsuccessful response for ${userId}:`, response);
    }
  } catch (error) {
    console.error(`❌ [preloadUserInfo] Error fetching user ${userId}:`, error);

    // Store null in cache to prevent repeated failed requests
    userCache[userId] = null;
  }

  return null;
};

// Hook for getting user display name with automatic loading
export const useUserDisplayName = (userId?: string | null) => {
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || typeof userId !== 'string') {
      setDisplayName('Usuario desconocido');
      return;
    }

    // Check cache first
    if (userCache[userId]) {
      const cachedName = getUserDisplayName(userCache[userId]);
      setDisplayName(cachedName);
      console.log(`💾 [useUserDisplayName] Cache hit for ${userId}: ${cachedName}`);
      return;
    }

    // Show loading state immediately
    setDisplayName('Cargando...');
    setLoading(true);

    console.log(`🔄 [useUserDisplayName] Loading user info for: ${userId}`);

    // Load user info with race condition protection
    let isCurrentRequest = true;

    preloadUserInfo(userId).then(user => {
      // Only update if this is still the current request
      if (isCurrentRequest) {
        if (user) {
          const userName = getUserDisplayName(user);
          setDisplayName(userName);
          console.log(`✅ [useUserDisplayName] Loaded: ${userId} -> ${userName}`);
        } else {
          setDisplayName('Usuario desconocido');
          console.log(`❌ [useUserDisplayName] Failed to load: ${userId}`);
        }
        setLoading(false);
      }
    }).catch(error => {
      if (isCurrentRequest) {
        console.error(`❌ [useUserDisplayName] Error loading ${userId}:`, error);
        setDisplayName('Usuario desconocido');
        setLoading(false);
      }
    });

    // Cleanup function to prevent race conditions
    return () => {
      isCurrentRequest = false;
    };
  }, [userId]);

  return { displayName, loading };
};

// Helper function to get cached user or placeholder (for backward compatibility)
export const getCachedUserDisplayName = (userId: string | undefined | null): string => {
  if (!userId || typeof userId !== 'string') {
    return 'Usuario desconocido';
  }

  const cachedUser = userCache[userId];
  if (cachedUser) {
    return getUserDisplayName(cachedUser);
  }

  // Try to preload the user info asynchronously for next time (but don't wait)
  preloadUserInfo(userId).catch(() => {
    // Ignore errors in background preloading
  });

  // Show a more user-friendly loading state
  return 'Cargando...';
};

// Function to preload users from conversation participants (avoids API calls)
export const preloadUsersFromConversations = (conversations: Array<{ participantes: Usuario[] }>): void => {
  const allParticipants: Usuario[] = [];

  conversations.forEach(conversation => {
    if (conversation.participantes && Array.isArray(conversation.participantes)) {
      conversation.participantes.forEach((participant: Usuario) => {
        // Only cache if we have complete user data (from conversations API)
        if (participant.id && participant.nombre && participant.apellido) {
          allParticipants.push(participant);
        }
      });
    }
  });

  console.log(`📦 [preloadUsersFromConversations] Caching ${allParticipants.length} users from conversations`);

  allParticipants.forEach(participant => {
    const normalized = normalizeUserData(participant);
    if (normalized && normalized.id) {
      userCache[normalized.id] = normalized;
      console.log(`✅ [preloadUsersFromConversations] Cached: ${normalized.id} -> ${getUserDisplayName(normalized)}`);
    }
  });
};

// Function to preload multiple users at once for better performance
export const preloadMultipleUsers = async (userIds: string[]): Promise<void> => {
  const uniqueIds = [...new Set(userIds.filter(id => id && typeof id === 'string'))];
  const uncachedIds = uniqueIds.filter(id => !userCache[id]);

  if (uncachedIds.length === 0) {
    console.log('💾 [preloadMultipleUsers] All users already cached');
    return;
  }

  console.log(`🔄 [preloadMultipleUsers] Loading ${uncachedIds.length} users:`, uncachedIds);

  // Load users in parallel with Promise.allSettled to handle individual failures
  const results = await Promise.allSettled(
    uncachedIds.map(userId => preloadUserInfo(userId))
  );

  const successful = results.filter(result => result.status === 'fulfilled').length;
  console.log(`✅ [preloadMultipleUsers] Successfully loaded ${successful}/${uncachedIds.length} users`);
};

// Function to clear cache (useful for testing or memory management)
export const clearUserCache = (): void => {
  Object.keys(userCache).forEach(key => delete userCache[key]);
  console.log('🗑️ [clearUserCache] User cache cleared');
};

// Function to get cache statistics
export const getCacheStats = () => {
  const totalCached = Object.keys(userCache).length;
  const validUsers = Object.values(userCache).filter(user => user !== null).length;
  const failedUsers = totalCached - validUsers;

  return {
    totalCached,
    validUsers,
    failedUsers,
    cacheKeys: Object.keys(userCache)
  };
};