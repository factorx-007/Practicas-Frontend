// Datos simulados de usuarios siguiendo la estructura de la API

export interface MockStudent {
  id: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    avatar?: string;
    rol: 'ESTUDIANTE';
    verificado: boolean;
    activo: boolean;
    createdAt: string;
  };
  universidad?: string;
  carrera?: string;
  semestre?: number;
  promedio?: number;
  fecha_graduacion?: string;
  habilidades: string[];
  idiomas: { idioma: string; nivel: string }[];
  experiencia: {
    empresa: string;
    cargo: string;
    desde: string;
    hasta?: string;
    descripcion: string;
    actual: boolean;
  }[];
  proyectos: {
    nombre: string;
    descripcion: string;
    tecnologias: string[];
    url?: string;
    github?: string;
    imagen?: string;
  }[];
  certificaciones: {
    nombre: string;
    institucion: string;
    fecha: string;
    url?: string;
  }[];
  preferencias_laborales: {
    tipos_empleo: string[];
    modalidades: string[];
    ubicaciones: string[];
    salario_min?: number;
    disponibilidad_inicio: string;
  };
  perfil_completitud: number;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  cv_url?: string;
}

export const mockStudents: MockStudent[] = [
  {
    id: 'est1',
    usuario: {
      id: 'user1',
      email: 'juan.perez@universidad.edu',
      nombre: 'Juan Carlos',
      apellido: 'Pérez López',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rol: 'ESTUDIANTE',
      verificado: true,
      activo: true,
      createdAt: '2025-08-15T10:00:00.000Z'
    },
    universidad: 'Universidad Nacional Mayor de San Marcos',
    carrera: 'Ingeniería de Sistemas',
    semestre: 9,
    promedio: 16.8,
    fecha_graduacion: '2025-12-15',
    habilidades: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
      'SQL', 'MongoDB', 'Git', 'Docker', 'AWS'
    ],
    idiomas: [
      { idioma: 'Español', nivel: 'Nativo' },
      { idioma: 'Inglés', nivel: 'Intermedio' },
      { idioma: 'Portugués', nivel: 'Básico' }
    ],
    experiencia: [
      {
        empresa: 'TechStartup Lima',
        cargo: 'Desarrollador Frontend Junior',
        desde: '2024-06-01',
        hasta: '2025-02-28',
        descripcion: 'Desarrollo de interfaces web con React y TypeScript. Implementación de componentes reutilizables y optimización de performance.',
        actual: false
      },
      {
        empresa: 'Universidad (Proyecto)',
        cargo: 'Desarrollador Full Stack',
        desde: '2025-03-01',
        descripcion: 'Desarrollo de sistema de gestión académica como proyecto de tesis. Stack: React + Node.js + PostgreSQL.',
        actual: true
      }
    ],
    proyectos: [
      {
        nombre: 'E-commerce Platform',
        descripcion: 'Plataforma de comercio electrónico completa con carrito de compras, pagos y panel de administración.',
        tecnologias: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
        url: 'https://mi-ecommerce-demo.com',
        github: 'https://github.com/juanperez/ecommerce-platform',
        imagen: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop'
      },
      {
        nombre: 'Task Management App',
        descripcion: 'Aplicación de gestión de tareas con funcionalidades colaborativas, notificaciones en tiempo real.',
        tecnologias: ['Vue.js', 'Firebase', 'Node.js', 'Socket.io'],
        github: 'https://github.com/juanperez/task-manager',
        imagen: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop'
      }
    ],
    certificaciones: [
      {
        nombre: 'AWS Cloud Practitioner',
        institucion: 'Amazon Web Services',
        fecha: '2025-05-15',
        url: 'https://aws.amazon.com/certification/'
      },
      {
        nombre: 'React Developer Certificate',
        institucion: 'Meta',
        fecha: '2024-11-20',
        url: 'https://developers.facebook.com/certificate/'
      }
    ],
    preferencias_laborales: {
      tipos_empleo: ['TIEMPO_COMPLETO', 'PRACTICAS'],
      modalidades: ['REMOTO', 'HIBRIDO'],
      ubicaciones: ['Lima, Perú', 'Remoto', 'Santiago, Chile'],
      salario_min: 2500,
      disponibilidad_inicio: 'Inmediata'
    },
    perfil_completitud: 92,
    linkedin_url: 'https://linkedin.com/in/juancarlosperez',
    github_url: 'https://github.com/juanperez',
    portfolio_url: 'https://juanperez.dev',
    cv_url: '/documents/cv_juan_perez.pdf'
  }
];

export interface MockCompany {
  id: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    avatar?: string;
    rol: 'EMPRESA';
    verificado: boolean;
    activo: boolean;
    createdAt: string;
  };
  empresa: {
    nombre: string;
    descripcion: string;
    industria: string;
    tamaño: 'STARTUP' | 'PEQUEÑA' | 'MEDIANA' | 'GRANDE';
    año_fundacion: number;
    sitio_web: string;
    logo?: string;
    ubicaciones: string[];
    mision?: string;
    vision?: string;
    valores?: string[];
    beneficios: string[];
    cultura: string;
  };
  cargo_representante: string;
  ofertas_publicadas: number;
  candidatos_contratados: number;
  rating_promedio: number;
  verificacion_empresarial: {
    documentos_verificados: boolean;
    fecha_verificacion?: string;
    estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';
  };
}

export const mockCompanies: MockCompany[] = [
  {
    id: 'emp1',
    usuario: {
      id: 'user_comp1',
      email: 'rrhh@techcorp.com',
      nombre: 'María Elena',
      apellido: 'García Torres',
      rol: 'EMPRESA',
      verificado: true,
      activo: true,
      createdAt: '2025-01-10T09:00:00.000Z'
    },
    empresa: {
      nombre: 'TechCorp Solutions',
      descripcion: 'Empresa líder en desarrollo de software y soluciones tecnológicas para el sector financiero. Especializados en aplicaciones móviles, web y sistemas de gestión empresarial.',
      industria: 'Tecnología',
      tamaño: 'MEDIANA',
      año_fundacion: 2018,
      sitio_web: 'https://techcorp.com',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop&crop=center',
      ubicaciones: ['Lima, Perú', 'Bogotá, Colombia'],
      mision: 'Transformar digitalmente a las empresas mediante soluciones tecnológicas innovadoras.',
      vision: 'Ser la empresa de tecnología más confiable de América Latina.',
      valores: ['Innovación', 'Integridad', 'Excelencia', 'Trabajo en equipo'],
      beneficios: [
        'Seguro médico completo',
        'Work from home flexible',
        'Capacitaciones pagadas',
        'Bonos por rendimiento',
        'Días libres adicionales',
        'Presupuesto para equipamiento'
      ],
      cultura: 'Ambiente colaborativo y dinámico que fomenta la innovación y el crecimiento profesional.'
    },
    cargo_representante: 'Gerente de Recursos Humanos',
    ofertas_publicadas: 23,
    candidatos_contratados: 47,
    rating_promedio: 4.6,
    verificacion_empresarial: {
      documentos_verificados: true,
      fecha_verificacion: '2025-01-15T14:30:00.000Z',
      estado: 'VERIFICADO'
    }
  }
];

// Funciones helper
export const getStudentById = (id: string) => {
  return mockStudents.find(student => student.id === id);
};

export const getCompanyById = (id: string) => {
  return mockCompanies.find(company => company.id === id);
};

export const calculateProfileScore = (student: MockStudent): number => {
  let score = 0;

  // Información básica (30%)
  if (student.usuario.nombre && student.usuario.apellido) score += 10;
  if (student.universidad && student.carrera) score += 10;
  if (student.usuario.avatar) score += 5;
  if (student.semestre && student.promedio) score += 5;

  // Habilidades y competencias (25%)
  if (student.habilidades.length >= 5) score += 15;
  else if (student.habilidades.length >= 3) score += 10;
  else if (student.habilidades.length >= 1) score += 5;

  if (student.idiomas.length >= 2) score += 10;
  else if (student.idiomas.length >= 1) score += 5;

  // Experiencia y proyectos (30%)
  if (student.experiencia.length >= 2) score += 15;
  else if (student.experiencia.length >= 1) score += 10;

  if (student.proyectos.length >= 2) score += 15;
  else if (student.proyectos.length >= 1) score += 10;

  // Extras (15%)
  if (student.certificaciones.length >= 1) score += 5;
  if (student.linkedin_url) score += 3;
  if (student.github_url) score += 3;
  if (student.portfolio_url) score += 2;
  if (student.cv_url) score += 2;

  return Math.min(100, score);
};

export const getProfileSuggestions = (student: MockStudent): string[] => {
  const suggestions: string[] = [];
  
  if (!student.usuario.avatar) {
    suggestions.push('Agrega una foto de perfil profesional');
  }

  if (student.habilidades.length < 5) {
    suggestions.push('Añade más habilidades técnicas relevantes');
  }

  if (student.proyectos.length < 2) {
    suggestions.push('Comparte más proyectos para destacar tu experiencia');
  }

  if (!student.linkedin_url) {
    suggestions.push('Conecta tu perfil de LinkedIn');
  }

  if (!student.github_url) {
    suggestions.push('Conecta tu perfil de GitHub');
  }

  if (student.certificaciones.length === 0) {
    suggestions.push('Agrega certificaciones para validar tus habilidades');
  }

  if (!student.cv_url) {
    suggestions.push('Sube tu CV actualizado');
  }

  return suggestions.slice(0, 3); // Solo mostrar las 3 principales
};