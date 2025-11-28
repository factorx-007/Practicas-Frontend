import { useMemo } from 'react';
import { useProfile } from './useProfile';
import type { UserProfile, StudentProfile } from '@/types/user';

export function useProfileCompletion() {
  const { data: profile, isLoading } = useProfile();

  const { score, suggestions } = useMemo(() => {
    if (!profile) {
      return { score: 0, suggestions: ['Completa tu información básica'] };
    }

    // Verificar si el perfil es de tipo StudentProfile
    const isStudentProfile = profile && 'usuario' in profile && 'carrera' in profile;
    const studentData = isStudentProfile ? (profile as unknown as StudentProfile) : null;
    const userData = isStudentProfile ? (profile as unknown as StudentProfile).usuario : (profile as UserProfile);
    
    let completedFields = 0;
    let totalFields = 0;
    const missingSuggestions: string[] = [];

    // Basic user information (weight: 30%)
    const basicFields = [
      { field: userData?.nombre, name: 'nombre' },
      { field: userData?.apellido, name: 'apellido' },
      { field: userData?.email, name: 'email' },
      { field: userData?.avatar, name: 'foto de perfil' }
    ];

    basicFields.forEach(({ field, name }) => {
      totalFields += 1;
      if (field) {
        completedFields += 1;
      } else {
        missingSuggestions.push(`Agrega tu ${name}`);
      }
    });

    // Contact information (weight: 15%)
    const contactFields = [
      { field: studentData?.telefono, name: 'número de teléfono' },
      { field: studentData?.ubicacion, name: 'ubicación' }
    ];

    contactFields.forEach(({ field, name }) => {
      totalFields += 1;
      if (field) {
        completedFields += 1;
      } else {
        missingSuggestions.push(`Agrega tu ${name}`);
      }
    });

    // Academic information (weight: 25%)
    const academicFields = [
      { field: studentData?.universidad || undefined, name: 'universidad' },
      { field: studentData?.carrera || undefined, name: 'carrera' },
      // Nota: anio_ingreso y anio_egreso no están en la interfaz StudentProfile
      // Si son necesarios, deberían ser añadidos a la interfaz
      { field: undefined, name: 'año de ingreso' },
      { field: undefined, name: 'año de egreso (si aplica)' }
    ];

    academicFields.forEach(({ field, name }) => {
      totalFields += 1;
      if (field) {
        completedFields += 1;
      } else if (name !== 'año de egreso (si aplica)') {
        missingSuggestions.push(`Agrega tu ${name}`);
      }
    });

    // Professional information (weight: 20%)
    const professionalFields = [
      // Usar experiencias en lugar de experiencia
      { 
        field: studentData?.experiencias && studentData.experiencias.length > 0, 
        name: 'experiencia laboral' 
      },
      // Usar habilidadesNuevas en lugar de habilidades
      { 
        field: studentData?.habilidadesNuevas && studentData.habilidadesNuevas.length > 0, 
        name: 'habilidades' 
      }
    ];

    professionalFields.forEach(({ field, name }) => {
      totalFields += 1;
      if (field) {
        completedFields += 1;
      } else {
        missingSuggestions.push(`Agrega tu ${name}`);
      }
    });

    // Social links (weight: 10%)
    const socialFields = [
      { field: studentData?.linkedin, name: 'perfil de LinkedIn' },
      { field: studentData?.github, name: 'perfil de GitHub' },
      { field: studentData?.portafolio, name: 'portafolio web' }
    ];

    let socialCompleted = 0;
    socialFields.forEach(({ field }) => {
      if (field) socialCompleted += 1;
    });

    // At least one social link counts as completion
    totalFields += 1;
    if (socialCompleted > 0) {
      completedFields += 1;
    } else {
      missingSuggestions.push('Agrega al menos un enlace social (LinkedIn, GitHub o portafolio)');
    }

    const completionScore = Math.round((completedFields / totalFields) * 100);

    // Prioritize suggestions based on importance
    const prioritizedSuggestions = [
      ...missingSuggestions.filter(s => s.includes('nombre') || s.includes('apellido') || s.includes('email')),
      ...missingSuggestions.filter(s => s.includes('universidad') || s.includes('carrera')),
      ...missingSuggestions.filter(s => s.includes('foto de perfil')),
      ...missingSuggestions.filter(s => s.includes('habilidades') || s.includes('experiencia')),
      ...missingSuggestions.filter(s => !s.includes('nombre') && !s.includes('apellido') && !s.includes('email') && 
        !s.includes('universidad') && !s.includes('carrera') && !s.includes('foto de perfil') && 
        !s.includes('habilidades') && !s.includes('experiencia'))
    ];

    return {
      score: completionScore,
      suggestions: prioritizedSuggestions.slice(0, 5) // Limit to top 5 suggestions
    };
  }, [profile]);

  return { score, suggestions, isLoading };
}
