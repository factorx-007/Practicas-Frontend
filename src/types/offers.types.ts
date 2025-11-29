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

export interface Offer {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  modalidad: OfferModalidad;
  salario_min?: number;
  salario_max?: number;
  fecha_limite: string; // Usar string para fechas para simplificar, o Date si se maneja en frontend
  empresaId: string;
  estado: OfferEstado;
  createdAt: string;
  updatedAt: string;
  vistas?: number;

  empresa: CompanyInfoForOffer; // Relación con la empresa
  _count?: { // Para el conteo de postulaciones si es necesario
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
  experiencia?: string; // Podría ser un enum o string libre
  salarioMin?: number;
  salarioMax?: number;
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
