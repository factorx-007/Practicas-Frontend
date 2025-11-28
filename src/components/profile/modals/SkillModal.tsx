'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalSelect from '@/components/ui/MinimalSelect';
import MinimalButton from '@/components/ui/MinimalButton';
import { EstudianteHabilidadInput } from '@/types/profile.types';
import { EstudianteHabilidad } from '@/types/user';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EstudianteHabilidadInput) => Promise<void>;
  currentData?: EstudianteHabilidad | null;
}

const NIVEL_DOMINIO_OPTIONS = [
  { value: 'BASICO', label: 'Básico' },
  { value: 'INTERMEDIO', label: 'Intermedio' },
  { value: 'AVANZADO', label: 'Avanzado' },
  { value: 'EXPERTO', label: 'Experto' },
];

const CATEGORIA_OPTIONS = [
  { value: 'LENGUAJE_PROGRAMACION', label: 'Lenguaje de Programación' },
  { value: 'FRAMEWORK_LIBRERIA', label: 'Framework / Librería' },
  { value: 'HERRAMIENTA_SOFTWARE', label: 'Herramienta de Software' },
  { value: 'BASE_DATOS', label: 'Base de Datos' },
  { value: 'CLOUD_DEVOPS', label: 'Cloud / DevOps' },
  { value: 'DISEÑO_GRAFICO', label: 'Diseño Gráfico' },
  { value: 'DISEÑO_3D', label: 'Diseño 3D' },
  { value: 'INGENIERIA_CIVIL', label: 'Ingeniería Civil' },
  { value: 'TOPOGRAFIA', label: 'Topografía' },
  { value: 'AUTOMATIZACION', label: 'Automatización' },
  { value: 'GESTION_PROYECTOS', label: 'Gestión de Proyectos' },
  { value: 'SOFT_SKILL', label: 'Habilidad Blanda' },
  { value: 'IDIOMA_TECNICO', label: 'Idioma Técnico' },
  { value: 'OTRO', label: 'Otro' },
];

const TIPO_OPTIONS = [
  { value: 'TECNICA', label: 'Técnica' },
  { value: 'BLANDA', label: 'Blanda' },
];

export default function SkillModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: SkillModalProps) {
  const [loading, setLoading] = useState(false);
  // TODO: isNewSkill se puede usar en el futuro para diferenciar entre crear/editar
  // const [isNewSkill, setIsNewSkill] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstudianteHabilidadInput & { habilidad_nombre: string; habilidad_categoria: string; habilidad_tipo: string }>({
    defaultValues: currentData
      ? {
          nivel: currentData.nivel,
          anios_experiencia: currentData.anios_experiencia || 0,
          habilidad_nombre: currentData.habilidad?.nombre || '',
          habilidad_categoria: currentData.habilidad?.categoria || 'OTRO', // Usar 'OTRO' como default
          habilidad_tipo: currentData.habilidad?.tipo || 'TECNICA',
        }
      : {
          nivel: 'INTERMEDIO',
          anios_experiencia: 0,
          habilidad_nombre: '',
          habilidad_categoria: 'OTRO',
          habilidad_tipo: 'TECNICA',
        },
  });

  useEffect(() => {
    if (isOpen && currentData) {
      reset({
        nivel: currentData.nivel,
        anios_experiencia: currentData.anios_experiencia || 0,
        habilidad_nombre: currentData.habilidad?.nombre || '',
        habilidad_categoria: currentData.habilidad?.categoria || 'OTRO',
        habilidad_tipo: currentData.habilidad?.tipo || 'TECNICA',
      });
      // TODO: Usar cuando se implemente lógica que dependa de isNewSkill
      // setIsNewSkill(!currentData.habilidadId);
    } else if (isOpen) {
      reset({
        nivel: 'INTERMEDIO',
        anios_experiencia: 0,
        habilidad_nombre: '',
        habilidad_categoria: 'OTRO',
        habilidad_tipo: 'TECNICA',
      });
      // TODO: Usar cuando se implemente lógica que dependa de isNewSkill
      // setIsNewSkill(true);
    }
  }, [isOpen, currentData, reset]);

  const onSubmit = async (data: EstudianteHabilidadInput & { habilidad_nombre: string; habilidad_categoria: string; habilidad_tipo: string }) => {
    try {
      setLoading(true);

      const experience = data.anios_experiencia;
      let finalExperience: number;
      if (typeof experience === 'number' && !isNaN(experience)) {
        finalExperience = experience;
      } else {
        finalExperience = 0;
      }

      const payload: EstudianteHabilidadInput = {
        nivel: data.nivel,
        anios_experiencia: finalExperience,
        habilidad: {
          nombre: data.habilidad_nombre,
          categoria: data.habilidad_categoria,
          tipo: data.habilidad_tipo,
        },
      };

      await onSave(payload);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentData ? 'Editar Habilidad' : 'Nueva Habilidad'}
      size="md"
      footer={
        <>
          <MinimalButton variant="ghost" onClick={handleClose} disabled={loading}>
            Cancelar
          </MinimalButton>
          <MinimalButton onClick={handleSubmit(onSubmit)} loading={loading}>
            Guardar
          </MinimalButton>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre de la Habilidad */}
        <MinimalInput
          label="Nombre de la Habilidad"
          {...register('habilidad_nombre', { required: 'El nombre es requerido' })}
          error={errors.habilidad_nombre?.message}
          placeholder="Ej: React, Python, Trabajo en equipo"
          required
        />

        {/* Categoría y Tipo */}
        <div className="grid grid-cols-2 gap-4">
          <MinimalSelect
            label="Categoría"
            {...register('habilidad_categoria', { required: 'La categoría es requerida' })}
            error={errors.habilidad_categoria?.message}
            options={CATEGORIA_OPTIONS}
            required
          />

          <MinimalSelect
            label="Tipo"
            {...register('habilidad_tipo', { required: 'El tipo es requerido' })}
            error={errors.habilidad_tipo?.message}
            options={TIPO_OPTIONS}
            required
          />
        </div>

        {/* Nivel de Dominio */}
        <MinimalSelect
          label="Nivel de Dominio"
          {...register('nivel', { required: 'El nivel es requerido' })}
          error={errors.nivel?.message}
          options={NIVEL_DOMINIO_OPTIONS}
          required
        />

        {/* Años de Experiencia */}
        <MinimalInput
          label="Años de Experiencia (opcional)"
          type="number"
          {...register('anios_experiencia', { min: 0, max: 50, valueAsNumber: true })}
          error={errors.anios_experiencia?.message}
          placeholder="0"
          min={0}
          max={50}
          helperText="Indica cuántos años has trabajado con esta habilidad"
        />

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          💡 <strong>Tip:</strong> Sé honesto con tu nivel de dominio. Los reclutadores valoran la
          transparencia y podrán evaluar tus habilidades en entrevistas.
        </div>
      </form>
    </MinimalModal>
  );
}
