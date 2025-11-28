'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  customItems?: BreadcrumbItem[];
}

export default function Breadcrumbs({
  className = "",
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  showHome = true,
  customItems
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Generate breadcrumbs from pathname
  useEffect(() => {
    // Path to label mapping
    const pathLabels: Record<string, string> = {
      // Dashboard paths
      'dashboard': 'Dashboard',
      'profile': 'Perfil',
      'settings': 'Configuración',
      'notifications': 'Notificaciones',

      // Student paths
      'offers': 'Ofertas',
      'applications': 'Mis Postulaciones',
      'events': 'Eventos',
      'create': 'Crear',
      'edit': 'Editar',
      'view': 'Ver',

      // Company paths
      'candidates': 'Candidatos',
      'my-offers': 'Mis Ofertas',
      'analytics': 'Análisis',
      'reports': 'Reportes',

      // Institution paths
      'students': 'Estudiantes',
      'companies': 'Empresas',

      // Admin paths
      'admin': 'Administración',
      'users': 'Usuarios',

      // Common paths
      'chat': 'Mensajes',
      'help': 'Ayuda',
      'about': 'Acerca de',
      'contact': 'Contacto',
      'search': 'Búsqueda',
      'results': 'Resultados'
    };

    if (customItems) {
      setBreadcrumbs(customItems);
      return;
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHome && pathSegments.length > 0) {
      items.push({
        label: 'Inicio',
        href: '/dashboard'
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Skip certain segments or replace with better labels
      let label = pathLabels[segment] || decodeURIComponent(segment);

      // Handle special cases for IDs and long strings
      if (segment.match(/^[0-9a-f]{24}$/) || segment.match(/^[0-9]+$/)) {
        // If it's an ID (MongoDB ObjectId or numeric), try to get a better label based on context
        const prevSegment = pathSegments[index - 1];
        if (prevSegment === 'offers') label = 'Oferta';
        else if (prevSegment === 'users') label = 'Usuario';
        else if (prevSegment === 'companies') label = 'Empresa';
        else if (prevSegment === 'students') label = 'Estudiante';
        else if (prevSegment === 'chat') {
          // For chat conversations, don't show the ID at all - just skip this segment
          return;
        }
        else label = `#${segment.slice(0, 8)}...`; // Show first 8 chars for other IDs
      }

      // Format labels
      label = label.charAt(0).toUpperCase() + label.slice(1);

      items.push({
        label,
        href: currentPath,
        isCurrentPage: isLast
      });
    });

    setBreadcrumbs(items);
  }, [pathname, customItems, showHome]);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs if there's only one item or less
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={`${item.href}-${index}`} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 flex-shrink-0">
                {separator}
              </span>
            )}

            {item.isCurrentPage ? (
              <span
                className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Hook for custom breadcrumb management
export function useBreadcrumbs() {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    setCustomBreadcrumbs(items);
  };

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setCustomBreadcrumbs(prev => [...prev, item]);
  };

  const clearBreadcrumbs = () => {
    setCustomBreadcrumbs([]);
  };

  return {
    breadcrumbs: customBreadcrumbs,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs
  };
}