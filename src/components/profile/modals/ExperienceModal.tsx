'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalTextarea from '@/components/ui/MinimalTextarea';
import MinimalSelect from '@/components/ui/MinimalSelect';
import MinimalButton from '@/components/ui/MinimalButton';
import { ExperienciaLaboralInput, MODALIDAD_TRABAJO_LABELS } from '@/types/profile.types';
import { ExperienciaLaboral } from '@/types/user';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExperienciaLaboralInput) => Promise<void>;
  currentData?: ExperienciaLaboral | null;
}

// Definir tipos para los campos de array
interface FieldArrayItem {
  id: string;
  value: string;
}

// Tipo para el formulario
type ExperienceFormValues = Omit<ExperienciaLaboralInput, 'responsabilidades' | 'logros'> & {
  responsabilidades: FieldArrayItem[];
  logros: FieldArrayItem[];
};

export default function ExperienceModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: ExperienceModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<ExperienceFormValues>({
    defaultValues: {
      cargo: currentData?.cargo || '',
      empresa: currentData?.empresa || '',
      fecha_inicio: currentData?.fecha_inicio?.split('T')[0] || '',
      fecha_fin: currentData?.fecha_fin?.split('T')[0] || '',
      es_actual: currentData?.es_actual || false,
      modalidad: currentData?.modalidad || 'PRESENCIAL',
      descripcion: currentData?.descripcion || '',
      responsabilidades: (currentData?.responsabilidades || []).map(value => ({ id: Math.random().toString(36).substr(2, 9), value })),
      logros: (currentData?.logros || []).map(value => ({ id: Math.random().toString(36).substr(2, 9), value })),
    },
  });

  const {
    fields: responsabilidadesFields,
    append: appendResponsabilidad,
    remove: removeResponsabilidad,
  } = useFieldArray({
    control,
    name: 'responsabilidades',
  });

  const {
    fields: logrosFields,
    append: appendLogro,
    remove: removeLogro,
  } = useFieldArray({
    control,
    name: 'logros',
  });

  const esActual = watch('es_actual');

  const onSubmit = async (data: ExperienceFormValues) => {
    try {
      setLoading(true);
      // Convert dates to ISO strings and map field arrays
      const formattedData: ExperienciaLaboralInput = {
        ...data,
        fecha_inicio: new Date(data.fecha_inicio).toISOString(),
        fecha_fin: data.fecha_fin && !data.es_actual ? new Date(data.fecha_fin).toISOString() : null,
        responsabilidades: data.responsabilidades.map(r => r.value),
        logros: data.logros.map(l => l.value),
      };
      await onSave(formattedData);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving experience:', error);
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
      title={currentData ? 'Editar Experiencia' : 'Nueva Experiencia'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Cargo */}
          <MinimalInput
            label="Cargo"
            {...register('cargo', { required: 'El cargo es requerido' })}
            error={errors.cargo?.message}
            placeholder="Ej: Desarrollador Full Stack"
            required
          />

          {/* Empresa */}
          <MinimalInput
            label="Empresa"
            {...register('empresa', { required: 'La empresa es requerida' })}
            error={errors.empresa?.message}
            placeholder="Ej: Tech Company SAC"
            required
          />
        </div>

        {/* Modalidad */}
        <MinimalSelect
          label="Modalidad"
          {...register('modalidad', { required: 'La modalidad es requerida' })}
          options={Object.entries(MODALIDAD_TRABAJO_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          error={errors.modalidad?.message}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Fecha de Inicio */}
          <MinimalInput
            label="Fecha de Inicio"
            type="date"
            {...register('fecha_inicio', { required: 'La fecha de inicio es requerida' })}
            error={errors.fecha_inicio?.message}
            required
          />

          {/* Fecha de Fin */}
          <MinimalInput
            label="Fecha de Fin"
            type="date"
            {...register('fecha_fin')}
            error={errors.fecha_fin?.message}
            disabled={esActual}
          />
        </div>

        {/* Trabajo Actual */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('es_actual')}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700">Actualmente trabajo aquí</span>
        </label>

        {/* Descripción */}
        <MinimalTextarea
          label="Descripción"
          {...register('descripcion')}
          error={errors.descripcion?.message}
          placeholder="Describe tus funciones principales..."
          rows={3}
        />

        {/* Responsabilidades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsabilidades
          </label>
          <div className="space-y-2">
            {responsabilidadesFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <MinimalInput
                  {...register(`responsabilidades.${index}.value` as const)}
                  placeholder="Ej: Desarrollar features del producto"
                />
                <button
                  type="button"
                  onClick={() => removeResponsabilidad(index)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <MinimalButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendResponsabilidad({ id: Math.random().toString(36).substr(2, 9), value: '' })}
              icon={<Plus className="w-4 h-4" />}
            >
              Agregar Responsabilidad
            </MinimalButton>
          </div>
        </div>

        {/* Logros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logros
          </label>
          <div className="space-y-2">
            {logrosFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <MinimalInput
                  {...register(`logros.${index}.value` as const)}
                  placeholder="Ej: Mejoré el rendimiento del sistema en 40%"
                />
                <button
                  type="button"
                  onClick={() => removeLogro(index)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <MinimalButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendLogro({ id: Math.random().toString(36).substr(2, 9), value: '' })}
              icon={<Plus className="w-4 h-4" />}
            >
              Agregar Logro
            </MinimalButton>
          </div>
        </div>
      </form>
    </MinimalModal>
  );
}
