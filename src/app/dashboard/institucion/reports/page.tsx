'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Filter, 
  Download, 
  TrendingUp, 
  Users, 
  Briefcase 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

// Tipos de datos para reportes
interface CareerEmploymentData {
  carrera: string;
  empleabilidad: number;
  graduados: number;
  color: string;
}

interface MonthlyEmploymentData {
  mes: string;
  contrataciones: number;
  ofertas: number;
}

export default function ReportsPage() {
  const [careerData] = useState<CareerEmploymentData[]>([
    { carrera: 'Ingeniería de Sistemas', empleabilidad: 92, graduados: 156, color: '#10b981' },
    { carrera: 'Administración', empleabilidad: 87, graduados: 203, color: '#3b82f6' },
    { carrera: 'Marketing Digital', empleabilidad: 84, graduados: 89, color: '#8b5cf6' },
    { carrera: 'Diseño Gráfico', empleabilidad: 79, graduados: 67, color: '#f43f5e' }
  ]);

  const [monthlyData] = useState<MonthlyEmploymentData[]>([
    { mes: 'Ene', contrataciones: 45, ofertas: 120 },
    { mes: 'Feb', contrataciones: 62, ofertas: 145 },
    { mes: 'Mar', contrataciones: 78, ofertas: 180 },
    { mes: 'Abr', contrataciones: 55, ofertas: 135 },
    { mes: 'May', contrataciones: 90, ofertas: 210 },
    { mes: 'Jun', contrataciones: 65, ofertas: 160 }
  ]);

  const handleDownloadReport = () => {
    try {
      // Lógica para generar y descargar informe
      toast.success('Informe descargado exitosamente');
    } catch {
      toast.error('Error al descargar el informe');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reportes de Empleabilidad</h1>
            <p className="text-purple-100">
              Análisis detallado del desempeño de tus estudiantes
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones y Filtros */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option>Último año</option>
            <option>Último semestre</option>
            <option>Último trimestre</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Informe</span>
        </button>
      </div>

      {/* Gráficos y Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Empleabilidad por Carrera */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Empleabilidad por Carrera</h2>
          </div>
          {/** Preparar datos tipados para Recharts Pie */}
          {(() => {
            const pieData = careerData.map(d => ({
              carrera: d.carrera,
              empleabilidad: d.empleabilidad,
              color: d.color,
              graduados: d.graduados,
            }));
            return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="empleabilidad"
                nameKey="carrera"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}%`, 
                  `${props.payload.carrera} (${props.payload.graduados} graduados)`
                ]} 
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => {
                  const data = careerData.find(d => d.carrera === value);
                  return `${value} (${data?.graduados} graduados)`;
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
            );
          })()}
        </div>

        {/* Métricas Clave */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tasa de Empleabilidad</p>
                  <p className="text-2xl font-bold text-green-600">85.6%</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+3.2%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estudiantes Colocados</p>
                  <p className="text-2xl font-bold text-blue-600">342</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ofertas Disponibles</p>
                  <p className="text-2xl font-bold text-purple-600">1,245</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+8.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contrataciones Mensuales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Contrataciones Mensuales</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contrataciones" fill="#10b981" name="Contrataciones" />
              <Bar dataKey="ofertas" fill="#3b82f6" name="Ofertas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
