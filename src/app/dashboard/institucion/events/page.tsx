'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Tipos de datos de eventos
interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  estado: 'PROGRAMADO' | 'EN_PROGRESO' | 'FINALIZADO' | 'CANCELADO';
  participantes: number;
  tipo: 'FERIA_EMPLEO' | 'NETWORKING' | 'TALLER' | 'CONFERENCIA';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      titulo: 'Feria de Empleo Tech 2024',
      descripcion: 'Conexión directa entre estudiantes y empresas tecnológicas',
      fecha: '2024-07-15',
      ubicacion: 'Centro de Convenciones',
      estado: 'PROGRAMADO',
      participantes: 250,
      tipo: 'FERIA_EMPLEO'
    },
    {
      id: '2',
      titulo: 'Taller de Desarrollo Profesional',
      descripcion: 'Estrategias para mejorar la empleabilidad',
      fecha: '2024-06-20',
      ubicacion: 'Auditorio Principal',
      estado: 'EN_PROGRESO',
      participantes: 120,
      tipo: 'TALLER'
    }
  ]);

  const [filter, setFilter] = useState('TODOS');

  const filteredEvents = events.filter(event => 
    filter === 'TODOS' || event.estado === filter
  );

  const handleUpdateEventStatus = (eventId: string, newStatus: Event['estado']) => {
    try {
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, estado: newStatus } 
          : event
      ));
      toast.success(`Evento ${newStatus.toLowerCase().replace('_', ' ')}`);
    } catch (_error) {
      console.error('Error al actualizar estado del evento:', _error);
      toast.error('Error al actualizar estado del evento');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Eventos</h1>
            <p className="text-purple-100">
              Organiza y administra eventos de empleabilidad
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Acciones */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="TODOS">Todos los Eventos</option>
            <option value="PROGRAMADO">Programados</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="FINALIZADO">Finalizados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <Link 
          href="/dashboard/institucion/events/create"
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento</span>
        </Link>
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
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
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
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4 mr-1" />
                      {event.participantes} Participantes
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${event.estado === 'PROGRAMADO' ? 'bg-blue-100 text-blue-800' : 
                          event.estado === 'EN_PROGRESO' ? 'bg-yellow-100 text-yellow-800' : 
                          event.estado === 'FINALIZADO' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {event.estado.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                  {event.tipo.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleUpdateEventStatus(event.id, 'PROGRAMADO')}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleUpdateEventStatus(event.id, 'EN_PROGRESO')}
                  className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleUpdateEventStatus(event.id, 'FINALIZADO')}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleUpdateEventStatus(event.id, 'CANCELADO')}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Eventos */}
      {filteredEvents.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-50 rounded-full">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay eventos {filter !== 'TODOS' && `${filter.toLowerCase().replace('_', ' ')}s`}
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza a planificar eventos de empleabilidad
          </p>
          <Link 
            href="/dashboard/institucion/events/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Evento</span>
          </Link>
        </div>
      )}
    </div>
  );
}
