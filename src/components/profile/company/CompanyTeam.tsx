'use client';

import { UserProfile } from '@/types/user';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Crown
} from 'lucide-react';
import Image from 'next/image'; // Importar Image de next/image

interface CompanyTeamProps {
  profile: UserProfile | null;
}

export default function CompanyTeam({ }: CompanyTeamProps) {
  // Mock team data - this would come from API
  const teamMembers = [
    {
      id: 1,
      name: 'Ana García',
      position: 'CEO',
      department: 'Dirección',
      email: 'ana.garcia@empresa.com',
      phone: '+54 11 1234-5678',
      joinDate: '2020-01-15',
      role: 'admin',
      avatar: null,
      status: 'Activo'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      position: 'CTO',
      department: 'Tecnología',
      email: 'carlos.rodriguez@empresa.com',
      phone: '+54 11 2345-6789',
      joinDate: '2020-03-20',
      role: 'admin',
      avatar: null,
      status: 'Activo'
    },
    {
      id: 3,
      name: 'María López',
      position: 'HR Manager',
      department: 'Recursos Humanos',
      email: 'maria.lopez@empresa.com',
      phone: '+54 11 3456-7890',
      joinDate: '2021-06-10',
      role: 'manager',
      avatar: null,
      status: 'Activo'
    },
    {
      id: 4,
      name: 'Juan Pérez',
      position: 'Senior Developer',
      department: 'Tecnología',
      email: 'juan.perez@empresa.com',
      phone: '+54 11 4567-8901',
      joinDate: '2022-02-15',
      role: 'employee',
      avatar: null,
      status: 'Activo'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      default:
        return 'Empleado';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipo</h2>
          <p className="text-gray-600 mt-1">
            Gestiona los miembros de tu equipo y sus roles
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Invitar Miembro
        </button>
      </div>

      {/* Team Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{teamMembers.length}</p>
              <p className="text-sm text-gray-600">Total Miembros</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {teamMembers.filter(member => member.role === 'admin').length}
              </p>
              <p className="text-sm text-gray-600">Administradores</p>
            </div>
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {teamMembers.filter(member => member.role === 'manager').length}
              </p>
              <p className="text-sm text-gray-600">Gerentes</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {new Set(teamMembers.map(member => member.department)).size}
              </p>
              <p className="text-sm text-gray-600">Departamentos</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Miembros del Equipo</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <Image 
                        src={member.avatar} 
                        alt={member.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {getInitials(member.name)}
                      </span>
                    )}
                  </div>
                  
                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(member.role)}
                        <span className="text-sm text-gray-600">{getRoleLabel(member.role)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{member.position} • {member.department}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Desde {formatDate(member.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Departamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from(new Set(teamMembers.map(member => member.department))).map((department) => {
            const deptMembers = teamMembers.filter(member => member.department === department);
            return (
              <div key={department} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{department}</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">{deptMembers.length}</p>
                <p className="text-sm text-gray-600">miembros</p>
                <div className="mt-3 space-y-1">
                  {deptMembers.slice(0, 3).map((member) => (
                    <p key={member.id} className="text-sm text-gray-600">
                      {member.name} - {member.position}
                    </p>
                  ))}
                  {deptMembers.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{deptMembers.length - 3} más
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <div className="text-blue-600 mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Invitar Miembro</h4>
            <p className="text-sm text-gray-600">Agrega un nuevo miembro al equipo</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <div className="text-green-600 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Gestionar Roles</h4>
            <p className="text-sm text-gray-600">Actualiza permisos y roles</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
            <div className="text-purple-600 mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">Enviar Invitaciones</h4>
            <p className="text-sm text-gray-600">Invita múltiples personas</p>
          </button>
        </div>
      </div>
    </div>
  );
}
