'use client';

import { useState } from 'react';
import { 
  Users, 
  Filter, 
  Search, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Tipos de datos de candidatos
interface Candidate {
  id: string;
  nombre: string;
  email: string;
  oferta: string;
  estado: 'REVISIÓN' | 'ENTREVISTA' | 'ACEPTADO' | 'RECHAZADO';
  fechaPostulacion: string;
  universidad?: string;
  carrera?: string;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      oferta: 'Desarrollador Web Senior',
      estado: 'REVISIÓN',
      fechaPostulacion: '2024-01-15',
      universidad: 'Universidad Nacional',
      carrera: 'Ingeniería de Sistemas'
    },
    {
      id: '2',
      nombre: 'María González',
      email: 'maria.gonzalez@example.com',
      oferta: 'Diseñador UX/UI',
      estado: 'ENTREVISTA',
      fechaPostulacion: '2024-01-10',
      universidad: 'Universidad Tecnológica',
      carrera: 'Diseño Digital'
    }
  ]);

  const [filter, setFilter] = useState('TODAS');

  const handleUpdateCandidateStatus = (candidateId: string, newStatus: Candidate['estado']) => {
    try {
      setCandidates(candidates.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, estado: newStatus } 
          : candidate
      ));
      toast.success(`Candidato ${newStatus.toLowerCase()}`);
    } catch (_error) {
      console.error('Error al actualizar estado del candidato:', _error);
      toast.error('Error al actualizar estado del candidato');
    }
  };

  const filteredCandidates = candidates.filter(candidate => 
    filter === 'TODAS' || candidate.estado === filter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Candidatos</h1>
            <p className="text-blue-100">
              Administra y evalúa los candidatos para tus ofertas
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
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
            <option value="TODAS">Todos los Candidatos</option>
            <option value="REVISIÓN">En Revisión</option>
            <option value="ENTREVISTA">Entrevista</option>
            <option value="ACEPTADO">Aceptados</option>
            <option value="RECHAZADO">Rechazados</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Lista de Candidatos */}
      <div className="space-y-4">
        {filteredCandidates.map(candidate => (
          <div 
            key={candidate.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {candidate.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {candidate.email}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Oferta: {candidate.oferta}
                    </span>
                    <span>
                      Postulación: {new Date(candidate.fechaPostulacion).toLocaleDateString()}
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${candidate.estado === 'REVISIÓN' ? 'bg-yellow-100 text-yellow-800' : 
                          candidate.estado === 'ENTREVISTA' ? 'bg-blue-100 text-blue-800' : 
                          candidate.estado === 'ACEPTADO' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {candidate.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href={`/dashboard/empresa/candidates/${candidate.id}`}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Eye className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => handleUpdateCandidateStatus(candidate.id, 'ENTREVISTA')}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleUpdateCandidateStatus(candidate.id, 'ACEPTADO')}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleUpdateCandidateStatus(candidate.id, 'RECHAZADO')}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Candidatos */}
      {filteredCandidates.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay candidatos {filter !== 'TODAS' && `${filter.toLowerCase()}s`}
          </h3>
          <p className="text-gray-600 mb-6">
            Tus ofertas publicadas atraerán candidatos pronto
          </p>
          <Link 
            href="/dashboard/empresa/offers/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Clock className="w-5 h-5" />
            <span>Publicar Oferta</span>
          </Link>
        </div>
      )}
    </div>
  );
}
