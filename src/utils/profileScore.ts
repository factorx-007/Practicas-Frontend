import { StudentProfile, UserProfile } from '@/types/user';

export const calculateProfileScore = (profile: StudentProfile | UserProfile | null): number => {
    if (!profile) return 0;

    // If it's just a UserProfile (not full student profile), we can only check basic info
    if (!('carrera' in profile)) {
        let score = 0;
        if (profile.nombre && profile.apellido) score += 10;
        if (profile.avatar) score += 5;
        return score;
    }

    const student = profile as StudentProfile;
    let score = 0;

    // Información básica (30%)
    if (student.usuario.nombre && student.usuario.apellido) score += 10;
    if (student.universidad && student.carrera) score += 10;
    if (student.usuario.avatar) score += 5;
    // Semestre y promedio no están en el tipo StudentProfile actual, usamos placeholders o lógica alternativa
    // Asumimos que si tiene educación registrada, cuenta como info académica
    if (student.educacion && student.educacion.length > 0) score += 5;

    // Habilidades y competencias (25%)
    const skillsCount = student.habilidadesNuevas?.length || 0;
    if (skillsCount >= 5) score += 15;
    else if (skillsCount >= 3) score += 10;
    else if (skillsCount >= 1) score += 5;

    const languagesCount = student.idiomas?.length || 0;
    if (languagesCount >= 2) score += 10;
    else if (languagesCount >= 1) score += 5;

    // Experiencia y proyectos (30%)
    const experienceCount = student.experiencias?.length || 0;
    if (experienceCount >= 2) score += 15;
    else if (experienceCount >= 1) score += 10;

    const projectsCount = student.proyectos?.length || 0;
    if (projectsCount >= 2) score += 15;
    else if (projectsCount >= 1) score += 10;

    // Extras (15%)
    const certsCount = student.certificaciones?.length || 0;
    if (certsCount >= 1) score += 5;
    if (student.linkedin) score += 3;
    if (student.github) score += 3;
    if (student.portafolio) score += 2;
    if (student.cv) score += 2;

    return Math.min(100, score);
};

export const getProfileSuggestions = (profile: StudentProfile | UserProfile | null): string[] => {
    if (!profile) return [];

    const suggestions: string[] = [];

    // Basic User Profile checks
    const avatar = 'usuario' in profile ? (profile as StudentProfile).usuario.avatar : (profile as UserProfile).avatar;

    if (!avatar) {
        suggestions.push('Agrega una foto de perfil profesional');
    }

    if (!('carrera' in profile)) {
        suggestions.push('Completa tu información de estudiante');
        return suggestions;
    }

    const student = profile as StudentProfile;

    if (!student.carrera || !student.universidad) {
        suggestions.push('Completa tu información académica (Carrera/Universidad)');
    }

    const skillsCount = student.habilidadesNuevas?.length || 0;
    if (skillsCount < 5) {
        suggestions.push('Añade más habilidades técnicas relevantes');
    }

    const projectsCount = student.proyectos?.length || 0;
    if (projectsCount < 2) {
        suggestions.push('Comparte más proyectos para destacar tu experiencia');
    }

    if (!student.linkedin) {
        suggestions.push('Conecta tu perfil de LinkedIn');
    }

    if (!student.github) {
        suggestions.push('Conecta tu perfil de GitHub');
    }

    const certsCount = student.certificaciones?.length || 0;
    if (certsCount === 0) {
        suggestions.push('Agrega certificaciones para validar tus habilidades');
    }

    if (!student.cv) {
        suggestions.push('Sube tu CV actualizado');
    }

    return suggestions.slice(0, 3); // Solo mostrar las 3 principales
};
