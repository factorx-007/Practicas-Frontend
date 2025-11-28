'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Calendar,
  Briefcase,
  Star,
  Users,
  Building,
  MessageSquare,
  Bell,
  Plus,
  ChevronRight,
  BarChart3,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  User,
  MoreHorizontal
} from 'lucide-react';
import { mockDashboardStats, mockRecentActivity, upcomingEvents } from '@/data/dashboard';

// Helper function to format recent activity time
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Hace unos minutos';
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  if (diffInHours < 48) return 'Ayer';
  return `Hace ${Math.floor(diffInHours / 24)} días`;
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Action Component for Companies
interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function QuickAction({ title, description, href, icon: Icon, color }: QuickActionProps) {
  const colorClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-300 text-blue-600',
    green: 'hover:bg-green-50 hover:border-green-300 text-green-600',
    purple: 'hover:bg-purple-50 hover:border-purple-300 text-purple-600',
    orange: 'hover:bg-orange-50 hover:border-orange-300 text-orange-600',
  };

  return (
    <a
      href={href}
      className={`group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 ${colorClasses[color]}`}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="p-2 bg-current bg-opacity-10 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-current transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-current transition-colors duration-200" />
      </div>
    </a>
  );
}

export default function EmpresaDashboard() {
  const { user, isLoading } = useAuth(); // user es UserProfile | null
  const [isClient, setIsClient] = useState(false);

  console.log('[EMPRESA_DASHBOARD] 🏗️ Dashboard component rendered - User:', !!user, 'Loading:', isLoading);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const userRole = user?.rol; // Eliminar as any y tipo
    console.log('[EMPRESA_DASHBOARD] 👤 User effect triggered - User:', user?.email || 'No user', 'Role:', userRole);
    console.log('[EMPRESA_DASHBOARD] 🔍 Full user object:', user);
  }, [user]);

  // Show loading spinner during initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log('[EMPRESA_DASHBOARD] 🎯 Rendering dashboard content for user:', user?.email || 'No user');

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
    const userName = user?.nombre || 'Usuario'; // Eliminar as any
    return `${greeting}, ${userName}`;
  };

  const getCompanyStats = () => {
    const stats = mockDashboardStats.EMPRESA;

    return [
      { title: 'Ofertas Activas', value: stats.ofertas_activas || 0, subtitle: 'Publicadas', icon: Briefcase, color: 'blue' as const, trend: { value: 12, isPositive: true } },
      { title: 'Postulaciones', value: stats.postulaciones_recibidas || 0, subtitle: 'Recibidas', icon: Users, color: 'green' as const, trend: { value: 8, isPositive: true } },
      { title: 'Candidatos Entrevistados', value: stats.candidatos_entrevistados || 0, subtitle: 'Este mes', icon: Calendar, color: 'purple' as const },
      { title: 'Rating Empresa', value: `${stats.rating_empresa || 0}/5`, subtitle: 'Calificación', icon: Star, color: 'orange' as const },
    ];
  };

  const stats = getCompanyStats();

  // Company quick actions
  const quickActions = [
    {
      title: 'Publicar Nueva Oferta',
      description: 'Crear y publicar una nueva vacante',
      href: '/offers/create',
      icon: Plus,
      color: 'blue' as const
    },
    {
      title: 'Gestionar Candidatos',
      description: 'Revisar postulaciones y candidatos',
      href: '/candidates',
      icon: Users,
      color: 'green' as const
    },
    {
      title: 'Programar Entrevistas',
      description: 'Coordinar entrevistas con candidatos',
      href: '/interviews',
      icon: Calendar,
      color: 'purple' as const
    },
    {
      title: 'Analizar Métricas',
      description: 'Ver reportes de reclutamiento',
      href: '/analytics',
      icon: BarChart3,
      color: 'orange' as const
    }
  ];

  // Get icon for activity type
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'postulacion': return Users;
      case 'entrevista': return Calendar;
      case 'oferta': return Briefcase;
      case 'mensaje': return MessageSquare;
      case 'candidato': return User;
      case 'contratacion': return CheckCircle;
      default: return Bell;
    }
  };

  // Get icon color for activity state
  const getActivityColor = (estado?: string) => {
    switch (estado) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'error': return 'bg-red-100 text-red-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getWelcomeMessage()}
            </h1>
            <p className="text-blue-100 mt-2">
              Conecta con el mejor talento joven para tu empresa
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Building className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Actions and Management */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
              <a href="/activity" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todo
              </a>
            </div>

            <div className="space-y-4">
              {mockRecentActivity.slice(0, 5).map((activity) => {
                const ActivityIcon = getActivityIcon(activity.tipo);
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.estado)}`}>
                      <ActivityIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.titulo}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-2">{activity.fecha ? formatTimeAgo(activity.fecha) : 'Hace unos minutos'}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline de Candidatos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pipeline de Candidatos</h2>
              <a href="/candidates" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todos
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Nuevas Postulaciones</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-gray-600">En Revisión</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Entrevistas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Por Contratar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Insights and Tools */}
        <div className="space-y-8">
          {/* Métricas de Rendimiento */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Rendimiento</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo promedio de llenado</span>
                <span className="text-sm font-medium text-gray-900">
                  {mockDashboardStats.EMPRESA.tiempo_llenado_promedio || '15 días'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posiciones completadas</span>
                <span className="text-sm font-medium text-gray-900">
                  {mockDashboardStats.EMPRESA.posiciones_completadas || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasa de aceptación</span>
                <span className="text-sm font-medium text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Calidad de candidatos</span>
                <span className="text-sm font-medium text-blue-600">4.2/5</span>
              </div>
            </div>
          </div>

          {/* Próximas Entrevistas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Próximas Entrevistas</h3>
              <a href="/interviews" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas
              </a>
            </div>

            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.titulo}</p>
                    <p className="text-sm text-gray-600">{event.empresa || event.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.fecha).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Talent Pool */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Talent Pool</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Candidatos guardados</span>
                <span className="text-sm font-medium text-gray-900">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nuevos esta semana</span>
                <span className="text-sm font-medium text-green-600">+12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Match promedio</span>
                <span className="text-sm font-medium text-blue-600">78%</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Explorar Candidatos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
