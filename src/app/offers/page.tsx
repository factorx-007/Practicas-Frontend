'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Heart,
  Eye,
  ChevronDown,
  Users,
  BookmarkPlus,
  ArrowRight,
  Zap,
  Calendar,
  Target
} from 'lucide-react';
import Image from 'next/image'; // Importar Image de next/image

export default function OffersPage() {
  const { isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    modalidad: '',
    ubicacion: '',
    salario: '',
    experiencia: '',
    categoria: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedOffers, setSavedOffers] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading spinner during initial load
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data - en producción vendría de la API
  const offers = [
    {
      id: 1,
      titulo: 'Desarrollador Frontend React',
      empresa: 'TechCorp Colombia',
      ubicacion: 'Bogotá, Colombia',
      modalidad: 'Remoto',
      salario: '$2,500,000 - $3,500,000',
      experiencia: '1-3 años',
      categoria: 'Desarrollo',
      descripcion: 'Buscamos un desarrollador frontend con experiencia en React para unirse a nuestro equipo de desarrollo de productos digitales.',
      requisitos: ['React', 'TypeScript', 'CSS', 'Git'],
      beneficios: ['Seguro médico', 'Trabajo remoto', 'Capacitaciones'],
      fechaPublicacion: '2024-01-15',
      fechaVencimiento: '2024-02-15',
      postulantes: 45,
      match: 92,
      destacada: true,
      logo: null,
      estado: 'activa'
    },
    {
      id: 2,
      titulo: 'Analista de Datos Junior',
      empresa: 'DataInsights S.A.S',
      ubicacion: 'Medellín, Colombia',
      modalidad: 'Híbrido',
      salario: '$2,200,000 - $2,800,000',
      experiencia: '0-2 años',
      categoria: 'Análisis de Datos',
      descripcion: 'Oportunidad para recién graduados en carreras afines para iniciar su carrera en análisis de datos.',
      requisitos: ['Python', 'SQL', 'Excel', 'Power BI'],
      beneficios: ['Seguro médico', 'Bonos por desempeño', 'Horario flexible'],
      fechaPublicacion: '2024-01-14',
      fechaVencimiento: '2024-02-14',
      postulantes: 32,
      match: 87,
      destacada: false,
      logo: null,
      estado: 'activa'
    },
    {
      id: 3,
      titulo: 'Ingeniero de Software Backend',
      empresa: 'StartupTech',
      ubicacion: 'Cali, Colombia',
      modalidad: 'Presencial',
      salario: '$3,000,000 - $4,200,000',
      experiencia: '2-4 años',
      categoria: 'Desarrollo',
      descripcion: 'Únete a nuestro equipo para desarrollar APIs robustas y escalables usando tecnologías modernas.',
      requisitos: ['Node.js', 'MongoDB', 'Docker', 'AWS'],
      beneficios: ['Seguro médico', 'Bonos', 'Gimnasio', 'Snacks'],
      fechaPublicacion: '2024-01-13',
      fechaVencimiento: '2024-02-13',
      postulantes: 28,
      match: 78,
      destacada: true,
      logo: null,
      estado: 'activa'
    },
    {
      id: 4,
      titulo: 'Diseñador UX/UI',
      empresa: 'Creative Agency',
      ubicacion: 'Barranquilla, Colombia',
      modalidad: 'Remoto',
      salario: '$2,800,000 - $3,800,000',
      experiencia: '1-3 años',
      categoria: 'Diseño',
      descripcion: 'Buscamos un diseñador creativo para crear experiencias digitales excepcionales para nuestros clientes.',
      requisitos: ['Figma', 'Adobe Creative Suite', 'Prototipado', 'User Research'],
      beneficios: ['Trabajo remoto', 'Equipos Apple', 'Capacitaciones', 'Días libres'],
      fechaPublicacion: '2024-01-12',
      fechaVencimiento: '2024-02-12',
      postulantes: 67,
      match: 84,
      destacada: false,
      logo: null,
      estado: 'activa'
    },
    {
      id: 5,
      titulo: 'Product Manager Junior',
      empresa: 'InnovateCorp',
      ubicacion: 'Bogotá, Colombia',
      modalidad: 'Híbrido',
      salario: '$3,500,000 - $4,500,000',
      experiencia: '1-2 años',
      categoria: 'Producto',
      descripcion: 'Oportunidad única para liderar el desarrollo de productos digitales innovadores en una empresa en crecimiento.',
      requisitos: ['Metodologías Ágiles', 'Analytics', 'SQL básico', 'Comunicación'],
      beneficios: ['Seguro médico', 'Stock options', 'Capacitaciones', 'Mentoring'],
      fechaPublicacion: '2024-01-11',
      fechaVencimiento: '2024-02-11',
      postulantes: 89,
      match: 91,
      destacada: true,
      logo: null,
      estado: 'activa'
    }
  ];

  const filterOptions = {
    modalidad: ['Remoto', 'Presencial', 'Híbrido'],
    ubicacion: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'],
    salario: ['$1M - $2M', '$2M - $3M', '$3M - $4M', '$4M+'],
    experiencia: ['Sin experiencia', '0-2 años', '1-3 años', '2-4 años', '3+ años'],
    categoria: ['Desarrollo', 'Diseño', 'Análisis de Datos', 'Producto', 'Marketing']
  };

  const handleSaveOffer = (offerId: number) => {
    setSavedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-blue-600 bg-blue-100';
    if (match >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = Object.entries(selectedFilters).every(([key, value]) => {
      if (!value) return true;
      return offer[key as keyof typeof offer] === value;
    });

    return matchesSearch && matchesFilters;
  });

  const OfferCard = ({ offer }: { offer: typeof offers[0] }) => (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 ${offer.destacada ? 'ring-2 ring-blue-100' : ''}`}>
      {offer.destacada && (
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-600">Oferta Destacada</span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            {offer.logo ? (
              <Image src={offer.logo} alt={offer.empresa} className="w-8 h-8 rounded" width={32} height={32} />
            ) : (
              <Building2 className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {offer.titulo}
            </h3>
            <p className="text-blue-600 font-medium">{offer.empresa}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{offer.ubicacion}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{offer.modalidad}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>{offer.salario}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(offer.match)}`}>
            {offer.match}% match
          </div>
          <button
            onClick={() => handleSaveOffer(offer.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              savedOffers.includes(offer.id)
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${savedOffers.includes(offer.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{offer.descripcion}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {offer.requisitos.slice(0, 4).map((req, index) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {req}
          </span>
        ))}
        {offer.requisitos.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            +{offer.requisitos.length - 4} más
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{offer.postulantes} postulantes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatTimeAgo(offer.fechaPublicacion)}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            Ver detalles
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <span>Postular</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Explorar Ofertas</h1>
              <p className="text-gray-600 mt-1">Encuentra oportunidades que se ajusten a tu perfil</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <BookmarkPlus className="w-4 h-4" />
                <span>Ofertas Guardadas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título, empresa o tecnología..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key === 'modalidad' ? 'Modalidad' : key}
                  </label>
                  <select
                    value={selectedFilters[key as keyof typeof selectedFilters]}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">
              Mostrando <span className="font-medium">{filteredOffers.length}</span> ofertas
              {searchTerm && (
                <span> para &quot;<span className="font-medium">{searchTerm}</span>&quot;</span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Más relevantes</option>
              <option>Más recientes</option>
              <option>Mejor match</option>
              <option>Salario más alto</option>
            </select>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-6">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ofertas</h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda o términos de búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilters({
                    modalidad: '',
                    ubicacion: '',
                    salario: '',
                    experiencia: '',
                    categoria: ''
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredOffers.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Cargar más ofertas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
