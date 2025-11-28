'use client';

import { useState } from 'react';
import type { UserProfile, StudentProfile as StudentProfileType } from '@/types/user';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code, 
  FileText,
  Globe
} from 'lucide-react';
import ProfileLayout from '../shared/ProfileLayout';
import StudentSidebar from './StudentSidebar';
import StudentOverview from './StudentOverview';
import StudentExperience from './StudentExperience';
import StudentEducation from './StudentEducation';
import StudentSkills from './StudentSkills';
import StudentProjects from './StudentProjects';
import StudentCertifications from './StudentCertifications';
import LanguagesSection from '../LanguagesSection';

interface StudentProfileProps {
  profile: UserProfile | StudentProfileType | null;
}

export default function StudentProfile({ profile }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState('resumen');

  // Verificar si es StudentProfile completo o solo UserProfile
  const isFullStudentProfile = (p: unknown): p is StudentProfileType => {
    return Boolean(
      p &&
      typeof p === 'object' &&
      (
        'carrera' in (p as Record<string, unknown>) ||
        'usuarioId' in (p as Record<string, unknown>)
      ) &&
      'usuario' in (p as Record<string, unknown>)
    );
  };

  const studentProfile: StudentProfileType | null = isFullStudentProfile(profile) 
    ? profile 
    : null; // Si solo tenemos UserProfile, los componentes hijos usarán datos mock

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: User },
    { id: 'experiencia', label: 'Experiencia', icon: Briefcase },
    { id: 'educacion', label: 'Educación', icon: GraduationCap },
    { id: 'habilidades', label: 'Habilidades', icon: Code },
    { id: 'idiomas', label: 'Idiomas', icon: Globe },
    { id: 'proyectos', label: 'Proyectos', icon: FileText },
    { id: 'certificaciones', label: 'Certificaciones', icon: Award },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return <StudentOverview profile={studentProfile} />;
      case 'experiencia':
        return <StudentExperience profile={studentProfile} />;
      case 'educacion':
        return <StudentEducation profile={studentProfile} />;
      case 'habilidades':
        return <StudentSkills profile={studentProfile} />;
      case 'idiomas':
        return <LanguagesSection profile={studentProfile || profile} />;
      case 'proyectos':
        return <StudentProjects profile={studentProfile} />;
      case 'certificaciones':
        return <StudentCertifications profile={studentProfile} />;
      case 'configuracion':
        return <div>Configuración - En desarrollo</div>;
      default:
        return <StudentOverview profile={studentProfile} />;
    }
  };

  return (
    <ProfileLayout 
      profile={isFullStudentProfile(profile) ? profile : (profile as UserProfile)}
      sidebarContent={<StudentSidebar profile={studentProfile} />}
    >
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap gap-4 px-6 py-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  } whitespace-nowrap py-2 px-4 border rounded-lg font-medium text-sm flex items-center space-x-2 transition-all duration-200 min-w-0`}
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