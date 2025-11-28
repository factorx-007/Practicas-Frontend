'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  MessageCircle, 
  UserPlus, 
  Globe, 
  Briefcase 
} from 'lucide-react';
import { toast } from 'sonner';

// Tipos de datos de networking
interface Contact {
  id: string;
  nombre: string;
  email: string;
  titulo: string;
  empresa: string;
  sector: string;
  conectado?: boolean;
}

export default function NetworkingPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      nombre: 'María Rodríguez',
      email: 'maria.rodriguez@example.com',
      titulo: 'Gerente de Recursos Humanos',
      empresa: 'Tech Solutions Inc.',
      sector: 'Tecnología',
      conectado: false
    },
    {
      id: '2',
      nombre: 'Carlos Gómez',
      email: 'carlos.gomez@example.com',
      titulo: 'Líder de Desarrollo',
      empresa: 'Creative Digital Agency',
      sector: 'Marketing Digital',
      conectado: true
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    sector: 'TODOS'
  });

  const handleConnectContact = (contactId: string) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, conectado: !contact.conectado } 
        : contact
    );
    
    const contactToConnect = updatedContacts.find(contact => contact.id === contactId);
    
    if (contactToConnect) {
      setContacts(updatedContacts);
      toast.success(
        contactToConnect.conectado 
          ? 'Conexión establecida exitosamente' 
          : 'Conexión eliminada'
      );
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchSearch = contact.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                        contact.empresa.toLowerCase().includes(filters.search.toLowerCase()) ||
                        contact.titulo.toLowerCase().includes(filters.search.toLowerCase());
    const matchSector = filters.sector === 'TODOS' || contact.sector === filters.sector;
    
    return matchSearch && matchSector;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Networking</h1>
            <p className="text-blue-100">
              Expande tu red profesional y oportunidades
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nombre, empresa, título..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <select 
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="TODOS">Todos los Sectores</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Marketing Digital">Marketing Digital</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Diseño">Diseño</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Contactos */}
      <div className="space-y-4">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id} 
            className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {contact.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.titulo} - {contact.empresa}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {contact.sector}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Globe className="w-4 h-4 mr-1" />
                      {contact.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleConnectContact(contact.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                  ${contact.conectado 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
              >
                {contact.conectado ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Conectado</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Conectar</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  toast.info('Función de mensajería próximamente');
                }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sin Contactos */}
      {filteredContacts.length === 0 && (
        <div className="text-center bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay contactos {filters.sector !== 'TODOS' && `en ${filters.sector}`}
          </h3>
          <p className="text-gray-600 mb-6">
            Próximamente más oportunidades de networking
          </p>
        </div>
      )}
    </div>
  );
}
