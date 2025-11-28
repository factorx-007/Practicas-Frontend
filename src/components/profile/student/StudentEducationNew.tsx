'use client';

import { useState } from 'react';
import { Plus, GraduationCap, Calendar, Award } from 'lucide-react';
import { StudentProfile, EducacionAcademica } from '@/types/user';
import MinimalCard from '@/components/ui/MinimalCard';
import MinimalButton from '@/components/ui/MinimalButton';
import EducationModal from '../modals/EducationModal';
import {
  EducacionAcademicaInput,
  TIPO_INSTITUCION_LABELS,
  NIVEL_ACADEMICO_LABELS,
} from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentEducationProps {
  profile: StudentProfile | null;
  onProfileUpdate?: () => void;
}

export default function StudentEducationNew({ profile, onProfileUpdate }: StudentEducationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducacionAcademica | null>(null);

  if (!profile) {
    return <div>Cargando...</div>;
  }

  const { educacion } = profile;

  const handleSaveEducation = async (data: EducacionAcademicaInput) => {
    try {
      if (editingEducation) {
        // Update existing education
        await UsersService.updateStudentProfile({
          educacion: {
            update: [
              {
                where: { id: editingEducation.id },
                data,
              },
            ],
          },
        });
        toast.success('Educación actualizada');
      } else {
        // Create new education
        await UsersService.updateStudentProfile({
          educacion: {
            create: [data],
          },
        });
        toast.success('Educación agregada');
      }

      setIsModalOpen(false);
      setEditingEducation(null);
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Error al guardar la educación');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta educación?')) return;

    try {
      await UsersService.updateStudentProfile({
        educacion: {
          delete: [{ id }],
        },
      });
      toast.success('Educación eliminada');
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Error al eliminar la educación');
    }
  };

  const handleEdit = (edu: EducacionAcademica) => {
    setEditingEducation(edu);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingEducation(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Educación Académica</h2>
          <p className="text-sm text-gray-600 mt-1">
            {educacion.length} registro{educacion.length !== 1 ? 's' : ''} académico{educacion.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
          Agregar Educación
        </MinimalButton>
      </div>

      {/* Education List */}
      <div className="space-y-3">
        {educacion.length > 0 ? (
          educacion.map((edu) => (
            <MinimalCard
              key={edu.id}
              icon={<GraduationCap className="w-5 h-5 text-gray-700" />}
              onEdit={() => handleEdit(edu)}
              onDelete={() => handleDeleteEducation(edu.id)}
            >
              <div className="space-y-3">
                {/* Title & Institution */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{edu.titulo}</h3>
                  <p className="text-sm text-gray-600">{edu.institucion}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(edu.fecha_inicio)} -{' '}
                      {edu.en_curso ? 'Presente' : formatDate(edu.fecha_fin!)}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                    {NIVEL_ACADEMICO_LABELS[edu.nivel_academico]}
                  </span>

                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {TIPO_INSTITUCION_LABELS[edu.tipo_institucion]}
                  </span>

                  {edu.en_curso && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                      En curso
                    </span>
                  )}

                  {edu.promedio && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded font-medium">
                      <Award className="w-3 h-3" />
                      <span>Promedio: {edu.promedio.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Field of Study */}
                {edu.campo_estudio && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Campo de Estudio
                    </h4>
                    <p className="text-sm text-gray-700">{edu.campo_estudio}</p>
                  </div>
                )}

                {/* Featured Courses */}
                {edu.cursos_destacados && edu.cursos_destacados.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Cursos Destacados
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(edu.cursos_destacados as string[]).map((curso, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded border border-gray-200"
                        >
                          {curso}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </MinimalCard>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No hay educación registrada
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Agrega tu formación académica para mostrar tu preparación
            </p>
            <MinimalButton onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
              Agregar Primera Educación
            </MinimalButton>
          </div>
        )}
      </div>

      {/* Modal */}
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEducation(null);
        }}
        onSave={handleSaveEducation}
        currentData={editingEducation}
      />
    </div>
  );
}
