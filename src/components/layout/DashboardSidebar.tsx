'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, User, MessageCircle, Bell, LogOut, Briefcase, Users, GraduationCap,
  Building, PieChart, FileText, Calendar, Search, Plus, Sparkles, BookOpen, Bookmark, X
} from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSidebarProps {
  isVisible: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isVisible, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const logoutMutation = useLogout();

  // Get the user's role - handle both direct UserProfile and nested structures
  const userRole = user?.rol ||
    (user && typeof user === 'object' && 'usuario' in user && user.usuario && typeof user.usuario === 'object' && 'rol' in user.usuario
      ? (user.usuario as { rol: string }).rol
      : undefined);

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Inicio',
        href: '/dashboard',
        icon: Home,
        current: pathname === '/dashboard',
      },
      {
        name: 'Perfil',
        href: '/dashboard/profile',
        icon: User,
        current: pathname.startsWith('/dashboard/profile') || pathname === '/profile',
      },
      {
        name: 'Mensajes',
        href: '/dashboard/chat',
        icon: MessageCircle,
        current: pathname.startsWith('/dashboard/chat'),
        badge: 3,
      },
      {
        name: 'Notificaciones',
        href: '/notifications',
        icon: Bell,
        current: pathname.startsWith('/notifications'),
        badge: 0,
      },
      {
        name: 'Blog',
        href: '/dashboard/blog',
        icon: BookOpen,
        current: pathname.startsWith('/dashboard/blog'),
      }
    ];

    const roleSpecificItems = [];

    // Mantener la lógica existente de roleSpecificItems
    if (userRole === 'ESTUDIANTE') {
      roleSpecificItems.push(
        {
          name: 'Explorar Ofertas',
          href: '/dashboard/estudiante/offers',
          icon: Search,
          current: pathname.startsWith('/dashboard/estudiante/offers') && !pathname.includes('/create') && !pathname.includes('/edit'),
        },
        {
          name: 'Mis Postulaciones',
          href: '/dashboard/estudiante/applications',
          icon: FileText,
          current: pathname.startsWith('/dashboard/estudiante/applications'),
        },
        {
          name: 'Ofertas Guardadas',
          href: '/dashboard/estudiante/saved-offers',
          icon: Bookmark,
          current: pathname.startsWith('/dashboard/estudiante/saved-offers'),
        },
        {
          name: 'Mi Portafolio',
          href: '/dashboard/estudiante/portfolio',
          icon: Briefcase,
          current: pathname.startsWith('/dashboard/estudiante/portfolio'),
        },
        {
          name: 'Eventos',
          href: '/dashboard/estudiante/events',
          icon: Calendar,
          current: pathname.startsWith('/dashboard/estudiante/events'),
        },
        {
          name: 'Networking',
          href: '/dashboard/estudiante/networking',
          icon: Users,
          current: pathname.startsWith('/dashboard/estudiante/networking'),
        }
      );
    } else if (userRole === 'EMPRESA') {
      roleSpecificItems.push(
        {
          name: 'Mis Ofertas',
          href: '/dashboard/empresa/offers/my-offers',
          icon: Briefcase,
          current: pathname.startsWith('/dashboard/empresa/offers'),
        },
        {
          name: 'Crear Oferta',
          href: '/dashboard/empresa/offers/create',
          icon: Plus,
          current: pathname === '/dashboard/empresa/offers/create',
        },
        {
          name: 'Postulantes',
          href: '/dashboard/empresa/candidates',
          icon: Users,
          current: pathname.startsWith('/dashboard/empresa/candidates'),
        },
        {
          name: 'Estadísticas',
          href: '/dashboard/empresa/analytics',
          icon: PieChart,
          current: pathname.startsWith('/dashboard/empresa/analytics'),
        }
      );
    } else if (userRole === 'INSTITUCION' || userRole === 'ADMIN') {
      roleSpecificItems.push(
        {
          name: 'Estudiantes',
          href: '/dashboard/institucion/students',
          icon: GraduationCap,
          current: pathname.startsWith('/dashboard/institucion/students'),
        },
        {
          name: 'Sociedades',
          href: '/dashboard/institucion/partnerships',
          icon: Building,
          current: pathname.startsWith('/dashboard/institucion/partnerships'),
        },
        {
          name: 'Eventos',
          href: '/dashboard/institucion/events',
          icon: Calendar,
          current: pathname.startsWith('/dashboard/institucion/events'),
        },
        {
          name: 'Reportes',
          href: '/dashboard/institucion/reports',
          icon: FileText,
          current: pathname.startsWith('/dashboard/institucion/reports'),
        }
      );
    }

    return [...baseItems, ...roleSpecificItems];
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const sidebarVariants = {
    visible: {
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    hidden: {
      x: '-100%',
      transition: {
        type: 'tween' as const,
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={sidebarVariants}
        className={`
          fixed left-0 top-0 bottom-0 z-50 
          w-72 bg-white shadow-2xl border-r border-gray-200 
          overflow-hidden
        `}
      >
        {/* Contenido del sidebar */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo y título */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ProTalent
              </h1>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Cerrar menú</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-2">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <motion.li
                  key={item.name}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close sidebar on mobile when a link is clicked
                      if (window.innerWidth < 1024 && onClose) {
                        onClose();
                      }
                    }}
                    className={`
                      group flex items-center p-3 rounded-lg transition-all duration-300
                      ${item.current
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100 text-gray-700'}
                    `}
                  >
                    <item.icon
                      className={`
                        w-5 h-5 mr-3 transition-colors duration-300
                        ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}
                      `}
                    />
                    <span className="font-medium">{item.name}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer - Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 group"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}