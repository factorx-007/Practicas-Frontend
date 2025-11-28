'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Loader2,
  Wifi
} from 'lucide-react';
import { ChatService, Conversacion } from '@/services/chat.service';
import { UsersService } from '@/services/users.service';
import { useAuthStore } from '@/store/authStore';
import { getCachedUserDisplayName, preloadUserInfo, useUserDisplayName } from '@/hooks/useUserInfo';
import { useChat } from '@/hooks/useChat';
import toast from 'react-hot-toast';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversacion | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const currentUser = useAuthStore(state => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook de chat con Socket.IO
  const {
    messages,
    setMessages,
    typingUsers,
    connected,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping
  } = useChat({ conversationId });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEndRef]);

  const loadConversation = useCallback(async () => {
    try {
      const response = await ChatService.obtenerConversaciones(1, 50);
      if (response.success && response.data) {
        const conv = response.data.conversaciones.find(c => c._id === conversationId);
        if (conv) {
          setConversation(conv);
          console.log('Conversación cargada:', conv);

          if (conv.tipo === 'PRIVADA' && currentUser) {
            const otherParticipant = conv.participantes.find(p => p.id !== currentUser.id);
            const otherParticipantId = otherParticipant?.id;
            if (otherParticipantId && typeof otherParticipantId === 'string') {
              console.log('Precargando info del usuario:', otherParticipantId);
              UsersService.getUserProfile(otherParticipantId).then(response => {
                if (response.success && response.data) {
                  console.log('Usuario precargado exitosamente:', response.data);
                }
              }).catch(err => {
                console.log('Error al precargar usuario:', err);
              });
            }
          }
        } else {
          console.error('Conversación no encontrada en la lista. ID buscado:', conversationId);
          console.log('Conversaciones disponibles:', response.data.conversaciones.map(c => ({ id: c._id, tipo: c.tipo })));
          toast.error('Conversación no encontrada');
          router.push('/dashboard/chat');
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Error al cargar la conversación');
    } finally {
      setLoading(false);
    }
  }, [conversationId, setConversation, currentUser, router, setLoading]);

  const loadMessages = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoadingMessages(true);
      const response = await ChatService.obtenerMensajes(conversationId);
      if (response.success && response.data) {
        const sortedMessages = response.data.mensajes.sort((a, b) =>
          new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()
        );

        setMessages(prevMessages => {
          const hasNewMessages = sortedMessages.length > prevMessages.length ||
            sortedMessages.some(newMsg => !prevMessages.find(prevMsg => prevMsg._id === newMsg._id));

          if (hasNewMessages) {
            if (silent) {
              console.log('📨 Nuevos mensajes detectados (refresh automático)');
            }
            return sortedMessages;
          }

          return prevMessages;
        });

        if (!silent) {
          const authorIds = [...new Set(sortedMessages.map(m => m.autorId))];
          authorIds.forEach(authorId => {
            if (authorId && typeof authorId === 'string') {
              preloadUserInfo(authorId);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      if (!silent) toast.error('Error al cargar los mensajes');
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [conversationId, setLoadingMessages, setMessages]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      console.log('📤 Enviando mensaje via REST API');
      const response = await ChatService.enviarMensaje({
        conversacionId: conversationId,
        contenido: messageContent,
        tipo: 'TEXTO'
      });

      if (response.success && response.data) {
        setMessages(prev => [...prev, response.data!]);
        stopTyping();

        setTimeout(() => {
          loadMessages(true);
        }, 500);

        if (connected) {
          sendSocketMessage(messageContent);
        }
      } else {
        toast.error('Error al enviar mensaje');
        setNewMessage(messageContent); // Restore message on error
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, setNewMessage, setSending, conversationId, setMessages, stopTyping, loadMessages, connected, sendSocketMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.trim() && connected) {
      startTyping();
    } else if (connected) {
      stopTyping();
    }
  }, [setNewMessage, connected, startTyping, stopTyping]);

  // Load conversation and messages
  useEffect(() => {
    loadConversation();
    loadMessages();
  }, [conversationId, loadConversation, loadMessages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when connected
  useEffect(() => {
    if (connected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [connected, inputRef]);

  // Auto-refresh messages every 3 seconds (silent, no loading state)
  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(() => {
      loadMessages(true);
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [conversationId, loadMessages]);

  const otherParticipant = conversation?.tipo === 'PRIVADA' && currentUser
    ? conversation.participantes.find(p => p.id !== currentUser.id)
    : null;

  const otherParticipantId = otherParticipant?.id || null;

  // Use the hook to get the display name with automatic updates
  const { displayName: otherUserName } = useUserDisplayName(otherParticipantId);

  // Debug logs
  console.log('DEBUG - Conversation:', conversation);
  console.log('DEBUG - Other participant ID:', otherParticipantId);
  console.log('DEBUG - Other user name:', otherUserName);

  const getConversationDisplayName = () => {
    if (!conversation) return 'Chat';

    if (conversation.nombre) {
      return conversation.nombre;
    }

    if (conversation.tipo === 'PRIVADA' && otherParticipant) {
      // Use the participant data directly - no API call needed!
      const displayName = `${otherParticipant.nombre} ${otherParticipant.apellido}`;
      console.log('✅ [getConversationDisplayName] Using direct participant data:', displayName);
      return displayName;
    }

    return `Chat ${conversation.tipo.toLowerCase()}`;
  };

  const getTypingMessage = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0].userName} está escribiendo...`;
    return `${typingUsers.length} usuarios están escribiendo...`;
  };

  const formatTime = (date: string | Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatDate = (date: string | Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    const isToday = today.toDateString() === messageDate.toDateString();

    if (isToday) {
      return 'Hoy';
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = yesterday.toDateString() === messageDate.toDateString();

    if (isYesterday) {
      return 'Ayer';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(messageDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-500">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">Conversación no encontrada</p>
          <Button onClick={() => router.push('/dashboard/chat')} className="mt-4">
            Volver al chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/chat')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            {/* Conversation info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {getConversationDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {getConversationDisplayName()}
                </h2>
                <div className="flex items-center gap-2">
                  {/* Online status indicator */}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500">En línea</span>
                  </div>

                  {/* Typing indicator */}
                  {getTypingMessage() && (
                    <span className="text-xs text-blue-500 italic">
                      {getTypingMessage()}
                    </span>
                  )}

                  {/* Socket status (optional, only show if connected) */}
                  {connected && (
                    <div className="flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Tiempo real</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {loadingMessages ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-gray-500">Cargando mensajes...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No hay mensajes aún</p>
              <p className="text-gray-400 text-sm">Envía el primer mensaje para comenzar la conversación</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.autorId === currentUser?.id;
            const showDate = index === 0 ||
              formatDate(message.fechaCreacion) !== formatDate(messages[index - 1].fechaCreacion);

            return (
              <div key={message._id}>
                {showDate && (
                  <div className="text-center text-xs text-gray-500 my-4">
                    {formatDate(message.fechaCreacion)}
                  </div>
                )}

                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      isOwn
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    {/* Solo mostrar nombre en conversaciones grupales o si no es el usuario actual */}
                    {!isOwn && conversation?.tipo === 'GRUPO' && (
                      <p className="text-xs font-medium mb-1 opacity-70">
                        {message.autorNombre || getCachedUserDisplayName(message.autorId)}
                      </p>
                    )}
                    <p className="text-sm">{message.contenido}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwn ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.fechaCreacion)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex gap-3">
         <Input
            ref={inputRef}
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 !bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none active:outline-none outline-none rounded-full px-4 py-3"
            style={{
              backgroundColor: '#f9fafb',
              outline: 'none',
              boxShadow: 'none',
              border: '1px solid #e5e7eb'
            }}
            onFocus={(e) => {
              e.target.style.outline = 'none';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              e.target.style.border = '1px solid #3b82f6';
              e.target.style.backgroundColor = 'white';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid #e5e7eb';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#f9fafb';
              stopTyping();
            }}
            disabled={sending}
        />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Presiona Enter para enviar</span>
          </div>

          {/* Show typing indicator in input area if someone is typing */}
          {getTypingMessage() && (
            <span className="text-blue-500 italic">
              {getTypingMessage()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}