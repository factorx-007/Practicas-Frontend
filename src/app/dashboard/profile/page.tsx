'use client';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import StudentProfile from '@/components/profile/student/StudentProfile';
import CompanyProfile from '@/components/profile/company/CompanyProfile';
import InstitutionProfile from '@/components/profile/institution/InstitutionProfile';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/types/user';

export default function ProfilePage() {
  const { isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, isError, refetch } = useProfile(); // Obtener refetch

  const isLoading = authLoading || profileLoading;

  const handleProfileUpdated = () => {
    refetch(); // Volver a cargar el perfil después de una actualización
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <p className="text-red-500">Error al cargar el perfil.</p>
      </div>
    );
  }

  // Extraer el rol según el tipo de perfil
  const getRole = (): string | undefined => {
    const profileObj = profile as unknown as Record<string, unknown>;
    
    // Verificar si tiene usuario anidado
    if (profileObj && typeof profileObj === 'object' && 'usuario' in profileObj) {
      const usuario = profileObj.usuario as unknown as Record<string, unknown>;
      if (usuario && 'rol' in usuario) {
        return String(usuario.rol);
      }
    }
    
    // Si es UserProfile directo
    if ('rol' in profileObj) {
      return String(profileObj.rol);
    }
    
    return undefined;
  };

  const userRole = getRole();

  // Determinar qué perfil renderizar basado en el rol
  switch (userRole) {
    case 'ESTUDIANTE':
      // Si es StudentProfile completo, pasarlo directamente. Si no, pasar solo el usuario
      if (('carrera' in profile || 'usuarioId' in profile)) {
        return <StudentProfile profile={profile as UserProfile} />;
      }
      return <StudentProfile profile={profile as UserProfile} />;
    case 'EMPRESA':
      // Si es CompanyProfile completo, pasarlo directamente
      if ('nombre_empresa' in profile) {
        return <CompanyProfile profile={profile as UserProfile} onProfileUpdated={handleProfileUpdated} />;
      }
      // Si es UserProfile, pasarlo como está
      return <CompanyProfile profile={profile as UserProfile} onProfileUpdated={handleProfileUpdated} />;
    case 'INSTITUCION':
      // Si tiene usuario anidado, pasar el usuario. Si no, pasar el perfil completo
      const profileObj = profile as unknown as Record<string, unknown>;
      if (profileObj && 'usuario' in profileObj) {
        return <InstitutionProfile profile={profileObj.usuario as UserProfile} />;
      }
      return <InstitutionProfile profile={profile as UserProfile} />;
    default:
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
          <p>Rol de usuario no reconocido: {userRole || 'sin rol'}</p>
          <pre className="mt-4 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      );
  }
}