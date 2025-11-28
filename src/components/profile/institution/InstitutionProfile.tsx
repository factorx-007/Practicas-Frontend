'use client';

import { useState } from 'react';
import { UserProfile } from '@/types/user';
import { 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  Settings,
  TrendingUp,
  Building
} from 'lucide-react';
import ProfileLayout from '../shared/ProfileLayout';
import InstitutionSidebar from './InstitutionSidebar';
import InstitutionOverview from './InstitutionOverview';
import InstitutionPrograms from './InstitutionPrograms';
import InstitutionStudents from './InstitutionStudents';
import InstitutionEvents from './InstitutionEvents';
import InstitutionAnalytics from './InstitutionAnalytics';

interface InstitutionProfileProps {
  profile: UserProfile | null;
}

export default function InstitutionProfile({ profile }: InstitutionProfileProps) {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Building },
    { id: 'programas', label: 'Programas', icon: BookOpen },
    { id: 'estudiantes', label: 'Estudiantes', icon: Users },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'certificaciones', label: 'Certificaciones', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'configuracion', label: 'Configuración', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return <InstitutionOverview profile={profile} />;
      case 'programas':
        return <InstitutionPrograms profile={profile} />;
      case 'estudiantes':
        return <InstitutionStudents profile={profile} />;
      case 'eventos':
        return <InstitutionEvents profile={profile} />;
      case 'certificaciones':
        return <div>Certificaciones - En desarrollo</div>;
      case 'analytics':
        return <InstitutionAnalytics profile={profile} />;
      case 'configuracion':
        return <div>Configuración - En desarrollo</div>;
      default:
        return <InstitutionOverview profile={profile} />;
    }
  };

  return (
    <ProfileLayout 
      profile={profile}
      sidebarContent={<InstitutionSidebar profile={profile} activeTab={activeTab} onTabChange={setActiveTab} />}
    >
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </ProfileLayout>
  );
}
