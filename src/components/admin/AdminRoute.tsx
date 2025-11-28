'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const loading = isLoading; // Mapear a loading para mantener la compatibilidad

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.rol !== 'ADMIN') {
        router.push('/auth/admin/login');
      }
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated || user?.rol !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
