'use client';

import { UserProfile, CompanyProfile } from '@/types/user';
import {
  Award,
  Plus,
  Edit,
  Heart,
  Target,
  Users,
  Star,
  Coffee,
  Zap,
  Shield,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import CompanyCultureModal from '../modals/CompanyCultureModal';
import CompanyGalleryModal from '../modals/CompanyGalleryModal';
import CompanyBenefitsModal from '../modals/CompanyBenefitsModal';

interface CompanyCultureProps {
  profile: (UserProfile & { empresa?: CompanyProfile }) | CompanyProfile | null;
  onProfileUpdated: () => void;
}

interface CorporateValue {
  icon: string;
  title: string;
  description: string;
}

interface Benefit {
  nombre?: string;
  beneficio?: {
    nombre: string;
  };
}

export default function CompanyCulture({ profile, onProfileUpdated }: CompanyCultureProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);

  const company = 'empresa' in (profile || {})
    ? (profile as UserProfile & { empresa: CompanyProfile }).empresa
    : (profile as CompanyProfile);

  // Access data from perfilEmpresa if it exists, otherwise from company directly
  const perfilEmpresa = (company as unknown as Record<string, unknown>)?.perfilEmpresa as Record<string, unknown> | undefined;

  const mission: string = String(perfilEmpresa?.mision || company?.mision || "No especificada");
  const vision: string = String(perfilEmpresa?.vision || company?.vision || "No especificada");
  const culturaDescripcion: string = String(perfilEmpresa?.cultura_descripcion || (company as unknown as Record<string, unknown>)?.cultura_descripcion || '');

  const cultureData = {
    mission,
    vision,
    culturaDescripcion,
    values: Array.isArray(perfilEmpresa?.valores) ? (perfilEmpresa.valores as unknown as CorporateValue[]) : (Array.isArray(company?.valores) ? (company.valores as unknown as CorporateValue[]) : []),
    benefits: Array.isArray((perfilEmpresa as Record<string, unknown>)?.beneficios) ? (perfilEmpresa as Record<string, unknown>).beneficios as Benefit[] : (Array.isArray(company?.beneficios) ? company.beneficios as Benefit[] : []),
    perks: [] as string[],
    gallery: Array.isArray(perfilEmpresa?.galeria) ? perfilEmpresa.galeria as string[] : (Array.isArray(company?.galeria) ? company.galeria as string[] : [])
  };

  // Helper to map icon name to component
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = { Zap, Users, Star, Shield, Heart, Coffee, Target, Award, Briefcase };
    return icons[iconName] || Star;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cultura Empresarial</h2>
          <p className="text-gray-600 mt-1">
            Comparte la misión, visión y valores de tu empresa
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar Cultura
        </button>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Misión</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{cultureData.mission}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Visión</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{cultureData.vision}</p>
        </div>
      </div>

      {/* Culture Description */}
      {cultureData.culturaDescripcion && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Descripción de la Cultura</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {cultureData.culturaDescripcion}
          </p>
        </div>
      )}

      {/* Values */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Nuestros Valores</h3>
        {cultureData.values.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cultureData.values.map((value, index) => {
              const Icon = getIcon(value.icon);
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic">No se han definido valores corporativos.</p>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Beneficios y Compensación</h3>
          <button
            onClick={() => setIsBenefitsModalOpen(true)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Gestionar Beneficios
          </button>
        </div>
        {cultureData.benefits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cultureData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                {benefit.beneficio?.nombre || benefit.nombre || 'Beneficio'}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No se han registrado beneficios.</p>
        )}
      </div>

      {/* Culture Gallery */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Galería de Cultura</h3>
          <button
            onClick={() => setIsGalleryModalOpen(true)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Foto
          </button>
        </div>
        {cultureData.gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cultureData.gallery.map((photo, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image src={photo} alt={`Cultura ${index + 1}`} width={300} height={300} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No hay fotos en la galería</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
          >
            <div className="text-blue-600 mb-2">
              <Edit className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Actualizar Misión/Visión</h4>
            <p className="text-sm text-gray-600">Modifica la misión y visión empresarial</p>
          </button>

          <button
            onClick={() => setIsBenefitsModalOpen(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
          >
            <div className="text-green-600 mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Gestionar Beneficios</h4>
            <p className="text-sm text-gray-600">Actualiza beneficios y compensaciones</p>
          </button>

          <button
            onClick={() => setIsGalleryModalOpen(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
          >
            <div className="text-purple-600 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Agregar Fotos</h4>
            <p className="text-sm text-gray-600">Sube fotos de tu equipo y oficina</p>
          </button>
        </div>
      </div>

      <CompanyCultureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={profile}
        onSaveSuccess={onProfileUpdated}
      />

      <CompanyGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        currentGallery={cultureData.gallery}
        onSaveSuccess={onProfileUpdated}
      />

      <CompanyBenefitsModal
        isOpen={isBenefitsModalOpen}
        onClose={() => setIsBenefitsModalOpen(false)}
        onSaveSuccess={onProfileUpdated}
      />
    </div>
  );
}
