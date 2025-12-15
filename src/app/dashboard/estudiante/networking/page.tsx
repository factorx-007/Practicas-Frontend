'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MessageCircle,
  UserPlus,
  UserMinus,
  Briefcase,
  MapPin,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Tipos de datos de networking
interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar?: string;
  rol: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | 'ADMIN';
  // Campos específicos de estudiante
  carrera?: string;
  universidad?: string;
  // Campos específicos de empresa
  nombre_empresa?: string;
  rubro?: string;
  // Campos comunes
  ubicacion?: string;
  isFollowing?: boolean; // Estado local para saber si lo sigo
}

export default function NetworkingPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rol: 'TODOS'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Construir query params
      const params: Record<string, string | number> = {
        page: 1,
        limit: 50
      };

      if (filters.search) params.search = filters.search;
      if (filters.rol !== 'TODOS') params.rol = filters.rol;

      const response = await api.get<User[]>(API_ENDPOINTS.USERS.SEARCH, { params });

      if (response.success && response.data) {
        // Mapear los usuarios para asegurar la estructura correcta
        // Nota: El endpoint de search debería devolver si lo sigo o no, 
        // pero si no, tendríamos que consultar mis seguidos.
        // Por ahora asumiremos que el backend podría no devolver isFollowing directamente en search,
        // así que idealmente deberíamos cruzarlo con "my following".
        // Para esta iteración, vamos a manejar el estado localmente después de la acción.
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.rol]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnect = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        // Dejar de seguir
        const response = await api.delete(API_ENDPOINTS.USERS.UNFOLLOW(userId));
        if (response.success) {
          toast.success('Dejaste de seguir al usuario');
          updateUserFollowStatus(userId, false);
        }
      } else {
        // Seguir
        const response = await api.post(API_ENDPOINTS.USERS.FOLLOW(userId));
        if (response.success) {
          toast.success('Ahora sigues a este usuario');
          updateUserFollowStatus(userId, true);
        }
      }
    } catch (error: unknown) {
      console.error('Error toggling follow:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar conexión';
      toast.error(errorMessage);
    }
  };

  const updateUserFollowStatus = (userId: string, status: boolean) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isFollowing: status } : user
      )
    );
  };

  const handleMessage = (userId: string) => {
    // Redirigir al chat e iniciar conversación
    // Podríamos pasar el ID del usuario como query param para que el chat lo abra
    router.push(`/dashboard/chat?userId=${userId}`);
  };

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'ESTUDIANTE':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Estudiante</span>;
      case 'EMPRESA':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Empresa</span>;
      case 'INSTITUCION':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Institución</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{rol}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Networking Profesional</h1>
            <p className="text-blue-100 text-lg">
              Conecta con empresas y otros estudiantes para expandir tus oportunidades
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, empresa, carrera..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Tipo
            </label>
            <select
              value={filters.rol}
              onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="TODOS">Todos</option>
              <option value="EMPRESA">Empresas</option>
              <option value="ESTUDIANTE">Estudiantes</option>
              <option value="INSTITUCION">Instituciones</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.nombre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-lg">
                        {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {user.nombre} {user.apellido}
                    </h3>
                    <div className="mt-1">
                      {getRoleBadge(user.rol)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {user.rol === 'EMPRESA' && (
                  <>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="line-clamp-1">{user.nombre_empresa || 'Empresa'}</span>
                    </div>
                    {user.rubro && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="line-clamp-1">{user.rubro}</span>
                      </div>
                    )}
                  </>
                )}

                {user.rol === 'ESTUDIANTE' && (
                  <>
                    {user.carrera && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="line-clamp-1">{user.carrera}</span>
                      </div>
                    )}
                    {user.universidad && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="line-clamp-1">{user.universidad}</span>
                      </div>
                    )}
                  </>
                )}

                {user.ubicacion && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">{user.ubicacion}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleConnect(user.id, !!user.isFollowing)}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium
                    ${user.isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
                  `}
                >
                  {user.isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      <span>Siguiendo</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Seguir</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleMessage(user.id)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Enviar mensaje"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
