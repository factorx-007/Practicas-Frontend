// API Configuration
export const API_BASE_URL = typeof window !== 'undefined'
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    CHECK: '/auth/check',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  USERS: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    UPDATE_STUDENT_PROFILE: '/users/me/student',
    UPDATE_COMPANY_PROFILE: '/users/me/company',
    UPDATE_INSTITUTION_PROFILE: '/users/me/institution',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/upload/avatar',
    UPLOAD_CV: '/users/upload/cv',
    SEARCH: '/users/search',
    FOLLOW: (id: string) => `/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/users/${id}/follow`,
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
  },
  OFFERS: {
    BASE: '/offers',
    CREATE: '/offers',
    UPDATE: (id: string) => `/offers/${id}`,
    DELETE: (id: string) => `/offers/${id}`,
    GET_BY_ID: (id: string) => `/offers/${id}`,
    SEARCH: '/offers/search',
    MY_OFFERS: '/offers/company/my-offers',
    ADMIN_ALL: '/offers/admin/all',
    STUDENT_MY_APPLICATIONS: '/offers/student/my-applications'
  },
  APPLICATIONS: {
    BASE: '/applications',
    CREATE: '/applications',
    UPDATE: (id: string) => `/applications/${id}`,
    DELETE: (id: string) => `/applications/${id}`,
    GET_BY_ID: (id: string) => `/applications/${id}`,
    BY_OFFER: (offerId: string) => `/applications/offer/${offerId}`,
    MY_APPLICATIONS: '/applications/my-applications',
    STUDENT_MY_APPLICATIONS: '/applications/student/my-applications',
    DETAILS: (id: string) => `/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`
  },
  POSTS: {
    BASE: '/posts',
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    GET_BY_ID: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/unlike`,
  },
  COMMENTS: {
    BASE: '/comments',
    CREATE: '/comments',
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    BY_POST: (postId: string) => `/comments/post/${postId}`,
  },
  CHAT: {
    CONVERSATIONS: '/chat/conversaciones',
    MESSAGES: (conversationId: string) => `/chat/conversaciones/${conversationId}/mensajes`,
    CREATE_CONVERSATION: '/chat/conversaciones',
    SEND_MESSAGE: '/chat/mensajes',
    ADD_REACTION: (messageId: string) => `/chat/mensajes/${messageId}/reacciones`,
    MARK_READ: '/chat/leido',
    STATISTICS: '/chat/estadisticas',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    UNREAD_COUNT: '/notifications/unread-count',
  },
  BLOG: {
    BASE: '/blog',
    CREATE: '/blog',
    LIST: '/blog',
    GET_BY_ID: (id: string) => `/blog/${id}`,
    UPDATE: (id: string) => `/blog/${id}`,
    DELETE: (id: string) => `/blog/${id}`,
    SEARCH: '/blog/search'
  },
} as const;

// User Roles
export const USER_ROLES = {
  ESTUDIANTE: 'ESTUDIANTE',
  EMPRESA: 'EMPRESA',
  INSTITUCION: 'INSTITUCION',
  ADMIN: 'ADMIN',
} as const;

// Offer Types
export const OFFER_TYPES = {
  TIEMPO_COMPLETO: 'TIEMPO_COMPLETO',
  MEDIO_TIEMPO: 'MEDIO_TIEMPO',
  FREELANCE: 'FREELANCE',
  PRACTICAS: 'PRACTICAS',
} as const;

// Work Modality
export const WORK_MODALITY = {
  PRESENCIAL: 'PRESENCIAL',
  REMOTO: 'REMOTO',
  HIBRIDO: 'HIBRIDO',
} as const;

// Currencies
export const CURRENCIES = {
  COP: 'COP',
  USD: 'USD',
  EUR: 'EUR',
} as const;

// Education Levels
export const EDUCATION_LEVELS = {
  SECUNDARIA: 'SECUNDARIA',
  TECNICO: 'TECNICO',
  UNIVERSITARIO: 'UNIVERSITARIO',
  POSTGRADO: 'POSTGRADO',
} as const;

// Application Status
export const APPLICATION_STATUS = {
  PENDIENTE: 'PENDIENTE',
  ACEPTADA: 'ACEPTADA',
  RECHAZADA: 'RECHAZADA',
} as const;

// Offer Status
export const OFFER_STATUS = {
  ACTIVA: 'ACTIVA',
  PAUSADA: 'PAUSADA',
  CERRADA: 'CERRADA',
} as const;

// Contract Duration
export const DURACION_CONTRATO = {
  INDETERMINADO: "Indefinido",
  TEMPORAL: "Temporal",
  PROYECTO: "Por Proyecto",
  PRACTICAS: "Prácticas"
} as const;

// Socket Events
export const SOCKET_EVENTS = {
  CHAT: {
    JOIN_CONVERSATION: 'join_conversation',
    LEAVE_CONVERSATION: 'leave_conversation',
    SEND_MESSAGE: 'send_message',
    RECEIVE_MESSAGE: 'receive_message',
    TYPING_START: 'typing_start',
    TYPING_STOP: 'typing_stop',
    USER_TYPING: 'user_typing',
    USER_STOPPED_TYPING: 'user_stopped_typing',
    MARK_READ: 'mark_read',
    MESSAGE_READ: 'message_read',
  },
  NOTIFICATIONS: {
    NEW_NOTIFICATION: 'new_notification',
    MARK_NOTIFICATION_READ: 'mark_notification_read',
    GET_UNREAD_COUNT: 'get_unread_count',
    UNREAD_COUNT_UPDATE: 'unread_count_update',
  },
} as const;

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'protalent_access_token',
  REFRESH_TOKEN: 'protalent_refresh_token',
  USER_DATA: 'protalent_user_data',
  THEME: 'protalent_theme',
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'Formato de email inválido',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres',
  PASSWORD_COMPLEXITY: 'La contraseña debe contener al menos una minúscula, una mayúscula y un número',
  PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
  PHONE_INVALID: 'Formato de teléfono inválido',
  URL_INVALID: 'URL inválida',
  DATE_INVALID: 'Fecha inválida',
  FILE_SIZE_LIMIT: 'El archivo es demasiado grande',
  FILE_TYPE_INVALID: 'Tipo de archivo no válido',
} as const;

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  OFFERS: '/offers',
  APPLICATIONS: '/applications',
  POSTS: '/posts',
  CHAT: '/chat',
  SETTINGS: '/settings',
} as const;

// Export types
export type UserRole = keyof typeof USER_ROLES;
export type OfferType = keyof typeof OFFER_TYPES;
export type WorkModality = keyof typeof WORK_MODALITY;
export type Currency = keyof typeof CURRENCIES;
export type EducationLevel = keyof typeof EDUCATION_LEVELS;
export type ApplicationStatus = keyof typeof APPLICATION_STATUS;
export type OfferStatus = keyof typeof OFFER_STATUS;
export type ContractDuration = keyof typeof DURACION_CONTRATO;

// Experience Levels
export const EXPERIENCE_LEVELS = {
  SIN_EXPERIENCIA: 'SIN_EXPERIENCIA',
  JUNIOR: 'JUNIOR',
  SEMI_SENIOR: 'SEMI_SENIOR',
  SENIOR: 'SENIOR',
} as const;

// Añadir tipo para Experience Levels
export type ExperienceLevel = keyof typeof EXPERIENCE_LEVELS;