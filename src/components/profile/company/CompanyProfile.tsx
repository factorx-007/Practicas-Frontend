'use client';

import { useState } from 'react';
import { UserProfile, CompanyProfile as CompanyProfileType } from '@/types/user';
import ProfileLayout from '../shared/ProfileLayout';
import CompanyOverview from './CompanyOverview';
import CompanyJobs from './CompanyJobs';
import CompanyCulture from './CompanyCulture';
import CompanyAnalytics from './CompanyAnalytics';
import { Building, Briefcase, Users, BarChart2 } from 'lucide-react';

interface CompanyProfileProps {
  profile: (UserProfile & { empresa?: CompanyProfileType }) | CompanyProfileType | null;
  isOwnProfile?: boolean;
  onProfileUpdated: () => void;
}

export default function CompanyProfile({
  profile,
  isOwnProfile = false,
  onProfileUpdated,
}: CompanyProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Building },
    { id: 'jobs', label: 'Empleos', icon: Briefcase },
    { id: 'culture', label: 'Cultura', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <CompanyOverview
            profile={profile}
            onProfileUpdated={onProfileUpdated}
          />
        );
      case 'jobs':
        return <CompanyJobs profile={profile} />;
      case 'culture':
        return (
          <CompanyCulture
            profile={profile}
            onProfileUpdated={onProfileUpdated}
          />
        );
      case 'analytics':
        return <CompanyAnalytics />;
      default:
        return null;
    }
  };

  return (
    <ProfileLayout
      profile={profile}
      isOwnProfile={isOwnProfile}
      title="Perfil de Empresa"
      subtitle="Gestiona la información de tu empresa y tus ofertas laborales"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap
                    ${isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
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
