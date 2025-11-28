import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// Definir localmente la interfaz para evitar dependencia de @prisma/client
type TipoContrato = 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'POR_HORAS' | 'TEMPORAL' | 'PRACTICAS' | 'FREELANCE';

interface ExperienciaLaboral {
  id?: string;
  puesto: string;
  empresa: string;
  tipo: TipoContrato;
  fechaInicio: string;
  fechaFin?: string | null;
  descripcion?: string | null;
  habilidades: string[];
  trabajoActual?: boolean;
}

interface StudentProfile {
  habilidades: string[];
  experiencia: ExperienciaLaboral[]; // Array de experiencias laborales
  carrera: string;
  universidad: string;
  ubicacion: string;
  anio_egreso: number;
  anio_ingreso: number;
}

export interface Offer {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  modalidad: string;
  tipoEmpleo: string;
  nivelEducacion: string;
  experiencia: string;
  estado: 'ACTIVA' | 'PAUSADA' | 'CERRADA';
  createdAt: string;
  fechaLimite?: string | null;
  salarioMin?: number | null;
  salarioMax?: number | null;
  moneda: string;
  requisitos: string[];
  preguntas: {
    pregunta: string;
    tipo: string;
    obligatoria: boolean;
    opciones?: string[];
  }[];
  empresa: {
    nombre_empresa: string;
    logo_url?: string;
  };
  _count: {
    postulaciones: number;
  };
  affinity?: AffinityScore;
}

export interface AffinityScore {
  score: number; // 0-100
  level: 'BAJO' | 'MEDIO' | 'ALTO' | 'EXCELENTE';
  reasons: string[];
  breakdown: {
    skills: number;
    experience: number;
    education: number;
    location: number;
    salary: number;
  };
  missingSkills: string[];
  recommendations: string[];
}

export const useOfferAffinity = () => {
  const user = useAuthStore(state => state.user);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  // Obtener perfil del estudiante
  useEffect(() => {
    // En una implementación real, esto vendría del backend
    // Por ahora usamos datos mock basados en la estructura real
    if (user?.rol === 'ESTUDIANTE' && !studentProfile) {
      setStudentProfile({
        habilidades: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB'],
        experiencia: [
          {
            id: 'exp1',
            puesto: 'Desarrollador Frontend',
            empresa: 'Tech Corp',
            tipo: 'TIEMPO_COMPLETO',
            fechaInicio: '2023-01-01',
            fechaFin: '2024-01-01',
            habilidades: ['React', 'JavaScript', 'CSS'],
            trabajoActual: false,
            descripcion: 'Desarrollo de interfaces de usuario con React y TypeScript'
          }
        ],
        carrera: 'Ingeniería de Sistemas',
        universidad: 'Universidad Nacional de Trujillo',
        ubicacion: 'Trujillo',
        anio_egreso: 2024,
        anio_ingreso: 2020
      });
    }
  }, [user, studentProfile]);

  const calculateAffinity = (offer: Offer): AffinityScore => {
    if (!studentProfile || !offer) {
      return {
        score: 0,
        level: 'BAJO',
        reasons: [],
        breakdown: { skills: 0, experience: 0, education: 0, location: 0, salary: 0 },
        missingSkills: [],
        recommendations: []
      };
    }

    let totalScore = 0;
    const reasons: string[] = [];
    const breakdown = { skills: 0, experience: 0, education: 0, location: 0, salary: 0 };
    const missingSkills: string[] = [];
    const recommendations: string[] = [];

    // 1. ANÁLISIS DE HABILIDADES (40% del score total)
    const offerSkills = extractSkillsFromOffer(offer);
    const studentSkills = studentProfile.habilidades.map(s => s.toLowerCase());

    if (offerSkills.length > 0) {
      const matchingSkills = offerSkills.filter(skill =>
        studentSkills.includes(skill.toLowerCase())
      );
      const skillsScore = (matchingSkills.length / offerSkills.length) * 40;
      breakdown.skills = skillsScore;
      totalScore += skillsScore;

      if (matchingSkills.length > 0) {
        reasons.push(`Tienes ${matchingSkills.length} de ${offerSkills.length} habilidades requeridas`);
      }

      // Habilidades faltantes
      missingSkills.push(...offerSkills.filter(skill =>
        !studentSkills.includes(skill.toLowerCase())
      ));

      if (missingSkills.length > 0) {
        recommendations.push(`Considera aprender: ${missingSkills.slice(0, 3).join(', ')}`);
      }
    }

    // 2. ANÁLISIS DE EXPERIENCIA (25% del score total)
    const experienceScore = calculateExperienceScore(offer, studentProfile);
    breakdown.experience = experienceScore;
    totalScore += experienceScore;

    if (experienceScore > 15) {
      reasons.push('Tu experiencia laboral es compatible');
    } else if (experienceScore > 5) {
      reasons.push('Experiencia parcialmente compatible');
    }

    // 3. ANÁLISIS DE EDUCACIÓN (15% del score total)
    const educationScore = calculateEducationScore(offer);
    breakdown.education = educationScore;
    totalScore += educationScore;

    if (educationScore > 10) {
      reasons.push('Tu nivel educativo cumple los requisitos');
    }

    // 4. ANÁLISIS DE UBICACIÓN (10% del score total)
    const locationScore = calculateLocationScore(offer, studentProfile);
    breakdown.location = locationScore;
    totalScore += locationScore;

    if (locationScore > 5) {
      reasons.push('La ubicación es compatible');
    }

    // 5. ANÁLISIS DE TIPO DE EMPLEO (10% del score total)
    const employmentScore = calculateEmploymentScore();
    breakdown.salary = employmentScore;
    totalScore += employmentScore;

    // Determinar nivel
    let level: AffinityScore['level'] = 'BAJO';
    if (totalScore >= 80) level = 'EXCELENTE';
    else if (totalScore >= 65) level = 'ALTO';
    else if (totalScore >= 45) level = 'MEDIO';

    // Agregar recomendaciones generales
    if (totalScore < 50) {
      recommendations.push('Considera mejorar tu perfil con más experiencia o habilidades');
    }
    if (level === 'EXCELENTE') {
      reasons.push('¡Eres un candidato ideal para esta posición!');
    }

    return {
      score: Math.round(totalScore),
      level,
      reasons,
      breakdown,
      missingSkills,
      recommendations
    };
  };

  const extractSkillsFromOffer = (offer: Offer): string[] => {
    const skills: string[] = [];

    // Extraer de requisitos
    if (offer.requisitos) {
      offer.requisitos.forEach(req => {
        // Buscar tecnologías comunes en los requisitos
        const techKeywords = [
          'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
          'Python', 'Java', 'PHP', 'C#', 'C++', 'SQL', 'MongoDB',
          'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'Azure',
          'Git', 'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind',
          'Express', 'Django', 'Laravel', 'Spring', 'REST', 'GraphQL'
        ];

        techKeywords.forEach(tech => {
          if (req.toLowerCase().includes(tech.toLowerCase()) && !skills.includes(tech)) {
            skills.push(tech);
          }
        });
      });
    }

    // También buscar en el título
    if (offer.titulo) {
      const titleWords = offer.titulo.toLowerCase();
      if (titleWords.includes('react')) skills.push('React');
      if (titleWords.includes('node')) skills.push('Node.js');
      if (titleWords.includes('python')) skills.push('Python');
      if (titleWords.includes('java')) skills.push('Java');
      if (titleWords.includes('frontend')) skills.push('Frontend Development');
      if (titleWords.includes('backend')) skills.push('Backend Development');
      if (titleWords.includes('fullstack') || titleWords.includes('full stack')) {
        skills.push('Frontend Development', 'Backend Development');
      }
    }

    return [...new Set(skills)]; // Eliminar duplicados
  };

  const calculateExperienceScore = (offer: Offer, profile: StudentProfile): number => {
    // Calcular años de experiencia del estudiante
    const currentYear = new Date().getFullYear();
    const graduationYear = profile.anio_egreso;
    const yearsOfExperience = Math.max(0, currentYear - graduationYear);

    // Mapear nivel de experiencia requerido a años
    const experienceMapping = {
      'SIN_EXPERIENCIA': 0,
      'JUNIOR': 1,
      'SEMI_SENIOR': 3,
      'SENIOR': 5
    };

    const requiredYears = experienceMapping[offer.experiencia as keyof typeof experienceMapping] || 0;

    if (yearsOfExperience >= requiredYears) {
      return 25; // Score completo
    } else if (yearsOfExperience >= requiredYears - 1) {
      return 15; // Score parcial
    } else {
      return 5; // Score mínimo
    }
  };

  const calculateEducationScore = (offer: Offer): number => {
    const educationMapping = {
      'SECUNDARIO': 1,
      'TECNICO': 2,
      'UNIVERSITARIO': 3,
      'POSTGRADO': 4
    };

    // Determinar nivel del estudiante (asumimos universitario por tener carrera)
    const studentLevel = 3; // Universitario
    const requiredLevel = educationMapping[offer.nivelEducacion as keyof typeof educationMapping] || 2;

    if (studentLevel >= requiredLevel) {
      return 15; // Score completo
    } else {
      return 5; // Score mínimo
    }
  };

  const calculateLocationScore = (offer: Offer, profile: StudentProfile): number => {
    if (!offer.ubicacion || !profile.ubicacion) {
      return 5; // Score neutral si no hay info
    }

    const offerLocation = offer.ubicacion.toLowerCase();
    const studentLocation = profile.ubicacion.toLowerCase();

    // Matching exacto
    if (offerLocation.includes(studentLocation) || studentLocation.includes(offerLocation)) {
      return 10;
    }

    // Si es remoto, siempre compatible
    if (offer.modalidad?.toLowerCase().includes('remoto')) {
      return 10;
    }

    // Ubicaciones diferentes
    return 0;
  };

  const calculateEmploymentScore = (): number => {
    // Por ahora, dar score neutro
    // En el futuro se podría basar en preferencias del estudiante
    return 5;
  };

  const sortOffersByAffinity = (offers: Offer[]): Array<Offer & { affinity: AffinityScore }> => {
    return offers
      .map(offer => ({
        ...offer,
        affinity: calculateAffinity(offer)
      }))
      .sort((a, b) => b.affinity.score - a.affinity.score);
  };

  return {
    calculateAffinity,
    sortOffersByAffinity,
    studentProfile
  };
};