import { useEffect, useState, useCallback, useRef } from 'react';
import { socketManager } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { Mensaje } from '@/services/chat.service';

interface UseChatProps {
  conversationId: string;
}

interface TypingUser {
  userId: string;
  userName: string;
}

export const useChat = ({ conversationId }: UseChatProps) => {
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Conectar al socket cuando el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setConnected(false);
      return;
    }

    console.log('🔗 [useChat] Conectando al socket...');
    
    // El socket manager manejará la autenticación con las cookies HTTP-only
    const socket = socketManager.connect();

    // Verificar si ya está conectado
    if (socket.connected) {
      console.log('✅ [useChat] Socket ya conectado');
      setConnected(true);
    }

    const handleConnect = () => {
      setConnected(true);
      console.log('✅ [useChat] Socket conectado');
    };

    const handleDisconnect = (reason: string) => {
      setConnected(false);
      console.log('🔌 [useChat] Socket desconectado:', reason);
    };

    const handleConnectError = (error: unknown) => {
      setConnected(false);
      console.error('❌ [useChat] Error de conexión:', error);
    };

    const handleNewMessage = (message: Mensaje) => {
      console.log('📨 [useChat] Nuevo mensaje recibido:', message);
      if (message.conversacionId === conversationId) {
        setMessages(prev => {
          // Evitar duplicados
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;

          // Insertar en orden cronológico
          const newMessages = [...prev, message];
          return newMessages.sort((a, b) =>
            new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()
          );
        });
      }
    };

    const handleUserTyping = (data: { userId: string; userName: string; conversacionId: string }) => {
      if (data.conversacionId === conversationId && data.userId !== user.id) {
        setTypingUsers(prev => {
          const exists = prev.some(u => u.userId === data.userId);
          if (exists) return prev;
          return [...prev, { userId: data.userId, userName: data.userName }];
        });
      }
    };

    const handleUserStoppedTyping = (data: { userId: string; conversacionId: string }) => {
      if (data.conversacionId === conversationId) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    };

    const handleUserOnline = (data: { userId: string }) => {
      setOnlineUsers(prev => {
        if (prev.includes(data.userId)) return prev;
        return [...prev, data.userId];
      });
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    };

    // Registrar listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    // Connection timeout
    const connectionTimeout = setTimeout(() => {
      if (!socket.connected) {
        console.warn('⚠️ [useChat] Conexión timeout - asumiendo desconectado');
        setConnected(false);
      }
    }, 5000);

    return () => {
      clearTimeout(connectionTimeout);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [user, isAuthenticated, conversationId]);

  // Unirse a la conversación cuando el socket esté conectado
  useEffect(() => {
    if (!connected || !conversationId) return;

    console.log(`💬 [useChat] Uniéndose a la conversación ${conversationId}`);
    
    // Obtener la instancia del socket
    const socket = socketManager.connect();
    socket.emit('join_conversation', conversationId);

  }, [connected, conversationId]);

  // Función para enviar mensaje
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !conversationId) return;

    try {
      // Create a new message object that matches the required fields
      const newMessage = {
        _id: Date.now().toString(), // Temporary ID
        conversacionId: conversationId,
        autorId: user.id,
        autorNombre: user.nombre || 'Usuario',
        autorAvatar: user.avatar || '',
        contenido: content,
        tipo: 'TEXTO' as const,
        editado: false,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        // Optional fields with default values
        adjuntos: [],
        reacciones: []
      } as Mensaje;

      // Obtener la instancia del socket y enviar mensaje
      const socket = socketManager.connect();
      socket.emit('send_message', {
        ...newMessage,
        conversacionId: conversationId
      });

      // Actualizar UI inmediatamente
      setMessages(prev => [
        ...prev,
        {
          ...newMessage,
          id: Date.now().toString(), // ID temporal
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Mensaje
      ]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketManager.stopTyping(conversationId);
    }, 3000);
  }, [user, conversationId]);

  // Función para indicar que está escribiendo
  const startTyping = useCallback(() => {
    if (!connected) return;

    const socket = socketManager.connect();
    socket.emit('start_typing', { conversationId });

    // Auto-stop después de 3 segundos
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketManager.stopTyping(conversationId);
    }, 3000);
  }, [connected, conversationId]);

  const stopTyping = useCallback(() => {
    if (!connected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketManager.stopTyping(conversationId);
  }, [connected, conversationId]);

  // Función para marcar como leído
  const markAsRead = useCallback((messageId: string) => {
    if (!connected) return;

    socketManager.markAsRead({
      conversacionId: conversationId,
      mensajeId: messageId
    });
  }, [connected, conversationId]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    setMessages, // Para permitir set inicial desde API REST
    typingUsers,
    onlineUsers,
    connected,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead
  };
};