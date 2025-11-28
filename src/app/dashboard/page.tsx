'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Función para determinar el dashboard según el rol
    const getRoleDashboard = (userRole: string | undefined) => {
      const roleDashboards: { [key: string]: string } = {
        ESTUDIANTE: '/dashboard/estudiante',
        EMPRESA: '/dashboard/empresa',
        INSTITUCION: '/dashboard/institucion',
        ADMIN: '/admin/dashboard',
      };

      return userRole ? roleDashboards[userRole] : null;
    };

    // Lógica de redirección
    const handleRedirect = () => {
      // Si ya está cargado
      if (!isLoading && user) {
        // Obtener el rol del usuario
        // El tipo UserProfile tiene la propiedad 'rol' que es de tipo Rol
        const userRole = user.rol;

        console.log('[DASHBOARD] Detalles de redirección:', {
          user,
          userRole,
          userKeys: Object.keys(user)
        });

        const targetPath = getRoleDashboard(userRole);

        if (targetPath) {
          console.log(`[DASHBOARD] Redirigiendo a dashboard de rol: ${targetPath}`);
          router.replace(targetPath);
        } else {
          console.warn('[DASHBOARD] No se encontró un dashboard para el rol:', userRole);
          // Fallback a dashboard de estudiante
          router.replace('/dashboard/estudiante');
        }
      }
    };

    // Intentar redirección
    handleRedirect();
  }, [user, isLoading, router]);

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    router.replace('/auth/login');
    return null;
  }

  // Contenido de fallback
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bienvenido a ProTalent</h1>
            <p className="text-blue-100 mt-2">
              Tu plataforma de conexión entre talento y oportunidades
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Configurando tu dashboard...
        </h2>
        <p className="text-gray-600">
          Estamos preparando tu experiencia personalizada según tu rol.
        </p>
      </div>
    </div>
  );
}