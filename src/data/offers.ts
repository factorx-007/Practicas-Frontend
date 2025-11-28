// Datos simulados de ofertas siguiendo la estructura de la API

export interface MockOffer {
  id: string;
  titulo: string;
  descripcion: string;
  tipo_empleo: 'TIEMPO_COMPLETO' | 'TIEMPO_PARCIAL' | 'PRACTICAS' | 'FREELANCE';
  modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  ubicacion: string;
  salario_min?: number;
  salario_max?: number;
  moneda: 'USD' | 'PEN' | 'EUR';
  fecha_expiracion: string;
  estado: 'ACTIVA' | 'PAUSADA' | 'EXPIRADA' | 'COMPLETADA';
  empresa: {
    id: string;
    nombre: string;
    logo?: string;
    industria: string;
    verificada: boolean;
  };
  requisitos: {
    experiencia_anos: number;
    nivel_educativo: 'BACHILLERATO' | 'TECNICO' | 'UNIVERSITARIO' | 'POSGRADO';
    habilidades: string[];
    idiomas: { idioma: string; nivel: string }[];
  };
  beneficios: string[];
  createdAt: string;
  updatedAt: string;
  postulaciones_count: number;
  vistas: number;
  match_score?: number; // Para estudiantes
}

export const mockOffers: MockOffer[] = [
  {
    id: '1',
    titulo: 'Desarrollador Frontend React Senior',
    descripcion: 'Buscamos un desarrollador frontend con experiencia en React, TypeScript y Next.js para unirse a nuestro equipo de desarrollo. Trabajarás en productos innovadores para el sector fintech.',
    tipo_empleo: 'TIEMPO_COMPLETO',
    modalidad: 'HIBRIDO',
    ubicacion: 'Lima, Perú',
    salario_min: 4000,
    salario_max: 6000,
    moneda: 'USD',
    fecha_expiracion: '2025-10-15T23:59:59.000Z',
    estado: 'ACTIVA',
    empresa: {
      id: 'emp1',
      nombre: 'TechCorp Solutions',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop&crop=center',
      industria: 'Tecnología',
      verificada: true
    },
    requisitos: {
      experiencia_anos: 3,
      nivel_educativo: 'UNIVERSITARIO',
      habilidades: ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL'],
      idiomas: [
        { idioma: 'Español', nivel: 'Nativo' },
        { idioma: 'Inglés', nivel: 'Intermedio' }
      ]
    },
    beneficios: [
      'Seguro médico completo',
      'Work from home flexible',
      'Capacitaciones pagadas',
      'Bonos por rendimiento'
    ],
    createdAt: '2025-09-15T10:00:00.000Z',
    updatedAt: '2025-09-15T10:00:00.000Z',
    postulaciones_count: 47,
    vistas: 234,
    match_score: 92
  },
  {
    id: '2',
    titulo: 'Analista de Datos Junior',
    descripcion: 'Oportunidad para recién egresados en Data Science. Trabajarás con Python, SQL y herramientas de visualización para generar insights que impulsen decisiones de negocio.',
    tipo_empleo: 'TIEMPO_COMPLETO',
    modalidad: 'PRESENCIAL',
    ubicacion: 'Santiago, Chile',
    salario_min: 1200,
    salario_max: 1800,
    moneda: 'USD',
    fecha_expiracion: '2025-10-20T23:59:59.000Z',
    estado: 'ACTIVA',
    empresa: {
      id: 'emp2',
      nombre: 'DataInsights SA',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      industria: 'Consultoría',
      verificada: true
    },
    requisitos: {
      experiencia_anos: 0,
      nivel_educativo: 'UNIVERSITARIO',
      habilidades: ['Python', 'SQL', 'Power BI', 'Excel', 'Statistics'],
      idiomas: [
        { idioma: 'Español', nivel: 'Nativo' },
        { idioma: 'Inglés', nivel: 'Intermedio' }
      ]
    },
    beneficios: [
      'Programa de mentoring',
      'Certificaciones gratuitas',
      'Flexible schedule',
      'Almuerzo incluido'
    ],
    createdAt: '2025-09-18T14:30:00.000Z',
    updatedAt: '2025-09-18T14:30:00.000Z',
    postulaciones_count: 23,
    vistas: 156,
    match_score: 78
  },
  {
    id: '3',
    titulo: 'Diseñador UX/UI',
    descripcion: 'Únete a nuestro equipo de diseño para crear experiencias digitales excepcionales. Buscamos alguien creativo, con ojo para el detalle y pasión por el diseño centrado en el usuario.',
    tipo_empleo: 'TIEMPO_COMPLETO',
    modalidad: 'REMOTO',
    ubicacion: 'Bogotá, Colombia',
    salario_min: 2000,
    salario_max: 3500,
    moneda: 'USD',
    fecha_expiracion: '2025-11-01T23:59:59.000Z',
    estado: 'ACTIVA',
    empresa: {
      id: 'emp3',
      nombre: 'Creative Studio',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center',
      industria: 'Diseño',
      verificada: true
    },
    requisitos: {
      experiencia_anos: 2,
      nivel_educativo: 'UNIVERSITARIO',
      habilidades: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'HTML/CSS'],
      idiomas: [
        { idioma: 'Español', nivel: 'Nativo' },
        { idioma: 'Inglés', nivel: 'Avanzado' }
      ]
    },
    beneficios: [
      'Trabajo 100% remoto',
      'Horarios flexibles',
      'Presupuesto para cursos',
      'Equipo de trabajo incluido'
    ],
    createdAt: '2025-09-20T09:15:00.000Z',
    updatedAt: '2025-09-20T09:15:00.000Z',
    postulaciones_count: 31,
    vistas: 189,
    match_score: 65
  },
  {
    id: '4',
    titulo: 'Practicante de Marketing Digital',
    descripcion: 'Prácticas profesionales en marketing digital. Aprenderás sobre SEO, SEM, redes sociales y analytics mientras trabajas en campañas reales para clientes internacionales.',
    tipo_empleo: 'PRACTICAS',
    modalidad: 'HIBRIDO',
    ubicacion: 'México DF, México',
    salario_min: 600,
    salario_max: 800,
    moneda: 'USD',
    fecha_expiracion: '2025-10-10T23:59:59.000Z',
    estado: 'ACTIVA',
    empresa: {
      id: 'emp4',
      nombre: 'Digital Growth Agency',
      logo: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=100&h=100&fit=crop&crop=center',
      industria: 'Marketing',
      verificada: true
    },
    requisitos: {
      experiencia_anos: 0,
      nivel_educativo: 'UNIVERSITARIO',
      habilidades: ['Google Ads', 'Facebook Ads', 'Analytics', 'Social Media', 'Content Creation'],
      idiomas: [
        { idioma: 'Español', nivel: 'Nativo' },
        { idioma: 'Inglés', nivel: 'Intermedio' }
      ]
    },
    beneficios: [
      'Certificación Google',
      'Mentoría personalizada',
      'Proyectos reales',
      'Posibilidad de contratación'
    ],
    createdAt: '2025-09-19T16:45:00.000Z',
    updatedAt: '2025-09-19T16:45:00.000Z',
    postulaciones_count: 89,
    vistas: 312,
    match_score: 88
  },
  {
    id: '5',
    titulo: 'Ingeniero DevOps',
    descripcion: 'Buscamos un ingeniero DevOps para optimizar nuestros procesos de CI/CD y gestionar nuestra infraestructura en la nube. Experiencia con AWS, Docker y Kubernetes requerida.',
    tipo_empleo: 'TIEMPO_COMPLETO',
    modalidad: 'REMOTO',
    ubicacion: 'Buenos Aires, Argentina',
    salario_min: 3500,
    salario_max: 5500,
    moneda: 'USD',
    fecha_expiracion: '2025-11-15T23:59:59.000Z',
    estado: 'ACTIVA',
    empresa: {
      id: 'emp5',
      nombre: 'CloudTech Solutions',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&crop=center',
      industria: 'Cloud Computing',
      verificada: true
    },
    requisitos: {
      experiencia_anos: 4,
      nivel_educativo: 'UNIVERSITARIO',
      habilidades: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Python'],
      idiomas: [
        { idioma: 'Español', nivel: 'Nativo' },
        { idioma: 'Inglés', nivel: 'Avanzado' }
      ]
    },
    beneficios: [
      'Trabajo remoto total',
      'Presupuesto para certificaciones AWS',
      'Laptop y monitor incluidos',
      'Vacaciones flexibles'
    ],
    createdAt: '2025-09-17T11:20:00.000Z',
    updatedAt: '2025-09-17T11:20:00.000Z',
    postulaciones_count: 15,
    vistas: 98,
    match_score: 45
  }
];

// Funciones helper para filtrar ofertas
export const getOffersByType = (type: string) => {
  return mockOffers.filter(offer => offer.tipo_empleo === type);
};

export const getOffersByModality = (modality: string) => {
  return mockOffers.filter(offer => offer.modalidad === modality);
};

export const getOffersByCompany = (companyId: string) => {
  return mockOffers.filter(offer => offer.empresa.id === companyId);
};

export const getRecommendedOffers = (userSkills: string[] = []) => {
  return mockOffers
    .filter(offer => offer.estado === 'ACTIVA')
    .map(offer => ({
      ...offer,
      match_score: calculateMatchScore(offer.requisitos.habilidades, userSkills)
    }))
    .sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
    .slice(0, 5);
};

const calculateMatchScore = (requiredSkills: string[], userSkills: string[]): number => {
  if (userSkills.length === 0) return Math.floor(Math.random() * 40) + 30; // Random score between 30-70

  const matches = requiredSkills.filter(skill =>
    userSkills.some(userSkill =>
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  return Math.min(95, Math.floor((matches.length / requiredSkills.length) * 100));
};