'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Info,
  Send,
  Eye,
  FileText,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';

interface Application {
  id: string;
  titulo: string;
  descripcion: string;
  empresa: {
    nombre_empresa: string;
    logo_url?: string;
  };
  fechaPostulacion: string;
  estado?: string;
  oferta?: {
    id: string;
    ubicacion?: string;
    modalidad?: string;
    tipoEmpleo?: string;
    nivelEducacion?: string;
    experiencia?: string;
    fecha_limite?: string;
  };
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(API_ENDPOINTS.OFFERS.STUDENT_MY_APPLICATIONS);

        if (response.success) {
          const raw = response.data as unknown;
          let applicationsData: Application[] = [];

          // Helper to safely access nested data
          const getNestedData = (data: unknown) => {
            if (data && typeof data === 'object' && 'data' in data) {
              return (data as { data: unknown }).data;
            }
            return data;
          };

          const rawData = getNestedData(raw);

          if (Array.isArray(rawData)) {
            applicationsData = rawData.map((app: unknown) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const application = app as any;
              return {
                id: application.id,
                titulo: application.oferta?.titulo || 'Oferta sin título',
                descripcion: application.oferta?.descripcion || '',
                empresa: {
                  nombre_empresa: application.oferta?.empresa?.nombre_empresa || 'Empresa desconocida',
                  logo_url: application.oferta?.empresa?.logo_url || application.oferta?.empresa?.usuario?.avatar
                },
                fechaPostulacion: application.createdAt,
                estado: application.estado,
                oferta: {
                  id: application.oferta?.id,
                  ubicacion: application.oferta?.ubicacion,
                  modalidad: application.oferta?.modalidad,
                  tipoEmpleo: application.oferta?.tipoEmpleo,
                  nivelEducacion: application.oferta?.nivelEducacion,
                  experiencia: application.oferta?.experiencia,
                  fecha_limite: application.oferta?.fecha_limite
                }
              };
            });
          }
          setApplications(applicationsData);
        } else {
          toast.error(response.message || 'Error al cargar tus postulaciones');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Error de conexión o al cargar postulaciones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EN_REVISION': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACEPTADA': return 'bg-green-100 text-green-800 border-green-200';
      case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-200';
      case 'ENTREVISTA': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_REVISION': return 'En Revisión';
      case 'ACEPTADA': return 'Aceptada';
      case 'RECHAZADA': return 'No Seleccionado';
      case 'ENTREVISTA': return 'Entrevista';
      default: return status || 'Desconocido';
    }
  };

  const formatDateSafe = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return isValid(date)
      ? format(date, "d 'de' MMMM, yyyy", { locale: es })
      : 'Fecha no disponible';
  };

  const toggleApplicationExpand = (applicationId: string) => {
    setExpandedApplicationId(
      expandedApplicationId === applicationId ? null : applicationId
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Postulaciones</h1>
          <p className="mt-1 text-sm text-gray-500">Seguimiento de tus procesos de selección</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500">Total:</span>
          <span className="ml-2 text-lg font-bold text-gray-900">{applications.length}</span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Aún no tienes postulaciones
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Explora las ofertas disponibles y da el primer paso hacia tu próxima oportunidad profesional.
          </p>
          <Link
            href="/dashboard/estudiante/offers"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Explorar Ofertas
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => {
            const currentStep = (() => {
              switch (application.estado) {
                case 'PENDIENTE': return 1;
                case 'EN_REVISION': return 2;
                case 'ENTREVISTA': return 3;
                case 'ACEPTADA': return 4;
                case 'RECHAZADA': return -1;
                default: return 1;
              }
            })();

            const steps = [
              { id: 1, label: 'Enviada' },
              { id: 2, label: 'En Revisión' },
              { id: 3, label: 'Entrevista' },
              { id: 4, label: 'Oferta' }
            ];

            return (
              <div
                key={application.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Encabezado de la Postulación */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleApplicationExpand(application.id)}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Info Principal */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {application.empresa?.logo_url ? (
                          <Image
                            src={application.empresa.logo_url}
                            alt={`Logo de ${application.empresa.nombre_empresa}`}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200">
                            <Briefcase className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {application.titulo || 'Oferta sin título'}
                          </h2>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.estado)}`}>
                            {getStatusLabel(application.estado)}
                          </span>
                        </div>
                        <p className="text-base font-medium text-gray-600 mb-2">
                          {application.empresa?.nombre_empresa || 'Empresa desconocida'}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                          Postulado el {formatDateSafe(application.fechaPostulacion)}
                        </div>
                      </div>
                    </div>

                    {/* Status Tracker (Solo visible en desktop o si no está rechazada) */}
                    {/* Status Tracker Mejorado */}
                    {currentStep !== -1 && (
                      <div className="hidden md:block px-4 min-w-[340px]">
                        <div className="relative flex items-center justify-between w-full">
                          {/* Línea de fondo */}
                          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full -z-10" />

                          {/* Línea de progreso activa */}
                          <div
                            className="absolute left-0 top-1/2 h-1 bg-blue-600 -translate-y-1/2 rounded-full -z-10 transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                          />

                          {steps.map((step) => {
                            const isCompleted = step.id <= currentStep;
                            const isCurrent = step.id === currentStep;

                            return (
                              <div key={step.id} className="relative flex flex-col items-center group/step">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white ${isCompleted
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-gray-300 text-gray-300'
                                    } ${isCurrent ? 'ring-4 ring-blue-50 shadow-lg scale-110' : ''}`}
                                >
                                  {isCompleted ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                                  )}
                                </div>
                                <span
                                  className={`absolute -bottom-6 text-[11px] font-semibold whitespace-nowrap transition-colors duration-300 ${isCompleted ? 'text-blue-700' : 'text-gray-400'
                                    }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detalles Expandidos */}
                {/* Detalles Expandidos Mejorados */}
                {expandedApplicationId === application.id && (
                  <div className="bg-gray-50/80 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Columna Izquierda: Detalles Clave */}
                        <div className="lg:col-span-4 space-y-6">
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                Detalles del Puesto
                              </h3>
                            </div>
                            <div className="p-5 space-y-5">
                              {application.oferta?.ubicacion && (
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ubicación</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{application.oferta.ubicacion}</p>
                                  </div>
                                </div>
                              )}
                              {application.oferta?.modalidad && (
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-purple-50 rounded-lg shrink-0">
                                    <Briefcase className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Modalidad</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{application.oferta.modalidad}</p>
                                  </div>
                                </div>
                              )}
                              {application.oferta?.tipoEmpleo && (
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-green-50 rounded-lg shrink-0">
                                    <Clock className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tipo de Empleo</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{application.oferta.tipoEmpleo}</p>
                                  </div>
                                </div>
                              )}
                              {application.oferta?.nivelEducacion && (
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                                    <GraduationCap className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Educación</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{application.oferta.nivelEducacion}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {application.oferta?.id && (
                              <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <Link
                                  href={`/dashboard/estudiante/offers/${application.oferta.id}`}
                                  className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow group/btn"
                                >
                                  <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                  Ver Oferta Completa
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Columna Derecha: Descripción */}
                        <div className="lg:col-span-8">
                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                              <FileText className="w-5 h-5 text-gray-400" />
                              Descripción de la Oferta
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-600">
                              <p className="whitespace-pre-line leading-relaxed">
                                {application.descripcion || 'Sin descripción disponible'}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
