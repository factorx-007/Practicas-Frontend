'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/admin';
import { AdminStats } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, Briefcase, Building2, School } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener estadísticas del sistema
        const statsResponse = await adminService.getSystemStats();
        setStats(statsResponse);
        setIsLoading(false);
      } catch (error: unknown) {
        toast.error((error as Error).message || 'Error al cargar datos del dashboard');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    { 
      name: 'Usuarios', 
      value: stats?.totalUsers || 0, 
      icon: Users 
    },
    { 
      name: 'Ofertas', 
      value: stats?.totalOffers || 0, 
      icon: Briefcase 
    },
    { 
      name: 'Empresas', 
      value: stats?.totalCompanies || 0, 
      icon: Building2 
    },
    { 
      name: 'Instituciones', 
      value: stats?.totalInstitutions || 0, 
      icon: School 
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>

      {isLoading ? (
        <div className="text-center text-gray-500">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statsData.map(({ name, value, icon: Icon }) => (
              <Card key={name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{name}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center">No hay actividad reciente</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={stats.recentActivity.map((activity, index) => ({
                      name: `Actividad ${index + 1}`,
                      tipo: activity.tipo,
                      registros: activity.count
                    }))}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-4 rounded shadow">
                              <p className="font-bold">{data.tipo}</p>
                              <p>Registros: {data.registros}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="registros" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
