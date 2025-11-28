import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  User, 
  Building, 
  GraduationCap, 
  Loader2 
} from 'lucide-react';
import { UserProfile } from '@/types/user';
// Removed unused imports
import { ChatService, Conversacion } from '@/services/chat.service'; // Importar ChatService y Conversacion
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importar Image de next/image

export const getRoleIcon = (rol: string) => {
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

export const getRoleColor = (rol: string) => {
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

// Función para obtener el nombre a mostrar de la conversación (similar a chat/page.tsx)
const getConversationDisplayName = (conversation: Conversacion, currentUser: UserProfile | null) => {
  if (conversation.nombre) {
    return conversation.nombre;
  }

  if (conversation.tipo === 'PRIVADA' && currentUser) {
    const otherParticipant = conversation.participantes.find(p => p.id !== currentUser.id);
    if (otherParticipant) {
      return `${otherParticipant.nombre} ${otherParticipant.apellido}`;
    }
  }
  return `Chat ${conversation.tipo.toLowerCase()}`;
};

const ChatUsersHighlights: React.FC = () => {
  const [conversations, setConversations] = useState<Conversacion[]>([]); // Cambiar a conversaciones
  const [loading, setLoading] = useState(false);
  // Removed unused searchTerm state

  const currentUser = useAuthStore(state => state.user);
  const router = useRouter();

  const loadConversations = async () => { // Cambiar a loadConversations
    setLoading(true);
    try {
      const response = await ChatService.obtenerConversaciones(1, 5); // Obtener un límite de conversaciones

      if (response.success && response.data) {
        setConversations(response.data.conversaciones);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations(); // Llamar a loadConversations
  }, []);

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Chats Recientes</h3>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <AnimatePresence>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-2" />
            <span className="text-gray-500 text-sm">Cargando...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 text-sm">
              No hay conversaciones recientes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participantes.find(p => p.id !== currentUser?.id);
              const displayName = getConversationDisplayName(conversation, currentUser);
              const avatarUrl = otherParticipant?.avatar;

              return (
                <motion.div
                  key={conversation._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                  onClick={() => router.push(`/dashboard/chat/${conversation._id}`)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-medium text-xs">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info del usuario/conversación */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {displayName}
                    </h4>
                    {conversation.ultimoMensaje && (
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.ultimoMensaje.contenido}
                      </p>
                    )}
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

export default ChatUsersHighlights;