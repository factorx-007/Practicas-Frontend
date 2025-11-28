import { StudentProfile } from '@/types/user';

// Define los pesos para cada sección del perfil
const PROFILE_WEIGHTS = {
  perfilProfesional: 20, // Resumen, disponibilidad, etc.
  educacion: 20,         // Al menos una entrada
  experiencias: 20,      // Al menos una entrada
  habilidadesNuevas: 20, // Al menos una habilidad
  proyectos: 10,         // Al menos un proyecto
  certificaciones: 5,    // Al menos una certificación
  idiomas: 5,            // Al menos un idioma
};

interface CompletionResult {
  score: number;
  suggestions: string[];
}

export function calculateProfileCompletion(profile: StudentProfile | null): CompletionResult {
  if (!profile) {
    return { score: 0, suggestions: ['Completa tu información básica.'] };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Evaluar Perfil Profesional
  if (profile.perfilProfesional && profile.perfilProfesional.resumen) {
    score += PROFILE_WEIGHTS.perfilProfesional;
  } else {
    suggestions.push('Añade un resumen a tu perfil profesional.');
  }

  // Evaluar Educación
  if (profile.educacion && profile.educacion.length > 0) {
    score += PROFILE_WEIGHTS.educacion;
  } else {
    suggestions.push('Registra tu formación académica.');
  }

  // Evaluar Experiencias
  if (profile.experiencias && profile.experiencias.length > 0) {
    score += PROFILE_WEIGHTS.experiencias;
  } else {
    suggestions.push('Añade al menos una experiencia laboral.');
  }

  // Evaluar Habilidades
  if (profile.habilidadesNuevas && profile.habilidadesNuevas.length > 0) {
    score += PROFILE_WEIGHTS.habilidadesNuevas;
  } else {
    suggestions.push('Enumera tus habilidades técnicas y blandas.');
  }

  // Evaluar Proyectos
  if (profile.proyectos && profile.proyectos.length > 0) {
    score += PROFILE_WEIGHTS.proyectos;
  } else {
    suggestions.push('Muestra tus proyectos personales o académicos.');
  }

  // Evaluar Certificaciones
  if (profile.certificaciones && profile.certificaciones.length > 0) {
    score += PROFILE_WEIGHTS.certificaciones;
  } else {
    suggestions.push('Incluye tus certificaciones más importantes.');
  }

  // Evaluar Idiomas
  if (profile.idiomas && profile.idiomas.length > 0) {
    score += PROFILE_WEIGHTS.idiomas;
  } else {
    suggestions.push('¿Qué idiomas dominas? Añádelos a tu perfil.');
  }

  return {
    score: Math.min(100, Math.round(score)), // Asegurar que no pase de 100
    suggestions,
  };
}
