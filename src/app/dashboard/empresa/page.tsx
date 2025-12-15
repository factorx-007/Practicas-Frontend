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
import { mockDashboardStats, upcomingEvents } from '@/data/dashboard';
import { useQuery } from '@tanstack/react-query';
import { offersService } from '@/services/offers.service';
import { notificationsService, Notification } from '@/services/notifications.service';
import Link from 'next/link';

// Helper function to format recent activity time
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Hace unos minutos';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
  return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
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
    <Link
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
    </Link>
  );
}

export default function EmpresaDashboard() {
  const { user, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
    queryKey: ['companyStats'],
    queryFn: () => offersService.getCompanyStats(),
    enabled: !!user && user.rol === 'EMPRESA'
  });

  const { data: notificationsResponse, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['companyNotifications'],
    queryFn: () => notificationsService.getMyNotifications({ limit: 5 }),
    enabled: !!user && user.rol === 'EMPRESA'
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading || (isLoadingStats && !!user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
    const userName = user?.nombre || 'Usuario';
    return `${greeting}, ${userName}`;
  };

  const getCompanyStats = () => {
    const stats = statsResponse?.data || mockDashboardStats.EMPRESA;

    return [
      { title: 'Ofertas Activas', value: stats.ofertas_activas || 0, subtitle: 'Publicadas', icon: Briefcase, color: 'blue' as const, trend: { value: 12, isPositive: true } },
      { title: 'Postulaciones', value: stats.postulaciones_recibidas || 0, subtitle: 'Recibidas', icon: Users, color: 'green' as const, trend: { value: 8, isPositive: true } },
      { title: 'Candidatos Entrevistados', value: stats.candidatos_entrevistados || 0, subtitle: 'Este mes', icon: Calendar, color: 'purple' as const },
      { title: 'Rating Empresa', value: `${stats.rating_empresa || 0}/5`, subtitle: 'Calificación', icon: Star, color: 'orange' as const },
    ];
  };

  const stats = getCompanyStats();

  // Company quick actions with REAL routes
  const quickActions = [
    {
      title: 'Publicar Nueva Oferta',
      description: 'Crear y publicar una nueva vacante',
      href: '/dashboard/empresa/offers/create',
      icon: Plus,
      color: 'blue' as const
    },
    {
      title: 'Gestionar Candidatos',
      description: 'Revisar postulaciones y candidatos',
      href: '/dashboard/empresa/candidates',
      icon: Users,
      color: 'green' as const
    },
    {
      title: 'Mis Ofertas',
      description: 'Ver y editar ofertas publicadas',
      href: '/dashboard/empresa/offers/my-offers',
      icon: Briefcase,
      color: 'purple' as const
    },
    {
      title: 'Analizar Métricas',
      description: 'Ver reportes de reclutamiento',
      href: '/dashboard/empresa/analytics',
      icon: BarChart3,
      color: 'orange' as const
    }
  ];

  // Get icon for activity type
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'POSTULACION': return Users;
      case 'ENTREVISTA': return Calendar;
      case 'NUEVA_OFERTA': return Briefcase;
      case 'MENSAJE': return MessageSquare;
      case 'CANDIDATO': return User;
      case 'CONTRATACION': return CheckCircle;
      default: return Bell;
    }
  };

  // Get icon color for activity state (using notification type as proxy for now)
  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'POSTULACION': return 'bg-green-100 text-green-600';
      case 'NUEVA_OFERTA': return 'bg-blue-100 text-blue-600';
      case 'MENSAJE': return 'bg-purple-100 text-purple-600';
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

          {/* Recent Activity (Using Real Notifications) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
              <Link href="/dashboard/notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todo
              </Link>
            </div>

            <div className="space-y-4">
              {isLoadingNotifications ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : notificationsResponse?.notificaciones && notificationsResponse.notificaciones.length > 0 ? (
                notificationsResponse.notificaciones.map((notification: Notification) => {
                  const ActivityIcon = getActivityIcon(notification.tipo);
                  return (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className={`p-2 rounded-lg ${getActivityColor(notification.tipo)}`}>
                        <ActivityIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.titulo}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.mensaje}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.fechaCreacion)}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">No hay actividad reciente</p>
              )}
            </div>
          </div>

          {/* Pipeline de Candidatos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pipeline de Candidatos</h2>
              <Link href="/dashboard/empresa/candidates" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{statsResponse?.data?.postulaciones_recibidas || 0}</div>
                <div className="text-sm text-gray-600">Nuevas Postulaciones</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600">En Revisión</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{statsResponse?.data?.candidatos_entrevistados || 0}</div>
                <div className="text-sm text-gray-600">Entrevistas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
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
              <Link href="/dashboard/empresa/candidates" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas
              </Link>
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
