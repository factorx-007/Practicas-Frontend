import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Search, 
  User, 
  Building, 
  GraduationCap, 
  Loader2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UsersService, Usuario } from '@/services/users.service';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Importar Image de next/image
type RolType = 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION';

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

const MessageHighlights: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<RolType | ''>('');

  const currentUser = useAuthStore(state => state.user);
  const router = useRouter();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UsersService.getUsersForChat({
        query: searchTerm || undefined,
        rol: selectedRole || undefined,
        limit: 5 // Limitar a 5 usuarios para la vista de blog
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
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedRole, currentUser?.id]);

  useEffect(() => {
    loadUsers();
  }, [searchTerm, selectedRole, loadUsers]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Usuarios para Chatear</h2>
        </div>
      </div>

      {/* Búsqueda de usuarios */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>

        <select 
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as RolType)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-auto"
        >
          <option value="">Todos los roles</option>
          <option value="ESTUDIANTE">Estudiantes</option>
          <option value="EMPRESA">Empresas</option>
          <option value="INSTITUCION">Instituciones</option>
        </select>
      </div>

      {/* Lista de usuarios */}
      <AnimatePresence>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-gray-500">Buscando usuarios...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">
              {searchTerm || selectedRole
                ? `No se encontraron usuarios${searchTerm ? ` con "${searchTerm}"` : ''}${selectedRole ? ` del rol ${selectedRole}` : ''}`
                : 'No hay usuarios disponibles'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
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
                  onClick={() => router.push(`/dashboard/chat`)}
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

export default MessageHighlights;
