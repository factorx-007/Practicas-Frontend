'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, User, FileText, Video, Users, Calendar, BarChart,
  GraduationCap, TrendingUp, Shield, Flag, PieChart, CheckCircle,
  Target, MessageCircle, Eye, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getPrimaryActions, getSecondaryActions } from '@/data/dashboard';

import { QuickAction } from '@/data/dashboard'; // Importar QuickAction

const iconMap = {
  Plus, Search, User, FileText, Video, Users, Calendar, BarChart,
  GraduationCap, TrendingUp, Shield, Flag, PieChart, CheckCircle,
  Target, MessageCircle, Eye, ChevronRight
};

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className = "" }: QuickActionsProps) {
  const { user } = useAuth(); // user is UserProfile | null
  const [showSecondary, setShowSecondary] = useState(false);
  
  // Get the user's role - since user is of type UserProfile, we can directly access rol
  const userRole = user?.rol;

  // Show empty state if no user or no role, but don't return null to prevent component disappearing
  if (!user || !userRole) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando acciones...</h3>
          <p className="text-gray-600">Las acciones aparecerán cuando se complete la carga.</p>
        </div>
      </div>
    );
  }

  const primaryActions = getPrimaryActions(userRole);
  const secondaryActions = getSecondaryActions(userRole);

  const ActionCard = ({ action, isPrimary = true }: { action: QuickAction, isPrimary?: boolean }) => {
    const IconComponent = iconMap[action.icono as keyof typeof iconMap] || Search;

    return (
      <Link
        href={action.url}
        className={`
          group relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md
          ${isPrimary
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150'
            : 'bg-white border-gray-200 hover:border-gray-300'
          }
        `}
      >
        {action.nuevo && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Nuevo
          </span>
        )}

        <div className="flex items-start space-x-3">
          <div className={`
            flex-shrink-0 p-2 rounded-lg transition-colors duration-200
            ${isPrimary
              ? 'bg-blue-600 text-white group-hover:bg-blue-700'
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }
          `}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`
              font-semibold mb-1 group-hover:text-blue-700 transition-colors duration-200
              ${isPrimary ? 'text-blue-900' : 'text-gray-900'}
            `}>
              {action.titulo}
            </h3>
            <p className={`
              text-sm leading-relaxed
              ${isPrimary ? 'text-blue-700' : 'text-gray-600'}
            `}>
              {action.descripcion}
            </p>
          </div>

          <ChevronRight className={`
            w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1
            ${isPrimary ? 'text-blue-600' : 'text-gray-400'}
          `} />
        </div>
      </Link>
    );
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
        {secondaryActions.length > 0 && (
          <button
            onClick={() => setShowSecondary(!showSecondary)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
          >
            <span>{showSecondary ? 'Ver menos' : 'Ver más'}</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showSecondary ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {primaryActions.map((action) => (
          <ActionCard key={action.id} action={action} isPrimary={true} />
        ))}
      </div>

      {/* Secondary Actions */}
      {showSecondary && secondaryActions.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Más Acciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {secondaryActions.map((action) => (
              <ActionCard key={action.id} action={action} isPrimary={false} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {primaryActions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay acciones disponibles</h3>
          <p className="text-gray-600">Las acciones aparecerán aquí cuando estén disponibles para tu rol.</p>
        </div>
      )}
    </div>
  );
}