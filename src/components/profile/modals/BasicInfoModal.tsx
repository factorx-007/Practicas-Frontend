'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalButton from '@/components/ui/MinimalButton';

interface BasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BasicInfoInput) => Promise<void>;
  currentData?: {
    carrera?: string;
    universidad?: string;
  } | null;
}

export interface BasicInfoInput {
  carrera?: string;
  universidad?: string;
}

export default function BasicInfoModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: BasicInfoModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BasicInfoInput>({
    defaultValues: {
      carrera: currentData?.carrera || '',
      universidad: currentData?.universidad || '',
    },
  });

  const onSubmit = async (data: BasicInfoInput) => {
    try {
      setLoading(true);
      await onSave(data);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving basic info:', error);
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
      title="Editar Información Básica"
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
        <MinimalInput
          label="Carrera"
          {...register('carrera', { required: 'La carrera es requerida' })}
          error={errors.carrera?.message}
          placeholder="Ej: Ingeniería de Software"
          required
        />

        <MinimalInput
          label="Universidad / Institución"
          {...register('universidad', { required: 'La universidad es requerida' })}
          error={errors.universidad?.message}
          placeholder="Ej: Universidad Nacional"
          required
        />

        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          💡 <strong>Tip:</strong> Esta información aparecerá en tu perfil público y ayuda a los reclutadores a encontrarte.
        </div>
      </form>
    </MinimalModal>
  );
}
