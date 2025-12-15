'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Plus,
  X,
  Send,
  FileText,
  Briefcase,
  HelpCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

import { api } from '@/lib/api';
import { API_ENDPOINTS, WORK_MODALITY, OFFER_TYPES, DURACION_CONTRATO } from '@/constants';
import LocationSelector from '@/components/ui/LocationSelector';

// Schema de validación actualizado
const CreateOfferSchema = z.object({
  titulo: z.string()
    .min(15, "El título debe describir claramente el puesto (mínimo 15 caracteres)")
    .max(100, "El título no puede exceder 100 caracteres"),

  descripcion: z.string()
    .min(50, "Describe detalladamente las responsabilidades y requisitos (mínimo 50 caracteres)")
    .max(2000, "La descripción no puede exceder 2000 caracteres"),

  ubicacion: z.string()
    .min(2, "Especifica la ubicación")
    .max(100, "Ubicación demasiado larga"),

  modalidad: z.string()
    .refine(
      (val): val is string =>
        Object.values(WORK_MODALITY).includes(val as keyof typeof WORK_MODALITY),
      { message: "Selecciona una modalidad de trabajo válida" }
    ),

  tipoEmpleo: z.string()
    .refine(
      (val): val is string =>
        Object.values(OFFER_TYPES).includes(val as keyof typeof OFFER_TYPES),
      { message: "Selecciona un tipo de empleo válido" }
    ),

  nivelEducacion: z.string()
    .refine(
      (val) => ['PRACTICANTE', 'PASANTE', 'EGRESADO'].includes(val),
      { message: "Selecciona un nivel de educación" }
    ),

  experiencia: z.string()
    .refine(
      (val) => ['SIN_EXPERIENCIA', 'JUNIOR', 'SEMI_SENIOR', 'SENIOR'].includes(val),
      { message: "Selecciona un nivel de experiencia" }
    ),

  fechaLimite: z.string()
    .refine((val) => {
      const date = new Date(val);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      return !isNaN(date.getTime()) && date > minDate;
    }, { message: "Selecciona una fecha al menos 7 días en el futuro" }),

  requiereCV: z.boolean(),
  requiereCarta: z.boolean()
});

type CreateOfferFormData = z.infer<typeof CreateOfferSchema>;

interface Pregunta {
  pregunta: string;
  tipo: 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'EMAIL' | 'URL';
  obligatoria: boolean;
  opciones?: string[];
}

interface ApiResponseError extends Error {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: Array<{ msg?: string; message?: string }>;
    };
  };
}

export default function CreateOfferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [requisitos, setRequisitos] = useState<string[]>([]);
  const [currentRequisito, setCurrentRequisito] = useState('');
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    setCurrentDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
  }, []);

  // Valores por defecto del formulario
  const defaultValues: CreateOfferFormData = {
    titulo: '',
    descripcion: '',
    ubicacion: '',
    modalidad: 'PRESENCIAL',
    tipoEmpleo: 'TIEMPO_COMPLETO',
    nivelEducacion: 'EGRESADO',
    experiencia: 'SIN_EXPERIENCIA',
    fechaLimite: currentDateTime,
    requiereCV: true,
    requiereCarta: false
  };

  const form = useForm<CreateOfferFormData>({
    resolver: zodResolver(CreateOfferSchema),
    mode: 'onSubmit',
    defaultValues
  });

  const { register, handleSubmit, control, formState: { errors } } = form;

  const addRequisito = () => {
    if (currentRequisito.trim() && requisitos.length < 10) {
      setRequisitos([...requisitos, currentRequisito.trim()]);
      setCurrentRequisito('');
    }
  };

  const removeRequisito = (index: number) => {
    setRequisitos(requisitos.filter((_, i) => i !== index));
  };

  const addPregunta = () => {
    if (preguntas.length < 5) {
      setPreguntas([
        ...preguntas,
        {
          pregunta: '',
          tipo: 'TEXT',
          obligatoria: false
        }
      ]);
    }
  };

  const updatePregunta = (index: number, updates: Partial<Pregunta>) => {
    const newPreguntas = [...preguntas];
    newPreguntas[index] = { ...newPreguntas[index], ...updates };
    setPreguntas(newPreguntas);
  };

  const removePregunta = (index: number) => {
    setPreguntas(preguntas.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<CreateOfferFormData> = async (data: CreateOfferFormData) => {
    setIsSubmitting(true);

    try {
      const preparedPreguntas = preguntas
        .filter(pregunta => pregunta.pregunta.trim() !== '')
        .map(pregunta => {
          if (pregunta.tipo === 'SELECT') {
            return {
              ...pregunta,
              opciones: pregunta.opciones?.filter(opt => opt.trim() !== '') || []
            } as Pregunta;
          }
          return {
            ...pregunta,
            opciones: undefined
          } as Pregunta;
        });

      const payload = {
        ...data,
        estado: 'PUBLICADA',
        duracion: DURACION_CONTRATO.INDETERMINADO,
        requisitos,
        preguntas: preparedPreguntas,
        moneda: 'USD',
        fechaLimite: new Date(data.fechaLimite).toISOString()
      };

      const response = await api.post(API_ENDPOINTS.OFFERS.CREATE, payload);

      if (response.success) {
        toast.success('Oferta creada exitosamente');
        router.push('/dashboard/empresa/offers/my-offers');
      } else {
        toast.error(response.message || 'Error al crear la oferta');
      }
    } catch (error: unknown) {
      console.error('Error al crear oferta:', error);

      const apiError = error as ApiResponseError;

      if (apiError.response) {
        const { status, data } = apiError.response;

        switch (status) {
          case 401:
            toast.error('No estás autenticado. Por favor, inicia sesión.');
            router.push('/auth/login');
            break;
          case 403:
            toast.error('No tienes permisos para crear ofertas.');
            break;
          case 400:
            if (data?.errors && Array.isArray(data.errors)) {
              data.errors.forEach((err: { msg?: string; message?: string }) => {
                toast.error(err.msg || err.message || 'Error en los datos enviados');
              });
            } else {
              toast.error(data?.message || 'Error en los datos enviados');
            }
            break;
          default:
            toast.error('Hubo un problema al crear la oferta.');
        }
      } else {
        toast.error('Error de conexión. Verifica tu conexión a internet.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 lg:p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Crear Nueva Oferta</h1>
            <p className="text-sm lg:text-base text-gray-600">
              Completa los detalles para publicar una nueva oportunidad laboral
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Información Básica</h2>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Título de la Oferta
              <span className="text-red-500 ml-1">*</span>
              <div className="ml-2 group relative">
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-6 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-64 z-10">
                  Un título claro y descriptivo ayuda a atraer candidatos. Incluye el puesto y tecnologías principales.
                </div>
              </div>
            </label>
            <input
              {...register('titulo')}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${errors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej. Desarrollador Full Stack React con experiencia en Node.js"
            />
            {errors.titulo && <p className="text-red-500 text-xs lg:text-sm">{errors.titulo.message}</p>}
            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
              <Lightbulb className="w-4 h-4" />
              <span>Sé específico, incluye tecnologías o responsabilidades clave</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Descripción del Puesto
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              {...register('descripcion')}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm lg:text-base ${errors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
              rows={6}
              placeholder="Describe en detalle las responsabilidades, tecnologías que se usarán, el contexto del proyecto y lo que buscas en un candidato..."
            />
            {errors.descripcion && <p className="text-red-500 text-xs lg:text-sm">{errors.descripcion.message}</p>}
            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
              <Lightbulb className="w-4 h-4" />
              <span>Incluye contexto del proyecto, tecnologías, responsabilidades e impacto del rol</span>
            </div>
          </div>

          {/* Ubicación */}
          <Controller
            name="ubicacion"
            control={control}
            render={({ field }) => (
              <LocationSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.ubicacion?.message}
              />
            )}
          />
        </div>

        {/* Detalles del Empleo */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <Briefcase className="w-5 h-5 text-green-600" />
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Detalles del Empleo</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Modalidad */}
            <div className="space-y-2">
              <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Modalidad de Trabajo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('modalidad')}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base ${errors.modalidad ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Selecciona modalidad</option>
                  {Object.values(WORK_MODALITY).map(modalidad => (
                    <option key={modalidad} value={modalidad}>{modalidad}</option>
                  ))}
                </select>
              </div>
              {errors.modalidad && <p className="text-red-500 text-xs lg:text-sm">{errors.modalidad.message}</p>}
            </div>

            {/* Tipo de Empleo */}
            <div className="space-y-2">
              <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Tipo de Empleo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('tipoEmpleo')}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base ${errors.tipoEmpleo ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Selecciona tipo</option>
                  {Object.values(OFFER_TYPES).map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              {errors.tipoEmpleo && <p className="text-red-500 text-xs lg:text-sm">{errors.tipoEmpleo.message}</p>}
            </div>

            {/* Nivel de Educación */}
            <div className="space-y-2">
              <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                Nivel de Educación
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('nivelEducacion')}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base ${errors.nivelEducacion ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Selecciona nivel</option>
                  <option value="PRACTICANTE">Practicante</option>
                  <option value="PASANTE">Pasante</option>
                  <option value="EGRESADO">Egresado</option>
                </select>
              </div>
              {errors.nivelEducacion && <p className="text-red-500 text-xs lg:text-sm">{errors.nivelEducacion.message}</p>}
            </div>

            {/* Experiencia */}
            <div className="space-y-2">
              <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                Experiencia Requerida
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('experiencia')}
                  className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base ${errors.experiencia ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Selecciona experiencia</option>
                  <option value="SIN_EXPERIENCIA">Sin Experiencia</option>
                  <option value="JUNIOR">Junior (0-2 años)</option>
                  <option value="SEMI_SENIOR">Semi Senior (2-5 años)</option>
                  <option value="SENIOR">Senior (5+ años)</option>
                </select>
              </div>
              {errors.experiencia && <p className="text-red-500 text-xs lg:text-sm">{errors.experiencia.message}</p>}
            </div>
          </div>

          {/* Fecha Límite */}
          <div className="space-y-2">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Fecha Límite de Postulación
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('fechaLimite')}
              min={currentDateTime}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${errors.fechaLimite ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.fechaLimite && <p className="text-red-500 text-xs lg:text-sm">{errors.fechaLimite.message}</p>}
          </div>
        </div>

        {/* Requisitos de Documentos */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <FileText className="w-5 h-5 text-orange-600" />
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Requisitos de Documentos</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                {...register('requiereCV')}
                className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <label className="text-sm lg:text-base font-medium text-gray-900 cursor-pointer">
                  Solicitar CV obligatorio
                </label>
                <p className="text-xs lg:text-sm text-gray-600">Los candidatos deberán subir su currículum</p>
              </div>
            </div>

            <div className="flex items-center p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                {...register('requiereCarta')}
                className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <label className="text-sm lg:text-base font-medium text-gray-900 cursor-pointer">
                  Solicitar carta de presentación
                </label>
                <p className="text-xs lg:text-sm text-gray-600">Los candidatos deberán incluir una carta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requisitos */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-base lg:text-lg font-semibold text-gray-900">Requisitos Específicos</h2>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentRequisito}
                onChange={(e) => setCurrentRequisito(e.target.value)}
                className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                placeholder="Ej. Conocimiento en React y Node.js (mínimo 5 caracteres)"
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                onKeyUp={(e) => e.key === 'Enter' && addRequisito()}
              />
              <button
                type="button"
                onClick={addRequisito}
                disabled={currentRequisito.trim().length < 5 || requisitos.length >= 10}
                className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {requisitos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Requisitos añadidos ({requisitos.length}/10):</p>
                {requisitos.map((req, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm lg:text-base text-gray-700 flex-1">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequisito(index)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
              <Lightbulb className="w-4 h-4" />
              <span>Sé específico sobre habilidades técnicas, experiencia y competencias blandas</span>
            </div>
          </div>
        </div>

        {/* Preguntas Personalizadas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">Preguntas de Filtrado</h2>
                <p className="text-sm text-gray-500">Añade preguntas clave para identificar a los mejores candidatos</p>
              </div>
            </div>
            <button
              type="button"
              onClick={addPregunta}
              disabled={preguntas.length >= 5}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Añadir pregunta
            </button>
          </div>

          {preguntas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <HelpCircle className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Sin preguntas adicionales</h3>
              <p className="text-sm text-gray-500 mt-1">
                Recomendamos añadir al menos 2 preguntas para filtrar mejor a los candidatos.
              </p>
              <button
                type="button"
                onClick={addPregunta}
                className="mt-4 text-sm text-blue-600 font-medium hover:underline"
              >
                + Añadir primera pregunta
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {preguntas.map((pregunta, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group">
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removePregunta(index)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 pr-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pregunta {index + 1}
                      </label>
                      <input
                        type="text"
                        value={pregunta.pregunta}
                        onChange={(e) => updatePregunta(index, { pregunta: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Ej. ¿Cuántos años de experiencia tienes con React?"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de respuesta
                        </label>
                        <select
                          value={pregunta.tipo}
                          onChange={(e) => updatePregunta(index, { tipo: e.target.value as Pregunta['tipo'] })}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="TEXT">Texto corto</option>
                          <option value="TEXTAREA">Párrafo</option>
                          <option value="NUMBER">Numérico</option>
                          <option value="SELECT">Opción múltiple</option>
                          <option value="EMAIL">Email</option>
                          <option value="URL">Enlace/URL</option>
                        </select>
                      </div>

                      <div className="flex items-center h-full pt-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pregunta.obligatoria}
                            onChange={(e) => updatePregunta(index, { obligatoria: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Respuesta obligatoria</span>
                        </label>
                      </div>
                    </div>

                    {pregunta.tipo === 'SELECT' && (
                      <div className="bg-white p-3 rounded border border-gray-200 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Opciones de respuesta
                        </label>
                        {pregunta.opciones?.map((opcion, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={opcion}
                              onChange={(e) => {
                                const newOpciones = [...(pregunta.opciones || [])];
                                newOpciones[optIndex] = e.target.value;
                                updatePregunta(index, { opciones: newOpciones });
                              }}
                              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm"
                              placeholder={`Opción ${optIndex + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newOpciones = pregunta.opciones?.filter((_, i) => i !== optIndex);
                                updatePregunta(index, { opciones: newOpciones });
                              }}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newOpciones = [...(pregunta.opciones || []), ''];
                            updatePregunta(index, { opciones: newOpciones });
                          }}
                          className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Añadir opción
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 lg:px-8 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base font-medium shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Publicar Oferta</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}