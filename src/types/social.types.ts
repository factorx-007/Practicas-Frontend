export enum TipoReaccion {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  HAHA = 'HAHA',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY'
  // CELEBRATE = 'CELEBRATE', // Removido porque no existe en el backend
}

// Importar las interfaces de perfil desde users.service.ts
import { PerfilEstudiante, PerfilEmpresa, PerfilInstitucion } from '@/services/users.service';

export interface UserInfo {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  avatar?: string;
  rol?: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | 'ADMIN'; // Añadir roles explícitos
  estudiante?: PerfilEstudiante;
  empresa?: PerfilEmpresa;
  institucion?: PerfilInstitucion;
  emailVerificado?: boolean; // Añadir emailVerificado
}

export interface Post {
  id: string;
  contenido: string;
  autorId: string;
  imagenes?: string[];
  videos?: string[];
  privado: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  autor?: UserInfo;
  comentarios?: Comentario[];
  reacciones?: Reaccion[];
  totalComentarios?: number;
  totalReacciones?: number;
  yaReaccionado?: boolean;
  tipoReaccionUsuario?: TipoReaccion;
}

export interface Comentario {
  id: string;
  postId: string;
  autorId: string;
  contenido: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;

  autor?: UserInfo;
  respuestas?: Comentario[];
  reacciones?: Reaccion[];
  totalRespuestas?: number;
}

export interface Reaccion {
  id: string;
  tipo: TipoReaccion;
  usuarioId: string;
  postId?: string;
  comentarioId?: string;
  createdAt: Date;
  updatedAt: Date;

  usuario?: UserInfo;
}

export interface CreatePostDTO {
  contenido: string;
  privado?: boolean;
  // images y videos se manejan como File[] en el servicio, no en el DTO
}

export interface UpdatePostDTO {
  contenido?: string;
  privado?: boolean;
}

export interface CreateComentarioDTO {
  contenido: string;
  postId: string;
  parentId?: string;
}

export interface UpdateComentarioDTO {
  contenido: string;
}

export interface CreateReaccionDTO {
  tipo: TipoReaccion;
  postId?: string;
  comentarioId?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

export interface ComentariosResponse {
  comentarios: Comentario[];
  pagination: PaginationInfo;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  autorId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
  soloConexiones?: boolean;
  incluirComentarios?: boolean;
  incluirReacciones?: boolean;
  orderBy?: 'createdAt' | 'totalReacciones' | 'totalComentarios';
  order?: 'asc' | 'desc';
}

export interface ComentarioQueryParams {
  page?: number;
  limit?: number;
  postId: string;
  incluirRespuestas?: boolean;
  incluirReacciones?: boolean;
  orderBy?: 'createdAt' | 'totalReacciones';
  order?: 'asc' | 'desc';
}