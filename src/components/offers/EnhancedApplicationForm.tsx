'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  X,
  Send,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';

// Tipos para la oferta (basados en estructura real del backend)
interface OfferQuestion {
  id?: string;
  pregunta?: string;
  tipo?: 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'EMAIL' | 'URL';
  obligatoria?: boolean;
  opciones?: string[];
}

interface Offer {
  id: string;
  titulo?: string;
  descripcion?: string;
  requiereCV?: boolean;
  requiereCarta?: boolean;
  preguntas?: OfferQuestion[];
  empresa?: {
    nombre_empresa?: string;
  };
}

// Schema factory para validación dinámica
const createApplicationSchema = (offer: Offer) => z.object({
  // Documentos
  cvFile: z.any().optional(),
  cvUrl: z.string().url({ message: "URL de CV inválida" }).optional()
    .refine((val) => !offer.requiereCV || (val && val.length > 0), {
      message: "El CV es obligatorio para esta oferta"
    }),

  // Contenido principal
  mensajePresentacion: z.string()
    .max(1000, { message: "El mensaje no puede superar 1000 caracteres" })
    .refine((val) => !offer.requiereCarta || (val && val.length >= 50), {
      message: "La carta de presentación es obligatoria (mínimo 50 caracteres)"
    }),

  // Campos opcionales
  portfolioUrl: z.string().url({ message: "URL de portfolio inválida" }).optional().or(z.literal("")),
  motivacion: z.string()
    .max(500, { message: "La motivación no puede superar 500 caracteres" })
    .optional().or(z.literal("")),

  // Campo obligatorio
  disponibilidad: z.string()
    .min(10, { message: "Especifica cuándo podrías empezar (mínimo 10 caracteres)" })
    .max(200, { message: "La disponibilidad no puede superar 200 caracteres" }),

  // Respuestas a preguntas personalizadas
  respuestasPersonalizadas: z.array(
    z.object({
      preguntaId: z.string(),
      respuesta: z.string().min(1, { message: "Esta respuesta es obligatoria" })
    })
  ).optional()
});

type EnhancedApplicationFormData = z.infer<ReturnType<typeof createApplicationSchema>>;

interface Props {
  offer: Offer;
  onSubmit: (data: unknown) => Promise<void>;
  onCancel?: () => void;
}

export default function EnhancedApplicationForm({ offer, onSubmit, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const schema = createApplicationSchema(offer);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<EnhancedApplicationFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      mensajePresentacion: '',
      portfolioUrl: '',
      motivacion: '',
      disponibilidad: '',
      respuestasPersonalizadas: offer.preguntas?.map(q => ({
        preguntaId: q.id || '',
        respuesta: ''
      })) || []
    }
  });

  // Removed unused fields variable
  useFieldArray({
    control,
    name: 'respuestasPersonalizadas'
  });

  // Upload de archivos
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Solo se permiten archivos PDF o Word');
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo no puede superar 10MB');
        return;
      }

      // Upload al Backend
      const response = await api.uploadFile<{ cvUrl: string }>(
        API_ENDPOINTS.USERS.UPLOAD_CV,
        file,
        'cv'
      );

      if (response.success && response.data) {
        setValue('cvUrl', response.data.cvUrl);
        setUploadedFiles([file]);
        toast.success('Archivo subido exitosamente');
      } else {
        throw new Error(response.message || 'Error al subir archivo');
      }

    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error uploading file:', err);
      toast.error(err.message || 'Error al subir el archivo');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = () => {
    setUploadedFiles([]);
    setValue('cvUrl', '');
  };

  const handleFormSubmit = async (data: EnhancedApplicationFormData) => {
    // Prevenir múltiples envíos
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Validar CV obligatorio - Ya manejado por el schema


      // Preparar datos para el backend
      const applicationData = {
        mensaje: data.mensajePresentacion,
        ...(data.cvUrl && { cvUrl: data.cvUrl }),
        ...(data.portfolioUrl && { portfolioUrl: data.portfolioUrl }),
        ...(data.motivacion && { motivacion: data.motivacion }),
        disponibilidad: data.disponibilidad,
        ...(data.respuestasPersonalizadas && data.respuestasPersonalizadas.length > 0 && {
          respuestas: data.respuestasPersonalizadas.filter(r => r.respuesta.trim() !== '')
        })
      };

      await onSubmit(applicationData);

    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = (question: OfferQuestion, index: number) => {
    const error = errors.respuestasPersonalizadas?.[index]?.respuesta;

    switch (question.tipo) {
      case 'TEXT':
        return (
          <input
            type="text"
            {...register(`respuestasPersonalizadas.${index}.respuesta`)}
            placeholder="Tu respuesta..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            {...register(`respuestasPersonalizadas.${index}.respuesta`)}
            placeholder="Tu respuesta detallada..."
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          />
        );

      case 'NUMBER':
        return (
          <input
            type="number"
            {...register(`respuestasPersonalizadas.${index}.respuesta`)}
            placeholder="Número..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          />
        );

      case 'SELECT':
        return (
          <select
            {...register(`respuestasPersonalizadas.${index}.respuesta`)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Selecciona una opción</option>
            {question.opciones?.map((opcion, optIndex) => (
              <option key={optIndex} value={opcion}>{opcion}</option>
            ))}
          </select>
        );

      case 'EMAIL':
        return (
          <input
            type="email"
            {...register(`respuestasPersonalizadas.${index}.respuesta`)}
            placeholder="correo@ejemplo.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          />
        );

      case 'URL':
        return (
          <input
            type="url"
            {...register(`respuestasPersonalizadas.${index}.respuesta`)}
            placeholder="https://ejemplo.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
              }`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Postúlate a esta Oferta</h2>
        <p className="text-blue-100">
          {offer.titulo} en {offer.empresa?.nombre_empresa}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6">

        {/* CV Upload - Solo si es obligatorio */}
        {offer.requiereCV && (
          <div className="space-y-2 lg:space-y-3">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Curriculum Vitae
              <span className="text-red-500 ml-1">*</span>
            </label>

            {uploadedFiles.length === 0 ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 lg:p-6 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 lg:w-10 h-8 lg:h-10 mx-auto text-gray-400 mb-2 lg:mb-3" />
                <p className="text-gray-600 mb-1 lg:mb-2 text-sm lg:text-base">
                  {isDragActive
                    ? 'Suelta el archivo aquí...'
                    : 'Arrastra tu CV o haz clic'
                  }
                </p>
                <p className="text-xs lg:text-sm text-gray-500">
                  PDF, DOC, DOCX (máx. 10MB)
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-3 lg:p-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{uploadedFiles[0].name}</p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {(uploadedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 lg:p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                  >
                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Layout de campos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Mensaje de Presentación */}
          <div className="lg:col-span-2 space-y-2 lg:space-y-3">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Mensaje de Presentación
              {offer.requiereCarta ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-500 text-xs ml-2">(Opcional)</span>}
            </label>
            <textarea
              {...register('mensajePresentacion')}
              placeholder="Comparte por qué eres el candidato ideal para esta posición. Menciona tu experiencia relevante, motivación y qué puedes aportar..."
              rows={4}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm lg:text-base ${errors.mensajePresentacion ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.mensajePresentacion && (
              <p className="text-red-500 text-xs lg:text-sm">{errors.mensajePresentacion.message}</p>
            )}
            <p className="text-xs lg:text-sm text-gray-500">
              {offer.requiereCarta ? 'Mínimo 50 caracteres, máximo 1000. Sé específico y profesional.' : 'Máximo 1000 caracteres.'}
            </p>
          </div>

          {/* Disponibilidad */}
          <div className="space-y-2 lg:space-y-3">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Disponibilidad
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              {...register('disponibilidad')}
              placeholder="Ej: Inmediato / 15 enero / 2 semanas"
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${errors.disponibilidad ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.disponibilidad && (
              <p className="text-red-500 text-xs lg:text-sm">{errors.disponibilidad.message}</p>
            )}
          </div>

          {/* Portfolio URL - Opcional */}
          <div className="space-y-2 lg:space-y-3">
            <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              Portfolio (Opcional)
            </label>
            <input
              type="url"
              {...register('portfolioUrl')}
              placeholder="https://tu-portfolio.com"
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base ${errors.portfolioUrl ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.portfolioUrl && (
              <p className="text-red-500 text-xs lg:text-sm">{errors.portfolioUrl.message}</p>
            )}
          </div>
        </div>

        {/* Motivación - Opcional */}
        <div className="space-y-2 lg:space-y-3">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            ¿Qué te motiva de esta oportunidad?
            <span className="text-gray-500 text-xs lg:text-sm ml-2">(Opcional)</span>
          </label>
          <textarea
            {...register('motivacion')}
            placeholder="Comparte qué te emociona de esta posición o empresa..."
            rows={3}
            className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-sm lg:text-base ${errors.motivacion ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.motivacion && (
            <p className="text-red-500 text-xs lg:text-sm">{errors.motivacion.message}</p>
          )}
        </div>

        {/* Preguntas Personalizadas */}
        {offer.preguntas && offer.preguntas.length > 0 && (
          <div className="space-y-4 lg:space-y-6">
            <div className="border-l-4 border-blue-500 pl-3 lg:pl-4">
              <h3 className="text-base lg:text-lg font-bold text-gray-900">
                Preguntas de la Empresa ({offer.preguntas.length})
              </h3>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">
                Responde estas preguntas específicas de {offer.empresa?.nombre_empresa || 'la empresa'}
              </p>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {offer.preguntas.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-3">
                  <label className="block text-sm lg:text-base font-medium text-gray-900">
                    <span className="text-xs lg:text-sm text-gray-500 font-medium">Pregunta {index + 1}:</span>
                    <br />
                    {question.pregunta}
                    {question.obligatoria && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {renderQuestionInput(question, index)}

                  {errors.respuestasPersonalizadas?.[index]?.respuesta && (
                    <p className="text-red-500 text-xs lg:text-sm">
                      {errors.respuestasPersonalizadas[index].respuesta.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base order-2 sm:order-1"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 lg:px-8 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base font-medium order-1 sm:order-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Enviar Postulación
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}