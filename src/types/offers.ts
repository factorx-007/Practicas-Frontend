import { BaseEntity, OfferType, WorkModality, Currency, EducationLevel, OfferStatus, ApplicationStatus } from './common';
import { UserProfile } from './user';

// Offer Interface
export interface Offer extends BaseEntity {
  titulo: string;
  descripcion: string;
  tipoEmpleo: OfferType;
  modalidad: WorkModality;
  ubicacion?: string;

  // Salary information
  salarioMin?: number;
  salarioMax?: number;
  moneda: Currency;
  mostrarSalario: boolean;

  // Requirements
  requisitos: string[];
  beneficios: string[];
  habilidadesRequeridas: string[];
  experienciaMinimaAnios?: number;
  nivelEducativo?: EducationLevel;

  // Dates
  fechaLimite?: string;
  fechaInicio?: string;
  duracion?: string; // For internships/temporary positions

  // Company information
  empresa: {
    id: string;
    nombre: string;
    logo?: string;
    ubicacion?: string;
    industria?: string;
    tamaño?: string;
  };

  // Offer status and statistics
  estado: OfferStatus;
  numeroPostulaciones: number;
  numeroVistas: number;
  destacada: boolean;

  // Additional information
  tags?: string[];
  idiomas?: string[];
  certificacionesRequeridas?: string[];
  herramientasRequeridas?: string[];

  // Contact information
  contacto?: {
    email?: string;
    telefono?: string;
    instruccionesPostulacion?: string;
  };

  // SEO and metadata
  slug?: string;
  metaDescription?: string;

  // Publishing information
  publicadaPor: {
    id: string;
    nombre: string;
    apellido: string;
    cargo?: string;
  };

  // Application settings
  requiereCartaPresentacion: boolean;
  requierePortfolio: boolean;
  preguntasPersonalizadas?: PreguntaPersonalizada[];
}

// Custom Question Interface
export interface PreguntaPersonalizada {
  id: string;
  pregunta: string;
  tipo: 'TEXTO' | 'TEXTAREA' | 'OPCION_MULTIPLE' | 'ARCHIVO';
  requerida: boolean;
  opciones?: string[]; // For multiple choice questions
  longitudMaxima?: number; // For text questions
  tiposArchivoPermitidos?: string[]; // For file questions
}

// Application Interface
export interface Application extends BaseEntity {
  oferta: {
    id: string;
    titulo: string;
    empresa: {
      nombre: string;
      logo?: string;
    };
    ubicacion?: string;
    tipoEmpleo: OfferType;
    modalidad: WorkModality;
  };

  candidato: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    avatar?: string;
    universidad?: string;
    carrera?: string;
  };

  estado: ApplicationStatus;
  mensaje?: string;
  cartaPresentacion?: string;
  portfolioUrl?: string;
  curriculumUrl?: string;

  // Custom answers
  respuestasPersonalizadas?: RespuestaPersonalizada[];

  // Application tracking
  fechaRevision?: string;
  revisadoPor?: {
    id: string;
    nombre: string;
    apellido: string;
  };

  comentariosReclutador?: string;
  puntuacion?: number; // 1-5 stars

  // Interview information
  entrevista?: {
    programada: boolean;
    fecha?: string;
    modalidad?: 'PRESENCIAL' | 'VIRTUAL';
    enlace?: string;
    notas?: string;
  };

  // Status history
  historialEstados?: HistorialEstado[];
}

// Custom Answer Interface
export interface RespuestaPersonalizada {
  preguntaId: string;
  respuesta: string;
  archivoUrl?: string;
}

// Status History Interface
export interface HistorialEstado {
  estado: ApplicationStatus;
  fecha: string;
  comentario?: string;
  cambiadoPor: {
    id: string;
    nombre: string;
    apellido: string;
  };
}

// Create Offer Data Interface
export interface CreateOfferData {
  titulo: string;
  descripcion: string;
  tipoEmpleo: OfferType;
  modalidad: WorkModality;
  ubicacion?: string;
  salarioMin?: number;
  salarioMax?: number;
  moneda: Currency;
  mostrarSalario: boolean;
  requisitos: string[];
  beneficios: string[];
  habilidadesRequeridas: string[];
  experienciaMinimaAnios?: number;
  nivelEducativo?: EducationLevel;
  fechaLimite?: string;
  fechaInicio?: string;
  duracion?: string;
  tags?: string[];
  idiomas?: string[];
  certificacionesRequeridas?: string[];
  herramientasRequeridas?: string[];
  contacto?: {
    email?: string;
    telefono?: string;
    instruccionesPostulacion?: string;
  };
  requiereCartaPresentacion: boolean;
  requierePortfolio: boolean;
  preguntasPersonalizadas?: Omit<PreguntaPersonalizada, 'id'>[];
}

// Update Offer Data Interface
export interface UpdateOfferData extends Partial<CreateOfferData> {
  estado?: OfferStatus;
  destacada?: boolean;
}

// Create Application Data Interface
export interface CreateApplicationData {
  ofertaId: string;
  mensaje?: string;
  cartaPresentacion?: string;
  portfolioUrl?: string;
  curriculumFile?: File;
  respuestasPersonalizadas?: Omit<RespuestaPersonalizada, 'preguntaId'>[];
}

// Update Application Data Interface
export interface UpdateApplicationData {
  estado?: ApplicationStatus;
  comentariosReclutador?: string;
  puntuacion?: number;
  entrevista?: {
    programada: boolean;
    fecha?: string;
    modalidad?: 'PRESENCIAL' | 'VIRTUAL';
    enlace?: string;
    notas?: string;
  };
}

// Offer Search Parameters Interface
export interface OfferSearchParams {
  query?: string;
  tipoEmpleo?: OfferType[];
  modalidad?: WorkModality[];
  ubicacion?: string;
  salarioMin?: number;
  salarioMax?: number;
  moneda?: Currency;
  experienciaMinima?: number;
  experienciaMaxima?: number;
  nivelEducativo?: EducationLevel[];
  habilidades?: string[];
  tags?: string[];
  idiomas?: string[];
  empresa?: string;
  industria?: string;
  fechaPublicacion?: 'HOY' | 'SEMANA' | 'MES' | 'TODO';
  conSalario?: boolean;
  destacadas?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'fechaCreacion' | 'salarioMin' | 'titulo' | 'relevancia';
  sortOrder?: 'asc' | 'desc';
}

// Application Search Parameters Interface
export interface ApplicationSearchParams {
  estado?: ApplicationStatus;
  ofertaId?: string;
  candidatoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  conEntrevista?: boolean;
  puntuacionMinima?: number;
  page?: number;
  limit?: number;
  sortBy?: 'fechaCreacion' | 'fechaRevision' | 'puntuacion';
  sortOrder?: 'asc' | 'desc';
}

// Offer Statistics Interface
export interface OfferStats {
  totalOfertas: number;
  ofertasActivas: number;
  ofertasPausadas: number;
  ofertasCerradas: number;
  totalPostulaciones: number;
  promedioPostulacionesPorOferta: number;
  ofertasMasVistas: Offer[];
  ofertasMasPostuladas: Offer[];
  estadisticasPorTipo: Record<OfferType, number>;
  estadisticasPorModalidad: Record<WorkModality, number>;
  tendenciasSalariales: {
    tipo: OfferType;
    promedioSalario: number;
    moneda: Currency;
  }[];
}

// Application Statistics Interface
export interface ApplicationStats {
  totalPostulaciones: number;
  postulacionesPendientes: number;
  postulacionesAceptadas: number;
  postulacionesRechazadas: number;
  tasaAceptacion: number;
  tiempoPromedioRespuesta: number; // in days
  postulacionesPorMes: {
    mes: string;
    cantidad: number;
  }[];
  candidatosMasActivos: {
    candidato: UserProfile;
    numeroPostulaciones: number;
  }[];
}

// Offer Filters Interface
export interface OfferFilters {
  tipoEmpleo: { value: OfferType; label: string; count: number }[];
  modalidad: { value: WorkModality; label: string; count: number }[];
  ubicaciones: { value: string; label: string; count: number }[];
  industrias: { value: string; label: string; count: number }[];
  habilidades: { value: string; label: string; count: number }[];
  rangosExperiencia: { value: string; label: string; count: number }[];
  rangosSalario: { min: number; max: number; moneda: Currency; count: number }[];
}

// Saved Search Interface
export interface SavedSearch extends BaseEntity {
  nombre: string;
  parametros: OfferSearchParams;
  alertasEmail: boolean;
  frecuenciaAlertas: 'DIARIA' | 'SEMANAL' | 'MENSUAL';
  ultimaEjecucion?: string;
  numeroResultados?: number;
}

// Offer Recommendation Interface
export interface OfferRecommendation {
  oferta: Offer;
  puntuacion: number; // 0-100
  razones: string[];
  habilidadesCoincidentes: string[];
  criteriosCoincidentes: {
    tipoEmpleo: boolean;
    modalidad: boolean;
    ubicacion: boolean;
    salario: boolean;
    experiencia: boolean;
    habilidades: number; // number of matching skills
  };
}

// Company Offer Statistics Interface
export interface CompanyOfferStats {
  ofertasPublicadas: number;
  ofertasActivas: number;
  totalPostulaciones: number;
  candidatosContratados: number;
  tasaContratacion: number;
  tiempoPromedioContratacion: number; // in days
  satisfaccionCandidatos: number; // 1-5 stars
  ofertasMasExitosas: {
    oferta: Offer;
    numeroPostulaciones: number;
    numeroContratados: number;
  }[];
}

// Bulk Operations Interface
export interface BulkOperation {
  action: 'ACTIVAR' | 'PAUSAR' | 'CERRAR' | 'DESTACAR' | 'ELIMINAR';
  ofertaIds: string[];
  reason?: string;
}

export interface BulkApplicationOperation {
  action: 'ACEPTAR' | 'RECHAZAR' | 'MARCAR_REVISADO';
  applicationIds: string[];
  message?: string;
}

// Export Interface for offers and applications
export interface ExportData {
  format: 'CSV' | 'EXCEL' | 'PDF';
  fields: string[];
  filters?: OfferSearchParams | ApplicationSearchParams;
  dateRange?: {
    start: string;
    end: string;
  };
}