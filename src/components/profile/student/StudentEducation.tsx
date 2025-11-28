'use client';

import { useState } from 'react';
import { Plus, GraduationCap, Calendar, Award, Edit2, Trash2 } from 'lucide-react';
import { StudentProfile, EducacionAcademica } from '@/types/user';
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
}

export default function StudentEducation({ profile: initialProfile }: StudentEducationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducacionAcademica | null>(null);
  const [educationList, setEducationList] = useState<EducacionAcademica[]>(
    initialProfile?.educacion || [
      {
        id: '1',
        institucion: 'Universidad Nacional Mayor de San Marcos',
        tipo_institucion: 'UNIVERSIDAD',
        titulo: 'Ingeniería de Software',
        campo_estudio: 'Ciencias de la Computación',
        nivel_academico: 'LICENCIATURA',
        fecha_inicio: '2019-03-01T00:00:00.000Z',
        fecha_fin: '2023-12-15T00:00:00.000Z',
        en_curso: false,
        promedio: 16.8,
        sistema_notas: '0_20',
      },
      {
        id: '2',
        institucion: 'Instituto CIBERTEC',
        tipo_institucion: 'INSTITUTO',
        titulo: 'Desarrollo de Aplicaciones Web',
        campo_estudio: 'Tecnología',
        nivel_academico: 'TECNICO',
        fecha_inicio: '2017-03-01T00:00:00.000Z',
        fecha_fin: '2019-01-15T00:00:00.000Z',
        en_curso: false,
        promedio: 18.2,
        sistema_notas: '0_20',
      },
    ]
  );

  const mapSistemaNotas = (value: string): EducacionAcademica['sistema_notas'] => {
    switch (value) {
      case 'VIGESIMAL':
      case 'ALFABETICO':
      case 'NUMERICO_100':
      case 'GPA':
      case 'OTRO':
        return value as EducacionAcademica['sistema_notas'];
      default:
        return 'OTRO';
    }
  };

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

        setEducationList(educationList.map(edu =>
          edu.id === editingEducation.id
            ? {
                ...edu,
                institucion: data.institucion,
                tipo_institucion: data.tipo_institucion,
                titulo: data.titulo,
                campo_estudio: data.campo_estudio,
                nivel_academico: data.nivel_academico,
                fecha_inicio: data.fecha_inicio,
                fecha_fin: data.fecha_fin ?? null,
                en_curso: data.en_curso,
                promedio: data.promedio,
                sistema_notas: mapSistemaNotas(data.sistema_notas as unknown as string),
                cursos_destacados: (data.cursos_destacados as string[] | undefined) ?? edu.cursos_destacados,
              }
            : edu
        ));

        toast.success('Educación actualizada');
      } else {
        // Create new education
        const newEdu = {
          id: Date.now().toString(), // Asegurar que el id se genera antes de enviar
          institucion: data.institucion,
          tipo_institucion: data.tipo_institucion,
          titulo: data.titulo,
          campo_estudio: data.campo_estudio,
          nivel_academico: data.nivel_academico,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin ?? null,
          en_curso: data.en_curso,
          promedio: data.promedio,
          sistema_notas: mapSistemaNotas(data.sistema_notas as unknown as string),
          cursos_destacados: (data.cursos_destacados as string[] | undefined) ?? [],
        };

        await UsersService.updateStudentProfile({
          educacion: {
            create: [newEdu], // Pasar el objeto completo con el id generado
          },
        });

        setEducationList([...educationList, newEdu]);
        toast.success('Educación agregada');
      }

      setIsModalOpen(false);
      setEditingEducation(null);
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

      setEducationList(educationList.filter(edu => edu.id !== id));
      toast.success('Educación eliminada');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Educación Académica</h2>
          <p className="text-gray-600 mt-1">
            {educationList.length} registro{educationList.length !== 1 ? 's' : ''} académico{educationList.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton 
          onClick={handleNew} 
          icon={<Plus className="w-5 h-5" />}
          className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span className="font-medium">Agregar Educación</span>
        </MinimalButton>
      </div>

      {/* Education List */}
      <div className="space-y-5">
        {educationList.length > 0 ? (
          educationList.map((edu) => (
            <div
              key={edu.id}
              className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900">{edu.titulo}</h3>
                    <p className="text-lg text-gray-700 mt-1">{edu.institucion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {formatDate(edu.fecha_inicio)} -{' '}
                    {edu.en_curso ? 'Presente' : formatDate(edu.fecha_fin!)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {NIVEL_ACADEMICO_LABELS[edu.nivel_academico as keyof typeof NIVEL_ACADEMICO_LABELS]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {TIPO_INSTITUCION_LABELS[edu.tipo_institucion]}
                  </span>
                </div>

                {edu.en_curso && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      En curso
                    </span>
                  </div>
                )}

                {edu.promedio && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    <span>Promedio: {typeof edu.promedio === 'number' ? edu.promedio.toFixed(1) : Number(edu.promedio).toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Field of Study */}
              {edu.campo_estudio && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                    Campo de Estudio
                  </h4>
                  <p className="text-gray-700">{edu.campo_estudio}</p>
                </div>
              )}

              {/* Featured Courses */}
              {edu.cursos_destacados && (edu.cursos_destacados as string[]).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Cursos Destacados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(edu.cursos_destacados as string[]).map((curso, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-200"
                      >
                        {curso}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay educación registrada
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Agrega tu formación académica para mostrar tu preparación
            </p>
            <MinimalButton 
              onClick={handleNew} 
              icon={<Plus className="w-5 h-5" />}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <span className="font-medium">Agregar Primera Educación</span>
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