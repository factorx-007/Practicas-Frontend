'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image'; // Importar Image de next/image
import {
  MessageSquare,
  Plus,
  Users,
  Search,
  User,
  Building,
  GraduationCap,
  X,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { UsersService, Usuario } from '@/services/users.service';
import { ChatService, Conversacion } from '@/services/chat.service';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
// import { useChat } from '@/hooks/useChat';
import { Mensaje } from '@/types/chat'; // Importa la interfaz Mensaje
import { Rol } from '@/types/localTypes';
import { socketManager } from '@/lib/socket';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Usuario[]>([]);
  const [conversations, setConversations] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Rol | ''>('');
  const [startingChat, setStartingChat] = useState<string | null>(null); // Track which user we're starting chat with
  const [connected, setConnected] = useState(false);

  const currentUser = useAuthStore(state => state.user);
  const router = useRouter();

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const response = await ChatService.obtenerConversaciones(1, 50);
      if (response.success && response.data) {
        const conversations = response.data.conversaciones;
        setConversations(conversations);

        console.log('✅ [ChatPage] Conversaciones cargadas con participantes completos:', conversations);

        conversations.forEach(conv => {
          console.log(`📋 [ChatPage] Conversación ${conv._id}:`, {
            tipo: conv.tipo,
            participantes: conv.participantes
          });
        });
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [setLoadingConversations, setConversations]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Guard de tipo para roles válidos del chat (sin usar any)
      const isChatRole = (value: Rol | ''): value is 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' =>
        value === 'ESTUDIANTE' || value === 'EMPRESA' || value === 'INSTITUCION';

      const allowedRole: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | undefined =
        isChatRole(selectedRole) ? selectedRole : undefined;

      const response = await UsersService.getUsersForChat({
        query: searchTerm || undefined,
        rol: allowedRole,
        limit: 20
      });

      if (response.success && response.data) {
        const allUsers = response.data.data || [];
        const filteredUsers = allUsers.filter(
          (user: Usuario) => user.id !== currentUser?.id
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUsers, searchTerm, selectedRole, currentUser]);

  // Load conversations when component mounts
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Socket.IO connection setup
  useEffect(() => {
    if (!currentUser) {
      setConnected(false);
      return;
    }

    console.log('🔗 [ChatPage] Conectando al socket...');
    const socket = socketManager.connect();

    if (socket.connected) {
      console.log('✅ [ChatPage] Socket ya conectado');
      setConnected(true);
    }

    const handleConnect = () => {
      setConnected(true);
      console.log('✅ [ChatPage] Socket conectado');
    };

    const handleDisconnect = (reason: string) => {
      setConnected(false);
      console.log('🔌 [ChatPage] Socket desconectado:', reason);
    };

    const handleConnectError = (error: unknown) => {
      setConnected(false);
      console.error('❌ [ChatPage] Error de conexión:', error);
    };

    const handleNewMessage = (message: Mensaje) => {
      console.log('📨 [ChatPage] Nuevo mensaje recibido:', message);
      loadConversations();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('new_message', handleNewMessage);

    const connectionTimeout = setTimeout(() => {
      if (!socket.connected) {
        console.warn('⚠️ [ChatPage] Conexión timeout - asumiendo desconectado');
        setConnected(false);
      }
    }, 5000);

    return () => {
      clearTimeout(connectionTimeout);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('new_message', handleNewMessage);
    };
  }, [currentUser, setConnected, loadConversations]);

  // Load initial users when search modal opens
  useEffect(() => {
    if (showUserSearch) {
      loadUsers();
    }
  }, [showUserSearch, loadUsers]);

  // Search users when search term or filters change
  useEffect(() => {
    if (showUserSearch) {
      const timeoutId = setTimeout(() => {
        loadUsers();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, selectedRole, showUserSearch, loadUsers]);

  const handleStartConversation = async (user: Usuario) => {
    if (startingChat === user.id) return; // Prevent double clicks

    setStartingChat(user.id);
    try {
      console.log('Iniciando conversación con:', user);

      // Try to find existing conversation or create new one
      const response = await ChatService.iniciarOEncontrarChat(user.id);

      if (response.success && response.data) {
        console.log('Conversación creada/encontrada:', response.data);

        // Reload conversations to show the new one
        loadConversations();

        // Close search modal
        setShowUserSearch(false);

        // Navigate to the conversation
        router.push(`/dashboard/chat/${response.data._id}`);
      } else {
        console.error('Error al crear conversación:', response.message);
        toast.error(`Error al iniciar chat: ${response.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al iniciar conversación:', error);
      toast.error('Error al iniciar chat. Por favor, inténtalo de nuevo.');
    } finally {
      setStartingChat(null);
    }
  };

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'ESTUDIANTE':
        return <User className="w-4 h-4" />;
      case 'EMPRESA':
        return <Building className="w-4 h-4" />;
      case 'INSTITUCION':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Component for conversation display name that updates automatically
  const ConversationDisplayName = ({ conversation }: { conversation: Conversacion }) => {
    if (conversation.nombre) {
      return <>{conversation.nombre}</>;
    }

    if (conversation.tipo === 'PRIVADA' && currentUser) {
      // Find the other participant directly from the conversation data
      const otherParticipant = conversation.participantes.find(p => p.id !== currentUser.id);
      if (otherParticipant) {
        const displayName = `${otherParticipant.nombre} ${otherParticipant.apellido}`;
        console.log('✅ [ConversationDisplayName] Using direct participant:', displayName);
        return <>{displayName}</>;
      }
    }

    return <>Chat {conversation.tipo.toLowerCase()}</>;
  };

  // Function to get conversation display name (for avatar initials)
  const getConversationDisplayName = (conversation: Conversacion) => {
    if (conversation.nombre) {
      return conversation.nombre;
    }

    if (conversation.tipo === 'PRIVADA' && currentUser) {
      // For private conversations, get the name of the other participant directly
      const otherParticipant = conversation.participantes.find(p => p.id !== currentUser.id);
      if (otherParticipant) {
        const displayName = `${otherParticipant.nombre} ${otherParticipant.apellido}`;
        console.log('✅ [getConversationDisplayName] Using direct participant for avatar:', displayName);
        return displayName;
      }
    }

    return `Chat ${conversation.tipo.toLowerCase()}`;
  };

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'ESTUDIANTE':
        return 'bg-blue-100 text-blue-700';
      case 'EMPRESA':
        return 'bg-green-100 text-green-700';
      case 'INSTITUCION':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajes</h1>
        <p className="text-gray-600 text-lg">Conecta y chatea con otros usuarios de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Lista de conversaciones */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Conversaciones
              </h2>
              <div className="flex items-center gap-2">
                {connected ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-sm text-green-600">Conectado</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-orange-500" />
                    <span className="text-sm text-orange-600">Desconectado</span>
                  </>
                )}
              </div>
            </div>

            {/* Búsqueda de conversaciones */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar conversaciones..."
                className="pl-10 bg-white border-gray-300"
              />
            </div>

            {/* Lista de conversaciones */}
            {loadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
                <span className="text-gray-500">Cargando conversaciones...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay conversaciones
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  Inicia una nueva conversación para comenzar a chatear
                </p>
                <Button
                  onClick={() => setShowUserSearch(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                  Buscar usuarios
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() => router.push(`/dashboard/chat/${conversation._id}`)}
                    className="p-4 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                        <span className="text-blue-600 font-medium text-sm">
                          {getConversationDisplayName(conversation).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          <ConversationDisplayName conversation={conversation} />
                        </p>
                        {conversation.ultimoMensaje && (
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.ultimoMensaje.contenido}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          {conversation.ultimoMensaje
                            ? new Intl.DateTimeFormat('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              }).format(new Date(conversation.ultimoMensaje.fechaCreacion || conversation.fechaCreacion))
                            : new Intl.DateTimeFormat('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                              }).format(new Date(conversation.fechaCreacion))
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Botón para agregar nueva conversación */}
                <Button
                  onClick={() => setShowUserSearch(true)}
                  variant="outline"
                  className="w-full flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 mt-4"
                >
                  <Plus className="w-4 h-4" />
                  Nueva conversación
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Área principal del chat */}
        <div className="lg:col-span-2">
          {showUserSearch ? (
            /* Modal de búsqueda de usuarios */
            <Card className="h-[600px] flex flex-col bg-white border border-gray-200 shadow-md rounded-xl">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Buscar usuarios para chatear
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserSearch(false)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Búsqueda de usuarios */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Buscar por nombre, carrera, empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-gray-300"
                    />
                  </div>

                  {/* Filtro por rol */}
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      const v = e.target.value as '' | Rol;
                      setSelectedRole(v);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Todos los roles</option>
                    <option value="ESTUDIANTE">Estudiantes</option>
                    <option value="EMPRESA">Empresas</option>
                    <option value="INSTITUCION">Instituciones</option>
                  </select>
                </div>
              </div>

              {/* Lista de usuarios */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
                    <span className="text-gray-500">Buscando usuarios...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-blue-50 transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-sm">
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={`${user.nombre} ${user.apellido}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-blue-600 font-medium text-sm">
                                {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                              </span>
                            )}
                          </div>

                          {/* Info del usuario */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {user.rol === 'EMPRESA' && user.empresa?.nombre_empresa
                                  ? user.empresa.nombre_empresa
                                  : `${user.nombre} ${user.apellido}`
                                }
                              </h4>
                              <Badge variant="secondary" className={`text-xs ${getRoleColor(user.rol)}`}>
                                <span className="flex items-center gap-1">
                                  {getRoleIcon(user.rol)}
                                  {user.rol}
                                </span>
                              </Badge>
                              {user.emailVerificado && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" title="Verificado" />
                              )}
                            </div>

                            <p className="text-sm text-gray-500">
                              {user.rol === 'ESTUDIANTE' && user.estudiante && (
                                <>
                                  {user.estudiante.carrera && user.estudiante.universidad
                                    ? `${user.estudiante.carrera} - ${user.estudiante.universidad}`
                                    : user.estudiante.carrera || user.estudiante.universidad || user.email
                                  }
                                </>
                              )}
                              {user.rol === 'EMPRESA' && user.empresa && (
                                `${user.empresa.rubro || 'Empresa'} - ${user.ubicacion || 'Sin ubicación'}`
                              )}
                              {user.rol === 'INSTITUCION' && user.institucion && (
                                `${user.institucion.tipo || 'Institución'} - ${user.ubicacion || 'Sin ubicación'}`
                              )}
                              {(!user.estudiante && !user.empresa && !user.institucion) && user.email}
                            </p>

                            {/* Habilidades para estudiantes */}
                            {user.rol === 'ESTUDIANTE' && user.estudiante?.habilidades && user.estudiante.habilidades.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.estudiante.habilidades.slice(0, 3).map((skill, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                                {user.estudiante.habilidades.length > 3 && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                                    +{user.estudiante.habilidades.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <div className={`flex items-center gap-1`}>
                                <div className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span>{user.activo ? 'Activo' : 'Inactivo'}</span>
                              </div>
                              {user._count && (
                                <span>{user._count.seguidores} seguidores</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Botón de acción */}
                        <Button
                          onClick={() => handleStartConversation(user)}
                          size="sm"
                          disabled={!user.activo || startingChat === user.id}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {startingChat === user.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Iniciando...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4" />
                              Chat
                            </>
                          )}
                        </Button>
                      </div>
                    ))}

                    {users.length === 0 && !loading && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-500">
                          {searchTerm || selectedRole
                            ? `No se encontraron usuarios${searchTerm ? ` con "${searchTerm}"` : ''}${selectedRole ? ` del rol ${selectedRole}` : ''}`
                            : 'No hay usuarios disponibles'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            /* Estado vacío - Bienvenida */
            <Card className="h-[600px] flex flex-col bg-white border border-gray-200 shadow-md rounded-xl">
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-12 h-12 text-blue-500" />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    ¡Bienvenido al Chat de ProTalent!
                  </h2>

                  <p className="text-gray-600 mb-6">
                    Conecta con empresas, estudiantes e instituciones en tiempo real.
                    Busca usuarios para iniciar una conversación.
                  </p>

                  {/* Connection status */}
                  <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-gray-50">
                    {connected ? (
                      <>
                        <Wifi className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Chat en tiempo real activo</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600">Conectando al chat...</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowUserSearch(true)}
                      className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Buscar usuarios
                    </Button>

                    <div className="text-center">
                      <div className="border-t border-gray-200 my-4"></div>
                      <p className="text-sm text-gray-500">
                        Encuentra profesionales, estudiantes y empresas en tu red
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}