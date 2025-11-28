'use client';

import { useState, useEffect } from 'react';
import { Offer } from '@/types/offers';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CompanyJobsProps {
  profile: unknown;
}

export default function CompanyJobs({ }: CompanyJobsProps) {
  const [jobs, setJobs] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Offer[]; pagination: Record<string, unknown> }>(API_ENDPOINTS.OFFERS.MY_OFFERS);
      if (response.success && response.data) {
        const jobsData = Array.isArray(response.data.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Error al cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVA':
        return 'bg-green-100 text-green-700';
      case 'PAUSADA':
        return 'bg-yellow-100 text-yellow-700';
      case 'CERRADA':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVA':
        return <CheckCircle className="w-4 h-4" />;
      case 'PAUSADA':
        return <Clock className="w-4 h-4" />;
      case 'CERRADA':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Empleos</h2>
          <p className="text-gray-600 mt-1">
            Gestiona tus ofertas laborales y candidatos
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Publicar Empleo
        </button>
      </div>

      {/* Jobs Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
              <p className="text-sm text-gray-600">Total Empleos</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {jobs.filter(job => job.estado === 'ACTIVA').length}
              </p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {jobs.reduce((sum, job) => sum + (job.numeroPostulaciones || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Aplicaciones</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {jobs.length > 0
                  ? Math.round(jobs.reduce((sum, job) => sum + (job.numeroPostulaciones || 0), 0) / jobs.length)
                  : 0}
              </p>
              <p className="text-sm text-gray-600">Promedio/Empleo</p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.titulo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(job.estado)}`}>
                      {getStatusIcon(job.estado)}
                      <span>{job.estado}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.ubicacion || 'Remoto'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{job.tipoEmpleo}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>
                        {job.mostrarSalario && job.salarioMin && job.salarioMax
                          ? `${job.moneda} ${job.salarioMin} - ${job.salarioMax}`
                          : 'Salario no visible'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Publicado {formatDate(job.fechaCreacion)}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.descripcion}</p>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{job.numeroPostulaciones || 0} aplicaciones</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Job Actions */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver candidatos ({job.numeroPostulaciones || 0})
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      Ver detalles
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {job.estado === 'ACTIVA' && (
                      <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors duration-200">
                        Pausar
                      </button>
                    )}
                    {job.estado === 'PAUSADA' && (
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors duration-200">
                        Activar
                      </button>
                    )}
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors duration-200">
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleos publicados</h3>
          <p className="text-gray-600 mb-6">
            Comienza a atraer talento publicando tu primera oferta laboral
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto">
            <Plus className="w-4 h-4 mr-2" />
            Publicar Primer Empleo
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <div className="text-blue-600 mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Nuevo Empleo</h4>
            <p className="text-sm text-gray-600">Crea una nueva oferta laboral</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <div className="text-green-600 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Ver Todos los Candidatos</h4>
            <p className="text-sm text-gray-600">Revisa todas las aplicaciones</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <div className="text-purple-600 mb-2">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Plantillas de Empleo</h4>
            <p className="text-sm text-gray-600">Usa plantillas predefinidas</p>
          </button>
        </div>
      </div>
    </div>
  );
}
