import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Offer } from '@/types/offers';

// Define types for the dashboard data
export interface DashboardStats {
    postulaciones_mes: number;
    entrevistas_programadas: number;
    match_promedio: number;
    perfil_completitud: number;
}

export interface RecentActivity {
    id: string;
    tipo: 'postulacion' | 'entrevista' | 'oferta' | 'mensaje' | 'perfil' | 'empresa';
    titulo: string;
    descripcion: string;
    fecha: string;
    estado?: 'success' | 'warning' | 'error' | 'info';
    meta?: unknown;
}

export interface StudentDashboardData {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    recommendedOffers: Offer[];
}

interface Application {
    id: string;
    titulo: string;
    empresa?: { nombre_empresa: string };
    fechaPostulacion: string;
    estado: string;
}

export function useStudentDashboard() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['student-dashboard', user?.id],
        queryFn: async () => {
            if (!user) throw new Error('User not authenticated');

            // 1. Fetch Applications (for stats and recent activity)
            const applicationsResponse = await api.get('/offers/student/my-applications');
            const applications = (applicationsResponse.data as { data: Application[] }).data || [];

            // 2. Fetch Recommended Offers
            const offersResponse = await api.get('/offers/search?limit=3');
            const recommendedOffers = (offersResponse.data as { data: Offer[] }).data || [];

            // 3. Calculate Stats
            const stats: DashboardStats = {
                postulaciones_mes: applications.filter((app: Application) => {
                    const appDate = new Date(app.fechaPostulacion);
                    const now = new Date();
                    return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
                }).length,
                entrevistas_programadas: applications.filter((app: Application) => app.estado === 'ENTREVISTA').length,
                match_promedio: 75, // Placeholder logic, could be calculated based on skills match
                perfil_completitud: user.perfilCompleto ? 100 : 60, // Basic logic based on user flag
            };

            // 4. Format Recent Activity
            // Combine applications and other events if available. For now, using applications.
            const recentActivity: RecentActivity[] = applications.slice(0, 5).map((app: Application) => ({
                id: app.id,
                tipo: 'postulacion',
                titulo: `Postulación a ${app.titulo}`,
                descripcion: app.empresa?.nombre_empresa || 'Empresa confidencial',
                fecha: app.fechaPostulacion,
                estado: app.estado === 'ACEPTADA' ? 'success' : app.estado === 'RECHAZADA' ? 'error' : 'info'
            }));

            return {
                stats,
                recentActivity,
                recommendedOffers
            };
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
