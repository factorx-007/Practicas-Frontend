import React, { useState, useEffect, useCallback } from 'react';

import { Users, MessageSquare, User, Building, GraduationCap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UsersService, Usuario } from '@/services/users.service';
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

const UserHighlights: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuthStore(state => state.user);
  const router = useRouter();

  const loadTopUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UsersService.getUsersForChat({
        limit: 5, // Limitar a 5 usuarios para destacar
        // Aquí podrías añadir un filtro para "usuarios más activos" o "con más seguidores" si el backend lo soporta
      });

      if (response.success && response.data) {
        // The users are in the 'usuarios' property of the response data
        const allUsers = response.data.usuarios || [];
        const filteredUsers = allUsers.filter(
          (user: Usuario) => user.id !== currentUser?.id
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error loading top users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadTopUsers();
  }, [loadTopUsers]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        <Users className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Usuarios Destacados</h2>
      </div>
      <AnimatePresence>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-gray-500">Cargando usuarios...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No hay usuarios destacados disponibles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-blue-200"
                onClick={() => router.push(`/dashboard/profile/${user.id}`)} // Redirigir al perfil del usuario
              >
                <div className="flex items-center space-x-4">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                        {user.rol === 'EMPRESA' && user.empresa?.nombre_empresa
                          ? user.empresa.nombre_empresa
                          : `${user.nombre} ${user.apellido}`
                        }
                      </h3>
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
                    <p className="text-sm text-gray-500 truncate">
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
                    {user.rol === 'ESTUDIANTE' && user.estudiante?.habilidades && user.estudiante.habilidades.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.estudiante.habilidades.slice(0, 2).map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {user.estudiante.habilidades.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                            +{user.estudiante.habilidades.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar que el clic en el botón active la redirección de la tarjeta
                    router.push(`/dashboard/chat`);
                  }}
                  size="sm"
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserHighlights;
