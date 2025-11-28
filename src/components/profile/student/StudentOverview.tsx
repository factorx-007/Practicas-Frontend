'use client';

import { useState } from 'react';
import { User, Briefcase, GraduationCap, Edit2, Calendar, Sparkles } from 'lucide-react';
import { StudentProfile } from '@/types/user';
import MinimalButton from '@/components/ui/MinimalButton';
import ProfessionalProfileModal from '../modals/ProfessionalProfileModal';
import BasicInfoModal, { BasicInfoInput } from '../modals/BasicInfoModal';
import { PerfilProfesionalInput, DISPONIBILIDAD_LABELS, MODALIDAD_TRABAJO_LABELS } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentOverviewProps {
  profile: StudentProfile | null;
}

export default function StudentOverview({ profile: initialProfile }: StudentOverviewProps) {
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(initialProfile);

  // Usar el perfil real si está disponible
  const currentProfile = profile || initialProfile;

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-500">Cargando información...</p>
      </div>
    );
  }

  const { perfilProfesional, educacion, experiencias, habilidadesNuevas } = currentProfile;

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
      // Actualizar perfil local
      setProfile({
        ...currentProfile,
        perfilProfesional: {
          id: perfilProfesional?.id || '1',
          ...data,
        },
      });
    } catch (error) {
      console.error('Error updating professional profile:', error);
      toast.error('Error al actualizar el perfil profesional');
    }
  };

  const handleSaveBasicInfo = async (data: BasicInfoInput) => {
    try {
      await UsersService.updateStudentProfile({
        carrera: data.carrera,
        universidad: data.universidad,
      });

      toast.success('Información básica actualizada');
      // Actualizar perfil local
      setProfile({
        ...currentProfile,
        carrera: data.carrera || currentProfile.carrera,
        universidad: data.universidad || currentProfile.universidad,
      });
    } catch (error) {
      console.error('Error updating basic info:', error);
      toast.error('Error al actualizar la información básica');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info - Universidad y Carrera */}
      {(currentProfile.universidad || currentProfile.carrera) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Información Académica Básica</h3>
                <p className="text-gray-600 mt-1">De tu registro inicial</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingBasicInfo(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentProfile.carrera && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Carrera</p>
                <p className="text-lg font-medium text-gray-900">{currentProfile.carrera}</p>
              </div>
            )}
            {currentProfile.universidad && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Universidad</p>
                <p className="text-lg font-medium text-gray-900">{currentProfile.universidad}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Resumen Profesional</h3>
              <p className="text-gray-600 mt-1">Tu carta de presentación</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfessional(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        </div>

        {perfilProfesional ? (
          <div className="space-y-5">
            <p className="text-gray-700 leading-relaxed text-lg">
              {perfilProfesional.resumen}
            </p>

            {perfilProfesional.objetivo_carrera && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Objetivo de Carrera</h4>
                <p className="text-gray-700 text-lg">{perfilProfesional.objetivo_carrera}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Disponibilidad</p>
                <p className="text-lg font-medium text-gray-900">
                  {DISPONIBILIDAD_LABELS[perfilProfesional.disponibilidad]}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Modalidad</p>
                <div className="flex flex-wrap gap-2">
                  {perfilProfesional.modalidad_trabajo.map((mod) => (
                    <span
                      key={mod}
                      className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      {MODALIDAD_TRABAJO_LABELS[mod]}
                    </span>
                  ))}
                </div>
              </div>

              {perfilProfesional.salario_minimo && perfilProfesional.salario_maximo && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Expectativa Salarial</p>
                  <p className="text-lg font-medium text-gray-900">
                    {perfilProfesional.moneda} {perfilProfesional.salario_minimo} - {perfilProfesional.salario_maximo}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Completa tu perfil profesional para destacar
            </p>
            <MinimalButton
              onClick={() => setIsEditingProfessional(true)}
              icon={<Edit2 className="w-5 h-5" />}
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <span className="font-medium">Crear Perfil Profesional</span>
            </MinimalButton>
          </div>
        )}
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent Experience */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Experiencia Reciente</h3>
              <p className="text-gray-600 mt-1">{experiencias.length} experiencia(s)</p>
            </div>
          </div>

          {experiencias && experiencias.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900">{experiencias[0].cargo}</h4>
              <p className="text-gray-700 text-lg">{experiencias[0].empresa}</p>
              <div className="flex items-center gap-4 text-gray-600 pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {formatDate(experiencias[0].fecha_inicio)}
                    {experiencias[0].es_actual ? ' - Presente' : experiencias[0].fecha_fin ? ` - ${formatDate(experiencias[0].fecha_fin)}` : ''}
                  </span>
                </div>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {MODALIDAD_TRABAJO_LABELS[experiencias[0].modalidad]}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Sin experiencia registrada</p>
          )}
        </div>

        {/* Recent Education */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Educación Principal</h3>
              <p className="text-gray-600 mt-1">{educacion.length} registro(s)</p>
            </div>
          </div>

          {educacion && educacion.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900">{educacion[0].titulo}</h4>
              <p className="text-gray-700 text-lg">{educacion[0].institucion}</p>
              <div className="flex items-center justify-between text-gray-600 pt-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {formatDate(educacion[0].fecha_inicio)}
                    {educacion[0].en_curso ? ' - Presente' : educacion[0].fecha_fin ? ` - ${formatDate(educacion[0].fecha_fin)}` : ''}
                  </span>
                </div>
                {educacion[0].promedio && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full font-medium text-sm">
                    {typeof educacion[0].promedio === 'number'
                      ? educacion[0].promedio.toFixed(1)
                      : Number(educacion[0].promedio).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Sin educación registrada</p>
          )}
        </div>
      </div>

      {/* Skills Preview */}
      {habilidadesNuevas && habilidadesNuevas.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Habilidades Principales
            <span className="text-gray-600 font-normal ml-2">
              ({habilidadesNuevas.length} total)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {habilidadesNuevas.slice(0, 12).map((hab, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full"
              >
                {hab.habilidad.nombre}
              </span>
            ))}
            {habilidadesNuevas.length > 12 && (
              <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                +{habilidadesNuevas.length - 12} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ProfessionalProfileModal
        isOpen={isEditingProfessional}
        onClose={() => setIsEditingProfessional(false)}
        onSave={handleSaveProfessionalProfile}
        currentData={perfilProfesional}
      />

      <BasicInfoModal
        isOpen={isEditingBasicInfo}
        onClose={() => setIsEditingBasicInfo(false)}
        onSave={handleSaveBasicInfo}
        currentData={{
          carrera: currentProfile.carrera,
          // Asegurarse de que universidad sea string | undefined
          universidad: currentProfile.universidad || undefined,
        }}
      />
    </div>
  );
}