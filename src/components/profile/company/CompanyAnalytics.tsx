'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { Offer } from '@/types/offers';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import {
  Users,
  Briefcase,
  Eye,
  BarChart3,
  Activity,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CompanyAnalyticsProps {
  profile?: UserProfile | null;
}

export default function CompanyAnalytics({ }: CompanyAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalApplications: 0,
    activeJobs: 0,
    avgApplications: 0,
    topJobs: [] as Offer[]
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Offer[]; pagination: Record<string, unknown> }>(API_ENDPOINTS.OFFERS.MY_OFFERS);
      if (response.success && response.data) {
        const offers = Array.isArray(response.data.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);

        const totalViews = offers.reduce((sum, job) => sum + (job.numeroVistas || 0), 0);
        const totalApplications = offers.reduce((sum, job) => sum + (job.numeroPostulaciones || 0), 0);
        const activeJobs = offers.filter(job => job.estado === 'ACTIVA').length;
        const avgApplications = offers.length > 0 ? Math.round(totalApplications / offers.length) : 0;

        // Sort by views and take top 5
        const topJobs = [...offers]
          .sort((a, b) => (b.numeroVistas || 0) - (a.numeroVistas || 0))
          .slice(0, 5);

        setStats({
          totalViews,
          totalApplications,
          activeJobs,
          avgApplications,
          topJobs
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">
            Analiza el rendimiento de tus ofertas laborales y candidatos
          </p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Histórico completo</option>
            {/* Future implementation: Date filtering */}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vistas Totales</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Total histórico
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aplicaciones</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalApplications.toLocaleString()}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Total histórico
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Empleos Activos</p>
              <p className="text-2xl font-bold text-purple-600">{stats.activeJobs}</p>
              <p className="text-xs text-gray-500 mt-1">En este momento</p>
            </div>
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio Apps/Empleo</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgApplications}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                Rendimiento promedio
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Top Performing Jobs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Empleos con Mejor Rendimiento (Top 5)
        </h3>

        {stats.topJobs.length > 0 ? (
          <div className="space-y-4">
            {stats.topJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{job.titulo}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {job.numeroVistas || 0} vistas
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.numeroPostulaciones || 0} aplicaciones
                    </span>
                    <span className="flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      {job.estado}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">
                    {job.numeroVistas && job.numeroVistas > 0
                      ? `${(((job.numeroPostulaciones || 0) / job.numeroVistas) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                  <p className="text-xs text-gray-500">Tasa conversión</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-4">No hay datos suficientes para mostrar tendencias.</p>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-blue-800 text-sm">
              {stats.activeJobs === 0
                ? "No tienes empleos activos. Publica una nueva oferta para atraer talento."
                : `Tienes ${stats.activeJobs} empleos activos recibiendo candidatos.`}
            </p>
          </div>
          {stats.topJobs.length > 0 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-blue-800 text-sm">
                El empleo &quot;{stats.topJobs[0].titulo}&quot; es el más popular con {stats.topJobs[0].numeroVistas} vistas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
