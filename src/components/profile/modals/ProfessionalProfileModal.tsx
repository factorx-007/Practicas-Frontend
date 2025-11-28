'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalTextarea from '@/components/ui/MinimalTextarea';
import MinimalSelect from '@/components/ui/MinimalSelect';
import MinimalButton from '@/components/ui/MinimalButton';
import {
  PerfilProfesionalInput,
  DISPONIBILIDAD_LABELS,
  MODALIDAD_TRABAJO_LABELS,
} from '@/types/profile.types';
import { PerfilProfesional } from '@/types/user';
// Tipo local derivado de las claves de los labels (evita dependencia directa de Prisma en el frontend)
type ModalidadTrabajoType = keyof typeof MODALIDAD_TRABAJO_LABELS;

interface ProfessionalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PerfilProfesionalInput) => Promise<void>;
  currentData?: PerfilProfesional | null;
}

export default function ProfessionalProfileModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: ProfessionalProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedModalidades, setSelectedModalidades] = useState<ModalidadTrabajoType[]>(
    currentData?.modalidad_trabajo || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PerfilProfesionalInput>({
    defaultValues: {
      resumen: currentData?.resumen || '',
      objetivo_carrera: currentData?.objetivo_carrera || '',
      disponibilidad: currentData?.disponibilidad || 'INMEDIATA',
      modalidad_trabajo: currentData?.modalidad_trabajo || [],
      salario_minimo: 0,
      salario_maximo: 0,
      moneda: 'PEN',
    },
  });

  const handleModalidadToggle = (modalidad: ModalidadTrabajoType) => {
    setSelectedModalidades((prev) =>
      prev.includes(modalidad)
        ? prev.filter((m) => m !== modalidad)
        : [...prev, modalidad]
    );
  };

  const onSubmit = async (data: PerfilProfesionalInput) => {
    try {
      setLoading(true);
      await onSave({
        ...data,
        modalidad_trabajo: selectedModalidades,
      });
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving professional profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedModalidades(currentData?.modalidad_trabajo || []);
    onClose();
  };

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentData ? 'Editar Perfil Profesional' : 'Crear Perfil Profesional'}
      size="lg"
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Resumen Profesional */}
        <MinimalTextarea
          label="Resumen Profesional"
          {...register('resumen', {
            required: 'El resumen profesional es requerido',
            minLength: {
              value: 50,
              message: 'El resumen debe tener al menos 50 caracteres',
            },
          })}
          error={errors.resumen?.message}
          placeholder="Describe tu experiencia, fortalezas y qué te hace destacar como profesional..."
          rows={5}
          required
        />

        {/* Objetivo de Carrera */}
        <MinimalTextarea
          label="Objetivo de Carrera"
          {...register('objetivo_carrera')}
          error={errors.objetivo_carrera?.message}
          placeholder="¿Qué buscas en tu próximo paso profesional?"
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Disponibilidad */}
          <MinimalSelect
            label="Disponibilidad"
            {...register('disponibilidad', {
              required: 'La disponibilidad es requerida',
            })}
            options={Object.entries(DISPONIBILIDAD_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            error={errors.disponibilidad?.message}
            required
          />

          {/* Moneda */}
          <MinimalSelect
            label="Moneda"
            {...register('moneda')}
            options={[
              { value: 'PEN', label: 'Soles (PEN)' },
              { value: 'USD', label: 'Dólares (USD)' },
            ]}
          />
        </div>

        {/* Modalidad de Trabajo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalidad de Trabajo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MODALIDAD_TRABAJO_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleModalidadToggle(value as ModalidadTrabajoType)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg border transition-all
                  ${
                    selectedModalidades.includes(value as ModalidadTrabajoType)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
          {selectedModalidades.length === 0 && (
            <p className="mt-1 text-xs text-red-600">
              Selecciona al menos una modalidad de trabajo
            </p>
          )}
        </div>

        {/* Expectativa Salarial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expectativa Salarial (Opcional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <MinimalInput
              label="Mínimo"
              type="number"
              {...register('salario_minimo', { valueAsNumber: true })}
              placeholder="0"
            />
            <MinimalInput
              label="Máximo"
              type="number"
              {...register('salario_maximo', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
        </div>
      </form>
    </MinimalModal>
  );
}
