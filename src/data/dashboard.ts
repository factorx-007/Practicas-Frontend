// Datos simulados para dashboards siguiendo la estructura de la API

export interface DashboardStats {
  ESTUDIANTE: {
    perfil_completitud: number;
    postulaciones_mes: number;
    entrevistas_programadas: number;
    ofertas_guardadas: number;
    match_promedio: number;
    tiempo_respuesta_promedio: string; // en horas
  };
  EMPRESA: {
    ofertas_activas: number;
    postulaciones_recibidas: number;
    candidatos_entrevistados: number;
    posiciones_completadas: number;
    tiempo_llenado_promedio: string; // en días
    rating_empresa: number;
  };
  INSTITUCION: {
    estudiantes_activos: number;
    tasa_empleabilidad: number;
    convenios_activos: number;
    graduados_empleados: number;
    empresas_aliadas: number;
    eventos_programados: number;
  };
  ADMIN: {
    usuarios_activos: number;
    nuevos_registros_mes: number;
    ofertas_publicadas_mes: number;
    matches_exitosos: number;
    revenue_mes: number;
    satisfaccion_usuario: number;
  };
}

export const mockDashboardStats: DashboardStats = {
  ESTUDIANTE: {
    perfil_completitud: 92,
    postulaciones_mes: 8,
    entrevistas_programadas: 2,
    ofertas_guardadas: 12,
    match_promedio: 78,
    tiempo_respuesta_promedio: '24'
  },
  EMPRESA: {
    ofertas_activas: 5,
    postulaciones_recibidas: 89,
    candidatos_entrevistados: 15,
    posiciones_completadas: 3,
    tiempo_llenado_promedio: '45',
    rating_empresa: 4.2
  },
  INSTITUCION: {
    estudiantes_activos: 1250,
    tasa_empleabilidad: 87,
    convenios_activos: 45,
    graduados_empleados: 892,
    empresas_aliadas: 78,
    eventos_programados: 12
  },
  ADMIN: {
    usuarios_activos: 15420,
    nuevos_registros_mes: 234,
    ofertas_publicadas_mes: 156,
    matches_exitosos: 89,
    revenue_mes: 45000,
    satisfaccion_usuario: 4.1
  }
};

export interface QuickAction {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  url: string;
  categoria: 'primary' | 'secondary';
  rol: 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | 'ADMIN';
  nuevo?: boolean;
}

export const quickActions: QuickAction[] = [
  // Acciones para estudiantes
  {
    id: 'explorar_ofertas',
    titulo: 'Explorar Ofertas',
    descripcion: 'Encuentra nuevas oportunidades laborales',
    icono: 'Search',
    url: '/offers',
    categoria: 'primary',
    rol: 'ESTUDIANTE'
  },
  {
    id: 'completar_perfil',
    titulo: 'Completar Perfil',
    descripcion: 'Mejora tu perfil para más matches',
    icono: 'User',
    url: '/profile',
    categoria: 'primary',
    rol: 'ESTUDIANTE'
  },
  {
    id: 'ver_postulaciones',
    titulo: 'Mis Postulaciones',
    descripcion: 'Revisa el estado de tus aplicaciones',
    icono: 'FileText',
    url: '/applications',
    categoria: 'secondary',
    rol: 'ESTUDIANTE'
  },
  {
    id: 'practicar_entrevistas',
    titulo: 'Practicar Entrevistas',
    descripcion: 'Prepárate con simulaciones de IA',
    icono: 'Video',
    url: '/interview-practice',
    categoria: 'secondary',
    rol: 'ESTUDIANTE',
    nuevo: true
  },

  // Acciones para empresas
  {
    id: 'crear_oferta',
    titulo: 'Crear Oferta',
    descripcion: 'Publica una nueva vacante',
    icono: 'Plus',
    url: '/offers/create',
    categoria: 'primary',
    rol: 'EMPRESA'
  },
  {
    id: 'revisar_candidatos',
    titulo: 'Revisar Candidatos',
    descripcion: 'Nuevas postulaciones pendientes',
    icono: 'Users',
    url: '/candidates',
    categoria: 'primary',
    rol: 'EMPRESA'
  },
  {
    id: 'programar_entrevistas',
    titulo: 'Programar Entrevistas',
    descripcion: 'Gestiona tu calendario de entrevistas',
    icono: 'Calendar',
    url: '/interviews',
    categoria: 'secondary',
    rol: 'EMPRESA'
  },
  {
    id: 'analytics_hiring',
    titulo: 'Analytics de Hiring',
    descripcion: 'Métricas de reclutamiento',
    icono: 'BarChart',
    url: '/analytics',
    categoria: 'secondary',
    rol: 'EMPRESA'
  },

  // Acciones para instituciones
  {
    id: 'ver_estudiantes',
    titulo: 'Ver Estudiantes',
    descripcion: 'Gestiona los estudiantes activos',
    icono: 'GraduationCap',
    url: '/students',
    categoria: 'primary',
    rol: 'INSTITUCION'
  },
  {
    id: 'crear_evento',
    titulo: 'Crear Evento',
    descripcion: 'Organiza ferias de empleo virtuales',
    icono: 'Calendar',
    url: '/events/create',
    categoria: 'primary',
    rol: 'INSTITUCION'
  },
  {
    id: 'reportes_empleabilidad',
    titulo: 'Reportes de Empleabilidad',
    descripcion: 'Estadísticas de inserción laboral',
    icono: 'TrendingUp',
    url: '/reports',
    categoria: 'secondary',
    rol: 'INSTITUCION'
  },

  // Acciones para admins
  {
    id: 'verificar_empresas',
    titulo: 'Verificar Empresas',
    descripcion: 'Pendientes de verificación',
    icono: 'Shield',
    url: '/admin/companies/pending',
    categoria: 'primary',
    rol: 'ADMIN'
  },
  {
    id: 'moderar_contenido',
    titulo: 'Moderar Contenido',
    descripcion: 'Revisar reportes de usuarios',
    icono: 'Flag',
    url: '/admin/moderation',
    categoria: 'primary',
    rol: 'ADMIN'
  },
  {
    id: 'analytics_plataforma',
    titulo: 'Analytics de Plataforma',
    descripcion: 'KPIs y métricas generales',
    icono: 'PieChart',
    url: '/admin/analytics',
    categoria: 'secondary',
    rol: 'ADMIN'
  }
];

export interface RecentActivity {
  id: string;
  tipo: 'postulacion' | 'entrevista' | 'oferta' | 'mensaje' | 'perfil' | 'empresa';
  titulo: string;
  descripcion: string;
  fecha: string;
  icono: string;
  estado?: 'success' | 'warning' | 'info' | 'error';
  url?: string;
  actor?: {
    nombre: string;
    avatar?: string;
  };
}

export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    tipo: 'postulacion',
    titulo: 'Nueva postulación aceptada',
    descripcion: 'DataInsights SA ha aceptado tu postulación para Analista de Datos Junior',
    fecha: '2025-09-21T10:30:00.000Z',
    icono: 'CheckCircle',
    estado: 'success',
    url: '/applications/app2',
    actor: {
      nombre: 'DataInsights SA',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop&crop=center'
    }
  },
  {
    id: '2',
    tipo: 'entrevista',
    titulo: 'Entrevista programada',
    descripcion: 'Entrevista técnica para el 25 de septiembre a las 10:00 AM',
    fecha: '2025-09-20T14:15:00.000Z',
    icono: 'Calendar',
    estado: 'info',
    url: '/interviews/int1',
    actor: {
      nombre: 'TechCorp Solutions'
    }
  },
  {
    id: '3',
    tipo: 'oferta',
    titulo: 'Nueva oferta recomendada',
    descripcion: 'Desarrollador Python Senior - 95% de match con tu perfil',
    fecha: '2025-09-20T09:45:00.000Z',
    icono: 'Target',
    estado: 'info',
    url: '/offers/6'
  },
  {
    id: '4',
    tipo: 'mensaje',
    titulo: 'Nuevo mensaje',
    descripcion: 'TechCorp te ha enviado un mensaje sobre tu postulación',
    fecha: '2025-09-19T16:20:00.000Z',
    icono: 'MessageCircle',
    estado: 'info',
    url: '/chat/techcorp',
    actor: {
      nombre: 'María García',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b217?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '5',
    tipo: 'perfil',
    titulo: 'Perfil visto 15 veces',
    descripcion: 'Tu perfil ha sido visto por reclutadores esta semana',
    fecha: '2025-09-19T08:00:00.000Z',
    icono: 'Eye',
    estado: 'success'
  }
];

// Datos para métricas y gráficos
export interface MetricData {
  periodo: string;
  valor: number;
  cambio?: number; // porcentaje de cambio respecto al periodo anterior
}

export const postulacionesChart: MetricData[] = [
  { periodo: 'Ene', valor: 12, cambio: 0 },
  { periodo: 'Feb', valor: 8, cambio: -33 },
  { periodo: 'Mar', valor: 15, cambio: 87 },
  { periodo: 'Abr', valor: 22, cambio: 47 },
  { periodo: 'May', valor: 18, cambio: -18 },
  { periodo: 'Jun', valor: 25, cambio: 39 },
  { periodo: 'Jul', valor: 19, cambio: -24 },
  { periodo: 'Ago', valor: 28, cambio: 47 },
  { periodo: 'Sep', valor: 8, cambio: -71 } // Mes actual parcial
];

export const matchChart: MetricData[] = [
  { periodo: 'Semana 1', valor: 72 },
  { periodo: 'Semana 2', valor: 78 },
  { periodo: 'Semana 3', valor: 81 },
  { periodo: 'Semana 4', valor: 85 },
  { periodo: 'Esta semana', valor: 78 }
];

// Próximos eventos/citas
export interface UpcomingEvent {
  id: string;
  tipo: 'entrevista' | 'evento' | 'deadline' | 'seguimiento';
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion?: string;
  empresa?: string;
  urgente?: boolean;
}

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 'ev1',
    tipo: 'entrevista',
    titulo: 'Entrevista Técnica',
    descripcion: 'Frontend Developer - TechCorp Solutions',
    fecha: '2025-09-25T10:00:00.000Z',
    ubicacion: 'Virtual (Google Meet)',
    empresa: 'TechCorp Solutions',
    urgente: true
  },
  {
    id: 'ev2',
    tipo: 'evento',
    titulo: 'Feria Virtual de Empleos Tech',
    descripcion: 'Networking con más de 50 empresas tecnológicas',
    fecha: '2025-09-28T14:00:00.000Z',
    ubicacion: 'Plataforma ProTalent',
    urgente: false
  },
  {
    id: 'ev3',
    tipo: 'deadline',
    titulo: 'Cierre de postulación',
    descripcion: 'Ingeniero DevOps - CloudTech Solutions',
    fecha: '2025-09-30T23:59:00.000Z',
    empresa: 'CloudTech Solutions',
    urgente: false
  },
  {
    id: 'ev4',
    tipo: 'seguimiento',
    titulo: 'Seguimiento de postulación',
    descripcion: 'Han pasado 7 días sin respuesta de Digital Growth Agency',
    fecha: '2025-09-27T09:00:00.000Z',
    empresa: 'Digital Growth Agency',
    urgente: false
  }
];

// Funciones helper
export const getQuickActionsByRole = (role: string) => {
  return quickActions.filter(action => action.rol === role);
};

export const getPrimaryActions = (role: string) => {
  return quickActions.filter(action => action.rol === role && action.categoria === 'primary');
};

export const getSecondaryActions = (role: string) => {
  return quickActions.filter(action => action.rol === role && action.categoria === 'secondary');
};

export const getRecentActivityByType = (type: string) => {
  return mockRecentActivity.filter(activity => activity.tipo === type);
};