'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalSelect from '@/components/ui/MinimalSelect';
import MinimalButton from '@/components/ui/MinimalButton';
import { CertificacionInput } from '@/types/profile.types';
import { Certificacion } from '@/types/user';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CertificacionInput) => Promise<void>;
  currentData?: Certificacion | null;
}

const TIPO_CERTIFICACION_OPTIONS = [
  { value: 'PROFESIONAL', label: 'Profesional' },
  { value: 'TECNICA', label: 'Técnica' },
  { value: 'IDIOMAS', label: 'Idiomas' },
  { value: 'CURSO', label: 'Curso' },
  { value: 'OTRO', label: 'Otro' },
];

export default function CertificationModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: CertificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [tieneExpiracion, setTieneExpiracion] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CertificacionInput>({
    defaultValues: currentData
      ? {
          titulo: currentData.titulo,
          emisor: currentData.emisor,
          tipo: currentData.tipo,
          fecha_emision: currentData.fecha_emision?.split('T')[0],
          fecha_expiracion: currentData.fecha_expiracion?.split('T')[0] || '',
          credencial_id: currentData.credencial_id || '',
          url_verificacion: currentData.url_verificacion || '',
        }
      : {
          titulo: '',
          emisor: '',
          tipo: 'PROFESIONAL',
          fecha_emision: '',
          fecha_expiracion: '',
          credencial_id: '',
          url_verificacion: '',
        },
  });

  useEffect(() => {
    if (isOpen && currentData) {
      reset({
        titulo: currentData.titulo,
        emisor: currentData.emisor,
        tipo: currentData.tipo,
        fecha_emision: currentData.fecha_emision?.split('T')[0],
        fecha_expiracion: currentData.fecha_expiracion?.split('T')[0] || '',
        credencial_id: currentData.credencial_id || '',
        url_verificacion: currentData.url_verificacion || '',
      });
      setTieneExpiracion(!!currentData.fecha_expiracion);
    }
  }, [isOpen, currentData, reset]);

  const onSubmit = async (data: CertificacionInput) => {
    try {
      setLoading(true);

      const payload: CertificacionInput = {
        titulo: data.titulo,
        emisor: data.emisor,
        tipo: data.tipo,
        fecha_emision: `${data.fecha_emision}T00:00:00.000Z`,
        fecha_expiracion: tieneExpiracion && data.fecha_expiracion
          ? `${data.fecha_expiracion}T00:00:00.000Z`
          : null,
        credencial_id: data.credencial_id || undefined,
        url_verificacion: data.url_verificacion || undefined,
      };

      await onSave(payload);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving certification:', error);
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
      title={currentData ? 'Editar Certificación' : 'Nueva Certificación'}
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
        {/* Título */}
        <MinimalInput
          label="Título de la Certificación"
          {...register('titulo', { required: 'El título es requerido' })}
          error={errors.titulo?.message}
          placeholder="Ej: AWS Certified Solutions Architect"
          required
        />

        {/* Emisor y Tipo */}
        <div className="grid grid-cols-2 gap-4">
          <MinimalInput
            label="Emisor/Proveedor"
            {...register('emisor', { required: 'El emisor es requerido' })}
            error={errors.emisor?.message}
            placeholder="Ej: Amazon Web Services"
            required
          />

          <MinimalSelect
            label="Tipo"
            {...register('tipo', { required: 'El tipo es requerido' })}
            error={errors.tipo?.message}
            options={TIPO_CERTIFICACION_OPTIONS}
            required
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <MinimalInput
            label="Fecha de Emisión"
            type="date"
            {...register('fecha_emision', { required: 'La fecha de emisión es requerida' })}
            error={errors.fecha_emision?.message}
            required
          />

          <div>
            <MinimalInput
              label="Fecha de Expiración"
              type="date"
              {...register('fecha_expiracion')}
              error={errors.fecha_expiracion?.message}
              disabled={!tieneExpiracion}
            />
            <label className="flex items-center gap-2 mt-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={tieneExpiracion}
                onChange={(e) => setTieneExpiracion(e.target.checked)}
                className="rounded border-gray-300"
              />
              Esta certificación tiene fecha de expiración
            </label>
          </div>
        </div>

        {/* Credencial ID */}
        <MinimalInput
          label="ID de Credencial"
          {...register('credencial_id')}
          error={errors.credencial_id?.message}
          placeholder="Ej: AWS-CSA-2024-001"
        />

        {/* URL de Verificación */}
        <MinimalInput
          label="URL de Verificación"
          {...register('url_verificacion')}
          error={errors.url_verificacion?.message}
          placeholder="https://verify.provider.com/..."
        />

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          💡 <strong>Tip:</strong> Incluye el ID de credencial y URL de verificación para que los
          reclutadores puedan validar tu certificación fácilmente.
        </div>
      </form>
    </MinimalModal>
  );
}
