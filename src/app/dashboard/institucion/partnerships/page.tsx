'use client';

import { useState } from 'react';
import { 
  Building, 
  Filter, 
  Search, 
  Eye, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Tipos de datos de convenios
interface Partnership {
  id: string;
  nombreEmpresa: string;
  sector: string;
  estado: 'ACTIVO' | 'PENDIENTE' | 'INACTIVO';
  fechaInicio: string;
  ofertas: number;
  contacto: {
    nombre: string;
    email: string;
  };
}

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([
    {
      id: '1',
      nombreEmpresa: 'Tech Solutions Inc.',
      sector: 'Tecnología',
      estado: 'ACTIVO',
      fechaInicio: '2024-01-15',
      ofertas: 24,
      contacto: {
        nombre: 'María Rodríguez',
        email: 'maria.rodriguez@techsolutions.com'
      }
    },
    {
      id: '2',
      nombreEmpresa: 'Global Marketing Group',
      sector: 'Marketing Digital',
      estado: 'PENDIENTE',
      fechaInicio: '2024-01-10',
      ofertas: 12,
      contacto: {
        nombre: 'Carlos Gómez',
        email: 'carlos.gomez@globalmarketing.com'
      }
    }
  ]);

  const [filter, setFilter] = useState('TODOS');

  const filteredPartnerships = partnerships.filter(partnership => 
    filter === 'TODOS' || partnership.estado === filter
  );

  const handleUpdatePartnershipStatus = (partnerId: string, newStatus: Partnership['estado']) => {
    try {
      setPartnerships(partnerships.map(partnership => 
        partnership.id === partnerId 
          ? { ...partnership, estado: newStatus } 
          : partnership
      ));
      toast.success(`Convenio ${newStatus.toLowerCase()}`);
    } catch {
      toast.error('Error al actualizar estado del convenio');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Convenios Empresariales</h1>
            <p className="text-purple-100">
              Administra y expande tus alianzas con empresas
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Building className="w-12 h-12 text-white" />
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
            <option value="TODOS">Todos los Convenios</option>
            <option value="ACTIVO">Activos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <Link 
          href="/dashboard/institucion/partnerships/create"
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Convenio</span>
        </Link>
      </div>

      {/* Lista de Convenios */}
      <div className="space-y-4">
        {filteredPartnerships.map(partnership => (
          <div 
            key={partnership.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {partnership.nombreEmpresa}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {partnership.contacto.nombre} - {partnership.contacto.email}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Sector: {partnership.sector}
                    </span>
                    <span>
                      Fecha de Inicio: {new Date(partnership.fechaInicio).toLocaleDateString()}
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${partnership.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 
                          partnership.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {partnership.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href={`/dashboard/institucion/partnerships/${partnership.id}`}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Eye className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{partnership.ofertas} Ofertas</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleUpdatePartnershipStatus(partnership.id, 'ACTIVO')}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleUpdatePartnershipStatus(partnership.id, 'PENDIENTE')}
                  className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleUpdatePartnershipStatus(partnership.id, 'INACTIVO')}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Convenios */}
      {filteredPartnerships.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-50 rounded-full">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay convenios {filter !== 'TODOS' && `${filter.toLowerCase()}s`}
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza a establecer convenios con empresas
          </p>
          <Link 
            href="/dashboard/institucion/partnerships/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Convenio</span>
          </Link>
        </div>
      )}
    </div>
  );
}
