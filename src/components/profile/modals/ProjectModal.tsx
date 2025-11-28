'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalTextarea from '@/components/ui/MinimalTextarea';
import MinimalSelect from '@/components/ui/MinimalSelect';
import MinimalButton from '@/components/ui/MinimalButton';
import { ProyectoInput } from '@/types/profile.types';
import { Proyecto } from '@/types/user';
// Los tipos se importan automáticamente a través de ProyectoInput

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProyectoInput) => Promise<void>;
  currentData?: Proyecto | null;
}

const TIPO_PROYECTO_OPTIONS = [
  { value: 'DESARROLLO_SOFTWARE', label: 'Desarrollo de Software' },
  { value: 'DISEÑO', label: 'Diseño' },
  { value: 'INGENIERIA', label: 'Ingeniería' },
  { value: 'INVESTIGACION', label: 'Investigación' },
  { value: 'CONSTRUCCION', label: 'Construcción' },
  { value: 'TOPOGRAFIA', label: 'Topografía' },
  { value: 'AUTOMATIZACION', label: 'Automatización' },
  { value: 'OTRO', label: 'Otro' },
];

const ESTADO_PROYECTO_OPTIONS = [
  { value: 'COMPLETADO', label: 'Completado' },
  { value: 'EN_DESARROLLO', label: 'En Desarrollo' },
  { value: 'PAUSADO', label: 'Pausado' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

const CONTEXTO_PROYECTO_OPTIONS = [
  { value: 'ACADEMICO', label: 'Académico' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'EMPRESA', label: 'Empresa' },
  { value: 'COMPETENCIA', label: 'Competencia' },
];

type ProyectoWithTecnologias = Proyecto & { tecnologias?: string[] };

export default function ProjectModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: ProjectModalProps) {
  const [loading, setLoading] = useState(false);

  type TecnologiaField = { id: string; value: string };

  // Definir un tipo para los valores del formulario que extiende ProyectoInput
  // pero reemplaza tecnologias con el tipo correcto para el formulario
  type ProjectFormValues = Omit<ProyectoInput, 'tecnologias' | 'imagenes'> & {
    tecnologias: TecnologiaField[];
  };

  const getDefaultValues = useCallback((): ProjectFormValues => {
    if (currentData) {
      const current = currentData as ProyectoWithTecnologias;
      return {
        titulo: current.titulo || '',
        descripcion: current.descripcion || '',
        tipo: current.tipo || 'DESARROLLO_SOFTWARE',
        fecha_inicio: current.fecha_inicio?.split('T')[0] || '',
        fecha_fin: current.fecha_fin?.split('T')[0] || '',
        estado: current.estado || 'EN_DESARROLLO',
        url_repositorio: current.url_repositorio || '',
        url_demo: current.url_demo || '',
        contexto: current.contexto || undefined,
        tecnologias: (current.tecnologias || []).map((t: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          value: t
        }))
      };
    }
    
    return {
      titulo: '',
      descripcion: '',
      tipo: 'DESARROLLO_SOFTWARE',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'EN_DESARROLLO',
      url_repositorio: '',
      url_demo: '',
      contexto: undefined,
      tecnologias: [],
    };
  }, [currentData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ProjectFormValues>({
    defaultValues: getDefaultValues(),
  });

  void useFieldArray({
    control,
    name: 'tecnologias' as const,
  });

  const estado = watch('estado');

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues());
    } else {
      // Resetear el formulario cuando se cierra el modal para limpiar los campos
      reset(getDefaultValues());
    }
  }, [isOpen, currentData, reset, getDefaultValues]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setLoading(true);

      // Crear el payload con los datos del formulario
      const payload: ProyectoInput = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipo: data.tipo,
        fecha_inicio: `${data.fecha_inicio}T00:00:00.000Z`,
        fecha_fin: data.fecha_fin && data.estado !== 'EN_DESARROLLO' ? `${data.fecha_fin}T00:00:00.000Z` : null,
        estado: data.estado,
        url_repositorio: data.url_repositorio || undefined,
        url_demo: data.url_demo || undefined,
        contexto: data.contexto,
        // Convertir el array de objetos TecnologiaField a un array de strings
        tecnologias: data.tecnologias.map(t => t.value).filter(Boolean),
      };
      await onSave(payload);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentData ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      size="lg"
      footer={
        <>
          <MinimalButton variant="ghost" onClick={handleClose} disabled={loading}>
            Cancelar
          </MinimalButton>
          <MinimalButton onClick={handleFormSubmit} loading={loading}>
            Guardar
          </MinimalButton>
        </>
      }
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Título */}
        <MinimalInput
          label="Título del Proyecto"
          {...register('titulo', { required: 'El título es requerido' })}
          error={errors.titulo?.message}
          placeholder="Ej: Sistema de Gestión Empresarial"
          required
        />

        {/* Tipo y Contexto */}
        <div className="grid grid-cols-2 gap-4">
          <MinimalSelect
            label="Tipo de Proyecto"
            {...register('tipo', { required: 'El tipo es requerido' })}
            error={errors.tipo?.message}
            options={TIPO_PROYECTO_OPTIONS}
            required
          />

          <MinimalSelect
            label="Contexto"
            {...register('contexto')}
            error={errors.contexto?.message}
            options={CONTEXTO_PROYECTO_OPTIONS}
          />
        </div>

        {/* Descripción */}
        <MinimalTextarea
          label="Descripción"
          {...register('descripcion', { required: 'La descripción es requerida' })}
          error={errors.descripcion?.message}
          placeholder="Describe brevemente el proyecto, su objetivo y principales funcionalidades..."
          rows={4}
          required
        />

        {/* Estado */}
        <MinimalSelect
          label="Estado del Proyecto"
          {...register('estado', { required: 'El estado es requerido' })}
          error={errors.estado?.message}
          options={ESTADO_PROYECTO_OPTIONS}
          required
        />

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <MinimalInput
            label="Fecha de Inicio"
            type="date"
            {...register('fecha_inicio', { required: 'La fecha de inicio es requerida' })}
            error={errors.fecha_inicio?.message}
            required
          />

          <MinimalInput
            label="Fecha de Finalización"
            type="date"
            {...register('fecha_fin')}
            error={errors.fecha_fin?.message}
            disabled={estado === 'EN_DESARROLLO'}
            helperText={estado === 'EN_DESARROLLO' ? 'Proyecto en desarrollo activo' : undefined}
          />
        </div>

        {/* URLs */}
        <MinimalInput
          label="URL del Repositorio (GitHub, GitLab, etc.)"
          {...register('url_repositorio')}
          error={errors.url_repositorio?.message}
          placeholder="https://github.com/usuario/proyecto"
        />

        <MinimalInput
          label="URL de Demo/Producción"
          {...register('url_demo')}
          error={errors.url_demo?.message}
          placeholder="https://mi-proyecto.com"
        />

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          💡 <strong>Tip:</strong> Asegúrate de incluir enlaces a tu repositorio y demo para que los
          reclutadores puedan ver tu trabajo en acción.
        </div>
      </form>
    </MinimalModal>
  );
}
