'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Filter, 
  Plus 
} from 'lucide-react';
import { adminService, UserFilterParams } from '@/services/admin';
import { toast } from 'sonner';
import { UserDetails } from '@/types/admin';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters] = useState<UserFilterParams>({
    rol: '',
    activo: undefined
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Llamada al servicio con los filtros actuales
        const response = await adminService.listUsers(filters);
        
        // Verificar la estructura de la respuesta
        console.log('Respuesta de listUsers:', response);
        
        // Establecer los usuarios de la respuesta
        // La respuesta es un objeto con la propiedad 'data' que contiene el array de usuarios
        setUsers(response?.data || []);
        setIsLoading(false);
      } catch (_error) {
        console.error('Error al cargar usuarios:', _error);
        toast.error('Error al cargar usuarios');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  const handleEditUser = async (userId: string) => {
    try {
      // Obtener detalles del usuario
      const userDetails = await adminService.getUserDetails(userId);
      
      // Aquí podrías abrir un modal de edición o navegar a una página de edición
      console.log('Detalles del usuario para editar:', userDetails);
      toast.info(`Editar usuario ${userId}`);
    } catch (_error) {
      console.error('Error al obtener detalles del usuario:', _error);
      toast.error('No se pudieron obtener los detalles del usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Confirmar eliminación
      const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
      
      if (confirmDelete) {
        await adminService.deleteUser(userId);
        
        // Actualizar lista de usuarios después de eliminar
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        
        toast.success('Usuario eliminado exitosamente');
      }
    } catch (_error) {
      console.error('Error al eliminar usuario:', _error);
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const handleCreateUser = async () => {
    try {
      // Aquí podrías abrir un modal o navegar a un formulario de creación de usuario
      toast.info('Funcionalidad de crear usuario próximamente');
    } catch (_error) {
      console.error('Error al crear usuario:', _error);
      toast.error('No se pudo crear el usuario');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Usuarios</CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>
                      <span 
                        className={`
                          px-2 py-1 rounded-full text-xs 
                          ${user.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}
                        `}
                      >
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
