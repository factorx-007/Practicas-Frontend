'use client';

import { useState } from 'react';
import {
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { API_ENDPOINTS, OFFER_STATUS } from '@/constants';
import OffersList from '@/components/OffersList';
import type { Offer } from '@/hooks/useOfferAffinity';
import type { AdvancedFilters } from '@/components/offers/AdvancedOfferFilters';

export default function MyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filtros, setFiltros] = useState<AdvancedFilters>({
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
  const [showFilters, setShowFilters] = useState(false);

  const handleDeleteOffer = async (offerId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta oferta?')) {
      try {
        const response = await api.delete(`${API_ENDPOINTS.OFFERS.BASE}/${offerId}`);

        if (response.success) {
          setOffers(offers.filter(offer => offer.id !== offerId));
          toast.success('Oferta eliminada exitosamente', {
            icon: '🗑️',
            position: 'top-right'
          });
        } else {
          toast.error('Error al eliminar la oferta');
        }
      } catch (error) {
        console.error('Error deleting offer:', error);
        toast.error('Error al eliminar la oferta', {
          icon: '❌',
          position: 'top-right'
        });
      }
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, nuevoEstado: Offer['estado']) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.OFFERS.BASE}/${offerId}/estado`, { estado: nuevoEstado });

      if (response.success) {
        setOffers(offers.map(offer => (
          offer.id === offerId ? { ...offer, estado: nuevoEstado } as Offer : offer
        )));
        toast.success(`Oferta ${nuevoEstado.toLowerCase()} exitosamente`);
      } else {
        toast.error('Error al actualizar el estado de la oferta');
      }
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast.error('Error al actualizar el estado de la oferta');
    }
  };

  const renderActions = (offer: Offer) => (
    <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <select
          value={offer.estado}
          onChange={(e) => handleUpdateOfferStatus(offer.id, e.target.value as Offer['estado'])}
          className={`text-sm font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-1 cursor-pointer transition-colors
            ${offer.estado === 'PUBLICADA' ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500' :
              offer.estado === 'BORRADOR' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500' :
                'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'}`}
        >
          {Object.values(OFFER_STATUS).map(estado => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>

        <div className="flex space-x-2">
          <Link
            href={`/dashboard/empresa/offers/${offer.id}`}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <Link
            href={`/dashboard/empresa/offers/${offer.id}/edit`}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title="Editar oferta"
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDeleteOffer(offer.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Eliminar oferta"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderExpandedDetails = (offer: Offer) => (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Badges de Requisitos y Estado */}
      <div className="flex flex-wrap gap-2 mb-4">
        {offer.requiereCV && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
            Requiere CV
          </span>
        )}
        {offer.requiereCarta && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
            Requiere Carta
          </span>
        )}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${offer.estado === 'PUBLICADA' ? 'bg-green-50 text-green-700 border-green-100' :
          offer.estado === 'BORRADOR' ? 'bg-gray-50 text-gray-700 border-gray-100' :
            'bg-red-50 text-red-700 border-red-100'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${offer.estado === 'PUBLICADA' ? 'bg-green-500' :
            offer.estado === 'BORRADOR' ? 'bg-gray-500' :
              'bg-red-500'
            }`}></span>
          {offer.estado}
        </span>
      </div>

      {/* Grid de Detalles Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ubicación</p>
            <p className="text-sm text-gray-900 font-semibold mt-0.5">{offer.ubicacion || 'No especificada'}</p>
            <p className="text-xs text-blue-600 font-medium mt-0.5">{offer.modalidad}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tipo de Empleo</p>
            <p className="text-sm text-gray-900 font-semibold mt-0.5">{offer.tipoEmpleo || 'No especificado'}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-green-50 rounded-lg">
            <GraduationCap className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Educación</p>
            <p className="text-sm text-gray-900 font-semibold mt-0.5">{offer.nivelEducacion || 'No especificado'}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Experiencia</p>
            <p className="text-sm text-gray-900 font-semibold mt-0.5">{offer.experiencia || 'No especificada'}</p>
          </div>
        </div>
      </div>

      {/* Descripción y Requisitos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
              Descripción del Puesto
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-600 whitespace-pre-wrap break-words leading-relaxed font-normal">
                {offer.descripcion || 'No hay descripción disponible'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              Fecha Límite
            </h4>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {offer.fechaLimite ? new Date(offer.fechaLimite).toLocaleDateString() : 'No especificada'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Cierre de postulaciones</p>
              </div>
            </div>
          </div>

          {offer.requisitos && offer.requisitos.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4">Requisitos</h4>
              <ul className="space-y-3">
                {offer.requisitos.map((req, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Preguntas Personalizadas */}
      {offer.preguntas && offer.preguntas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-6 bg-purple-500 rounded-full mr-3"></div>
            Preguntas de Aplicación ({offer.preguntas.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offer.preguntas.map((pregunta, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="text-gray-900 font-semibold text-sm flex-grow pr-2 group-hover:text-blue-700 transition-colors">
                    {pregunta.pregunta || 'Pregunta no especificada'}
                    {pregunta.obligatoria && (
                      <span className="ml-1 text-red-500" title="Obligatoria">*</span>
                    )}
                  </p>
                  <span className="text-[10px] font-bold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200 uppercase tracking-wider">
                    {pregunta.tipo}
                  </span>
                </div>

                {pregunta.tipo === 'SELECT' && pregunta.opciones && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pregunta.opciones.map((opcion, optIndex) => (
                      <span
                        key={optIndex}
                        className="bg-white text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-200 shadow-sm"
                      >
                        {opcion}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {renderActions(offer)}
    </div>
  );

  const toggleFilters = () => setShowFilters(!showFilters);

  const applyFilters = () => {
    console.log('Filtros aplicados:', filtros);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Ofertas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona tus publicaciones y revisa el estado de tus vacantes</p>
        </div>
        <button
          onClick={toggleFilters}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${showFilters
              ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Ocultar Filtros' : 'Filtrar Ofertas'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
            <button
              onClick={() => setFiltros({
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
              })}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar todo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Buscar</label>
              <div className="relative">
                <input
                  type="text"
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Buscar por título, descripción o palabras clave..."
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filtros.ubicacion}
                  onChange={(e) => setFiltros(prev => ({ ...prev, ubicacion: e.target.value }))}
                  placeholder="Ciudad, país..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all hover:shadow-md active:transform active:scale-95"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      <OffersList
        apiEndpoint={API_ENDPOINTS.OFFERS.MY_OFFERS}
        headerTitle=""
        headerSubtitle=""
        renderExpandedDetails={renderExpandedDetails}
        filters={filtros}
      />
    </div>
  );
}
