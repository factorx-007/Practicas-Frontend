'use client';

import { useState } from 'react';
import { AlertCircle, TrendingUp, Award, Target, ChevronRight } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { calculateProfileScore, getProfileSuggestions } from '@/utils/profileScore';
import { StudentProfile } from '@/types/user';
import { useRouter } from 'next/navigation';

interface ProfileScoreProps {
  className?: string;
}

export default function ProfileScore({ className = "" }: ProfileScoreProps) {
  const { data: profile, isLoading } = useProfile();
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex justify-center py-4">
            <div className="h-32 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Check if it's a student profile
  const isStudent = profile.rol === 'ESTUDIANTE';
  if (!isStudent) return null;

  // Cast to StudentProfile if it has student specific fields, otherwise treat as partial
  const studentProfile = ('carrera' in profile ? profile : null) as StudentProfile | null;

  const score = calculateProfileScore(profile);
  const suggestions = getProfileSuggestions(profile);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Award;
    if (score >= 70) return Target;
    if (score >= 50) return TrendingUp;
    return AlertCircle;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '¡Excelente! Tu perfil está optimizado';
    if (score >= 70) return 'Buen perfil, algunas mejoras disponibles';
    if (score >= 50) return 'Perfil promedio, hay oportunidades de mejora';
    return 'Perfil básico, necesita más información';
  };

  const ScoreIcon = getScoreIcon(score);

  // Counts for quick stats
  const skillsCount = studentProfile?.habilidadesNuevas?.length || 0;
  const projectsCount = studentProfile?.proyectos?.length || 0;
  const certsCount = studentProfile?.certificaciones?.length || 0;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Score de Perfil</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <span>Detalles</span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
          {/* Circular Progress */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              className={score >= 90 ? 'text-green-500' : score >= 70 ? 'text-blue-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'}
              strokeLinecap="round"
            />
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
            <span className="text-sm text-gray-500 font-medium">/ 100</span>
          </div>
        </div>

        {/* Score Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full border font-medium ${getScoreColor(score)}`}>
          <ScoreIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{getScoreMessage(score)}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{skillsCount}</div>
          <div className="text-xs text-gray-600">Habilidades</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{projectsCount}</div>
          <div className="text-xs text-gray-600">Proyectos</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">{certsCount}</div>
          <div className="text-xs text-gray-600">Certificaciones</div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            Sugerencias para mejorar
          </h3>

          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-sm text-blue-800 font-medium">{suggestion}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push('/dashboard/profile')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Completar Perfil
          </button>
        </div>
      )}

      {/* Detailed Breakdown */}
      {showDetails && studentProfile && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Desglose del Score</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Información básica</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${score > 30 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Habilidades</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${skillsCount >= 5 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (skillsCount / 5) * 100)}%` }}></div>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Experiencia/Proyectos</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${projectsCount >= 2 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (projectsCount / 2) * 100)}%` }}></div>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Extras</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${certsCount >= 1 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (certsCount / 1) * 100)}%` }}></div>
                </div>
                <span className="text-sm font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}