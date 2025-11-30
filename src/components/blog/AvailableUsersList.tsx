import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UsersService, Usuario } from '@/services/users.service';
import { ChatService } from '@/services/chat.service';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { getRoleColor } from './ChatUsersHighlights';

const AvailableUsersList: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [startingChat, setStartingChat] = useState<string | null>(null);
  const currentUser = useAuthStore(state => state.user);
  const router = useRouter();

  const startConversation = async (userId: string) => {
    console.log('Current User:', currentUser);
    
    if (!currentUser?.id) {
      console.error('Error de autenticación - Usuario no autenticado');
      toast.error('Error de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }

    setStartingChat(userId);
    try {
      // Usar el método mejorado que busca o crea la conversación
      const response = await ChatService.iniciarOEncontrarChat(userId);
      console.log('Respuesta de iniciarOEncontrarChat:', response);
      
      if (response.success && response.data) {
        // Navegar a la conversación usando _id
        const conversationId = response.data._id;
        if (conversationId) {
          toast.success(response.message || 'Conversación iniciada');
          router.push(`/dashboard/chat/${conversationId}`);
        } else {
          console.error('ID de conversación no encontrado en la respuesta:', response.data);
          throw new Error('No se pudo obtener el ID de la conversación');
        }
      } else {
        const errorMessage = response.message || 'No se pudo iniciar la conversación';
        console.error('Error en la respuesta del servidor:', errorMessage);
        
        // Si el error es de autenticación, redirigir al login
        if (errorMessage.toLowerCase().includes('autenticación') || errorMessage.toLowerCase().includes('sesión')) {
          // Limpiar el estado de autenticación
          const { logout } = useAuthStore.getState();
          logout();
          
          // Redirigir al login
          router.push('/auth/login');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          return;
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error al iniciar conversación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al iniciar la conversación';
      
      // Si el error es de autenticación, redirigir al login
      if (errorMessage.toLowerCase().includes('autenticación') || errorMessage.toLowerCase().includes('sesión')) {
        // Limpiar el estado de autenticación
        const { logout } = useAuthStore.getState();
        logout();
        
        // Redirigir al login
        router.push('/auth/login');
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setStartingChat(null);
    }
  };

  const loadAvailableUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UsersService.getUsersForChat({
        limit: 5,
      });

      if (response && response.data && Array.isArray(response.data.data)) {
        const usersData = response.data.data;
        
        // Filtrar el usuario actual
        const filteredUsers = usersData.filter(
          (userItem: Usuario) => userItem.id !== currentUser?.id
        );
        setUsers(filteredUsers);
      } else {
        // Si la estructura no es la esperada, dejar la lista vacía
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading available users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadAvailableUsers();
  }, [loadAvailableUsers]);

  console.log('Rendering users:', users);

  // Log del estado actual
  console.log('Estado actual - loading:', loading, 'users:', users);
  
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center text-sm">
          <Users className="w-4 h-4 mr-2 text-green-500" />
          Usuarios Conectados
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {users.length}
        </span>
      </div>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-green-500 mr-2" />
            <span className="text-gray-500 text-sm">Cargando...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-4">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 text-sm">No hay usuarios disponibles</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((userItem: Usuario) => {
              const isCurrentUser = userItem.id === currentUser?.id;
              const isStartingChat = startingChat === userItem.id;
              
              return (
                <motion.div
                  key={userItem.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group relative"
                >
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors w-full cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      startConversation(userItem.id);
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden">
                          {userItem.avatar ? (
                            <Image
                              src={userItem.avatar}
                              alt={`${userItem.nombre} ${userItem.apellido}`}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-blue-600 font-medium text-sm">
                              {userItem.nombre?.charAt(0)}{userItem.apellido?.charAt(0) || ''}
                            </span>
                          )}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          userItem.activo ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      </div>

                      {/* User Info */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {`${userItem.nombre} ${userItem.apellido}`}
                        </h4>
                        {userItem.rol && (
                          <div className="mt-0.5">
                            <Badge 
                              variant="outline" 
                              className={`text-[9px] px-1.5 py-0 h-4 ${getRoleColor(userItem.rol)}`}
                            >
                              {userItem.rol.toLowerCase()}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="ml-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 p-0 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          startConversation(userItem.id);
                        }}
                        disabled={isStartingChat || isCurrentUser}
                        title={isCurrentUser ? 'No puedes chatear contigo mismo' : 'Iniciar chat'}
                      >
                        {isStartingChat ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailableUsersList;