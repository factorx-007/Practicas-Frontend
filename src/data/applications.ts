// Datos simulados de postulaciones siguiendo la estructura de la API

export interface MockApplication {
  id: string;
  estudiante_id: string;
  oferta_id: string;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'EN_PROCESO' | 'CONTRATADO';
  carta_presentacion?: string;
  cv_url?: string;
  fecha_postulacion: string;
  fecha_actualizacion: string;
  notas_empresa?: string;
  calificacion?: number;
  oferta: {
    id: string;
    titulo: string;
    empresa: {
      nombre: string;
      logo?: string;
    };
    ubicacion: string;
    tipo_empleo: string;
    modalidad: string;
    salario_min?: number;
    salario_max?: number;
    moneda: string;
  };
  timeline: {
    fecha: string;
    evento: string;
    descripcion: string;
    actor: 'SISTEMA' | 'ESTUDIANTE' | 'EMPRESA';
  }[];
}

export const mockApplications: MockApplication[] = [
  {
    id: 'app1',
    estudiante_id: 'est1',
    oferta_id: '1',
    estado: 'EN_PROCESO',
    carta_presentacion: 'Estimados, me dirijo a ustedes para expresar mi interés en la posición de Desarrollador Frontend React Senior. Cuento con 3 años de experiencia trabajando con React, TypeScript y Next.js...',
    cv_url: '/documents/cv_juan_perez.pdf',
    fecha_postulacion: '2025-09-16T09:30:00.000Z',
    fecha_actualizacion: '2025-09-20T14:15:00.000Z',
    calificacion: 4,
    oferta: {
      id: '1',
      titulo: 'Desarrollador Frontend React Senior',
      empresa: {
        nombre: 'TechCorp Solutions',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop&crop=center'
      },
      ubicacion: 'Lima, Perú',
      tipo_empleo: 'TIEMPO_COMPLETO',
      modalidad: 'HIBRIDO',
      salario_min: 4000,
      salario_max: 6000,
      moneda: 'USD'
    },
    timeline: [
      {
        fecha: '2025-09-16T09:30:00.000Z',
        evento: 'Postulación enviada',
        descripcion: 'Tu postulación ha sido recibida exitosamente',
        actor: 'SISTEMA'
      },
      {
        fecha: '2025-09-17T11:45:00.000Z',
        evento: 'CV revisado',
        descripcion: 'La empresa ha revisado tu CV',
        actor: 'EMPRESA'
      },
      {
        fecha: '2025-09-19T16:20:00.000Z',
        evento: 'Preseleccionado',
        descripcion: 'Has sido preseleccionado para la siguiente fase',
        actor: 'EMPRESA'
      },
      {
        fecha: '2025-09-20T14:15:00.000Z',
        evento: 'Entrevista programada',
        descripcion: 'Entrevista técnica programada para el 25 de septiembre',
        actor: 'EMPRESA'
      }
    ]
  },
  {
    id: 'app2',
    estudiante_id: 'est1',
    oferta_id: '2',
    estado: 'ACEPTADA',
    carta_presentacion: 'Me complace postularme para la posición de Analista de Datos Junior. Como recién egresado de Ingeniería de Sistemas con especialización en Data Science...',
    cv_url: '/documents/cv_juan_perez.pdf',
    fecha_postulacion: '2025-09-18T15:20:00.000Z',
    fecha_actualizacion: '2025-09-21T10:30:00.000Z',
    calificacion: 5,
    oferta: {
      id: '2',
      titulo: 'Analista de Datos Junior',
      empresa: {
        nombre: 'DataInsights SA',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center'
      },
      ubicacion: 'Santiago, Chile',
      tipo_empleo: 'TIEMPO_COMPLETO',
      modalidad: 'PRESENCIAL',
      salario_min: 1200,
      salario_max: 1800,
      moneda: 'USD'
    },
    timeline: [
      {
        fecha: '2025-09-18T15:20:00.000Z',
        evento: 'Postulación enviada',
        descripcion: 'Tu postulación ha sido recibida exitosamente',
        actor: 'SISTEMA'
      },
      {
        fecha: '2025-09-19T08:15:00.000Z',
        evento: 'Perfil revisado',
        descripcion: 'La empresa ha revisado tu perfil completo',
        actor: 'EMPRESA'
      },
      {
        fecha: '2025-09-20T12:45:00.000Z',
        evento: 'Entrevista realizada',
        descripcion: 'Entrevista técnica completada exitosamente',
        actor: 'EMPRESA'
      },
      {
        fecha: '2025-09-21T10:30:00.000Z',
        evento: 'Oferta extendida',
        descripcion: 'La empresa te ha extendido una oferta de trabajo',
        actor: 'EMPRESA'
      }
    ]
  },
  {
    id: 'app3',
    estudiante_id: 'est1',
    oferta_id: '4',
    estado: 'PENDIENTE',
    carta_presentacion: 'Estimado equipo de Digital Growth Agency, me dirijo a ustedes para solicitar la oportunidad de realizar mis prácticas profesionales...',
    cv_url: '/documents/cv_juan_perez.pdf',
    fecha_postulacion: '2025-09-20T11:00:00.000Z',
    fecha_actualizacion: '2025-09-20T11:00:00.000Z',
    oferta: {
      id: '4',
      titulo: 'Practicante de Marketing Digital',
      empresa: {
        nombre: 'Digital Growth Agency',
        logo: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=100&h=100&fit=crop&crop=center'
      },
      ubicacion: 'México DF, México',
      tipo_empleo: 'PRACTICAS',
      modalidad: 'HIBRIDO',
      salario_min: 600,
      salario_max: 800,
      moneda: 'USD'
    },
    timeline: [
      {
        fecha: '2025-09-20T11:00:00.000Z',
        evento: 'Postulación enviada',
        descripcion: 'Tu postulación ha sido recibida exitosamente',
        actor: 'SISTEMA'
      }
    ]
  },
  {
    id: 'app4',
    estudiante_id: 'est1',
    oferta_id: '3',
    estado: 'RECHAZADA',
    carta_presentacion: 'Estimado equipo de Creative Studio, me entusiasma la oportunidad de contribuir como Diseñador UX/UI...',
    cv_url: '/documents/cv_juan_perez.pdf',
    fecha_postulacion: '2025-09-15T14:30:00.000Z',
    fecha_actualizacion: '2025-09-18T09:15:00.000Z',
    notas_empresa: 'Perfil interesante pero buscamos mayor experiencia en research y testing',
    oferta: {
      id: '3',
      titulo: 'Diseñador UX/UI',
      empresa: {
        nombre: 'Creative Studio',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center'
      },
      ubicacion: 'Bogotá, Colombia',
      tipo_empleo: 'TIEMPO_COMPLETO',
      modalidad: 'REMOTO',
      salario_min: 2000,
      salario_max: 3500,
      moneda: 'USD'
    },
    timeline: [
      {
        fecha: '2025-09-15T14:30:00.000Z',
        evento: 'Postulación enviada',
        descripcion: 'Tu postulación ha sido recibida exitosamente',
        actor: 'SISTEMA'
      },
      {
        fecha: '2025-09-16T10:20:00.000Z',
        evento: 'En revisión',
        descripcion: 'Tu postulación está siendo evaluada por el equipo',
        actor: 'EMPRESA'
      },
      {
        fecha: '2025-09-18T09:15:00.000Z',
        evento: 'No seleccionado',
        descripcion: 'Aunque tu perfil es interesante, hemos decidido continuar con otros candidatos',
        actor: 'EMPRESA'
      }
    ]
  }
];

// Funciones helper para manejar postulaciones
export const getApplicationsByStatus = (status: string) => {
  return mockApplications.filter(app => app.estado === status);
};

export const getApplicationsByStudentId = (studentId: string) => {
  return mockApplications.filter(app => app.estudiante_id === studentId);
};

export const getApplicationStats = (studentId: string) => {
  const applications = getApplicationsByStudentId(studentId);

  return {
    total: applications.length,
    pendientes: applications.filter(app => app.estado === 'PENDIENTE').length,
    en_proceso: applications.filter(app => app.estado === 'EN_PROCESO').length,
    aceptadas: applications.filter(app => app.estado === 'ACEPTADA').length,
    rechazadas: applications.filter(app => app.estado === 'RECHAZADA').length,
    contratado: applications.filter(app => app.estado === 'CONTRATADO').length,
  };
};

export const getRecentApplications = (studentId: string, limit = 3) => {
  return mockApplications
    .filter(app => app.estudiante_id === studentId)
    .sort((a, b) => new Date(b.fecha_actualizacion).getTime() - new Date(a.fecha_actualizacion).getTime())
    .slice(0, limit);
};