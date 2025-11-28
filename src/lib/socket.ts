import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Socket {
    if (this.socket?.connected) {
      console.log('✅ [SocketManager] Reutilizando conexión existente');
      return this.socket;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    console.log('🔗 [SocketManager] Conectando a:', backendUrl);

    this.socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 10000, // Reduced timeout
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      forceNew: false // Don't force new connection if one exists
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ [SOCKET] Conectado al servidor de chat');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 [SOCKET] Desconectado:', reason);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 [SOCKET] Reconectado en intento ${attemptNumber}`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 [SOCKET] Intento de reconexión ${attemptNumber}`);
      this.reconnectAttempts = attemptNumber;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ [SOCKET] Falló la reconexión después de varios intentos');
    });

    this.socket.on('error', (error) => {
      console.error('❌ [SOCKET] Error:', error);
    });

    // Eventos específicos del chat
    this.socket.on('new_message', (message) => {
      console.log('📨 [SOCKET] Nuevo mensaje recibido:', message);
    });

    this.socket.on('user_typing', (data) => {
      console.log('⌨️ [SOCKET] Usuario escribiendo:', data);
    });

    this.socket.on('user_stopped_typing', (data) => {
      console.log('⌨️ [SOCKET] Usuario dejó de escribir:', data);
    });

    this.socket.on('user_online', (data) => {
      console.log('🟢 [SOCKET] Usuario en línea:', data);
    });

    this.socket.on('user_offline', (data) => {
      console.log('🔴 [SOCKET] Usuario desconectado:', data);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 [SOCKET] Desconectando...');
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Métodos para chat
  joinConversation(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`🚪 [SOCKET] Uniéndose a conversación: ${conversationId}`);
      this.socket.emit('join_conversation', conversationId);
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket?.connected) {
      console.log(`🚪 [SOCKET] Saliendo de conversación: ${conversationId}`);
      this.socket.emit('leave_conversation', conversationId);
    }
  }

  sendMessage(data: {
    conversacionId: string;
    contenido: string;
    tipo?: 'TEXTO' | 'IMAGEN' | 'ARCHIVO';
  }) {
    if (this.socket?.connected) {
      console.log('📤 [SOCKET] Enviando mensaje via socket:', data);
      this.socket.emit('send_message', data);
    }
  }

  markAsRead(data: { conversacionId: string; mensajeId: string }) {
    if (this.socket?.connected) {
      this.socket.emit('mark_as_read', data);
    }
  }

  startTyping(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing_start', conversationId);
    }
  }

  stopTyping(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing_stop', conversationId);
    }
  }

  // Método para agregar listeners personalizados
  on(event: string, callback: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Singleton instance
export const socketManager = new SocketManager();
export default socketManager;