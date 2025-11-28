import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from '@/types/common';

// Participant interface
export interface Participante {
  id: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  rol: string;
}

// Chat types from backend documentation
export interface Conversacion {
  _id: string;
  tipo: 'PRIVADA' | 'GRUPO';
  nombre?: string;
  participantes: Participante[]; // ← CORREGIDO: son objetos, no strings
  fechaCreacion: Date;
  ultimoMensaje?: {
    contenido: string;
    fechaCreacion: Date;
  };
}

export interface Mensaje {
  _id: string;
  conversacionId: string;
  autorId: string;
  autorNombre: string;
  contenido: string;
  tipo: 'TEXTO' | 'IMAGEN' | 'ARCHIVO';
  archivosAdjuntos?: ArchivoAdjunto[];
  reacciones?: Reaccion[];
  editado: boolean;
  fechaCreacion: Date;
}

export interface ArchivoAdjunto {
  url: string;
  public_id: string;
  original_name: string;
  size: number;
  format: string;
}

export interface Reaccion {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ConversacionesResponse {
  conversaciones: Conversacion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface MensajesResponse {
  mensajes: Mensaje[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export class ChatService {
  /**
   * Create a new conversation
   */
  static async crearConversacion(data: {
    tipo: 'PRIVADA' | 'GRUPO';
    nombre?: string;
    participantes: string[];
  }): Promise<ApiResponse<Conversacion>> {
    return api.post<Conversacion>(API_ENDPOINTS.CHAT.CREATE_CONVERSATION, data);
  }

  /**
   * Get user's conversations
   */
  static async obtenerConversaciones(page = 1, limit = 20): Promise<ApiResponse<ConversacionesResponse>> {
    return api.get<ConversacionesResponse>(`${API_ENDPOINTS.CHAT.CONVERSATIONS}?page=${page}&limit=${limit}`);
  }

  /**
   * Get messages from a conversation
   */
  static async obtenerMensajes(conversacionId: string, page = 1): Promise<ApiResponse<MensajesResponse>> {
    return api.get<MensajesResponse>(API_ENDPOINTS.CHAT.MESSAGES(conversacionId) + `?page=${page}&limit=50`);
  }

  /**
   * Send a text message via REST API
   */
  static async enviarMensaje(data: {
    conversacionId: string;
    contenido: string;
    tipo?: 'TEXTO' | 'IMAGEN' | 'ARCHIVO';
  }): Promise<ApiResponse<Mensaje>> {
    return api.post<Mensaje>(API_ENDPOINTS.CHAT.SEND_MESSAGE, data);
  }

  /**
   * Send message with files
   */
  static async enviarMensajeConArchivos(
    data: {
      conversacionId: string;
      contenido: string;
    },
    archivos: FileList
  ): Promise<ApiResponse<Mensaje>> {
    const formData = new FormData();
    formData.append('conversacionId', data.conversacionId);
    formData.append('contenido', data.contenido);

    // Add files to form data
    Array.from(archivos).forEach((file) => {
      if (file.type.startsWith('image/')) {
        formData.append('images', file);
      } else if (file.type.startsWith('video/')) {
        formData.append('videos', file);
      } else {
        formData.append('files', file);
      }
    });

    return api.uploadFile<Mensaje>('/chat/mensajes', archivos[0], 'file', {
      conversacionId: data.conversacionId,
      contenido: data.contenido
    });
  }

  /**
   * Add reaction to message
   */
  static async agregarReaccion(mensajeId: string, emoji: string): Promise<ApiResponse<void>> {
    return api.post(API_ENDPOINTS.CHAT.ADD_REACTION(mensajeId), { emoji });
  }

  /**
   * Mark message as read
  static async marcarComoLeido(conversacionId: string, mensajeId: string): Promise<ApiResponse<any>> {
    return api.post(API_ENDPOINTS.CHAT.MARK_READ, { conversacionId, mensajeId });
  }

  /**
   * Buscar una conversación con un usuario específico
   */
  static async buscarConversacionConUsuario(userId: string): Promise<ApiResponse<Conversacion | null>> {
    try {
      const conversaciones = await this.obtenerConversaciones(1, 50);

      if (!conversaciones.success || !conversaciones.data) {
        return { success: false, message: 'Error al buscar conversaciones' };
      }

      // Find private conversation with this user
      const conversacion = conversaciones.data.conversaciones.find(conv =>
        conv.tipo === 'PRIVADA' &&
        conv.participantes.some(p => p.id === userId)
      );

      return {
        success: true,
        data: conversacion || null,
        message: conversacion ? 'Conversación encontrada' : 'No se encontró la conversación'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al buscar conversación';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Start or find conversation with user (helper for chat button)
   */
  static async iniciarOEncontrarChat(userId: string): Promise<ApiResponse<Conversacion>> {
    try {
      // First, try to find existing conversation
      const existing = await this.buscarConversacionConUsuario(userId);

      if (existing.success && existing.data) {
        // Found existing conversation, return it with message
        return { 
          success: true, 
          data: existing.data,
          message: 'Conversación existente encontrada'
        };
      }

      // If no existing conversation, create new one
      const newConversation = await this.crearConversacion({
        tipo: 'PRIVADA',
        participantes: [userId]
      });

      if (newConversation.success && newConversation.data) {
        return { 
          success: true, 
          data: newConversation.data, 
          message: 'Nueva conversación iniciada' 
        };
      }

      return { 
        success: false, 
        message: newConversation.message || 'No se pudo iniciar la conversación' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al iniciar chat';
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  }
}

export default ChatService;