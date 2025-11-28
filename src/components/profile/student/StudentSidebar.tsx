'use client';

import { StudentProfile } from '@/types/user';
import { calculateProfileCompletion } from '@/lib/profile-completion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Github,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer, 
  PolarAngleAxis
} from 'recharts';

interface StudentSidebarProps {
  profile: StudentProfile | null;
}

export default function StudentSidebar({ profile }: StudentSidebarProps) {
  const { score, suggestions } = calculateProfileCompletion(profile);

  if (!profile) {
    return null; // O un skeleton loader
  }

  const { usuario, telefono, ubicacion, linkedin, github, portafolio, experiencias, habilidadesNuevas } = profile;

  const chartData = [
    {
      name: 'Completitud',
      uv: score,
      fill: '#3b82f6', // blue-500
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center mb-4">
          <div className="relative mx-auto h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="80%" 
                outerRadius="100%" 
                data={chartData} 
                startAngle={90} 
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey='uv' angleAxisId={0} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{score}%</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-3">Completitud del Perfil</h3>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <Target className="w-4 h-4 mr-2 text-gray-500" />
              Sugerencias para mejorar
            </h4>
            <ul className="list-disc list-inside space-y-1">
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-600">
                {suggestion}
              </li>
            ))}
            </ul>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
        <div className="space-y-3">
          {usuario?.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{usuario.email}</span>
            </div>
          )}
          {telefono && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
              <span>{telefono}</span>
            </div>
          )}
          {ubicacion && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
              <span>{ubicacion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      {(linkedin || github || portafolio) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enlaces</h3>
          <div className="space-y-3">
            {portafolio && (
              <a href={portafolio} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                <Globe className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                <span>Portafolio</span>
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                <Linkedin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                <span>LinkedIn</span>
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                <Github className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
          Estadísticas
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{habilidadesNuevas?.length || 0}</div>
            <div className="text-xs text-gray-600">Habilidades</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{experiencias?.length || 0}</div>
            <div className="text-xs text-gray-600">Experiencias</div>
          </div>
        </div>
      </div>
    </div>
  );
}