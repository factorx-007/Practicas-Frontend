'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FieldValues } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalSelect from '@/components/ui/MinimalSelect';
import MinimalButton from '@/components/ui/MinimalButton';
import {
  EducacionAcademicaInput,
  TIPO_INSTITUCION_LABELS,
  NIVEL_ACADEMICO_LABELS,
  SISTEMA_NOTAS_LABELS,
} from '@/types/profile.types';
import { EducacionAcademica } from '@/types/user';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EducacionAcademicaInput) => Promise<void>;
  currentData?: EducacionAcademica | null;
}

// Definir el tipo para los cursos destacados
interface CursoDestacado {
  id: string;
  value: string;
}

// Tipo para el formulario
type EducationFormValues = Omit<EducacionAcademicaInput, 'cursos_destacados'> & {
  cursos_destacados: CursoDestacado[];
};

export default function EducationModal({
  isOpen,
  onClose,
  onSave,
  currentData,
}: EducationModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm<EducationFormValues>({
    defaultValues: {
      institucion: '',
      tipo_institucion: 'UNIVERSIDAD',
      titulo: '',
      campo_estudio: '',
      nivel_academico: 'LICENCIATURA',
      fecha_inicio: '',
      fecha_fin: '',
      en_curso: false,
      promedio: undefined,
      sistema_notas: 'VIGESIMAL',
      cursos_destacados: [],
    },
  });

  // Inicializar valores del formulario cuando cambia currentData
  useEffect(() => {
    if (currentData) {
      // Asegurarse de que los campos opcionales tengan valores por defecto
      const formData: Partial<EducationFormValues> = {
        ...currentData,
        fecha_inicio: currentData.fecha_inicio?.split('T')[0] || '',
        fecha_fin: currentData.fecha_fin?.split('T')[0] || '',
        campo_estudio: currentData.campo_estudio || '',
        promedio: currentData.promedio || undefined,
        cursos_destacados: (currentData.cursos_destacados || []).map(c => ({
          id: Math.random().toString(36).substr(2, 9),
          value: c
        }))
      };
      reset(formData as EducationFormValues);
    } else {
      reset({
        institucion: '',
        tipo_institucion: 'UNIVERSIDAD',
        titulo: '',
        campo_estudio: '',
        nivel_academico: 'LICENCIATURA',
        fecha_inicio: '',
        fecha_fin: '',
        en_curso: false,
        promedio: undefined,
        sistema_notas: 'VIGESIMAL',
        cursos_destacados: [],
      });
    }
  }, [currentData, reset]);

  // Inicializar useFieldArray para manejar la lista de cursos
  const {
    fields: cursosFields,
    append: appendCurso,
    remove: removeCurso,
  } = useFieldArray({
    control,
    name: 'cursos_destacados',
  });

  const enCurso = watch('en_curso');

  const onSubmit = async (data: FieldValues) => {
    const formData = data as EducationFormValues;
    try {
      setLoading(true);
      const formattedData: EducacionAcademicaInput = {
        ...formData,
        fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
        fecha_fin: formData.fecha_fin && !formData.en_curso 
          ? new Date(formData.fecha_fin).toISOString() 
          : null,
        cursos_destacados: formData.cursos_destacados
          .map((c: CursoDestacado) => c.value.trim())
          .filter(Boolean)
      };
      await onSave(formattedData);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving education:', error);
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
      title={currentData ? 'Editar Educación' : 'Nueva Educación'}
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
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }} className="space-y-5">
        {/* Institución */}
        <MinimalInput
          label="Institución"
          {...register('institucion', { required: 'La institución es requerida' })}
          error={errors.institucion?.message}
          placeholder="Ej: Universidad Nacional Mayor de San Marcos"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tipo de Institución */}
          <MinimalSelect
            label="Tipo de Institución"
            {...register('tipo_institucion', { required: 'El tipo es requerido' })}
            options={Object.entries(TIPO_INSTITUCION_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            error={errors.tipo_institucion?.message}
            required
          />

          {/* Nivel Académico */}
          <MinimalSelect
            label="Nivel Académico"
            {...register('nivel_academico', { required: 'El nivel es requerido' })}
            options={Object.entries(NIVEL_ACADEMICO_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            error={errors.nivel_academico?.message}
            required
          />
        </div>

        {/* Título */}
        <MinimalInput
          label="Título o Carrera"
          {...register('titulo', { required: 'El título es requerido' })}
          error={errors.titulo?.message}
          placeholder="Ej: Ingeniería de Sistemas"
          required
        />

        {/* Campo de Estudio */}
        <MinimalInput
          label="Campo de Estudio"
          {...register('campo_estudio')}
          error={errors.campo_estudio?.message}
          placeholder="Ej: Ciencias de la Computación"
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
            label="Fecha de Graduación"
            type="date"
            {...register('fecha_fin')}
            error={errors.fecha_fin?.message}
            disabled={enCurso}
          />
        </div>

        {/* En Curso */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('en_curso')}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700">Actualmente estudio aquí</span>
        </label>

        {/* Promedio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MinimalSelect
            label="Sistema de Notas"
            {...register('sistema_notas')}
            options={[
              'VIGESIMAL',
              'ALFABETICO',
              'NUMERICO_100',
              'GPA',
              'OTRO',
            ].map((value) => ({ value, label: SISTEMA_NOTAS_LABELS[value as keyof typeof SISTEMA_NOTAS_LABELS] }))}
          />

          <MinimalInput
            label="Promedio"
            type="number"
            step="0.01"
            {...register('promedio', { valueAsNumber: true })}
            error={errors.promedio?.message}
            placeholder="Ej: 16.5"
          />
        </div>

        {/* Cursos Destacados */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cursos Destacados (Opcional)
          </label>
          <div className="space-y-2">
            {cursosFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <MinimalInput
                  {...register(`cursos_destacados.${index}.value` as const)}
                  placeholder="Ej: Algoritmos y Estructuras de Datos"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeCurso(index)}
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
              onClick={() => appendCurso({ 
                id: Math.random().toString(36).substr(2, 9), 
                value: '' 
              })}
              icon={<Plus className="w-4 h-4" />}
            >
              Agregar Curso
            </MinimalButton>
          </div>
        </div>
      </form>
    </MinimalModal>
  );
}
