'use client';

import type { UserProfile, CompanyProfile } from '@/types/user';
import {
  Building,
  Calendar,
  Edit,
  Globe,
  Users,
  TrendingUp
} from 'lucide-react';
import CompanyInfoModal from '../modals/CompanyInfoModal';
import { useState } from 'react';

type ProfileWithCompany = (UserProfile & { empresa?: CompanyProfile }) | CompanyProfile | null;

type CompanyWithExtras = CompanyProfile & {
  ruc?: string;
  telefono?: string;
  direccion?: string;
  website?: string;
  rubro?: string;
  sector?: string;
  tamaño?: number;
  año_fundacion?: number | string;
  tipo_empresa?: string;
  descripcion?: string;
};

interface CompanyOverviewProps {
  profile: ProfileWithCompany;
  onProfileUpdated: () => void; // Add this prop
}

export default function CompanyOverview({ profile, onProfileUpdated }: CompanyOverviewProps) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // Estados adicionales removidos por no uso

  // Handle different profile types to extract company and user data
  const companyData: CompanyWithExtras | null = (() => {
    if (!profile) return null;
    // If profile has empresa (UserProfile with empresa), return empresa
    const userWithCompany = profile as UserProfile & { empresa?: CompanyProfile };
    if (userWithCompany.empresa) return userWithCompany.empresa as CompanyWithExtras;
    // If profile is CompanyProfileType, return the profile itself
    if ('nombre_empresa' in profile) return profile as CompanyWithExtras;
    return null;
  })();

  const userData = (() => {
    if (!profile) return null;
    // If profile has usuario (CompanyProfileType), return usuario
    const profileObj = profile as unknown as Record<string, unknown>;
    if ('usuario' in profileObj && profileObj.usuario) {
      return profileObj.usuario as UserProfile;
    }
    // If profile is UserProfile, return the profile itself
    if ('email' in profile) return profile as UserProfile;
    return null;
  })();

  const handleOpenInfoModal = () => setIsInfoModalOpen(true);
  const handleCloseInfoModal = () => setIsInfoModalOpen(false);
  // Handlers adicionales removidos por no uso


  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Información de la Empresa
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center" onClick={handleOpenInfoModal}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
            <p className="text-gray-900">{companyData?.nombre_empresa || 'No especificado'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
            <p className="text-gray-900">{userData?.email}</p>
          </div>
          {companyData?.ruc && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
              <p className="text-gray-900">{companyData.ruc}</p>
            </div>
          )}
          {companyData?.telefono && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <p className="text-gray-900">{companyData.telefono}</p>
            </div>
          )}
          {companyData?.direccion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <p className="text-gray-900">{companyData.direccion}</p>
            </div>
          )}
          {companyData?.website && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
              <a
                href={companyData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Globe className="w-4 h-4 mr-1" />
                {companyData.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Detalles de la Empresa
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center" onClick={handleOpenInfoModal}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyData?.rubro && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
              <p className="text-gray-900">{companyData.rubro}</p>
            </div>
          )}
          {companyData?.sector && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
              <p className="text-gray-900">{companyData.sector}</p>
            </div>
          )}
          {companyData?.tamaño && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de la Empresa</label>
              <p className="text-gray-900 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {companyData.tamaño} empleados
              </p>
            </div>
          )}
          {companyData?.año_fundacion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año de Fundación</label>
              <p className="text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {companyData.año_fundacion}
              </p>
            </div>
          )}
          {companyData?.tipo_empresa && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empresa</label>
              <p className="text-gray-900">{companyData.tipo_empresa}</p>
            </div>
          )}
        </div>
      </div>

      {/* Company Description */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Descripción de la Empresa</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center" onClick={handleOpenInfoModal}>
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed">{companyData?.descripcion || 'No hay descripción disponible'}</p>
      </div>



      <CompanyInfoModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        currentProfile={profile}
        onSaveSuccess={onProfileUpdated}
      />
    </div>
  );
}
