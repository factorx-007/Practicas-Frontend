'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Briefcase, 
  Clock, 
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image'; // Importar Image de next/image

import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponseError } from '@/types/common'; // Importar ApiResponseError

export interface Application {
  id: string;
  titulo: string;
  descripcion: string;
  empresa: {
    nombre_empresa: string;
    logo_url?: string;
  };
  fechaPostulacion: string;
  estado: 'EN_REVISION' | 'ENTREVISTA' | 'ACEPTADO' | 'RECHAZADO';
  cv_url?: string;
  mensaje?: string;
  oferta: {
    ubicacion: string;
    modalidad: string;
    requisitos?: string[];
    nivelEducacion?: string;
    experiencia?: string;
    preguntas?: {
      id: string;
      pregunta: string;
      tipo: 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'EMAIL' | 'URL';
      respuesta?: string | number | string[];
      obligatoria: boolean;
    }[];
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApplicationsListProps {
  apiEndpoint?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  renderExpandedDetails?: (application: Application) => React.ReactNode;
}

export default function ApplicationsList({
  apiEndpoint = API_ENDPOINTS.OFFERS.STUDENT_MY_APPLICATIONS,
  headerTitle = "Mis Postulaciones",
  headerSubtitle = "Seguimiento de tus solicitudes de empleo",
  renderExpandedDetails
}: ApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('TODOS');
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);

  const fetchApplications = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await api.get<{ data: Application[]; pagination: PaginationInfo }>(apiEndpoint, {
        params: { 
          page, 
          limit: 10,
          estado: filter === 'TODOS' ? undefined : filter
        }
      });

      if (response.success) {
        // Manejar caso de datos vacíos
        const _data = response.data?.data || [];
        const paginationInfo = response.data?.pagination || {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        };

        setApplications(_data);
        setPagination(paginationInfo);

        if (_data.length === 0) {
          toast.info('No tienes postulaciones', {
            description: 'Explora ofertas y comienza a postularte'
          });
        }
      } else {
        toast.error(response.message || 'No se pudieron cargar las postulaciones');
      }
    } catch (error: unknown) {
      console.error('Error fetching applications:', error);
      const resp = (error as ApiResponseError).response as { status: number } | undefined;
      if (resp) {
        const { status } = resp;
        
        switch (status) {
          case 401:
            toast.error('No estás autenticado. Por favor, inicia sesión.');
            break;
          case 403:
            toast.error('Solo estudiantes pueden ver sus postulaciones');
            break;
          default:
            toast.error('Error al cargar las postulaciones');
        }
      } else {
        toast.error('Error de conexión. Verifica tu conexión a internet.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, filter]);

  useEffect(() => {
    fetchApplications();
  }, [filter, fetchApplications]);

  const toggleApplicationExpand = (applicationId: string) => {
    setExpandedApplicationId(
      expandedApplicationId === applicationId ? null : applicationId
    );
  };

  const renderApplicationStatus = (estado: Application['estado']) => {
    const statusClasses = {
      'EN_REVISION': 'bg-yellow-100 text-yellow-800',
      'ENTREVISTA': 'bg-blue-100 text-blue-800',
      'ACEPTADO': 'bg-green-100 text-green-800',
      'RECHAZADO': 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      'EN_REVISION': 'En Revisión',
      'ENTREVISTA': 'Entrevista',
      'ACEPTADO': 'Aceptado',
      'RECHAZADO': 'Rechazado'
    };

    return (
      <span 
        className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${statusClasses[estado]}
        `}
      >
        {statusLabels[estado]}
      </span>
    );
  };

  const renderDefaultExpandedDetails = (application: Application) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Descripción de la Oferta</h4>
        <p className="text-gray-600">{application.descripcion}</p>
        
        {/* Requisitos */}
        {application.oferta.requisitos && application.oferta.requisitos.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Requisitos</h4>
            <ul className="list-disc list-inside text-gray-600">
              {application.oferta.requisitos.map((requisito, index) => (
                <li key={index}>{requisito}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Detalles</h4>
        <div className="space-y-2 text-gray-600">
          <p><strong>Ubicación:</strong> {application.oferta.ubicacion}</p>
          <p><strong>Modalidad:</strong> {application.oferta.modalidad}</p>
          {application.oferta.nivelEducacion && (
            <p><strong>Nivel de Educación:</strong> {application.oferta.nivelEducacion}</p>
          )}
          {application.oferta.experiencia && (
            <p><strong>Nivel de Experiencia:</strong> {application.oferta.experiencia}</p>
          )}
          {application.cv_url && (
            <p>
              <strong>CV:</strong> 
              <a 
                href={application.cv_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:underline"
              >
                Ver CV
              </a>
            </p>
          )}
          {application.mensaje && (
            <div>
              <strong>Mensaje de Presentación:</strong>
              <p className="italic text-gray-500">{application.mensaje}</p>
            </div>
          )}
        </div>

        {/* Preguntas de la Postulación */}
        {application.oferta.preguntas && application.oferta.preguntas.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Preguntas de la Oferta</h4>
            {application.oferta.preguntas.map((pregunta) => (
              <div key={pregunta.id} className="mb-3">
                <p className="font-medium text-gray-700">
                  {pregunta.pregunta} 
                  {pregunta.obligatoria && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-gray-600">
                  {pregunta.respuesta 
                    ? (Array.isArray(pregunta.respuesta) 
                      ? pregunta.respuesta.join(', ') 
                      : pregunta.respuesta)
                    : <span className="italic text-gray-500">Sin respuesta</span>
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-8">
      {/* Header Futurista */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">{headerTitle}</h1>
            <p className="text-blue-100 text-lg">
              {headerSubtitle}
            </p>
          </div>
          <div className="hidden md:block">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center"
            >
              <FileText className="w-16 h-16 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="TODOS">Todas las Postulaciones</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="ENTREVISTA">Entrevista</option>
            <option value="ACEPTADO">Aceptadas</option>
            <option value="RECHAZADO">Rechazadas</option>
          </select>
        </div>
      </motion.div>

      {/* Lista de Postulaciones */}
      <AnimatePresence>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : applications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center bg-white border border-gray-200 rounded-xl p-8 shadow-sm"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes postulaciones {filter !== 'TODOS' && `${filter.toLowerCase()}s`}
            </h3>
            <p className="text-gray-600 mb-6">
              Explora ofertas y comienza a postularte
            </p>
            <Link 
              href="/dashboard/estudiante/offers"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Briefcase className="w-5 h-5" />
              <span>Explorar Ofertas</span>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {applications.map(application => (
              <motion.div 
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleApplicationExpand(application.id)}
                >
                  <div className="flex-1 min-w-0 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      {application.empresa.logo_url ? (
                        <Image 
                          src={application.empresa.logo_url} 
                          alt={`Logo de ${application.empresa.nombre_empresa}`} 
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {application.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {application.empresa.nombre_empresa}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 mr-1" />
                          Postulación: {new Date(application.fechaPostulacion).toLocaleDateString()}
                        </span>
                        {renderApplicationStatus(application.estado)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/dashboard/estudiante/applications/${application.id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    {application.estado === 'EN_REVISION' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Contactando con el reclutador');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Contactar
                      </button>
                    )}
                    {application.estado === 'ENTREVISTA' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Preparando documentos para entrevista');
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Preparar Entrevista
                      </button>
                    )}
                  </div>
                </div>

                {/* Detalles Expandidos */}
                <AnimatePresence>
                  {expandedApplicationId === application.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 p-6 border-t border-gray-200"
                    >
                      {renderExpandedDetails 
                        ? renderExpandedDetails(application) 
                        : renderDefaultExpandedDetails(application)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-6">
          <button 
            onClick={() => fetchApplications(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>
          <button 
            onClick={() => fetchApplications(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
