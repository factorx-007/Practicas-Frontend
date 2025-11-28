'use client';

import { useState } from 'react';
import { Plus, Briefcase, Calendar } from 'lucide-react';
import { StudentProfile, ExperienciaLaboral } from '@/types/user';
import MinimalCard from '@/components/ui/MinimalCard';
import MinimalButton from '@/components/ui/MinimalButton';
import ExperienceModal from '../modals/ExperienceModal';
import { ExperienciaLaboralInput, MODALIDAD_TRABAJO_LABELS } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentExperienceProps {
  profile: StudentProfile | null;
  onProfileUpdate?: () => void;
}

export default function StudentExperienceNew({ profile, onProfileUpdate }: StudentExperienceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienciaLaboral | null>(null);

  if (!profile) {
    return <div>Cargando...</div>;
  }

  const { experiencias } = profile;

  const handleSaveExperience = async (data: ExperienciaLaboralInput) => {
    try {
      if (editingExperience) {
        // Update existing experience
        await UsersService.updateStudentProfile({
          experiencias: {
            update: [
              {
                where: { id: editingExperience.id },
                data,
              },
            ],
          },
        });
        toast.success('Experiencia actualizada');
      } else {
        // Create new experience
        await UsersService.updateStudentProfile({
          experiencias: {
            create: [data],
          },
        });
        toast.success('Experiencia agregada');
      }

      setIsModalOpen(false);
      setEditingExperience(null);
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Error al guardar la experiencia');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta experiencia?')) return;

    try {
      await UsersService.updateStudentProfile({
        experiencias: {
          delete: [{ id }],
        },
      });
      toast.success('Experiencia eliminada');
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Error al eliminar la experiencia');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (inicio: string, fin: string | null | undefined, esActual: boolean): string => {
    try {
      const start = new Date(inicio);
      const end = esActual ? new Date() : (fin ? new Date(fin) : new Date());
      
      // Validar que las fechas sean válidas
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return '';
      }
      
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      
      // Validar que la fecha de inicio no sea posterior a la fecha de fin
      if (months < 0) return '';
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Experiencia Laboral</h2>
          <p className="text-sm text-gray-600 mt-1">
            {experiencias.length} experiencia{experiencias.length !== 1 ? 's' : ''} registrada{experiencias.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
          Agregar Experiencia
        </MinimalButton>
      </div>

      {/* Experiences List */}
      <div className="space-y-3">
        {experiencias.length > 0 ? (
          experiencias.map((exp) => (
            <MinimalCard
              key={exp.id}
              icon={<Briefcase className="w-5 h-5 text-gray-700" />}
              onEdit={() => handleEdit(exp)}
              onDelete={() => handleDeleteExperience(exp.id)}
            >
              <div className="space-y-3">
                {/* Title & Company */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{exp.cargo}</h3>
                  <p className="text-sm text-gray-600">{exp.empresa}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(exp.fecha_inicio)} - {exp.es_actual ? 'Presente' : formatDate(exp.fecha_fin!)}
                    </span>
                    <span className="text-gray-400">
                      · {calculateDuration(exp.fecha_inicio, exp.fecha_fin, exp.es_actual)}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                    {MODALIDAD_TRABAJO_LABELS[exp.modalidad]}
                  </span>

                  {exp.es_actual && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-medium">
                      Trabajo Actual
                    </span>
                  )}
                </div>

                {/* Description */}
                {exp.descripcion && (
                  <p className="text-sm text-gray-700 leading-relaxed">{exp.descripcion}</p>
                )}

                {/* Responsibilities */}
                {exp.responsabilidades && exp.responsabilidades.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Responsabilidades
                    </h4>
                    <ul className="space-y-1">
                      {exp.responsabilidades.map((resp, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400 mt-1.5">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {exp.logros && exp.logros.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Logros</h4>
                    <ul className="space-y-1">
                      {exp.logros.map((logro, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-1.5">✓</span>
                          <span>{logro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </MinimalCard>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No hay experiencia laboral
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Agrega tu experiencia profesional para destacar tu trayectoria
            </p>
            <MinimalButton onClick={handleNew} icon={<Plus className="w-4 h-4" />}>
              Agregar Primera Experiencia
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
        currentData={editingExperience}
      />
    </div>
  );
}
