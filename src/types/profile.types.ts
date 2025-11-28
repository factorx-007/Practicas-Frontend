/**
 * Profile Types - Tipos para el sistema de perfiles de ProTalent
 * Estos tipos reflejan la estructura exacta del backend API
 */

import {
  DisponibilidadTipo,
  ModalidadTrabajo,
  TipoInstitucion,
  NivelAcademico,
  SistemaNotas,
  NivelDominio,
  TipoProyecto,
  EstadoProyecto,
  ContextoProyecto,
  TipoCertificacion,
  NivelIdioma
} from './localTypes';

// ===================================================
// TIPOS PARA PETICIONES DE ACTUALIZACIÓN (Request DTOs)
// ===================================================

/**
 * Estructura para crear o actualizar el Perfil Profesional
 */
export interface PerfilProfesionalInput {
  resumen: string;
  objetivo_carrera?: string;
  disponibilidad: DisponibilidadTipo;
  modalidad_trabajo: ModalidadTrabajo[];
  salario_minimo?: number;
  salario_maximo?: number;
  moneda?: string;
}

/**
 * Estructura para operaciones de upsert en Perfil Profesional
 */
export interface PerfilProfesionalUpsert {
  upsert: {
    create: PerfilProfesionalInput;
    update: Partial<PerfilProfesionalInput>;
  };
}

/**
 * Estructura para crear/editar Experiencia Laboral
 */
export interface ExperienciaLaboralInput {
  cargo: string;
  empresa: string;
  fecha_inicio: string; // ISO Date String
  fecha_fin?: string | null;
  es_actual: boolean;
  modalidad: ModalidadTrabajo;
  descripcion?: string;
  responsabilidades?: string[];
  logros?: string[];
}

/**
 * Estructura para operaciones CRUD en Experiencias
 */
export interface ExperienciaLaboralOperations {
  create?: ExperienciaLaboralInput[];
  update?: Array<{
    where: { id: string };
    data: Partial<ExperienciaLaboralInput>;
  }>;
  delete?: Array<{ id: string }>;
}

/**
 * Estructura para crear/editar Educación Académica
 */
export interface EducacionAcademicaInput {
  institucion: string;
  tipo_institucion: TipoInstitucion;
  titulo: string;
  campo_estudio?: string;
  nivel_academico: NivelAcademico;
  fecha_inicio: string; // ISO Date String
  fecha_fin?: string | null;
  en_curso: boolean;
  promedio?: number;
  sistema_notas: SistemaNotas;
  cursos_destacados?: string[];
}

/**
 * Estructura para operaciones CRUD en Educación
 */
export interface EducacionAcademicaOperations {
  create?: EducacionAcademicaInput[];
  update?: Array<{
    where: { id: string };
    data: Partial<EducacionAcademicaInput>;
  }>;
  delete?: Array<{ id: string }>;
}

/**
 * Estructura para crear/editar Habilidades
 */
export interface EstudianteHabilidadInput {
  habilidadId?: string; // ID de habilidad existente
  nivel: NivelDominio;
  anios_experiencia?: number;
  // Para crear nueva habilidad inline
  habilidad?: {
    nombre: string;
    categoria: string;
    tipo: string;
  };
}

/**
 * Estructura para operaciones CRUD en Habilidades
 */
export interface EstudianteHabilidadOperations {
  create?: EstudianteHabilidadInput[];
  update?: Array<{
    where: { id: string };
    data: Partial<EstudianteHabilidadInput>;
  }>;
  delete?: Array<{ id: string }>;
}

/**
 * Estructura para crear/editar Proyectos
 */
export interface ProyectoInput {
  titulo: string;
  descripcion: string;
  tipo: TipoProyecto;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: EstadoProyecto;
  url_repositorio?: string;
  url_demo?: string;
  contexto?: ContextoProyecto;
  imagenes?: string[];
  tecnologias?: string[];
}

/**
 * Estructura para operaciones CRUD en Proyectos
 */
export interface ProyectoOperations {
  create?: ProyectoInput[];
  update?: Array<{
    where: { id: string };
    data: Partial<ProyectoInput>;
  }>;
  delete?: Array<{ id: string }>;
}

/**
 * Estructura para crear/editar Certificaciones
 */
export interface CertificacionInput {
  titulo: string;
  emisor: string;
  tipo: TipoCertificacion;
  fecha_emision: string;
  fecha_expiracion?: string | null;
  credencial_id?: string;
  url_verificacion?: string;
}

/**
 * Estructura para operaciones CRUD en Certificaciones
 */
export interface CertificacionOperations {
  create?: CertificacionInput[];
  update?: Array<{
    where: { id: string };
    data: Partial<CertificacionInput>;
  }>;
  delete?: Array<{ id: string }>;
}

/**
 * Estructura para crear/editar Idiomas
 */
export interface EstudianteIdiomaInput {
  idiomaId?: string; // ID de idioma existente
  nivel_oral: NivelIdioma;
  nivel_escrito: NivelIdioma;
  nivel_lectura: NivelIdioma;
  // Para crear nuevo idioma inline
  idioma?: {
    nombre: string;
    codigo_iso: string;
  };
}

/**
 * Estructura para operaciones CRUD en Idiomas
 */
export interface EstudianteIdiomaOperations {
  create?: EstudianteIdiomaInput[];
  update?: Array<{
    where: { id: string };
    data: Partial<EstudianteIdiomaInput>;
  }>;
  delete?: Array<{ id: string }>;
}

/**
 * REQUEST DTO COMPLETO para actualizar perfil de estudiante
 * Este es el tipo que se envía al endpoint PUT /api/users/me/student
 */
export interface UpdateStudentProfileRequest {
  // Campos básicos del modelo Estudiante
  carrera?: string;
  universidad?: string;
  anio_ingreso?: number;
  anio_egreso?: number;
  telefono?: string;
  portafolio?: string;
  linkedin?: string;
  github?: string;
  ubicacion?: string;
  tipo?: string;

  // Relaciones con operaciones anidadas
  perfilProfesional?: PerfilProfesionalUpsert;
  experiencias?: ExperienciaLaboralOperations;
  educacion?: EducacionAcademicaOperations;
  proyectos?: ProyectoOperations;
  certificaciones?: CertificacionOperations;
  idiomas?: EstudianteIdiomaOperations;
  habilidadesNuevas?: EstudianteHabilidadOperations;
}

// ===================================================
// ENUMS Y CONSTANTES ÚTILES
// ===================================================

export const DISPONIBILIDAD_LABELS: Record<DisponibilidadTipo, string> = {
  INMEDIATA: 'Disponibilidad Inmediata',
  DOS_SEMANAS: 'En 2 semanas',
  UN_MES: 'En 1 mes',
  NEGOCIABLE: 'Negociable'
};

export const MODALIDAD_TRABAJO_LABELS: Record<ModalidadTrabajo, string> = {
  PRESENCIAL: 'Presencial',
  REMOTO: 'Remoto',
  HIBRIDO: 'Híbrido',
  TIEMPO_COMPLETO: 'Tiempo completo',
  MEDIO_TIEMPO: 'Medio tiempo',
  POR_HORAS: 'Por horas'
};

export const TIPO_INSTITUCION_LABELS: Record<TipoInstitucion, string> = {
  UNIVERSIDAD: 'Universidad',
  INSTITUTO: 'Instituto',
  COLEGIO: 'Colegio',
  CENTRO_TECNICO: 'Centro Técnico',
  ESCUELA_PROFESIONAL: 'Escuela Profesional'
};

export const NIVEL_ACADEMICO_LABELS: Record<NivelAcademico, string> = {
  BACHILLERATO: 'Bachillerato',
  TECNICO: 'Técnico',
  PREGRADO: 'Pregrado',
  LICENCIATURA: 'Licenciatura',
  MAESTRIA: 'Maestría',
  DOCTORADO: 'Doctorado',
  SECUNDARIA: 'Secundaria'
};

export const SISTEMA_NOTAS_LABELS: Record<SistemaNotas, string> = {
  VIGESIMAL: 'Vigesimal (0-20)',
  ALFABETICO: 'Alfabético (A-F)',
  NUMERICO_100: 'Numérico (0-100)',
  GPA: 'GPA (0-4)',
  '0_20': 'Escala 0-20',
  '0_100': 'Escala 0-100',
  'A_F': 'Letras A-F',
  OTRO: 'Otro sistema'
};

export const NIVEL_DOMINIO_LABELS: Record<NivelDominio, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
  EXPERTO: 'Experto',
};

export const TIPO_PROYECTO_LABELS: Record<TipoProyecto, string> = {
  DESARROLLO_SOFTWARE: 'Desarrollo de Software',
  DISEÑO: 'Diseño',
  INGENIERIA: 'Ingeniería',
  INVESTIGACION: 'Investigación',
  EMPRESARIAL: 'Empresarial',
  PERSONAL: 'Personal',
  ACADEMICO: 'Académico',
  LABORAL: 'Laboral',
  PROFESIONAL: 'Profesional',
  OTRO: 'Otro'
};

export const ESTADO_PROYECTO_LABELS: Record<EstadoProyecto, string> = {
  EN_PROGRESO: 'En Progreso',
  COMPLETADO: 'Completado',
  EN_DESARROLLO: 'En Desarrollo',
  PAUSADO: 'Pausado',
  CANCELADO: 'Cancelado',
  EN_PAUSA: 'En Pausa'
};

export const TIPO_CERTIFICACION_LABELS: Record<TipoCertificacion, string> = {
  PROFESIONAL: 'Profesional',
  CURSO_ONLINE: 'Curso en Línea',
  CERTIFICADO_ACADEMICO: 'Certificado Académico',
  CAPACITACION: 'Capacitación',
  CERTIFICACION_PROFESIONAL: 'Certificación Profesional',
  CURSO: 'Curso',
  DIPLOMADO: 'Diplomado',
  TALLER: 'Taller',
  TECNICA: 'Técnica',
  IDIOMAS: 'Idiomas',
  OTRO: 'Otro'
};

export const NIVEL_IDIOMA_LABELS: Record<NivelIdioma, string> = {
  A1_BASICO: 'A1 Básico',
  A2_ELEMENTAL: 'A2 Elemental',
  B1_INTERMEDIO: 'B1 Intermedio',
  B2_INTERMEDIO_ALTO: 'B2 Intermedio Alto',
  C1_AVANZADO: 'C1 Avanzado',
  C2_MAESTRIA: 'C2 Maestría',
  NATIVO: 'Nativo',
  // Compatibilidad con valores antiguos
  A1: 'A1 Básico',
  A2: 'A2 Elemental',
  B1: 'B1 Intermedio',
  B2: 'B2 Intermedio Alto',
  C1: 'C1 Avanzado',
  C2: 'C2 Maestría'
};
