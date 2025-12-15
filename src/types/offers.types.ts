import { Usuario } from '@/services/users.service';

// Adaptado de Practicas-Backend/src/types/offers.types.ts y Practicas-Backend/src/services/offers.service.ts
// y Practicas-Backend/src/types/common.types.ts

export enum OfferModalidad {
  REMOTO = 'REMOTO',
  PRESENCIAL = 'PRESENCIAL',
  HIBRIDO = 'HIBRIDO',
}

export enum OfferEstado {
  PUBLICADA = 'PUBLICADA',
  CERRADA = 'CERRADA',
  BORRADOR = 'BORRADOR',
}

export interface CompanyInfoForOffer {
  id: string;
  nombre_empresa: string;
  logo_url?: string;
  usuarioId?: string; // Para futuras referencias, si es necesario
  usuario?: Usuario; // Incluir información del usuario asociado a la empresa
  rubro?: string; // Añadir la propiedad rubro
}

export interface OfferQuestion {
  id?: string;
  pregunta: string;
  tipo: 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'EMAIL' | 'URL';
  obligatoria: boolean;
  opciones?: string[];
}

export interface Offer {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  modalidad: OfferModalidad;
  tipoEmpleo: string;
  nivelEducacion: string;
  experiencia: string;
  fecha_limite: string;
  empresaId: string;
  estado: OfferEstado;
  createdAt: string;
  updatedAt: string;
  vistas?: number;
  requiereCV: boolean;
  requiereCarta: boolean;
  preguntas?: OfferQuestion[];

  empresa: CompanyInfoForOffer;
  _count?: {
    postulaciones: number;
  };
}

export interface OfferWithDetails extends Offer {
  requisitos?: string[];
  responsabilidades?: string[];
  beneficios?: string[];
  experiencia_minima?: string; // Por ejemplo: 'Junior', 'Mid', 'Senior'
}

export interface OfferSearchFilters {
  search?: string;
  modalidad?: OfferModalidad;
  experiencia?: string;
  ubicacion?: string;
  empresaId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOffersResponse {
  data: Offer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CompanyStats {
  ofertas_activas: number;
  postulaciones_recibidas: number;
  candidatos_entrevistados: number;
  rating_empresa: number;
}

export enum ApplicationStatus {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  ENTREVISTA = 'ENTREVISTA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
}

export interface Application {
  id: string;
  ofertaId: string;
  estudianteId: string;
  estado: ApplicationStatus;
  fecha_postulacion: string;
  mensaje?: string;
  cvUrl?: string;
  notasEntrevistador?: string;

  estudiante?: {
    id: string;
    usuario: {
      nombre: string;
      email: string;
      foto_perfil?: string;
    };
    carrera?: string;
    universidad?: string;
  };

  oferta?: {
    id: string;
    titulo: string;
    ubicacion: string;
    modalidad: OfferModalidad;
  };
}

export interface PaginatedCandidatesResponse {
  data: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
