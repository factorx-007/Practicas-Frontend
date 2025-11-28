'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import {
  Calendar,
  Briefcase,
  Target,
  Star,
  MessageSquare,
  Bell,
  Eye,
  Award,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import QuickActions from '@/components/dashboard/QuickActions';
import ProfileScore from '@/components/dashboard/ProfileScore';
import RecommendedOffers from '@/components/dashboard/RecommendedOffers';
import ProfileSummaryWidget from '@/components/dashboard/ProfileSummaryWidget';

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

export default function EstudianteDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoading = authLoading || dashboardLoading;

  // Show loading spinner during initial load
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
    const userName = user?.nombre || 'Usuario';
    return `${greeting}, ${userName}`;
  };

  const stats = [
    {
      title: 'Postulaciones',
      value: dashboardData?.stats.postulaciones_mes || 0,
      subtitle: 'Este mes',
      icon: Briefcase,
      color: 'blue' as const,
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Entrevistas',
      value: dashboardData?.stats.entrevistas_programadas || 0,
      subtitle: 'Programadas',
      icon: Calendar,
      color: 'green' as const
    },
    {
      title: 'Match Promedio',
      value: `${dashboardData?.stats.match_promedio || 0}%`,
      subtitle: 'Con ofertas',
      icon: Target,
      color: 'purple' as const
    },
    {
      title: 'Perfil Completitud',
      value: `${dashboardData?.stats.perfil_completitud || 0}%`,
      subtitle: 'Optimización',
      icon: Star,
      color: 'orange' as const
    },
  ];

  // Get icon for activity type
  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'postulacion': return Briefcase;
      case 'entrevista': return Calendar;
      case 'oferta': return Target;
      case 'mensaje': return MessageSquare;
      case 'perfil': return Eye;
      case 'empresa': return Award;
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
              Encuentra las mejores oportunidades para tu carrera
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-white" />
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
        {/* Left Column - Actions and Score */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <QuickActions className="w-full" />

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
              <a href="/dashboard/estudiante/applications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todo
              </a>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity) => {
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
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Profile Score and Quick Stats */}
        <div className="space-y-8">
          {/* Profile Score */}
          <ProfileScore className="w-full" />

          {/* Profile Summary Widget */}
          <ProfileSummaryWidget className="w-full" />

          {/* Quick Stats Widget */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Rápido</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo respuesta</span>
                <span className="text-sm font-medium text-gray-900">
                  24h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ofertas guardadas</span>
                <span className="text-sm font-medium text-gray-900">
                  0
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Match promedio</span>
                <span className="text-sm font-medium text-blue-600">
                  {dashboardData?.stats.match_promedio || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Esta semana</span>
                <span className="text-sm font-medium text-green-600">+{Math.floor(Math.random() * 20) + 5}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Offers */}
      <RecommendedOffers className="w-full" offers={dashboardData?.recommendedOffers} />
    </div>
  );
}
