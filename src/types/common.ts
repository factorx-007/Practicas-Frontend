// Common API Response Interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: PaginationInfo;
}

// Pagination Interface
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Base Entity Interface
export interface BaseEntity {
  id: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Search and Filter Interfaces
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// File Upload Interface
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

// Error Interface
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}

export interface ApiResponseError {
  response?: {
    status: number;
    data: {
      message?: string;
      errors?: { msg?: string; message?: string }[];
    };
  };
}

// Loading State Interface
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Modal Interface
export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}

// Toast Interface
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Form State Interface
export interface FormState<T = unknown> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// Theme Interface
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontFamily: string;
}

// Notification Preference Interface
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  applications: boolean;
  messages: boolean;
  offers: boolean;
  posts: boolean;
}

// Social Media Links Interface
export interface SocialMediaLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  website?: string;
}

// Address Interface
export interface Address {
  street?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Contact Information Interface
export interface ContactInfo {
  email: string;
  phone?: string;
  address?: Address;
  socialMedia?: SocialMediaLinks;
}

// Statistics Interface
export interface Statistics {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: number[];
}

// Chart Data Interface
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

// Menu Item Interface
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: MenuItem[];
  permissions?: string[];
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
}

// Breadcrumb Interface
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Tab Interface
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number;
}

// Table Column Interface
export interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Table Action Interface
export interface TableAction<T = unknown> {
  label: string;
  icon?: string;
  onClick: (item: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (item: T) => boolean;
  visible?: (item: T) => boolean;
}

// Enum-like constants as types
export type UserRole = 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | 'ADMIN';
export type OfferType = 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'FREELANCE' | 'PRACTICAS';
export type WorkModality = 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
export type Currency = 'COP' | 'USD' | 'EUR';
export type EducationLevel = 'BACHILLERATO' | 'TECNICO' | 'UNIVERSITARIO' | 'POSGRADO';
export type ApplicationStatus = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
export type OfferStatus = 'ACTIVA' | 'PAUSADA' | 'CERRADA';

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Generic CRUD Operations
export interface CrudOperations<T> {
  create: (data: Omit<T, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<T>;
  read: (id: string) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (params?: SearchParams) => Promise<ApiResponse<T[]>>;
}