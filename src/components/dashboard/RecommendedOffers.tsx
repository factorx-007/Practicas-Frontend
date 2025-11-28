'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, MapPin, Clock, DollarSign, Star, Bookmark,
  ChevronRight, Filter, Heart, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import Image from 'next/image';
import { Offer } from '@/types/offers';
import { StudentProfile } from '@/types/user';

interface RecommendedOffersProps {
  className?: string;
  offers?: Offer[];
}

export default function RecommendedOffers({ className = "", offers = [] }: RecommendedOffersProps) {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [savedOffers, setSavedOffers] = useState<string[]>([]);

  const userRole = user?.rol;

  // Show loading skeleton if no user
  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ofertas Recomendadas</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex space-x-2 mb-3">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (userRole !== 'ESTUDIANTE') return null;

  // Get student skills from profile
  const studentProfile = ('carrera' in (profile || {}) ? profile : null) as StudentProfile | null;
  const studentSkills = studentProfile?.habilidadesNuevas?.map(h => h.habilidad.nombre) || [];

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min) return 'Salario no especificado';
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });

    if (max && max > min) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return `Desde ${formatter.format(min)}`;
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Reciente';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  };

  const toggleSaveOffer = (offerId: string) => {
    setSavedOffers(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ofertas Recomendadas</h2>
            <p className="text-sm text-gray-600">Basadas en tu perfil y habilidades</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Filter className="w-4 h-4" />
          </button>
          <Link
            href="/offers"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
          >
            <span>Ver todas</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {offer.empresa.logo ? (
                    <Image
                      src={offer.empresa.logo}
                      alt={offer.empresa.nombre}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 truncate">
                    {offer.titulo}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">{offer.empresa.nombre}</span>
                    {/* offer.empresa.verificada check removed as it's not in the type yet */}
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{offer.ubicacion || 'Remoto'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Briefcase className="w-3 h-3" />
                  <span className="capitalize">{offer.tipoEmpleo?.replace('_', ' ').toLowerCase()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span className="capitalize">{offer.modalidad?.toLowerCase()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(offer.fechaCreacion)}</span>
                </span>
              </div>

              {/* Salary */}
              <div className="flex items-center space-x-1 font-medium text-gray-900">
                <DollarSign className="w-3 h-3" />
                <span>{formatSalary(offer.salarioMin, offer.salarioMax, offer.moneda)}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {offer.habilidadesRequeridas?.slice(0, 4).map((skill, index) => {
                const isMatched = studentSkills.some(userSkill =>
                  userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(userSkill.toLowerCase())
                );

                return (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${isMatched
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {skill}
                  </span>
                );
              })}
              {(offer.habilidadesRequeridas?.length || 0) > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{(offer.habilidadesRequeridas?.length || 0) - 4} más
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSaveOffer(offer.id)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${savedOffers.includes(offer.id)
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-gray-400 hover:text-red-600 hover:bg-gray-50'
                    }`}
                >
                  <Heart
                    className={`w-4 h-4 ${savedOffers.includes(offer.id) ? 'fill-current' : ''}`}
                  />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/offers/${offer.id}`}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver detalles
                </Link>
                <Link
                  href={`/offers/${offer.id}/apply`}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>Postular</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {offers.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ofertas recomendadas</h3>
          <p className="text-gray-600 mb-4">Completa tu perfil para recibir mejores recomendaciones.</p>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Completar Perfil
          </Link>
        </div>
      )}

      {/* Footer */}
      {offers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href="/offers"
            className="w-full flex items-center justify-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <span>Ver todas las ofertas disponibles</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}