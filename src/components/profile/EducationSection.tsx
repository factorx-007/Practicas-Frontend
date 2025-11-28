'use client';

import type { UserProfile, StudentProfile, EducacionAcademica } from '@/types/user';
import { GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';

interface UserWithStudentProfile extends UserProfile {
  perfilEstudiante?: {
    educacion?: EducacionAcademica[];
    carrera?: string;
    universidad?: string;
    semestreActual?: number;
    promedioAcademico?: number;
    fechaGraduacion?: string;
  };
}

type ProfileWithEducation = StudentProfile | UserWithStudentProfile | null;

interface EducationSectionProps {
  profile: ProfileWithEducation;
}

export default function EducationSection({ profile }: EducationSectionProps) {
  // Handle different profile types to extract education data
  const education = (() => {
    if (!profile) return [];
    // Handle StudentProfile
    if ('educacion' in profile) return profile.educacion || [];
    // Handle UserProfile with perfilEstudiante
    if ('perfilEstudiante' in profile && profile.perfilEstudiante?.educacion) {
      return profile.perfilEstudiante.educacion;
    }
    return [];
  })();

  // Helper to get student info safely
  const getStudentInfo = () => {
    if (!profile) return null;
    
    // Handle StudentProfile
    if ('carrera' in profile) {
      const studentProfile = profile as StudentProfile;
      return {
        carrera: studentProfile.carrera,
        universidad: studentProfile.universidad || undefined,
        // These fields are not directly on the PerfilProfesional interface
        // We'll need to add them to the interface or find where they should come from
        semestreActual: undefined,
        promedioAcademico: undefined,
        fechaGraduacion: undefined
      };
    }
    
    // Handle UserProfile with perfilEstudiante
    if ('perfilEstudiante' in profile) {
      return profile.perfilEstudiante || null;
    }
    
    return null;
  };

  const studentInfo = getStudentInfo();

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Educación</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Agregar Educación</span>
        </button>
      </div>

      {/* Current Academic Info (if student) */}
      {studentInfo && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {studentInfo.carrera || 'Carrera no especificada'}
                </h3>
                <p className="text-blue-600 font-medium">
                  {studentInfo.universidad || 'Universidad no especificada'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  {studentInfo.semestreActual && (
                    <span>{studentInfo.semestreActual}° semestre</span>
                  )}
                  {studentInfo.promedioAcademico && (
                    <span>Promedio: {studentInfo.promedioAcademico}</span>
                  )}
                  {studentInfo.fechaGraduacion && (
                    <span>Graduación: {studentInfo.fechaGraduacion}</span>
                  )}
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Additional Education */}
      {education.length > 0 ? (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.titulo}</h3>
                    <p className="text-blue-600 font-medium">{edu.institucion}</p>
                    <p className="text-sm text-gray-500">
                      {edu.fecha_inicio} - {edu.en_curso ? 'En curso' : (edu.fecha_fin || '')}
                    </p>
                    {edu.promedio && (
                      <p className="text-sm text-gray-500">Promedio: {edu.promedio} ({edu.sistema_notas})</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {edu.campo_estudio && (
                <p className="text-gray-600 mb-4">{edu.campo_estudio}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {edu.nivel_academico}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {edu.tipo_institucion}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Educación adicional</h3>
          <p className="text-gray-600 mb-4">Agrega cursos, diplomados o estudios complementarios</p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Educación
          </button>
        </div>
      )}
    </div>
  );
}