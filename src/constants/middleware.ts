// Authentication routes - users should not access these when logged in
export const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
] as const;

// Protected routes - require authentication
export const PROTECTED_ROUTES = [
  '/admin',
  '/profile',
  '/settings',
  '/chat',
  '/notifications',
  '/offers/create',
  '/offers/edit',
  '/applications',
  '/students',
  '/reports',
] as const;

// Public routes - accessible to everyone
export const PUBLIC_ROUTES = [
  '/',
  '/dashboard',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/offers', // Public offer listings
] as const;

// Role-specific route permissions
export const ROLE_ROUTES = {
  ESTUDIANTE: [
    '/dashboard/estudiante',
    '/applications',
    '/profile',
    '/chat',
    '/notifications',
    '/offers',
  ],
  EMPRESA: [
    '/dashboard/empresa',
    '/offers/create',
    '/offers/edit',
    '/offers/my-offers',
    '/candidates',
    '/profile',
    '/chat',
    '/notifications',
  ],
  INSTITUCION: [
    '/dashboard/institucion',
    '/students',
    '/reports',
    '/partnerships',
    '/profile',
    '/chat',
    '/notifications',
  ],
  ADMIN: [
    '/admin/dashboard',
    '/admin',
    '/users',
    '/offers/admin',
    '/reports/admin',
    '/settings/admin',
    // Admins have access to all routes
    ...AUTH_ROUTES,
    ...PROTECTED_ROUTES,
    ...PUBLIC_ROUTES,
  ],
} as const;

// Default dashboard paths for each role
export const DEFAULT_DASHBOARD_PATHS = {
  ESTUDIANTE: '/dashboard/estudiante',
  EMPRESA: '/dashboard/empresa',
  INSTITUCION: '/dashboard/institucion',
  ADMIN: '/admin/dashboard',
} as const;

// Routes that require specific roles
export const ROLE_REQUIRED_ROUTES = {
  '/offers/create': ['EMPRESA', 'ADMIN'],
  '/offers/edit': ['EMPRESA', 'ADMIN'],
  '/offers/my-offers': ['EMPRESA', 'ADMIN'],
  '/applications': ['ESTUDIANTE', 'ADMIN'],
  '/candidates': ['EMPRESA', 'ADMIN'],
  '/students': ['INSTITUCION', 'ADMIN'],
  '/reports': ['INSTITUCION', 'EMPRESA', 'ADMIN'],
  '/admin': ['ADMIN'],
  '/dashboard/estudiante': ['ESTUDIANTE', 'ADMIN'],
  '/dashboard/empresa': ['EMPRESA', 'ADMIN'],
  '/dashboard/institucion': ['INSTITUCION', 'ADMIN'],
  '/admin/dashboard': ['ADMIN'],
} as const;

// API routes that should be excluded from middleware
export const API_EXCLUDE_ROUTES = [
  '/api/auth',
  '/api/health',
  '/api/public',
] as const;

// Static file patterns to exclude
export const STATIC_FILE_PATTERNS = [
  '/_next',
  '/favicon',
  '/public',
  '/images',
  '/icons',
  '/static',
] as const;

// File extensions to exclude
export const EXCLUDED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.css', '.js', '.json', '.xml', '.txt',
  '.woff', '.woff2', '.ttf', '.eot',
  '.pdf', '.doc', '.docx', '.zip',
] as const;

export type UserRole = 'ESTUDIANTE' | 'EMPRESA' | 'INSTITUCION' | 'ADMIN';
export type AuthRoute = typeof AUTH_ROUTES[number];
export type ProtectedRoute = typeof PROTECTED_ROUTES[number];
export type PublicRoute = typeof PUBLIC_ROUTES[number];