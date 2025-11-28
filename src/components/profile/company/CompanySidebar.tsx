'use client';

import type { UserProfile, CompanyProfile } from '@/types/user';
import {
  Building,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

type ProfileWithCompany = (UserProfile & { empresa?: CompanyProfile }) | CompanyProfile | null;

interface CompanySidebarProps {
  profile: ProfileWithCompany;
}

export default function CompanySidebar({ profile }: CompanySidebarProps) {
  // Handle different profile types to extract company and user data
  const companyData: CompanyProfile | null = (() => {
    if (!profile) return null;
    // If profile has empresa (UserProfile with empresa), return empresa
    if ('empresa' in profile && profile.empresa) return profile.empresa;
    // If profile is CompanyProfile, return the profile itself
    if ('nombre_empresa' in profile) return profile;
    return null;
  })();

  const userData: UserProfile | null = (() => {
    if (!profile) return null;
    // If profile has usuario (CompanyProfile), return usuario
    const profileObj = profile as unknown as Record<string, unknown>;
    if ('usuario' in profileObj && profileObj.usuario) {
      return profileObj.usuario as UserProfile;
    }
    // If profile is UserProfile, return the profile itself
    if ('email' in profile) return profile as UserProfile;
    return null;
  })();

  // Extract perfilEmpresa data to avoid complex type assertions in JSX
  const perfilEmpresa = (companyData as unknown as Record<string, unknown>)?.perfilEmpresa as Record<string, unknown> | undefined;
  const tamanio = perfilEmpresa?.tamanio;
  const anioFundacion = perfilEmpresa?.anio_fundacion;
  const linkedinUrl = perfilEmpresa?.linkedin_url;

  return (
    <div className="space-y-6">
      {/* Company Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
              <Building className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-3">Perfil Empresarial</h3>
          <p className="text-sm text-gray-600">Conecta con talento</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-xs text-gray-600">Empleos activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-xs text-gray-600">Candidatos</div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      {companyData ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Empresa</h3>
          <div className="space-y-3">
            {userData?.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span>{userData.email}</span>
              </div>
            )}

            {companyData?.telefono && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span>{companyData.telefono}</span>
              </div>
            )}

            {companyData?.direccion && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                <span>{companyData.direccion}</span>
              </div>
            )}

            {companyData?.website && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-3 text-gray-400" />
                <a
                  href={companyData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sitio web
                </a>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Company Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles</h3>
        <div className="space-y-3">
          {companyData?.rubro && (
            <div>
              <p className="text-sm font-medium text-gray-700">Rubro</p>
              <p className="text-sm text-gray-600">{companyData.rubro}</p>
            </div>
          )}

          {tamanio ? (
            <div>
              <p className="text-sm font-medium text-gray-700">Tamaño</p>
              <p className="text-sm text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {String(tamanio)} empleados
              </p>
            </div>
          ) : null}

          {anioFundacion ? (
            <div>
              <p className="text-sm font-medium text-gray-700">Fundada</p>
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {String(anioFundacion)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Social Links */}
      {linkedinUrl ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h3>
          <div className="space-y-3">
            <a
              href={String(linkedinUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4 mr-3" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      ) : null}

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Estadísticas
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Empleos publicados</span>
            <span className="font-semibold text-gray-900">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Aplicaciones recibidas</span>
            <span className="font-semibold text-gray-900">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Contrataciones</span>
            <span className="font-semibold text-gray-900">8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Calificación promedio</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold text-gray-900">4.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Nuevo candidato aplicó</p>
              <p className="text-xs text-gray-500">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Empleo publicado</p>
              <p className="text-xs text-gray-500">Hace 1 día</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Perfil actualizado</p>
              <p className="text-xs text-gray-500">Hace 3 días</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
