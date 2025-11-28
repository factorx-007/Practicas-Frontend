'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Calendar, 
  Filter 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Tipos de datos para análisis
interface OfferPerformance {
  titulo: string;
  postulaciones: number;
  entrevistas: number;
  contrataciones: number;
}

interface MonthlyStats {
  mes: string;
  ofertas: number;
  postulaciones: number;
  contrataciones: number;
}

export default function AnalyticsPage() {
  const [offerPerformance] = useState<OfferPerformance[]>([
    {
      titulo: 'Desarrollador Web Senior',
      postulaciones: 24,
      entrevistas: 8,
      contrataciones: 2
    },
    {
      titulo: 'Diseñador UX/UI',
      postulaciones: 15,
      entrevistas: 5,
      contrataciones: 1
    }
  ]);

  const [monthlyStats] = useState<MonthlyStats[]>([
    { mes: 'Enero', ofertas: 5, postulaciones: 50, contrataciones: 3 },
    { mes: 'Febrero', ofertas: 7, postulaciones: 75, contrataciones: 5 },
    { mes: 'Marzo', ofertas: 10, postulaciones: 100, contrataciones: 8 }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Análisis de Reclutamiento</h1>
            <p className="text-blue-100">
              Insights detallados sobre tus procesos de contratación
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Ofertas Publicadas</p>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold text-gray-900">22</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600">12%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Postulaciones</p>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold text-gray-900">175</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600">25%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Contrataciones</p>
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold text-gray-900">16</h3>
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600">-5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rendimiento de Ofertas */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Rendimiento de Ofertas</h2>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={offerPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="titulo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="postulaciones" fill="#3b82f6" name="Postulaciones" />
              <Bar dataKey="entrevistas" fill="#10b981" name="Entrevistas" />
              <Bar dataKey="contrataciones" fill="#8b5cf6" name="Contrataciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas Mensuales */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Estadísticas Mensuales</h2>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ofertas" fill="#3b82f6" name="Ofertas" />
              <Bar dataKey="postulaciones" fill="#10b981" name="Postulaciones" />
              <Bar dataKey="contrataciones" fill="#8b5cf6" name="Contrataciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalles Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tiempo de Contratación */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiempo de Contratación</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tiempo promedio de revisión</span>
              <span className="text-sm font-medium text-gray-900">3 días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tiempo promedio de entrevista</span>
              <span className="text-sm font-medium text-gray-900">7 días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tiempo total de contratación</span>
              <span className="text-sm font-medium text-gray-900">15 días</span>
            </div>
          </div>
        </div>

        {/* Fuentes de Candidatos */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Candidatos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Plataforma ProTalent</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">65%</span>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">LinkedIn</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">20%</span>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Otras Fuentes</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">15%</span>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
