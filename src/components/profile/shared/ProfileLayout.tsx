'use client';

import { ReactNode } from 'react';
import { UserProfile, StudentProfile, CompanyProfile } from '@/types/user';
import AvatarUpload from '../AvatarUpload';
import Image from 'next/image';

interface ProfileLayoutProps {
  profile: (UserProfile | StudentProfile | CompanyProfile | (UserProfile & { empresa?: CompanyProfile })) | null;
  children: ReactNode;
  sidebarContent?: ReactNode;
  title?: string;
  subtitle?: string;
  isOwnProfile?: boolean;
}

export default function ProfileLayout({
  profile,
  children,
  sidebarContent,
  title,
  subtitle
}: ProfileLayoutProps) {
  // Helper functions to handle nested user structure
  const getUserName = () => {
    if (!profile) return 'Usuario';

    // Check for CompanyProfile (PerfilEmpresa)
    if ('nombre_empresa' in profile) {
      return (profile as CompanyProfile).nombre_empresa;
    }

    // Check for StudentProfile
    const studentProfile = profile as StudentProfile;
    if ('usuario' in studentProfile && studentProfile.usuario?.nombre) {
      return studentProfile.usuario.nombre;
    }

    // Check for UserProfile
    return (profile as UserProfile)?.nombre || 'Usuario';
  };

  const getUserLastName = () => {
    if (!profile) return '';

    // Company doesn't have last name
    if ('nombre_empresa' in profile) {
      return '';
    }

    const studentProfile = profile as StudentProfile;
    if ('usuario' in studentProfile && studentProfile.usuario?.apellido) {
      return studentProfile.usuario.apellido;
    }
    return (profile as UserProfile)?.apellido || '';
  };

  const getUserEmail = () => {
    if (!profile) return '';

    // Company might not have email directly on profile if it's just PerfilEmpresa
    // But usually it comes with User info if it's UserProfile & { empresa }

    const studentProfile = profile as StudentProfile;
    if ('usuario' in studentProfile && studentProfile.usuario?.email) {
      return studentProfile.usuario.email;
    }
    return (profile as UserProfile)?.email || '';
  };

  const getUserRole = () => {
    if (!profile) return 'Usuario';

    // Check for CompanyProfile
    if ('nombre_empresa' in profile) {
      return 'EMPRESA';
    }

    // Primero intentamos con la estructura de StudentProfile
    const studentProfile = profile as StudentProfile & {
      usuario?: { rol?: string };
      institucion?: { tipo?: string };
      empresa?: { tipo?: string };
    };

    // Si tiene usuario.rol, lo devolvemos
    if (studentProfile?.usuario?.rol) {
      return studentProfile.usuario.rol;
    }

    // Si no, intentamos con la estructura de UserProfile
    const userProfile = profile as UserProfile;
    if (userProfile?.rol) {
      return userProfile.rol;
    }

    // Finalmente, intentamos con institucion o empresa
    return studentProfile?.institucion?.tipo || studentProfile?.empresa?.tipo || 'Usuario';
  };

  const getAvatarUrl = (): string => {
    // Valor por defecto para el avatar
    const defaultAvatar = '/images/default-avatar.png';

    // Si no hay perfil, devolver el avatar por defecto
    if (!profile) return defaultAvatar;

    // Check for CompanyProfile logo
    if ('logo_url' in profile && (profile as CompanyProfile).logo_url) {
      return (profile as CompanyProfile).logo_url || defaultAvatar;
    }

    // Intentar obtener el avatar de un estudiante
    const studentProfile = profile as StudentProfile;
    if ('usuario' in studentProfile && studentProfile.usuario?.avatar) {
      return studentProfile.usuario.avatar;
    }

    // Intentar obtener el avatar de un usuario estándar
    const userProfile = profile as UserProfile;
    if (userProfile.avatar) {
      return userProfile.avatar;
    }

    // Si no hay avatar, devolver el valor por defecto
    return defaultAvatar;
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ESTUDIANTE': return 'Estudiante';
      case 'EMPRESA': return 'Empresa';
      case 'INSTITUCION': return 'Institución';
      case 'ADMIN': return 'Administrador';
      default: return 'Usuario';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {getAvatarUrl() ? (
                <Image
                  src={getAvatarUrl()}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/20">
                  <span className="text-2xl font-bold text-white">
                    {getUserName()[0]}{getUserLastName()[0]}
                  </span>
                </div>
              )}
              <AvatarUpload profile={profile} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {title || `${getUserName()} ${getUserLastName()}`}
              </h1>
              <p className="text-blue-100 text-lg">
                {subtitle || getRoleLabel(getUserRole())}
              </p>
              {!title && <p className="text-blue-200 text-sm">{getUserEmail()}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          {sidebarContent && (
            <div className="lg:col-span-1">
              {sidebarContent}
            </div>
          )}

          {/* Main Content */}
          <div className={sidebarContent ? "lg:col-span-3" : "lg:col-span-4"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
