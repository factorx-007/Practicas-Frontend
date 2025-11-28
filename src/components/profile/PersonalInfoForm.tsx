'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserProfile, StudentProfile, UpdateProfileData } from '@/types/user';
import { UpdateStudentProfileRequest } from '@/types/profile.types';
import { useUpdateProfile, useUpdateStudentProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { X, Save, Loader2 } from 'lucide-react';

// Validation schema
const personalInfoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
  ubicacion: z.string().optional(),
  sitioWeb: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  redesSociales: z.object({
    linkedin: z.string().url('Ingresa una URL válida de LinkedIn').optional().or(z.literal('')),
    github: z.string().url('Ingresa una URL válida de GitHub').optional().or(z.literal('')),
  }).optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  profile: (UserProfile | StudentProfile) & {
    telefono?: string | null;
    ubicacion?: string | null;
    portafolio?: string | null;
    linkedin?: string | null;
    github?: string | null;
    usuario?: {
      nombre: string;
      apellido: string;
    };
  } | null;
  onClose: () => void;
}

export default function PersonalInfoForm({ profile, onClose }: PersonalInfoFormProps) {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const updateStudentProfileMutation = useUpdateStudentProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset: _reset
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      nombre: (profile as { usuario?: { nombre: string } })?.usuario?.nombre || (profile as { nombre?: string })?.nombre || '',
      apellido: (profile as { usuario?: { apellido: string } })?.usuario?.apellido || (profile as { apellido?: string })?.apellido || '',
      telefono: profile?.telefono || '',
      ubicacion: profile?.ubicacion || '',
      sitioWeb: profile?.portafolio || '',
      redesSociales: {
        linkedin: profile?.linkedin || '',
        github: profile?.github || '',
      },
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    try {
      // Update basic user info (name, last name)
      const basicUpdateData: UpdateProfileData = {
        nombre: data.nombre,
        apellido: data.apellido,
      };
      await updateProfileMutation.mutateAsync(basicUpdateData);

      // If user is a student, update student-specific fields
      if (user?.rol === 'ESTUDIANTE') {
        const studentData: UpdateStudentProfileRequest = {
          telefono: data.telefono,
          ubicacion: data.ubicacion,
          portafolio: data.sitioWeb,
          linkedin: data.redesSociales?.linkedin,
          github: data.redesSociales?.github,
        };
        await updateStudentProfileMutation.mutateAsync(studentData);
      }

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Editar Información Personal</h2>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                {...register('nombre')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                {...register('apellido')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu apellido"
              />
              {errors.apellido && (
                <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+57 300 123 4567"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                {...register('ubicacion')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ciudad, País"
              />
              {errors.ubicacion && (
                <p className="mt-1 text-sm text-red-600">{errors.ubicacion.message}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web / Portfolio
            </label>
            <input
              type="url"
              {...register('sitioWeb')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://tu-portfolio.com"
            />
            {errors.sitioWeb && (
              <p className="mt-1 text-sm text-red-600">{errors.sitioWeb.message}</p>
            )}
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                {...register('redesSociales.linkedin')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/tu-perfil"
              />
              {errors.redesSociales?.linkedin && (
                <p className="mt-1 text-sm text-red-600">{errors.redesSociales.linkedin.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <input
                type="url"
                {...register('redesSociales.github')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/tu-usuario"
              />
              {errors.redesSociales?.github && (
                <p className="mt-1 text-sm text-red-600">{errors.redesSociales.github.message}</p>
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
            disabled={updateProfileMutation.isPending || updateStudentProfileMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(updateProfileMutation.isPending || updateStudentProfileMutation.isPending) ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{(updateProfileMutation.isPending || updateStudentProfileMutation.isPending) ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}