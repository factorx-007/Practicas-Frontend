'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Info,
  Send,
  Eye,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image'; // Importar Image de next/image

import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';

// Interfaz para representar una postulación
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
    ubicacion?: string;
    modalidad?: string;
    tipoEmpleo?: string;
    salarioMin?: number;
    salarioMax?: number;
    moneda?: string;
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

        console.log('Raw applications response:', response);

        if (response.success) {
          // Asegurarse de que los datos sean un array con type guards
          const raw = response.data as unknown;
          let applicationsData: Application[] = [];
          if (raw && typeof raw === 'object' && 'data' in (raw as Record<string, unknown>)) {
            const inner = (raw as { data?: unknown }).data;
            if (Array.isArray(inner)) {
              applicationsData = inner as Application[];
            }
          }

          console.log('Processed applications:', applicationsData);
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
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_REVISION': return 'bg-blue-100 text-blue-600';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      case 'ENTREVISTA': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleApplicationExpand = (applicationId: string) => {
    setExpandedApplicationId(
      expandedApplicationId === applicationId ? null : applicationId
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Postulaciones</h1>
        <div className="text-sm text-gray-500">
          Total de postulaciones: {applications.length}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
          <Info className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Aún no tienes postulaciones
          </h2>
          <p className="text-gray-600">
            Explora las ofertas de trabajo y postúlate a las que te interesen.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div 
              key={application.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Encabezado de la Postulación */}
              <div 
                className="p-6 cursor-pointer flex justify-between items-center border-b border-gray-200"
                onClick={() => toggleApplicationExpand(application.id)}
              >
                <div className="flex items-center space-x-4">
                  {application.empresa?.logo_url ? (
                    <Image 
                      src={application.empresa.logo_url} 
                      alt={`Logo de ${application.empresa.nombre_empresa}`} 
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Briefcase className="w-12 h-12 text-gray-500 p-2 border rounded-full" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {application.titulo || 'Oferta sin título'}
                    </h2>
                    <p className="text-gray-600">
                      {application.empresa?.nombre_empresa || 'Empresa desconocida'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {application.estado && (
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.estado)}`}
                    >
                      {application.estado}
                    </span>
                  )}
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {format(new Date(application.fechaPostulacion), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
              </div>

              {/* Detalles Expandidos */}
              {expandedApplicationId === application.id && (
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Descripción de la Oferta */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                        Descripción
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {application.descripcion || 'Sin descripción disponible'}
                      </p>
                    </div>

                    {/* Detalles de la Oferta */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-green-500" />
                        Detalles de la Oferta
                      </h3>
                      <div className="space-y-2">
                        {application.oferta?.ubicacion && (
                          <p className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            Ubicación: {application.oferta.ubicacion}
                          </p>
                        )}
                        {application.oferta?.modalidad && (
                          <p className="flex items-center text-gray-600">
                            <Send className="w-4 h-4 mr-2 text-gray-400" />
                            Modalidad: {application.oferta.modalidad}
                          </p>
                        )}
                        {application.oferta?.tipoEmpleo && (
                          <p className="flex items-center text-gray-600">
                            <Eye className="w-4 h-4 mr-2 text-gray-400" />
                            Tipo de Empleo: {application.oferta.tipoEmpleo}
                          </p>
                        )}
                        {application.oferta?.salarioMin && application.oferta?.salarioMax && (
                          <p className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                            Salario: {application.oferta.moneda || 'USD'} {application.oferta.salarioMin} - {application.oferta.salarioMax}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
