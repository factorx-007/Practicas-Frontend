import { z } from 'zod';
import { OFFER_TYPES, WORK_MODALITY } from '@/constants';

const PreguntaValidacionSchema = z.object({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(0).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  puntajeRespuestaCorrecta: z.number().min(0).max(10).optional(),
  respuestasCorrectas: z.array(z.string()).optional(),
  criterioEvaluacion: z.enum([
    'EXACTO', 
    'CONTIENE', 
    'MAYOR_QUE', 
    'MENOR_QUE', 
    'RANGO', 
    'REGEX'
  ]).optional()
});

const PreguntaSchema = z.object({
  pregunta: z.string().min(3, "La pregunta debe tener al menos 3 caracteres"),
  tipo: z.enum(['TEXT', 'NUMBER', 'SELECT', 'TEXTAREA', 'EMAIL', 'URL', 'MULTIPLE_SELECT']),
  requerida: z.boolean().default(true),
  descripcion: z.string().optional(),
  opciones: z.array(z.string()).min(1, "Debe haber al menos una opción").optional(), 
  validacion: PreguntaValidacionSchema.optional(),
  pesoEvaluacion: z.number().min(0).max(10).optional(),
  categoriaHabilidad: z.enum([
    'TECNICO', 
    'COMUNICACION', 
    'RESOLUCION_PROBLEMAS', 
    'TRABAJO_EQUIPO', 
    'LIDERAZGO', 
    'CREATIVIDAD', 
    'OTRO'
  ]).optional()
}).superRefine((data, ctx) => {
  if ((data.tipo === 'SELECT' || data.tipo === 'MULTIPLE_SELECT') && (!data.opciones || data.opciones.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Las preguntas de tipo 'SELECT' o 'MULTIPLE_SELECT' deben tener al menos una opción",
      path: ['opciones'],
    });
  }
  if (data.tipo === 'EMAIL' && data.validacion?.pattern && !/^\S+@\S+\.\S+$/.test(data.validacion.pattern)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El patrón de validación para EMAIL debe ser un regex de email válido",
      path: ['validacion.pattern'],
    });
  }
  if (data.tipo === 'URL' && data.validacion?.pattern && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(data.validacion.pattern)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El patrón de validación para URL debe ser un regex de URL válido",
      path: ['validacion.pattern'],
    });
  }
});

export const createOfferSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  descripcion: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  requisitos: z.array(z.string()).optional(),
  duracion: z.string().optional(),
  estado: z.enum(['BORRADOR', 'PUBLICADA']).default('PUBLICADA'),
  ubicacion: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  modalidad: z.nativeEnum(WORK_MODALITY),
  tipoEmpleo: z.nativeEnum(OFFER_TYPES),
  nivelEducacion: z.enum(['SECUNDARIO', 'TECNICO', 'UNIVERSITARIO', 'POSTGRADO']),
  experiencia: z.enum(['JUNIOR', 'SEMI_SENIOR', 'SENIOR', 'EXPERTO']),
  salarioMin: z.number().min(0, "El salario mínimo debe ser mayor o igual a 0").optional().nullable(),
  salarioMax: z.number().min(0, "El salario máximo debe ser mayor o igual a 0").optional().nullable(),
  moneda: z.string().default('USD'),
  requiereCV: z.boolean().default(true),
  requiereCarta: z.boolean().default(false),
  fechaLimite: z.string().datetime(),
  preguntas: z.array(PreguntaSchema).optional()
}).refine(data => (
  (data.salarioMax === undefined || data.salarioMax === null) || 
  (data.salarioMin === undefined || data.salarioMin === null) || 
  (data.salarioMax >= data.salarioMin)
), {
  message: "El salario máximo debe ser mayor o igual al salario mínimo",
  path: ["salarioMax"]
});

// Extender el esquema para la validación del formulario temporal
export const createOfferFormCombinedSchema = createOfferSchema.merge(
  z.object({
    fechaLimiteDate: z.string().min(1, "La fecha límite es requerida"),
    fechaLimiteTime: z.string().min(1, "La hora límite es requerida"),
  })
);

// Schema de registro
export const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(30, "El nombre no puede tener más de 50 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres").max(30, "El apellido no puede tener más de 50 caracteres"),
  email: z.string().email("Debe ser un email válido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/^(?=.*[a-z])/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/^(?=.*[A-Z])/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/^(?=.*\d)/, "La contraseña debe contener al menos un número"),
  confirmPassword: z.string(),
  rol: z.enum(['ESTUDIANTE', 'EMPRESA', 'INSTITUCION']),
  // Campos opcionales por rol
  nombreEmpresa: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres").optional(),
  nombreInstitucion: z.string().min(2, "El nombre de la institución debe tener al menos 2 caracteres").optional(),
  universidad: z.string().optional(),
  carrera: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
}).refine(data => {
  // Validar que si el rol es EMPRESA, nombreEmpresa es requerido
  if (data.rol === 'EMPRESA' && !data.nombreEmpresa) {
    return false;
  }
  return true;
}, {
  message: "El nombre de la empresa es requerido",
  path: ["nombreEmpresa"]
}).refine(data => {
  // Validar que si el rol es INSTITUCION, nombreInstitucion es requerido
  if (data.rol === 'INSTITUCION' && !data.nombreInstitucion) {
    return false;
  }
  return true;
}, {
  message: "El nombre de la institución es requerido",
  path: ["nombreInstitucion"]
});

// Schema de login
export const loginSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().default(false)
});

export type CreateOfferFormData = z.infer<typeof createOfferSchema>;
export type PreguntaFormData = z.infer<typeof PreguntaSchema>;
export type PreguntaValidacionFormData = z.infer<typeof PreguntaValidacionSchema>;
export type OfferFormCombinedData = z.infer<typeof createOfferFormCombinedSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;