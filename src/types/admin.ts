export interface AdminUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  rol: 'ADMIN';
  activo: boolean;
  ultimaConexion: Date;
  permisos: string[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export type AdminPermission = 
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'settings:manage'
  | 'dashboard:view'
  | 'logs:view';

export interface UserDetails {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  rol: 'ADMIN' | 'STUDENT' | 'COMPANY' | 'INSTITUTION';
  activo: boolean;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  genero?: string;
  ultimaConexion: Date;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  detalles?: Record<string, unknown>;
}

export interface UserListResponse {
  data: UserDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type OfferStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'FINALIZADA';

export interface Offer {
  id: string;
  titulo: string;
  descripcion: string;
  empresa: {
    id: string;
    nombre: string;
    logo?: string;
  };
  estado: OfferStatus;
  fechaPublicacion: Date;
  fechaExpiracion?: Date;
  requisitos: string[];
  habilidadesRequeridas: string[];
  tipoContrato: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'PRACTICAS' | 'FREELANCE';
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  ubicacion: string;
  salarioMin?: number;
  salarioMax?: number;
  moneda?: string;
  beneficios?: string[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface OfferListResponse {
  data: Offer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemStats extends AdminStats {
  activeUsers: number;
  newUsersThisMonth: number;
  pendingOffers: number;
  activeOffers: number;
  popularSkills: Array<{
    nombre: string;
    count: number;
  }>;
}

export interface SystemSettings {
  general: {
    nombreSitio: string;
    logoUrl: string;
    favicon: string;
    descripcion: string;
    terminosUrl: string;
    privacidadUrl: string;
    mantenimiento: boolean;
    mensajeMantenimiento?: string;
  };
  correo: {
    servidor: string;
    puerto: number;
    usuario: string;
    remitente: string;
    ssl: boolean;
  };
  notificaciones: {
    emailNuevoUsuario: boolean;
    emailNuevaOferta: boolean;
    notificarAprobacionOferta: boolean;
  };
}

export interface FileUploadResponse {
  url: string;
  nombre: string;
  tipo: string;
  tamano: number;
  ruta: string;
}

export type FileType = 'documento' | 'imagen' | 'video' | 'otro';

export interface AdminStats {
  totalUsers: number;
  totalOffers: number;
  totalCompanies: number;
  totalInstitutions: number;
  recentActivity: Array<{
    tipo: string;
    descripcion: string;
    fecha: Date;
    count: number;
  }>;
}
