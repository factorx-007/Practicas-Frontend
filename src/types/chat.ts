// Tipos para el sistema de chat
export interface Conversacion {
  _id: string;
  tipo: 'PRIVADA' | 'GRUPO';
  nombre?: string;
  participantes: Participante[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  ultimoMensaje?: {
    contenido: string;
    fechaCreacion: Date;
    autorNombre: string;
  };
}

export interface Participante {
  usuarioId: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  rol: string;
  fechaUnion: Date;
}

export interface Mensaje {
  _id: string;
  conversacionId: string;
  autorId: string;
  autorNombre: string;
  autorAvatar?: string;
  contenido: string;
  tipo: TipoMensaje;
  archivosAdjuntos?: ArchivoAdjunto[];
  reacciones?: Reaccion[];
  editado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export type TipoMensaje = 'TEXTO' | 'IMAGEN' | 'ARCHIVO' | 'VIDEO';

export interface ArchivoAdjunto {
  url: string;
  public_id: string;
  original_name: string;
  size: number;
  format: string;
  tipo: 'imagen' | 'video' | 'documento';
}

export interface Reaccion {
  usuarioId: string;
  emoji: string;
  fechaCreacion: Date;
}

export interface ConversacionFormData {
  tipo: 'PRIVADA' | 'GRUPO';
  nombre?: string;
  participantes: string[];
}

export interface MensajeFormData {
  conversacionId: string;
  contenido: string;
  tipo?: TipoMensaje;
}

export interface UsuarioEnLinea {
  usuarioId: string;
  nombre: string;
  avatar?: string;
  ultimaConexion: Date;
}

export interface EstadoEscritura {
  conversacionId: string;
  usuarioId: string;
  nombreUsuario: string;
  escribiendo: boolean;
}

export interface EstadisticasChat {
  totalConversaciones: number;
  totalMensajes: number;
  mensajesHoy: number;
  conversacionesActivas: number;
}

// Tipos para respuestas de la API
export interface ApiResponseChat<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Tipos para Socket.IO eventos
export interface SocketEvents {
  // Eventos que el cliente emite
  unirse_conversacion: { conversacionId: string };
  salir_conversacion: { conversacionId: string };
  enviar_mensaje: {
    conversacionId: string;
    contenido: string;
    tipo: TipoMensaje;
  };
  escribiendo: {
    conversacionId: string;
    escribiendo: boolean;
  };
  marcar_leido: {
    conversacionId: string;
    mensajeId: string;
  };

  // Eventos que el cliente escucha
  nuevo_mensaje: Mensaje;
  mensaje_editado: Mensaje;
  usuario_escribiendo: EstadoEscritura;
  usuarios_en_linea: UsuarioEnLinea[];
  conversacion_actualizada: Conversacion;
  error_chat: { message: string; code?: string };
}

// Tipos para componentes
export interface ChatContainerProps {
  conversacionId: string;
}

export interface MessageListProps {
  mensajes: Mensaje[];
  usuariosEscribiendo: EstadoEscritura[];
  onLoadMore?: () => void;
  loading?: boolean;
}

export interface MessageInputProps {
  onSendMessage: (contenido: string, archivos?: FileList) => void;
  onTyping: (escribiendo: boolean) => void;
  disabled?: boolean;
}

export interface ConversationListProps {
  conversaciones: Conversacion[];
  conversacionActiva: string | null;
  onSelectConversacion: (id: string) => void;
  loading?: boolean;
}