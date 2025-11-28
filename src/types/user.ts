import {
  Rol,
  TipoEstudiante,
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
// TIPOS BASE
// ===================================================

// Usuario base, viene anidado en todos los perfiles
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar?: string | null;
  rol: Rol;
  activo: boolean;
  emailVerificado: boolean;
  perfilCompleto: boolean;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

// ===================================================
// TIPOS DETALLADOS PARA PERFIL DE ESTUDIANTE
// ===================================================

export interface PerfilProfesional {
  id: string;
  resumen: string;
  objetivo_carrera?: string | null;
  disponibilidad: DisponibilidadTipo;
  modalidad_trabajo: ModalidadTrabajo[];
  salario_minimo?: number | null;
  salario_maximo?: number | null;
  moneda?: string | null;
}

export interface ExperienciaLaboral {
  id: string;
  cargo: string;
  empresa: string;
  fecha_inicio: string; // ISO Date String
  fecha_fin?: string | null; // ISO Date String
  es_actual: boolean;
  modalidad: ModalidadTrabajo;
  descripcion?: string | null;
  responsabilidades: string[];
  logros: string[];
}

export interface EducacionAcademica {
  id: string;
  institucion: string;
  tipo_institucion: TipoInstitucion;
  titulo: string;
  campo_estudio?: string | null;
  nivel_academico: NivelAcademico;
  fecha_inicio: string; // ISO Date String
  fecha_fin?: string | null; // ISO Date String
  en_curso: boolean;
  promedio?: number | null; // Prisma Decimal is serialized as number or string
  sistema_notas: SistemaNotas;
  cursos_destacados?: string[];
}

export interface EstudianteHabilidad {
  id: string;
  nivel: NivelDominio;
  anios_experiencia?: number;
  habilidad: {
    nombre: string;
    categoria: string;
    tipo: string;
  };
}

export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoProyecto;
  fecha_inicio: string; // ISO Date String
  fecha_fin?: string | null; // ISO Date String
  estado: EstadoProyecto;
  url_repositorio?: string | null;
  url_demo?: string | null;
  contexto?: ContextoProyecto | null;
  imagenes: string[];
  tecnologias?: string[];
}

export interface Certificacion {
  id: string;
  titulo: string;
  emisor: string;
  tipo: TipoCertificacion;
  fecha_emision: string; // ISO Date String
  fecha_expiracion?: string | null; // ISO Date String
  credencial_id?: string | null;
  url_verificacion?: string | null;
}

export interface EstudianteIdioma {
  id: string;
  nivel_oral: NivelIdioma;
  nivel_escrito: NivelIdioma;
  nivel_lectura: NivelIdioma;
  idioma: {
    nombre: string;
  };
}

// ===================================================
// TIPO PRINCIPAL PARA PERFIL DE ESTUDIANTE (lo que recibe el frontend)
// ===================================================

export interface StudentProfile {
  id: string;
  usuarioId: string;
  cv?: string | null;
  carrera: string;
  universidad?: string | null;
  telefono?: string | null;
  portafolio?: string | null;
  linkedin?: string | null;
  github?: string | null;
  ubicacion?: string | null;
  tipo: TipoEstudiante;
  usuario: Usuario;

  // --- Relaciones Anidadas ---
  perfilProfesional: PerfilProfesional | null;
  experiencias: ExperienciaLaboral[];
  educacion: EducacionAcademica[];
  habilidadesNuevas: EstudianteHabilidad[];
  proyectos: Proyecto[];
  certificaciones: Certificacion[];
  idiomas: EstudianteIdioma[];
}

// ===================================================
// TIPOS PARA OTROS PERFILES
// ===================================================

export interface PerfilEmpresa {
  id?: string;
  ruc: string;
  nombre_empresa: string;
  rubro: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  website?: string;
  logo_url?: string;
  verificada: boolean;
  usuarioId?: string;

  // Culture fields
  mision?: string;
  vision?: string;
  cultura_descripcion?: string;
  valores?: Record<string, unknown>[];
  beneficios?: Record<string, unknown>[];
  galeria?: string[];

  // Perfil Empresa fields
  perfilEmpresa?: {
    id?: string;
    empresaId?: string;
    sector_id?: string;
    tamanio?: string;
    anio_fundacion?: number;
    tipo?: string;
    cultura_descripcion?: string;
    mision?: string;
    vision?: string;
    linkedin_url?: string;
    valores?: Record<string, unknown>[];
    galeria?: string[];
    beneficios?: Record<string, unknown>[];
  };
}

export type CompanyProfile = PerfilEmpresa;

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION';
  carrera?: string;
  universidad?: string;
  nombreEmpresa?: string;
  nombreInstitucion?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar?: string | null;
  rol: Rol;
  emailVerificado: boolean;
  perfilCompleto: boolean;
}

export interface UpdateProfileData {
  nombre?: string;
  apellido?: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}