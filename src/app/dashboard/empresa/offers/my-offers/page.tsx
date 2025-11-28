'use client';

import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  DollarSign,
  MapPin
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
    salarioMin: null,
    salarioMax: null,
    soloConSalario: false,
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
        // Actualizar el estado de la oferta localmente
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
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Link 
          href={`/dashboard/empresa/offers/${offer.id}`}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Eye className="w-5 h-5" />
        </Link>
        <Link 
          href={`/dashboard/empresa/offers/${offer.id}/edit`}
          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
        >
          <Edit className="w-5 h-5" />
        </Link>
        <button 
          onClick={() => handleDeleteOffer(offer.id)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      {/* Cambiar estado de la oferta */}
      <select 
        value={offer.estado}
        onChange={(e) => handleUpdateOfferStatus(offer.id, e.target.value as Offer['estado'])}
        className="w-full p-1 text-sm border rounded"
      >
        {Object.values(OFFER_STATUS).map(estado => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>
    </div>
  );

  const renderExpandedDetails = (offer: Offer) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Información Básica */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2" /> Ubicación
        </h4>
        <p className="text-gray-600">{offer.ubicacion || 'No especificada'}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" /> Rango Salarial
        </h4>
        <p className="text-gray-600">
          {offer.salarioMin && offer.salarioMax
            ? `${offer.moneda} ${offer.salarioMin} - ${offer.salarioMax}`
            : 'No especificado'}
        </p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" /> Fecha Límite
        </h4>
        <p className="text-gray-600">
          {offer.fechaLimite || 'No especificada'}
        </p>
      </div>
      
      {/* Detalles Adicionales */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Modalidad</h4>
        <p className="text-gray-600">{offer.modalidad || 'No especificada'}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Tipo de Empleo</h4>
        <p className="text-gray-600">{offer.tipoEmpleo || 'No especificado'}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Nivel de Educación</h4>
        <p className="text-gray-600">{offer.nivelEducacion || 'No especificado'}</p>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Experiencia</h4>
        <p className="text-gray-600">{offer.experiencia || 'No especificada'}</p>
      </div>
      
      {/* Descripción Principal */}
      <div className="col-span-full">
        <h4 className="font-semibold text-gray-700 mb-2">Descripción del Puesto</h4>
        <p className="text-gray-600 whitespace-pre-line">{offer.descripcion || 'No hay descripción disponible'}</p>
      </div>

      {/* Requisitos */}
      {offer.requisitos && offer.requisitos.length > 0 && (
        <div className="col-span-full">
          <h4 className="font-semibold text-gray-700 mb-2">Requisitos</h4>
          <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-2">
            {offer.requisitos.map((req, index) => (
              <li key={index} className="text-gray-600">{req}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Preguntas Personalizadas */}
      {offer.preguntas && offer.preguntas.length > 0 && (
        <div className="col-span-full">
          <h4 className="font-semibold text-gray-700 mb-3">Preguntas de Aplicación</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offer.preguntas.map((pregunta, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-800 font-medium flex-grow pr-2">
                    {pregunta.pregunta || 'Pregunta no especificada'}
                    {pregunta.obligatoria && (
                      <span 
                        className="ml-2 text-red-500 text-sm"
                        title="Pregunta obligatoria"
                      >
                        *
                      </span>
                    )}
                  </p>
                  <span 
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    {pregunta.tipo || 'No especificado'}
                  </span>
                </div>
                
                {pregunta.tipo === 'SELECT' && pregunta.opciones && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Opciones:</p>
                    <div className="flex flex-wrap gap-2">
                      {pregunta.opciones.map((opcion, optIndex) => (
                        <span 
                          key={optIndex} 
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {opcion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Acciones */}
      <div className="col-span-full">
        {renderActions(offer)}
      </div>
    </div>
  );

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };


  const applyFilters = () => {
    // Implementar lógica de filtrado
    // Puedes hacer una llamada a la API con los filtros o filtrar los resultados localmente
    console.log('Filtros aplicados:', filtros);
    // Aquí podrías agregar una llamada a la API para aplicar los filtros
    // Por ejemplo:
    // fetchOffers(1, filtros);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Ofertas</h1>
        <button 
          onClick={toggleFilters}
          className="flex items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Filter className="w-5 h-5 mr-2" /> 
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                value={filtros.search}
                onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Título, descripción..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={filtros.ubicacion}
                onChange={(e) => setFiltros(prev => ({ ...prev, ubicacion: e.target.value }))}
                placeholder="Ciudad, país..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Salario Mínimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salario Mínimo</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  value={filtros.salarioMin || ''}
                  onChange={(e) => setFiltros(prev => ({
                    ...prev,
                    salarioMin: e.target.value ? Number(e.target.value) : null
                  }))}
                  placeholder="Mínimo"
                  className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Salario Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salario Máximo</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  value={filtros.salarioMax || ''}
                  onChange={(e) => setFiltros(prev => ({
                    ...prev,
                    salarioMax: e.target.value ? Number(e.target.value) : null
                  }))}
                  placeholder="Máximo"
                  className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Solo ofertas con salario */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="soloConSalario"
                checked={filtros.soloConSalario}
                onChange={(e) => setFiltros(prev => ({
                  ...prev,
                  soloConSalario: e.target.checked
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="soloConSalario" className="ml-2 block text-sm text-gray-700">
                Solo ofertas con salario
              </label>
            </div>
          </div>
          <div className="col-span-full flex justify-end">
            <button 
              onClick={applyFilters}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      <OffersList 
        apiEndpoint={API_ENDPOINTS.OFFERS.MY_OFFERS}
        headerTitle="Mis Ofertas"
        headerSubtitle="Gestiona y optimiza tus publicaciones de trabajo con inteligencia"
        renderExpandedDetails={renderExpandedDetails}
        filters={filtros}
      />
    </div>
  );
}
