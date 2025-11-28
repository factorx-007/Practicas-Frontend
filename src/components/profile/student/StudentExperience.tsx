'use client';

import { useState } from 'react';
import { Plus, Briefcase, Calendar, Edit2, Trash2 } from 'lucide-react';
import { StudentProfile, ExperienciaLaboral, ModalidadTrabajo } from '@/types/localTypes';
import MinimalButton from '@/components/ui/MinimalButton';
import ExperienceModal from '../modals/ExperienceModal';
import { ExperienciaLaboralInput, MODALIDAD_TRABAJO_LABELS } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentExperienceProps {
  profile: StudentProfile | null;
}

export default function StudentExperience({ profile: initialProfile }: StudentExperienceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienciaLaboral | null>(null);
  const [experiences, setExperiences] = useState<ExperienciaLaboral[]>(
    initialProfile?.experiencias || [
      {
        id: '1',
        cargo: 'Desarrollador Full Stack',
        empresa: 'Tech Innovations SAC',
        fecha_inicio: '2023-01-15T00:00:00.000Z',
        fecha_fin: null,
        es_actual: true,
        modalidad: 'REMOTO' as ModalidadTrabajo,
        descripcion: 'Desarrollo de aplicaciones web modernas con React, Node.js y PostgreSQL. Colaboración estrecha con el equipo de producto para implementar nuevas funcionalidades.',
        responsabilidades: [
          'Desarrollo de features del producto',
          'Code reviews y mentoría a juniors',
          'Optimización de performance del frontend'
        ],
        logros: [
          'Implementé arquitectura escalable que redujo tiempo de carga en 60%',
          'Reduje bugs en producción en 40% mediante testing exhaustivo'
        ],
      },
      {
        id: '2',
        cargo: 'Desarrollador Frontend',
        empresa: 'StartupX',
        fecha_inicio: '2021-06-01T00:00:00.000Z',
        fecha_fin: '2022-12-31T00:00:00.000Z',
        es_actual: false,
        modalidad: 'HIBRIDO' as ModalidadTrabajo,
        descripcion: 'Desarrollo de interfaces de usuario para plataforma e-commerce.',
        responsabilidades: [
          'Implementación de diseños en React',
          'Integración con APIs REST',
          'Testing unitario con Jest',
          'Optimización de rendimiento'
        ],
        logros: [
          'Mejoré el flujo de checkout aumentando conversión en 25%',
          'Implementé pruebas unitarias con Jest',
          'Mejoré el rendimiento de la aplicación en un 30%'
        ],
      },
    ]
  );

  const handleSaveExperience = async (inputData: ExperienciaLaboralInput) => {
    try {
      // Convert ExperienciaLaboralInput to ExperienciaLaboral
      const experienceData: ExperienciaLaboral = {
        id: '', // Will be set based on whether we're creating or updating
        cargo: inputData.cargo || '',
        empresa: inputData.empresa || '',
        fecha_inicio: inputData.fecha_inicio || new Date().toISOString(),
        fecha_fin: inputData.fecha_fin || null,
        es_actual: false, // Default value
        modalidad: inputData.modalidad || 'PRESENCIAL',
        descripcion: inputData.descripcion || null,
        logros: [],
        responsabilidades: []
      };

      if (editingExperience) {
        // Update existing experience
        experienceData.id = editingExperience.id;

        await UsersService.updateStudentProfile({
          experiencias: {
            update: [
              {
                where: { id: editingExperience.id },
                data: {
                  cargo: experienceData.cargo,
                  empresa: experienceData.empresa,
                  fecha_inicio: experienceData.fecha_inicio,
                  fecha_fin: experienceData.fecha_fin,
                  es_actual: experienceData.es_actual,
                  modalidad: experienceData.modalidad,
                  descripcion: experienceData.descripcion ?? undefined // Enviar undefined si no hay descripción
                },
              },
            ],
          },
        });

        setExperiences(experiences.map(exp =>
          exp.id === editingExperience.id
            ? { ...experienceData, id: exp.id } // Preserve the ID
            : exp
        ));

        toast.success('Experiencia actualizada');
      } else {
        // Add new experience
        const tempId = `temp-${Date.now()}`;
        const newExperience: ExperienciaLaboral = {
          ...experienceData,
          id: tempId
        };

        // For the actual API call, we don't include the ID
        const experienceToSave = { ...newExperience };
        delete (experienceToSave as Partial<typeof newExperience>).id;

        const response = await UsersService.updateStudentProfile({
          experiencias: {
            create: [{
              cargo: experienceToSave.cargo,
              empresa: experienceToSave.empresa,
              fecha_inicio: experienceToSave.fecha_inicio,
              fecha_fin: experienceToSave.fecha_fin,
              es_actual: experienceToSave.es_actual,
              modalidad: experienceToSave.modalidad,
              descripcion: experienceToSave.descripcion ?? undefined // Enviar undefined si no hay descripción
            }]
          },
        });

        // Update the ID with the one from the server if available
        if (response.data?.id) {
          newExperience.id = response.data.id as string;
        }

        setExperiences([...experiences, newExperience]);
        toast.success('Experiencia agregada');
      }

      setIsModalOpen(false);
      setEditingExperience(null);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Error al guardar la experiencia');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
      try {
        await UsersService.updateStudentProfile({
          experiencias: {
            delete: [{ id }]
          },
        });

        setExperiences(experiences.filter(exp => exp.id !== id));
        toast.success('Experiencia eliminada');
      } catch (error) {
        console.error('Error deleting experience:', error);
        toast.error('Error al eliminar la experiencia');
      }
    }
  };

  const handleEdit = (exp: ExperienciaLaboral) => {
    setEditingExperience(exp);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  };

  const calculateDuration = (startDate: string, endDate: string | null | undefined, isCurrent: boolean) => {
    try {
      const start = new Date(startDate);
      const end = isCurrent ? new Date() : (endDate ? new Date(endDate) : new Date());

      // Asegurarse de que las fechas sean válidas
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return '';
      }

      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

      if (months < 0) return ''; // Fecha de fin anterior a la de inicio
      if (months === 0) return 'Menos de un mes';

      if (months < 12) {
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
      } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        let result = `${years} ${years === 1 ? 'año' : 'años'}`;
        if (remainingMonths > 0) {
          result += ` ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
        }
        return result;
      }
    } catch (error) {
      console.error('Error calculando duración:', error);
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experiencia Laboral</h2>
          <p className="text-gray-600 mt-1">
            {experiences.length} experiencia{experiences.length !== 1 ? 's' : ''} registrada{experiences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton
          onClick={handleNew}
          icon={<Plus className="w-5 h-5" />}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span className="font-medium">Agregar Experiencia</span>
        </MinimalButton>
      </div>

      {/* Experiences List */}
      <div className="space-y-5">
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900">{exp.cargo}</h3>
                    <p className="text-lg text-gray-700 mt-1">{exp.empresa}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {formatDate(exp.fecha_inicio)} - {exp.es_actual ? 'Presente' : formatDate(exp.fecha_fin!)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {MODALIDAD_TRABAJO_LABELS[exp.modalidad]}
                  </span>
                </div>

                {exp.es_actual && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Trabajo Actual
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">
                    {calculateDuration(exp.fecha_inicio, exp.fecha_fin, exp.es_actual)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {exp.descripcion && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                    Descripción
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{exp.descripcion}</p>
                </div>
              )}

              {/* Responsibilities */}
              {exp.responsabilidades && exp.responsabilidades.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Responsabilidades
                  </h4>
                  <ul className="space-y-2">
                    {exp.responsabilidades.map((resp, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-3">
                        <span className="text-blue-500 mt-1.5">•</span>
                        <span className="flex-1">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {exp.logros && exp.logros.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Logros
                  </h4>
                  <ul className="space-y-2">
                    {exp.logros.map((logro, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-3">
                        <span className="text-green-600 mt-1.5 font-bold">✓</span>
                        <span className="flex-1">{logro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay experiencia laboral
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Agrega tu experiencia profesional para destacar tu trayectoria
            </p>
            <MinimalButton
              onClick={handleNew}
              icon={<Plus className="w-5 h-5" />}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <span className="font-medium">Agregar Primera Experiencia</span>
            </MinimalButton>
          </div>
        )}
      </div>

      {/* Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        currentData={editingExperience ? { ...editingExperience } : null}
      />
    </div>
  );
}