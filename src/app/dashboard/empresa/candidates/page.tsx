'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Filter,
  Search,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { offersService } from '@/services/offers.service';
import { Application, ApplicationStatus } from '@/types/offers.types';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await offersService.getCompanyCandidates(1, 50, filter || undefined);
        if (response.success && response.data) {
          setCandidates(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Error al cargar los candidatos');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [filter]);

  const handleUpdateCandidateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await offersService.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        setCandidates(candidates.map(candidate =>
          candidate.id === applicationId
            ? { ...candidate, estado: newStatus as ApplicationStatus }
            : candidate
        ));
        toast.success('Estado actualizado correctamente');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_REVISION': return 'bg-blue-100 text-blue-800';
      case 'ENTREVISTA': return 'bg-purple-100 text-purple-800';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todos los Candidatos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="ENTREVISTA">Entrevista</option>
            <option value="ACEPTADA">Aceptados</option>
            <option value="RECHAZADA">Rechazados</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Lista de Candidatos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(candidate => (
            <div
              key={candidate.id}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-md transition-shadow gap-4"
            >
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg shrink-0">
                    {candidate.estudiante?.usuario.foto_perfil ? (
                      <Image
                        src={candidate.estudiante.usuario.foto_perfil}
                        alt={candidate.estudiante.usuario.nombre}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Users className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {candidate.estudiante?.usuario.nombre || 'Estudiante'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {candidate.estudiante?.usuario.email}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium text-blue-600">
                        {candidate.oferta?.titulo}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        {new Date(candidate.fecha_postulacion).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.estado)}`}>
                        {candidate.estado.replace('_', ' ')}
                      </span>
                    </div>
                    {candidate.estudiante?.carrera && (
                      <p className="text-xs text-gray-500 mt-1">
                        {candidate.estudiante.carrera} - {candidate.estudiante.universidad}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                {candidate.cvUrl && (
                  <a
                    href={candidate.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Ver CV"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                )}

                {candidate.estado !== 'ENTREVISTA' && candidate.estado !== 'ACEPTADA' && candidate.estado !== 'RECHAZADA' && (
                  <button
                    onClick={() => handleUpdateCandidateStatus(candidate.id, 'ENTREVISTA')}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                    title="Mover a Entrevista"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                )}

                {candidate.estado !== 'ACEPTADA' && (
                  <button
                    onClick={() => handleUpdateCandidateStatus(candidate.id, 'ACEPTADA')}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    title="Aceptar Candidato"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}

                {candidate.estado !== 'RECHAZADA' && (
                  <button
                    onClick={() => handleUpdateCandidateStatus(candidate.id, 'RECHAZADA')}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Rechazar Candidato"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sin Candidatos */}
      {!loading && candidates.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay candidatos {filter && `con estado ${filter.toLowerCase().replace('_', ' ')}`}
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
