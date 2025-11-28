'use client';

import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search 
} from 'lucide-react';
import { toast } from 'sonner';

// Tipos de datos de eventos
interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  tipo: 'NETWORKING' | 'FERIA_EMPLEO' | 'TALLER' | 'CONFERENCIA';
  cupos: number;
  cuposDisponibles: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      titulo: 'Feria de Empleo Tech 2024',
      descripcion: 'Conexión directa entre estudiantes y empresas tecnológicas',
      fecha: '2024-07-15',
      ubicacion: 'Centro de Convenciones',
      tipo: 'FERIA_EMPLEO',
      cupos: 500,
      cuposDisponibles: 250
    },
    {
      id: '2',
      titulo: 'Taller de Desarrollo Profesional',
      descripcion: 'Estrategias para mejorar la empleabilidad',
      fecha: '2024-06-20',
      ubicacion: 'Auditorio Principal',
      tipo: 'TALLER',
      cupos: 100,
      cuposDisponibles: 50
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    tipo: 'TODOS'
  });

  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const handleRegisterEvent = (eventId: string) => {
    if (registeredEvents.includes(eventId)) {
      toast.info('Ya estás registrado en este evento.');
      return;
    }
    const updatedEvents = events.map(event => 
      event.id === eventId && event.cuposDisponibles > 0
        ? { ...event, cuposDisponibles: event.cuposDisponibles - 1 }
        : event
    );
    
    const eventToRegister = updatedEvents.find(event => event.id === eventId);
    
    if (eventToRegister && eventToRegister.cuposDisponibles >= 0) {
      setEvents(updatedEvents);
      setRegisteredEvents(prev => [...prev, eventId]);
      toast.success('Registro exitoso en el evento');
    } else {
      toast.error('No hay cupos disponibles');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchSearch = event.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                        event.descripcion.toLowerCase().includes(filters.search.toLowerCase());
    const matchTipo = filters.tipo === 'TODOS' || event.tipo === filters.tipo;
    
    return matchSearch && matchTipo;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Eventos de Empleabilidad</h1>
            <p className="text-blue-100">
              Conecta, aprende y crece profesionalmente
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Título, descripción..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento
            </label>
            <select 
              value={filters.tipo}
              onChange={(e) => setFilters({...filters, tipo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="TODOS">Todos los Eventos</option>
              <option value="NETWORKING">Networking</option>
              <option value="FERIA_EMPLEO">Feria de Empleo</option>
              <option value="TALLER">Taller</option>
              <option value="CONFERENCIA">Conferencia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-4">
        {filteredEvents.map(event => (
          <div 
            key={event.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {event.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {event.descripcion}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.ubicacion}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(event.fecha).toLocaleDateString()}
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${event.tipo === 'NETWORKING' ? 'bg-green-100 text-green-800' : 
                          event.tipo === 'FERIA_EMPLEO' ? 'bg-blue-100 text-blue-800' : 
                          event.tipo === 'TALLER' ? 'bg-purple-100 text-purple-800' : 
                          'bg-orange-100 text-orange-800'}
                      `}
                    >
                      {event.tipo.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>
                  {event.cuposDisponibles} / {event.cupos} Cupos
                </span>
              </div>
              <button 
                onClick={() => handleRegisterEvent(event.id)}
                disabled={event.cuposDisponibles === 0 || registeredEvents.includes(event.id)}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${event.cuposDisponibles > 0 && !registeredEvents.includes(event.id)
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                `}
              >
                {event.cuposDisponibles > 0 
                  ? registeredEvents.includes(event.id) ? 'Registrado' : 'Registrarse' 
                  : 'Cupos Llenos'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Eventos */}
      {filteredEvents.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay eventos {filters.tipo !== 'TODOS' && `de ${filters.tipo.toLowerCase().replace('_', ' ')}`}
          </h3>
          <p className="text-gray-600 mb-6">
            Próximamente más eventos de empleabilidad
          </p>
        </div>
      )}
    </div>
  );
}
