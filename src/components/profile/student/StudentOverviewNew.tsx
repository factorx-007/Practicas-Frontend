'use client';

import { useState } from 'react';
import { User, Briefcase, GraduationCap, Calendar, Edit2 } from 'lucide-react';
import { StudentProfile } from '@/types/user';
import MinimalCard from '@/components/ui/MinimalCard';
import MinimalButton from '@/components/ui/MinimalButton';
import ProfessionalProfileModal from '../modals/ProfessionalProfileModal';
import { PerfilProfesionalInput, DISPONIBILIDAD_LABELS, MODALIDAD_TRABAJO_LABELS } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentOverviewProps {
  profile: StudentProfile | null;
  onProfileUpdate?: () => void;
}

export default function StudentOverviewNew({ profile, onProfileUpdate }: StudentOverviewProps) {
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando información...</p>
      </div>
    );
  }

  const { perfilProfesional, educacion, experiencias, habilidadesNuevas } = profile;

  const handleSaveProfessionalProfile = async (data: PerfilProfesionalInput) => {
    try {
      await UsersService.updateStudentProfile({
        perfilProfesional: {
          upsert: {
            create: data,
            update: data,
          },
        },
      });

      toast.success('Perfil profesional actualizado');
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error updating professional profile:', error);
      toast.error('Error al actualizar el perfil profesional');
    }
  };

  return (
    <div className="space-y-4">
      {/* Professional Summary Card */}
      <MinimalCard
        title="Resumen Profesional"
        icon={<User className="w-5 h-5 text-gray-700" />}
        onEdit={() => setIsEditingProfessional(true)}
      >
        {perfilProfesional ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {perfilProfesional.resumen}
            </p>

            {perfilProfesional.objetivo_carrera && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Objetivo de Carrera
                </h4>
                <p className="text-sm text-gray-700">{perfilProfesional.objetivo_carrera}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Disponibilidad</p>
                <p className="text-sm font-medium text-gray-900">
                  {DISPONIBILIDAD_LABELS[perfilProfesional.disponibilidad]}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Modalidad</p>
                <div className="flex flex-wrap gap-1">
                  {perfilProfesional.modalidad_trabajo.map((mod) => (
                    <span
                      key={mod}
                      className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                    >
                      {MODALIDAD_TRABAJO_LABELS[mod]}
                    </span>
                  ))}
                </div>
              </div>

              {perfilProfesional.salario_minimo && perfilProfesional.salario_maximo && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Expectativa Salarial</p>
                  <p className="text-sm font-medium text-gray-900">
                    {perfilProfesional.moneda} {perfilProfesional.salario_minimo} -{' '}
                    {perfilProfesional.salario_maximo}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">
              Completa tu perfil profesional para destacar tus fortalezas
            </p>
            <MinimalButton
              size="sm"
              onClick={() => setIsEditingProfessional(true)}
              icon={<Edit2 className="w-4 h-4" />}
            >
              Crear Perfil Profesional
            </MinimalButton>
          </div>
        )}
      </MinimalCard>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Experience */}
        <MinimalCard
          title="Experiencia Reciente"
          icon={<Briefcase className="w-5 h-5 text-gray-700" />}
        >
          {experiencias && experiencias.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {experiencias[0].cargo}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{experiencias[0].empresa}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(experiencias[0].fecha_inicio).getFullYear()}
                    {experiencias[0].es_actual ? ' - Presente' : ` - ${new Date(experiencias[0].fecha_fin!).getFullYear()}`}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                  {MODALIDAD_TRABAJO_LABELS[experiencias[0].modalidad]}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin experiencia registrada</p>
          )}
        </MinimalCard>

        {/* Recent Education */}
        <MinimalCard
          title="Educación Principal"
          icon={<GraduationCap className="w-5 h-5 text-gray-700" />}
        >
          {educacion && educacion.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {educacion[0].titulo}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{educacion[0].institucion}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(educacion[0].fecha_inicio).getFullYear()}
                  {educacion[0].en_curso ? ' - Presente' : educacion[0].fecha_fin ? ` - ${new Date(educacion[0].fecha_fin).getFullYear()}` : ''}
                </span>
                {educacion[0].promedio && (
                  <span className="ml-auto px-2 py-0.5 bg-green-50 text-green-700 rounded font-medium">
                    {educacion[0].promedio.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin educación registrada</p>
          )}
        </MinimalCard>
      </div>

      {/* Skills Preview */}
      {habilidadesNuevas && habilidadesNuevas.length > 0 && (
        <MinimalCard title="Habilidades Principales">
          <div className="flex flex-wrap gap-2">
            {habilidadesNuevas.slice(0, 12).map((hab, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full"
              >
                {hab.habilidad.nombre}
              </span>
            ))}
            {habilidadesNuevas.length > 12 && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                +{habilidadesNuevas.length - 12} más
              </span>
            )}
          </div>
        </MinimalCard>
      )}

      {/* Modals */}
      <ProfessionalProfileModal
        isOpen={isEditingProfessional}
        onClose={() => setIsEditingProfessional(false)}
        onSave={handleSaveProfessionalProfile}
        currentData={perfilProfesional}
      />
    </div>
  );
}
