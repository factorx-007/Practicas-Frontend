'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Settings, User, LogOut, PanelLeftOpen } from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/useAuth';
import GlobalSearch from '@/components/ui/GlobalSearch';
import NotificationsDropdown from '@/components/ui/NotificationsDropdown';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Importar Image de next/image
import { UserProfile } from '@/types/user';
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export default function DashboardHeader({
  onMenuClick
}: DashboardHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [displayUser, setDisplayUser] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth(); // user es UserProfile | null
  const logoutMutation = useLogout();

  // Prevent hydration mismatch - same as dashboard
  useEffect(() => {
    console.log('🔵 [DashboardHeader] Component mounted, setting isClient to true');
    setIsClient(true);
    
    // Load user data from localStorage immediately on mount
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
      console.log('🔵 [DashboardHeader] Stored user from localStorage:', storedUser ? 'Found' : 'Not found');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('🔵 [DashboardHeader] Parsed user data:', parsedUser);
        
        // Validate that it's a proper user object
        if (parsedUser && parsedUser.id && parsedUser.email) {
          console.log('✅ [DashboardHeader] Setting cached user from localStorage:', parsedUser.nombre, parsedUser.apellido);
          setDisplayUser(parsedUser);
        } else {
          console.warn('⚠️ [DashboardHeader] Invalid user data in localStorage, removing');
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        }
      }
    } catch (e) {
      console.warn('❌ [DashboardHeader] Failed to load user data from localStorage:', e);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    }
  }, []);

  // Update displayUser when auth store user changes
  useEffect(() => {
    console.log('🔄 [DashboardHeader] Auth state changed - user:', user ? 'Present' : 'Null', 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    
    if (user) {
      console.log('✅ [DashboardHeader] User from auth store:', user.nombre, user.apellido);
      console.log('🔵 [DashboardHeader] Setting displayUser from auth store');
      setDisplayUser(user);
      
      // Persist user data in localStorage to prevent flickering on page reload
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        console.log('💾 [DashboardHeader] User data saved to localStorage');
      } catch (e) {
        console.warn('❌ [DashboardHeader] Failed to save user data to localStorage:', e);
      }
    } else if (!isLoading && !user && isAuthenticated) {
      console.log('⚠️ [DashboardHeader] Authenticated but no user data, checking localStorage');
      
      // If we're authenticated but don't have user data, try to get it
      // This handles edge cases where user data might be temporarily unavailable
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            console.log('✅ [DashboardHeader] Restoring user from localStorage:', parsedUser.nombre, parsedUser.apellido);
            setDisplayUser(parsedUser);
          }
        }
      } catch (e) {
        console.warn('❌ [DashboardHeader] Failed to load fallback user data from localStorage:', e);
      }
    } else if (!user) {
      console.log('⚠️ [DashboardHeader] No user data available, isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    }
  }, [user, isLoading, isAuthenticated]);

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 1 && segments[0] === 'dashboard') {
      return 'Dashboard';
    }

    const titleMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'profile': 'Perfil',
      'chat': 'Mensajes',
      'notifications': 'Notificaciones',
      'offers': 'Ofertas de Trabajo',
      'applications': 'Mis Postulaciones',
      'candidates': 'Candidatos',
      'students': 'Estudiantes',
      'companies': 'Empresas',
      'events': 'Eventos',
      'reports': 'Reportes',
      'analytics': 'Estadísticas',
      'settings': 'Configuración',
      'admin': 'Administración',
      'blog': 'Blog'
    };

    const lastSegment = segments[segments.length - 1];
    return titleMap[lastSegment] || 'ProTalent';
  };

  // Determine which user object to display
  // Use displayUser state which is managed more consistently
  const finalDisplayUser = displayUser;
  
  // Debug log for render
  console.log('🎨 [DashboardHeader] Rendering - finalDisplayUser:', finalDisplayUser ? `${finalDisplayUser.nombre} ${finalDisplayUser.apellido}` : 'null');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header Row */}
      <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Sidebar Toggle Button */}
        <motion.button
          type="button"
          aria-label="Toggle sidebar"
          className={`
            flex items-center justify-center 
            w-10 h-10 rounded-full transition-all duration-300
            bg-gray-100 text-gray-700 hover:bg-gray-200
          `}
          onClick={onMenuClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PanelLeftOpen className="w-5 h-5" />
        </motion.button>

        {/* Page Title */}
        <div className="flex-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-semibold text-gray-900"
          >
            {getPageTitle()}
          </motion.h1>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex md:flex-1 md:max-w-md">
          <GlobalSearch
            placeholder="Buscar ofertas, usuarios, empresas..."
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <NotificationsDropdown />

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="Menú de usuario"
            >
              <span className="sr-only">Abrir menú de usuario</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                {/* Show user avatar or initials even before hydration is complete */}
                {(finalDisplayUser?.avatar || (finalDisplayUser?.nombre && finalDisplayUser?.apellido)) ? (
                  finalDisplayUser?.avatar ? (
                    <Image
                      src={finalDisplayUser?.avatar || ''}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-600 font-medium text-xs">
                      {(finalDisplayUser?.nombre?.[0] || '').toUpperCase()}
                      {(finalDisplayUser?.apellido?.[0] || '').toUpperCase()}
                    </span>
                  )
                ) : isClient ? (
                  <User className="h-4 w-4 text-blue-600" />
                ) : (
                  // Show a placeholder during server render to prevent hydration mismatch
                  <div className="w-4 h-4 rounded-full bg-blue-200" />
                )}
              </div>
              <span className="hidden lg:flex lg:items-center lg:ml-3">
                <span className="text-sm font-semibold text-gray-900" aria-hidden="true">
                  {/* Show user name even before hydration is complete */}
                  {finalDisplayUser?.nombre 
                    ? `${finalDisplayUser?.nombre}${finalDisplayUser?.apellido ? ` ${finalDisplayUser?.apellido}` : ''}`.trim()
                    : isClient 
                      ? 'Usuario' 
                      : 'Cargando...'}
                </span>
              </span>
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {finalDisplayUser?.nombre 
                      ? `${finalDisplayUser?.nombre}${finalDisplayUser?.apellido ? ` ${finalDisplayUser?.apellido}` : ''}`.trim()
                      : isClient 
                        ? 'Usuario' 
                        : 'Cargando...'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {finalDisplayUser?.email ? finalDisplayUser?.email : isClient ? 'Cargando...' : 'Cargando...'}
                  </p>
                </div>

                <div className="py-1">
                  <a
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-400" />
                    Tu perfil
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Settings className="mr-3 h-4 w-4 text-gray-400" />
                    Configuración
                  </a>
                </div>

                <div className="py-1 border-t border-gray-100">
                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                    {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar sesión'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumbs Row */}
      <div className="px-4 pb-2 sm:px-6 lg:px-8">
        <Breadcrumbs className="pt-2" />
      </div>
    </header>
  );
}