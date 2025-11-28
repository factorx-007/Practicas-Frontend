'use client';


import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserProfile, StudentProfile } from '@/types/user';
import { useUpdateStudentProfile } from '@/hooks/useProfile';
import { UpdateStudentProfileRequest, EducacionAcademicaInput } from '@/types/profile.types';
import { X, Save, Loader2 } from 'lucide-react';

// Validation schema - using actual database field names
const academicInfoSchema = z.object({
  universidad: z.string().min(2, 'El nombre de la universidad es requerido'),
  carrera: z.string().min(2, 'El nombre de la carrera es requerido'),
  anioInicio: z.number().min(1990).max(2030).optional(),
  anioFin: z.number().min(1990).max(2035).optional(),
  portafolio: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  github: z.string().url('Ingresa una URL válida de GitHub').optional().or(z.literal('')),
});

type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;

interface AcademicInfoFormProps {
  profile: UserProfile | StudentProfile | null;
  onClose: () => void;
}

export default function AcademicInfoForm({ profile, onClose }: AcademicInfoFormProps) {
  const updateStudentProfileMutation = useUpdateStudentProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademicInfoFormData>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      universidad: (profile as StudentProfile)?.educacion?.[0]?.institucion || '',
      carrera: (profile as StudentProfile)?.educacion?.[0]?.titulo || '',
      anioInicio: (profile as StudentProfile)?.educacion?.[0]?.fecha_inicio ? 
        new Date((profile as StudentProfile).educacion[0].fecha_inicio).getFullYear() : undefined,
      anioFin: (profile as StudentProfile)?.educacion?.[0]?.fecha_fin ? 
        new Date((profile as StudentProfile).educacion[0].fecha_fin as string).getFullYear() : undefined,
      portafolio: (profile as StudentProfile)?.portafolio || '',
      github: (profile as StudentProfile)?.github || '',
    },
  });

  const onSubmit = async (data: AcademicInfoFormData) => {
    try {
      const educationId = (profile as StudentProfile)?.educacion?.[0]?.id;

      // This payload is compatible with EducacionAcademicaInput
      const educationPayload: EducacionAcademicaInput = {
        institucion: data.universidad,
        titulo: data.carrera,
        tipo_institucion: 'UNIVERSIDAD',
        nivel_academico: 'LICENCIATURA',
        sistema_notas: 'VIGESIMAL',
        fecha_inicio: data.anioInicio ? new Date(data.anioInicio, 0, 1).toISOString() : new Date().toISOString(),
        fecha_fin: data.anioFin ? new Date(data.anioFin, 11, 31).toISOString() : null,
        en_curso: !data.anioFin,
      };

      const updateData: Partial<UpdateStudentProfileRequest> = {
        universidad: data.universidad || undefined,
        carrera: data.carrera,
        portafolio: data.portafolio || undefined,
        github: data.github || undefined,
        educacion: educationId
          ? { update: [{ where: { id: educationId }, data: educationPayload }] }
          : { create: [educationPayload] }
      };

      await updateStudentProfileMutation.mutateAsync(updateData);
      onClose();
    } catch (error) {
      console.error('Error updating student profile:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Editar Información Académica</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          {/* Basic Academic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Universidad *
              </label>
              <input
                type="text"
                {...register('universidad')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre de tu universidad"
              />
              {errors.universidad && (
                <p className="mt-1 text-sm text-red-600">{errors.universidad.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrera *
              </label>
              <input
                type="text"
                {...register('carrera')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu carrera o programa académico"
              />
              {errors.carrera && (
                <p className="mt-1 text-sm text-red-600">{errors.carrera.message}</p>
              )}
            </div>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año de Ingreso
              </label>
              <input
                type="number"
                min="1990"
                max="2030"
                {...register('anioInicio', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2020"
              />
              {errors.anioInicio && (
                <p className="mt-1 text-sm text-red-600">{errors.anioInicio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año de Egreso (Estimado)
              </label>
              <input
                type="number"
                min="1990"
                max="2035"
                {...register('anioFin', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024"
              />
              {errors.anioFin && (
                <p className="mt-1 text-sm text-red-600">{errors.anioFin.message}</p>
              )}
            </div>
          </div>

          {/* Portfolio and GitHub */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Enlaces Profesionales</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Personal
              </label>
              <input
                type="url"
                {...register('portafolio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://tu-portfolio.com"
              />
              {errors.portafolio && (
                <p className="mt-1 text-sm text-red-600">{errors.portafolio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repositorio GitHub
              </label>
              <input
                type="url"
                {...register('github')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/tu-usuario"
              />
              {errors.github && (
                <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateStudentProfileMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateStudentProfileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{updateStudentProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}