'use client';

import { UserProfile } from '@/types/user';
import { 
  Building, 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  TrendingUp,
  Settings
} from 'lucide-react';
// usePathname y Link están comentados hasta que se necesiten
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';

interface InstitutionSidebarProps {
  profile: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function InstitutionSidebar({ 
  profile, 
  activeTab, 
  onTabChange 
}: InstitutionSidebarProps) {
  // const pathname = usePathname();
  
  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Building },
    { id: 'estudiantes', label: 'Estudiantes', icon: Users },
    { id: 'programas', label: 'Programas', icon: BookOpen },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'logros', label: 'Logros', icon: Award },
    { id: 'analiticas', label: 'Analíticas', icon: TrendingUp },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white rounded-xl border border-gray-200 p-4 space-y-2">
      <div className="p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {profile?.nombre || 'Institución'}
        </h2>
        <p className="text-sm text-gray-500">Panel de control</p>
      </div>
      
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
