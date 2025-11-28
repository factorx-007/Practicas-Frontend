'use client';

import { useState } from 'react';
import { 
  Users, 
  Filter, 
  Search, 
  Eye, 
  GraduationCap, 
  Star, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';

// Tipos de datos de estudiantes
interface Student {
  id: string;
  nombre: string;
  email: string;
  carrera: string;
  universidad: string;
  estado: 'ACTIVO' | 'GRADUADO' | 'INACTIVO';
  ultimaActualizacion: string;
  promedioAcademico: number;
}

export default function StudentsPage() {
  const [students] = useState<Student[]>([
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@example.com',
      carrera: 'Ingeniería de Sistemas',
      universidad: 'Universidad Nacional',
      estado: 'ACTIVO',
      ultimaActualizacion: '2024-01-15',
      promedioAcademico: 4.5
    },
    {
      id: '2',
      nombre: 'María González',
      email: 'maria.gonzalez@example.com',
      carrera: 'Administración de Empresas',
      universidad: 'Universidad Tecnológica',
      estado: 'GRADUADO',
      ultimaActualizacion: '2024-01-10',
      promedioAcademico: 4.2
    }
  ]);

  const [filter, setFilter] = useState('TODOS');

  const filteredStudents = students.filter(student => 
    filter === 'TODOS' || student.estado === filter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Estudiantes</h1>
            <p className="text-purple-100">
              Administra y monitorea el progreso de tus estudiantes
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Acciones */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="TODOS">Todos los Estudiantes</option>
            <option value="ACTIVO">Activos</option>
            <option value="GRADUADO">Graduados</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>
        <Link 
          href="/dashboard/institucion/students/create"
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Users className="w-4 h-4" />
          <span>Agregar Estudiante</span>
        </Link>
      </div>

      {/* Lista de Estudiantes */}
      <div className="space-y-4">
        {filteredStudents.map(student => (
          <div 
            key={student.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {student.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {student.email}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Carrera: {student.carrera}
                    </span>
                    <span>
                      Universidad: {student.universidad}
                    </span>
                    <span 
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${student.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 
                          student.estado === 'GRADUADO' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {student.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href={`/dashboard/institucion/students/${student.id}`}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Eye className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{student.promedioAcademico.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>Última actualización: {new Date(student.ultimaActualizacion).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Estudiantes */}
      {filteredStudents.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-50 rounded-full">
              <Search className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay estudiantes {filter !== 'TODOS' && `${filter.toLowerCase()}s`}
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza a registrar y gestionar tus estudiantes
          </p>
          <Link 
            href="/dashboard/institucion/students/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Users className="w-5 h-5" />
            <span>Agregar Estudiante</span>
          </Link>
        </div>
      )}
    </div>
  );
}
