'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { AdvancedFilters } from '@/components/offers/AdvancedOfferFilters';
import { Briefcase, Sparkles } from 'lucide-react';

import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import OffersList from '@/components/OffersList';
import type { Offer } from '@/hooks/useOfferAffinity';
import EnhancedApplicationForm from '@/components/offers/EnhancedApplicationForm';
import AdvancedOfferFilters from '@/components/offers/AdvancedOfferFilters';

interface ApiResponseError {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: { msg?: string; message?: string }[];
    };
  };
}

export default function StudentOffersPage() {
  const [advancedFilters, setAdvancedFilters] = useState({
    // Filtros básicos
    search: '',
    ubicacion: '',
    modalidad: [] as string[],
    tipoEmpleo: [] as string[],

    // Filtros de requisitos
    nivelEducacion: [] as string[],
    experiencia: [] as string[],

    // Filtros de fecha
    fechaPublicacion: 'TODO' as 'TODO' | 'HOY' | 'SEMANA' | 'MES',

    // Filtros de habilidades
    habilidades: [] as string[],

    // Ordenamiento
    sortBy: 'relevancia' as 'relevancia' | 'fechaCreacion' | 'popularidad',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  type ApplicationPayload = {
    mensaje: string;
    cvUrl?: string;
    portfolioUrl?: string;
    motivacion?: string;
    disponibilidad: string;
    respuestas?: { preguntaId: string; respuesta: string }[];
  };


  const handleApplyToOffer = async (offerId: string, applicationData: unknown) => {
    try {
      // Asegurarnos de que los datos tengan el formato esperado
      const formData = applicationData as {
        mensajePresentacion: string;
        cvUrl?: string;
        portfolioUrl?: string;
        motivacion?: string;
        disponibilidad: string;
        respuestasPersonalizadas?: { preguntaId: string; respuesta: string }[];
      };

      console.log('Enviando postulación:', formData);

      // Transformar al payload esperado por el backend
      const payload: ApplicationPayload = {
        mensaje: formData.mensajePresentacion,
        disponibilidad: formData.disponibilidad,
        ...(formData.cvUrl && { cvUrl: formData.cvUrl }),
        ...(formData.portfolioUrl && { portfolioUrl: formData.portfolioUrl }),
        ...(formData.motivacion && { motivacion: formData.motivacion }),
        ...(formData.respuestasPersonalizadas && formData.respuestasPersonalizadas.length > 0
          ? { respuestas: formData.respuestasPersonalizadas.filter(r => r.respuesta.trim() !== '') }
          : {})
      };

      const response = await api.post(`${API_ENDPOINTS.OFFERS.BASE}/${offerId}/apply`, payload);

      if (response.success) {
        toast.success('Postulación enviada exitosamente', {
          icon: '🎉',
          position: 'top-right'
        });

        // En lugar de recargar la página, actualizamos el estado local
        // Esto evita recargas múltiples y mejora la experiencia de usuario
      } else {
        toast.error(response.message || 'Error al enviar postulación');
      }
    } catch (error: unknown) {
      console.error('Error applying to offer:', error);

      const errObj = error as ApiResponseError;
      if (errObj.response) {
        const { status, data } = errObj.response;

        switch (status) {
          case 400:
            if (data.errors && data.errors.length > 0) {
              data.errors.forEach((err: { msg?: string; message?: string }) => {
                toast.error(err.msg || err.message || 'Error en los datos de postulación');
              });
            } else {
              toast.error(data.message || 'Error en los datos de postulación');
            }
            break;
          case 401:
            toast.error('No estás autenticado. Por favor, inicia sesión.');
            break;
          case 403:
            toast.error('Solo estudiantes pueden postularse a ofertas');
            break;
          case 404:
            toast.error('Oferta no encontrada');
            break;
          case 409:
            toast.error('Ya te postulaste a esta oferta anteriormente');
            break;
          default:
            toast.error('Error al enviar postulación');
        }
      } else {
        toast.error('Error de conexión. Verifica tu conexión a internet.');
      }
    }
  };


  const renderApplicationForm = (offer: Offer) => {
    type MinimalOfferForForm = {
      id: string;
      titulo?: string;
      descripcion?: string;
      requiereCV?: boolean;
      requiereCarta?: boolean;
      preguntas?: {
        id?: string;
        pregunta?: string;
        tipo?: 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'EMAIL' | 'URL';
        obligatoria?: boolean;
        opciones?: string[];
      }[];
      empresa?: { nombre_empresa?: string };
    };

    type OfferQuestionType = 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'EMAIL' | 'URL';
    const allowedTipos: ReadonlyArray<OfferQuestionType> = ['TEXT', 'NUMBER', 'SELECT', 'TEXTAREA', 'EMAIL', 'URL'] as const;
    const isOfferQuestionType = (val: string): val is OfferQuestionType => (allowedTipos as readonly string[]).includes(val);
    const converted: MinimalOfferForForm = {
      id: offer.id,
      titulo: offer.titulo,
      descripcion: offer.descripcion,
      requiereCV: offer.requiereCV,
      requiereCarta: offer.requiereCarta,
      empresa: offer.empresa ? { nombre_empresa: offer.empresa.nombre_empresa } : undefined,
      preguntas: offer.preguntas?.map((q) => {
        const tipo = typeof q.tipo === 'string' && isOfferQuestionType(q.tipo) ? q.tipo : undefined;
        return {
          id: q.id,
          pregunta: q.pregunta,
          tipo,
          obligatoria: q.obligatoria,
          opciones: q.opciones
        };
      })
    };

    return (
      <EnhancedApplicationForm
        offer={converted}
        onSubmit={async (data) => {
          try {
            await handleApplyToOffer(offer.id, data);
          } catch (error) {
            console.error('Error al procesar el formulario:', error);
            toast.error('Error al procesar el formulario');
          }
        }}
      />
    );
  };

  const handleAdvancedFiltersChange = (newFilters: typeof advancedFilters) => {
    // Only update if filters actually changed to prevent unnecessary re-renders
    setAdvancedFilters(prev => {
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(newFilters);
      return hasChanged ? newFilters : prev;
    });
  };

  const clearAllFilters = () => {
    setAdvancedFilters({
      search: '',
      ubicacion: '',
      modalidad: [],
      tipoEmpleo: [],
      nivelEducacion: [],
      experiencia: [],
      fechaPublicacion: 'TODO',
      habilidades: [],
      sortBy: 'relevancia',
      sortOrder: 'desc'
    });
  };

  // Convertir filtros avanzados al formato que espera OffersList
  const convertToSimpleFilters = (): AdvancedFilters => {
    return {
      search: advancedFilters.search,
      ubicacion: advancedFilters.ubicacion,
      modalidad: advancedFilters.modalidad,
      tipoEmpleo: advancedFilters.tipoEmpleo,
      nivelEducacion: advancedFilters.nivelEducacion,
      experiencia: advancedFilters.experiencia,
      habilidades: advancedFilters.habilidades,
      fechaPublicacion: advancedFilters.fechaPublicacion,
      sortBy: advancedFilters.sortBy,
      sortOrder: advancedFilters.sortOrder
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Ofertas de Trabajo
          </h1>
          <p className="mt-2 text-gray-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Encuentra tu próxima oportunidad profesional ideal
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
            Explora cientos de oportunidades
          </div>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <AdvancedOfferFilters
          filters={advancedFilters}
          onFiltersChange={handleAdvancedFiltersChange}
          onClearFilters={clearAllFilters}
        />
      </div>

      {/* Lista de Ofertas */}
      <div className="mt-8">
        <OffersList
          apiEndpoint={API_ENDPOINTS.OFFERS.SEARCH}
          headerTitle="Resultados de Búsqueda"
          headerSubtitle="Explora y postúlate a las mejores oportunidades laborales"
          renderExpandedDetails={renderApplicationForm}
          filters={convertToSimpleFilters()}
          onFiltersChange={handleAdvancedFiltersChange}
        />
      </div>
    </div>
  );
}
