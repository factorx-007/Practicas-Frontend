'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image'; // Importar Image de next/image

import { api } from '@/lib/api';
import { API_ENDPOINTS, WORK_MODALITY, OFFER_TYPES } from '@/constants';
import { useOfferAffinity, Offer } from '@/hooks/useOfferAffinity';
import { useAuthStore } from '@/store/authStore';
import { AdvancedFilters } from '@/components/offers/AdvancedOfferFilters'; // Importar AdvancedFilters

// Función de debounce
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
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

interface OffersListProps {
  apiEndpoint?: string;
  headerTitle: string;
  headerSubtitle: string;
  renderExpandedDetails?: (offer: Offer) => ReactNode;
  renderActions?: (offer: Offer) => ReactNode;
  filters?: AdvancedFilters; // Usar el tipo AdvancedFilters
  onFiltersChange?: (filters: AdvancedFilters) => void;
}

export default function OffersList({
  apiEndpoint = API_ENDPOINTS.OFFERS.SEARCH,
  headerTitle,
  headerSubtitle,
  renderExpandedDetails,
  renderActions,
  filters: externalFilters,
  onFiltersChange
}: OffersListProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Flag to prevent concurrent requests
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [showAffinityScores, setShowAffinityScores] = useState(true);

  const user = useAuthStore(state => state.user);
  const { sortOffersByAffinity, calculateAffinity, studentProfile } = useOfferAffinity();

  useEffect(() => {
    if (studentProfile && offers.length > 0 && user?.rol === 'ESTUDIANTE' && showAffinityScores) {
      setOffers(prevOffers => sortOffersByAffinity(prevOffers));
    }
  }, [studentProfile, sortOffersByAffinity, user?.rol, showAffinityScores]);

  const [filters, setFilters] = useState<AdvancedFilters>({
    search: '',
    ubicacion: '',
    modalidad: [],
    tipoEmpleo: [],
    nivelEducacion: [],
    experiencia: [],
    fechaPublicacion: 'TODO',
    habilidades: [],
    sortBy: 'fechaCreacion',
    sortOrder: 'desc'
  });

  // Agregar tipos explícitos y manejar tipos desconocidos
  const fetchOffers = useCallback(async (page = 1): Promise<void> => {
    // Prevent concurrent requests - return early if already fetching
    if (isFetching) {
      console.log('Skipping fetch - already fetching');
      return;
    }

    try {
      setIsFetching(true);
      // Only set loading to true for initial page loads, not for pagination
      if (page === 1) {
        setIsLoading(true);
      }

      // Usar directamente externalFilters si existen, de lo contrario usar los filtros locales
      const currentFilters = externalFilters || filters;

      type FilterKeys = keyof typeof currentFilters;
      const searchParams: Partial<Record<FilterKeys, string | string[] | number | boolean | null>> = { ...currentFilters };

      // Remover parámetros vacíos
      (Object.keys(searchParams) as Array<keyof typeof searchParams>).forEach(key => {
        const value = searchParams[key];
        if (value === '' || value === null || (Array.isArray(value) && value.length === 0) || value === 'TODO') {
          delete searchParams[key];
        }
      });

      console.log('Fetching offers with params:', searchParams);

      const response = await api.get(apiEndpoint, {
        params: {
          page,
          limit: 10,
          ...searchParams
        }
      });

      console.log('Raw API response:', response);

      if (response.success) {
        console.log('Raw offers data:', response.data);

        // Tipado explícito para response.data
        const offersData = response.data as { data: Offer[], pagination: PaginationInfo }; // Tipar data como Offer[]

        const normalizedOffers: Offer[] = offersData.data.map((offer: Offer) => ({
          id: offer.id || '',
          titulo: offer.titulo || 'Sin título',
          descripcion: offer.descripcion || 'No hay descripción disponible',
          ubicacion: offer.ubicacion || 'No especificada',
          modalidad: offer.modalidad || 'No especificada',
          tipoEmpleo: offer.tipoEmpleo || 'No especificado',
          nivelEducacion: offer.nivelEducacion || 'No especificado',
          experiencia: offer.experiencia || 'No especificada',
          estado: (offer.estado as 'PUBLICADA' | 'CERRADA' | 'BORRADOR') || 'BORRADOR',
          createdAt: offer.createdAt || 'Fecha no especificada',
          fechaLimite: offer.fechaLimite || null,
          requiereCV: offer.requiereCV || false,
          requiereCarta: offer.requiereCarta || false,
          requisitos: offer.requisitos || [],
          preguntas: offer.preguntas || [],
          empresa: offer.empresa || { nombre_empresa: 'Empresa desconocida' },
          _count: offer._count || { postulaciones: 0 }
        }));

        let finalOffers = normalizedOffers;
        if (user?.rol === 'ESTUDIANTE' && showAffinityScores) {
          const offersWithAffinity = sortOffersByAffinity(normalizedOffers);
          finalOffers = offersWithAffinity;
        }

        console.log('Final offers:', finalOffers);
        // For pagination, append offers instead of replacing
        if (page === 1) {
          setOffers(finalOffers);
        } else {
          setOffers(prev => [...prev, ...finalOffers]);
        }
        setPagination(prevPagination => offersData.pagination || prevPagination);
      } else {
        toast.error('No se pudieron cargar las ofertas');
        console.error('API response error:', response);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Error al cargar las ofertas');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [apiEndpoint, externalFilters, showAffinityScores, user?.rol, filters, sortOffersByAffinity, isFetching]);

  // Crear versión debounce de fetchOffers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchOffers = useCallback(
    debounce((page: number) => {
      void fetchOffers(page);
    }, 300),
    [fetchOffers]
  );

  useEffect(() => {
    // Fetch on mount only - external components should call fetchOffers directly when needed
    debouncedFetchOffers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const toggleOfferExpand = (offerId: string) => {
    setExpandedOfferId(expandedOfferId === offerId ? null : offerId);
  };

  const getAffinityBadgeColor = (level: string) => {
    switch (level) {
      case 'EXCELENTE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ALTO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MEDIO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BAJO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAffinityIcon = (level: string) => {
    switch (level) {
      case 'EXCELENTE':
        return <Star className="w-3 h-3" />;
      case 'ALTO':
        return <TrendingUp className="w-3 h-3" />;
      case 'MEDIO':
        return <Target className="w-3 h-3" />;
      default:
        return <Target className="w-3 h-3" />;
    }
  };

  // Ajustar tipos de funciones
  // Eliminar la definición local de calculateAffinity y sortOffersByAffinity
  // ya que se importan de useOfferAffinity

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Minimalista */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900">{headerTitle}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{headerSubtitle}</p>

        {user?.rol === 'ESTUDIANTE' && (
          <label className="inline-flex items-center text-sm text-gray-600 mt-4">
            <input
              type="checkbox"
              checked={showAffinityScores}
              onChange={(e) => setShowAffinityScores(e.target.checked)}
              className="mr-2 rounded border-gray-300"
            />
            Mostrar compatibilidad con mi perfil
          </label>
        )}
      </div>

      {/* Búsqueda Simple */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar ofertas..."
            value={filters.search}
            onChange={(e) => {
              const newSearch = e.target.value;
              // Only update if the value actually changed
              if (filters.search !== newSearch) {
                const newFilters = { ...filters, search: newSearch };
                setFilters(newFilters);
                // Solo actualizar externalFilters si están siendo usados
                if (externalFilters && onFiltersChange) {
                  onFiltersChange(newFilters);
                }
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.modalidad[0] || ""}
          onChange={(e) => {
            const value = e.target.value;
            const newModalidad = value ? [value] : [];
            // Only update if the value actually changed
            if (JSON.stringify(filters.modalidad) !== JSON.stringify(newModalidad)) {
              const newFilters = { ...filters, modalidad: newModalidad };
              setFilters(newFilters);
              // Solo actualizar externalFilters si están siendo usados
              if (externalFilters && onFiltersChange) {
                onFiltersChange(newFilters);
              }
            }
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Modalidad</option>
          {Object.values(WORK_MODALITY).map(modalidad => (
            <option key={modalidad} value={modalidad}>{modalidad}</option>
          ))}
        </select>

        <select
          value={filters.tipoEmpleo[0] || ''}
          onChange={e => {
            const value = e.target.value;
            const newTipoEmpleo = value ? [value] : [];
            // Only update if the value actually changed
            if (JSON.stringify(filters.tipoEmpleo) !== JSON.stringify(newTipoEmpleo)) {
              const newFilters = { ...filters, tipoEmpleo: newTipoEmpleo };
              setFilters(newFilters);
              // Solo actualizar externalFilters si están siendo usados
              if (externalFilters && onFiltersChange) {
                onFiltersChange(newFilters);
              }
            }
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tipo</option>
          {Object.values(OFFER_TYPES).map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {/* Lista de Ofertas */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No hay ofertas disponibles</h3>
          <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer: Offer) => {
            const affinityData = offer.affinity || (user?.rol === 'ESTUDIANTE' && showAffinityScores ? calculateAffinity(offer) : null);

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {/* Encabezado de la Oferta */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOfferExpand(offer.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      {/* Logo/Icono */}
                      <div className="flex-shrink-0">
                        {offer.empresa?.logo_url ? (
                          <Image
                            src={offer.empresa.logo_url}
                            alt={`Logo de ${offer.empresa.nombre_empresa}`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {offer.titulo || 'Sin título'}
                          </h3>

                          {affinityData && user?.rol === 'ESTUDIANTE' && showAffinityScores && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getAffinityBadgeColor(affinityData.level)}`}>
                              {getAffinityIcon(affinityData.level)}
                              {affinityData.score}%
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 font-medium">
                          {offer.empresa?.nombre_empresa || 'Empresa desconocida'}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {offer.ubicacion || 'Ubicación no especificada'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'Fecha no especificada'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {offer._count?.postulaciones || 0} postulaciones
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón de expandir */}
                    <div className="flex-shrink-0 ml-4">
                      {expandedOfferId === offer.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Detalles Expandidos */}
                <AnimatePresence>
                  {expandedOfferId === offer.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                        {/* Información básica - Layout adaptativo */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Descripción
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                              <p className="text-gray-700 leading-relaxed text-sm lg:text-base whitespace-pre-wrap break-words">
                                {offer.descripcion || 'Sin descripción'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Detalles del puesto
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                              <div className="space-y-2 text-xs lg:text-sm">
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-gray-600 font-medium">Modalidad:</span>
                                  <span className="text-gray-900 bg-white px-2 py-1 rounded text-xs">
                                    {offer.modalidad || 'No especificada'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-gray-600 font-medium">Tipo:</span>
                                  <span className="text-gray-900 bg-white px-2 py-1 rounded text-xs">
                                    {offer.tipoEmpleo || 'No especificado'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-gray-600 font-medium">Educación:</span>
                                  <span className="text-gray-900 bg-white px-2 py-1 rounded text-xs">
                                    {offer.nivelEducacion || 'No especificado'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                  <span className="text-gray-600 font-medium">Experiencia:</span>
                                  <span className="text-gray-900 bg-white px-2 py-1 rounded text-xs">
                                    {offer.experiencia || 'No especificada'}
                                  </span>
                                </div>

                                {offer.fechaLimite && (
                                  <div className="flex items-center justify-between py-1">
                                    <span className="text-gray-600 font-medium">Fecha límite:</span>
                                    <span className="text-red-600 bg-white px-2 py-1 rounded text-xs font-medium">
                                      {new Date(offer.fechaLimite).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Requisitos */}
                        {offer.requisitos && offer.requisitos.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 text-sm lg:text-base flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Requisitos ({offer.requisitos.length})
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                                {offer.requisitos.map((req: string, index: number) => (
                                  <div key={index} className="flex items-start gap-2 text-gray-700 bg-white rounded p-2 lg:p-3">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span className="text-xs lg:text-sm leading-relaxed">{req}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Análisis de Afinidad */}
                        {affinityData && user?.rol === 'ESTUDIANTE' && showAffinityScores && (
                          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-3 lg:p-4 border border-blue-200">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium border self-start ${getAffinityBadgeColor(affinityData.level)}`}>
                                {getAffinityIcon(affinityData.level)}
                                {affinityData.score}% compatible
                              </span>
                              <h4 className="font-medium text-gray-900 text-sm lg:text-base">Análisis de compatibilidad</h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                              {/* Razones y breakdown */}
                              <div className="space-y-3">
                                {/* Razones */}
                                {affinityData.reasons.length > 0 && (
                                  <div>
                                    <h5 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">✅ Fortalezas:</h5>
                                    <div className="space-y-1">
                                      {affinityData.reasons.slice(0, 3).map((reason: string, index: number) => (
                                        <div key={index} className="flex items-start gap-2 text-gray-700 bg-white/70 rounded p-2">
                                          <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                          <span className="text-xs lg:text-sm">{reason}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Breakdown compacto */}
                                <div>
                                  <h5 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">📊 Puntuación por área:</h5>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/70 rounded p-2 text-center">
                                      <div className="text-sm lg:text-base font-semibold text-blue-600">
                                        {Math.round(affinityData.breakdown.skills)}%
                                      </div>
                                      <div className="text-xs text-gray-600">Habilidades</div>
                                    </div>
                                    <div className="bg-white/70 rounded p-2 text-center">
                                      <div className="text-sm lg:text-base font-semibold text-green-600">
                                        {Math.round(affinityData.breakdown.experience)}%
                                      </div>
                                      <div className="text-xs text-gray-600">Experiencia</div>
                                    </div>
                                    <div className="bg-white/70 rounded p-2 text-center">
                                      <div className="text-sm lg:text-base font-semibold text-purple-600">
                                        {Math.round(affinityData.breakdown.education)}%
                                      </div>
                                      <div className="text-xs text-gray-600">Educación</div>
                                    </div>
                                    <div className="bg-white/70 rounded p-2 text-center">
                                      <div className="text-sm lg:text-base font-semibold text-orange-600">
                                        {Math.round(affinityData.breakdown.location)}%
                                      </div>
                                      <div className="text-xs text-gray-600">Ubicación</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Habilidades faltantes y recomendaciones */}
                              <div className="space-y-3">
                                {/* Habilidades faltantes */}
                                {affinityData.missingSkills.length > 0 && (
                                  <div>
                                    <h5 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
                                      🎯 Por desarrollar:
                                    </h5>
                                    <div className="flex flex-wrap gap-1 lg:gap-2">
                                      {affinityData.missingSkills.slice(0, 4).map((skill: string, index: number) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                      {affinityData.missingSkills.length > 4 && (
                                        <span className="text-xs text-gray-500 px-2 py-1">
                                          +{affinityData.missingSkills.length - 4} más
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Recomendaciones */}
                                {affinityData.recommendations.length > 0 && (
                                  <div>
                                    <h5 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
                                      💡 Recomendaciones:
                                    </h5>
                                    <div className="space-y-1 lg:space-y-2">
                                      {affinityData.recommendations.slice(0, 2).map((recommendation: string, index: number) => (
                                        <div key={index} className="text-xs lg:text-sm text-gray-600 bg-white/70 p-2 rounded">
                                          {recommendation}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Acciones personalizadas */}
                        {renderExpandedDetails && renderExpandedDetails(offer)}
                        {renderActions && renderActions(offer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => fetchOffers(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
            {pagination.currentPage} de {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchOffers(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}


