'use client';

import { useState } from 'react';
import { 
  Bookmark, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Heart, 
  Share2 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Tipos de datos de ofertas guardadas
interface SavedOffer {
  id: string;
  titulo: string;
  empresa: string;
  descripcion: string;
  ubicacion: string;
  salarioMin: number;
  salarioMax: number;
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  tipoEmpleo: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'FREELANCE' | 'PRACTICAS';
  fechaGuardada: string;
}

export default function SavedOffersPage() {
  const [savedOffers, setSavedOffers] = useState<SavedOffer[]>([
    {
      id: '1',
      titulo: 'Desarrollador Web Senior',
      empresa: 'Tech Solutions Inc.',
      descripcion: 'Buscamos desarrollador web con experiencia en React y Node.js',
      ubicacion: 'Bogotá, Colombia',
      salarioMin: 3500000,
      salarioMax: 5500000,
      modalidad: 'REMOTO',
      tipoEmpleo: 'TIEMPO_COMPLETO',
      fechaGuardada: '2024-01-15'
    },
    {
      id: '2',
      titulo: 'Diseñador UX/UI',
      empresa: 'Creative Digital Agency',
      descripcion: 'Diseñador creativo para mejorar experiencia de usuario',
      ubicacion: 'Medellín, Colombia',
      salarioMin: 2800000,
      salarioMax: 4200000,
      modalidad: 'HIBRIDO',
      tipoEmpleo: 'TIEMPO_COMPLETO',
      fechaGuardada: '2024-01-10'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    modalidad: 'TODOS',
    tipoEmpleo: 'TODOS'
  });

  const handleRemoveSavedOffer = (offerId: string) => {
    setSavedOffers(savedOffers.filter(offer => offer.id !== offerId));
    toast.success('Oferta removida de guardadas');
  };

  const filteredSavedOffers = savedOffers.filter(offer => {
    const matchSearch = offer.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                        offer.empresa.toLowerCase().includes(filters.search.toLowerCase());
    const matchModalidad = filters.modalidad === 'TODOS' || offer.modalidad === filters.modalidad;
    const matchTipoEmpleo = filters.tipoEmpleo === 'TODOS' || offer.tipoEmpleo === filters.tipoEmpleo;
    
    return matchSearch && matchModalidad && matchTipoEmpleo;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ofertas Guardadas</h1>
            <p className="text-blue-100">
              Tus ofertas de interés para futuras postulaciones
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Título, empresa..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modalidad
            </label>
            <select 
              value={filters.modalidad}
              onChange={(e) => setFilters({...filters, modalidad: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="TODOS">Todas</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Empleo
            </label>
            <select 
              value={filters.tipoEmpleo}
              onChange={(e) => setFilters({...filters, tipoEmpleo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="TODOS">Todos</option>
              <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
              <option value="MEDIO_TIEMPO">Medio Tiempo</option>
              <option value="FREELANCE">Freelance</option>
              <option value="PRACTICAS">Prácticas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Ofertas Guardadas */}
      <div className="space-y-4">
        {filteredSavedOffers.map(offer => (
          <div 
            key={offer.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {offer.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {offer.empresa}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {offer.ubicacion}
                    </span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {offer.salarioMin.toLocaleString()} - {offer.salarioMax.toLocaleString()} COP
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${offer.modalidad === 'REMOTO' ? 'bg-green-100 text-green-800' : 
                          offer.modalidad === 'PRESENCIAL' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}
                      `}
                    >
                      {offer.modalidad}
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${offer.tipoEmpleo === 'TIEMPO_COMPLETO' ? 'bg-purple-100 text-purple-800' : 
                          offer.tipoEmpleo === 'MEDIO_TIEMPO' ? 'bg-pink-100 text-pink-800' : 
                          offer.tipoEmpleo === 'FREELANCE' ? 'bg-orange-100 text-orange-800' : 
                          'bg-teal-100 text-teal-800'}
                      `}
                    >
                      {offer.tipoEmpleo.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleRemoveSavedOffer(offer.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <Link 
                href={`/dashboard/estudiante/offers/${offer.id}`}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Share2 className="w-5 h-5" />
              </Link>
              <Link 
                href={`/dashboard/estudiante/offers/${offer.id}/apply`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Postular
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Ofertas Guardadas */}
      {filteredSavedOffers.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Bookmark className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes ofertas guardadas
          </h3>
          <p className="text-gray-600 mb-6">
            Explora ofertas y guarda las que te interesen
          </p>
          <Link 
            href="/dashboard/estudiante/offers"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Briefcase className="w-5 h-5" />
            <span>Explorar Ofertas</span>
          </Link>
        </div>
      )}
    </div>
  );
}
