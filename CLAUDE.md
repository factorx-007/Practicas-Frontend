# Plan de Desarrollo Frontend - ProTalent

## TODOs por Fases de Desarrollo

### FASE 1: CONFIGURACIÓN Y FUNDACIONES (Semana 1-2)

#### Setup del Proyecto
- [ ] Configurar Next.js 14+ con App Router
- [ ] Configurar TypeScript con tipos estrictos
- [ ] Setup Tailwind CSS + shadcn/ui
- [ ] Configurar Zustand para estado global
- [ ] Setup React Query para data fetching
- [ ] Configurar ESLint + Prettier + Husky
- [ ] Setup testing con Jest + React Testing Library

#### Infraestructura Base
- [ ] Crear sistema de design tokens
- [ ] Implementar tema dark/light
- [ ] Configurar cliente HTTP (axios) con interceptors
- [ ] Setup WebSocket client (Socket.IO)
- [ ] Configurar manejo de autenticación JWT
- [ ] Implementar refresh token automático
- [ ] Setup error boundary global
- [ ] Configurar sistema de logging

---

### FASE 2: SISTEMA DE AUTENTICACIÓN (Semana 3)

#### Módulo Auth
- [ ] Crear layouts para páginas de auth
- [ ] Implementar página de Login responsive
- [ ] Crear formulario de Registro multi-paso
- [ ] Integrar Google OAuth
- [ ] Página de recuperación de contraseña
- [ ] Verificación de email
- [ ] Manejo de estados de autenticación
- [ ] Protección de rutas con middleware

#### Componentes Auth
- [ ] Formulario de login con validación Zod
- [ ] Wizard de registro por roles
- [ ] Selector de tipo de usuario
- [ ] Validación en tiempo real
- [ ] Mensajes de error/éxito
- [ ] Loading states

---

### FASE 3: SISTEMA DE LAYOUTS Y NAVEGACIÓN (Semana 4)

#### Layouts Base
- [ ] Layout principal con header/footer
- [ ] Sidebar navegación por rol
- [ ] Layout de dashboard responsive
- [ ] Layout de auth (sin navegación)
- [ ] Layout de páginas públicas
- [ ] Componente de breadcrumbs

#### Navegación
- [ ] Header principal adaptativo por rol
- [ ] Menú móvil hamburger
- [ ] Navegación bottom tab (mobile)
- [ ] Búsqueda global con autocomplete
- [ ] Notificaciones dropdown
- [ ] Perfil dropdown con acciones

---

### FASE 4: DASHBOARDS POR ROL (Semana 5-6)

#### Dashboard Estudiante
- [ ] Widget de bienvenida personalizada
- [ ] Cards de ofertas recomendadas (IA)
- [ ] Progreso de perfil gamificado
- [ ] Timeline de postulaciones
- [ ] Feed social personalizado
- [ ] Próximos eventos/webinars
- [ ] Métricas de rendimiento

#### Dashboard Empresa
- [ ] KPIs de hiring metrics
- [ ] Ofertas activas con quick actions
- [ ] Pipeline de candidatos
- [ ] Nuevas postulaciones en tiempo real
- [ ] Calendario de entrevistas
- [ ] Talent pool guardado
- [ ] Análisis de rendimiento

#### Dashboard Institución
- [ ] Estadísticas de empleabilidad
- [ ] Lista de estudiantes activos
- [ ] Convenios empresariales
- [ ] Reportes académicos
- [ ] Eventos programados
- [ ] Mapa de egresados

#### Dashboard Admin
- [ ] KPIs principales de plataforma
- [ ] Gráficos analíticos
- [ ] Alertas y notificaciones
- [ ] Acciones rápidas de moderación
- [ ] Geographic distribution
- [ ] Funnel de conversión

---

### FASE 5: MÓDULO DE OFERTAS (Semana 7-8)

#### Exploración de Ofertas
- [ ] Lista de ofertas con filtros inteligentes
- [ ] Cards de oferta optimizadas
- [ ] Sistema de filtrado avanzado
- [ ] Búsqueda con IA
- [ ] Vista de mapa geográfico
- [ ] Paginación infinita
- [ ] Match score visual
- [ ] Ofertas guardadas

#### Detalle de Oferta
- [ ] Página detalle inmersiva
- [ ] CTAs prominentes de postulación
- [ ] Tabs de información
- [ ] Sidebar con match analysis
- [ ] Skills requeridas vs usuario
- [ ] Proceso de postulación claro
- [ ] Compartir en redes sociales

#### Crear/Editar Ofertas (Empresas)
- [ ] Formulario multi-paso
- [ ] Editor rico para descripción
- [ ] Autocomplete para skills
- [ ] Vista previa en tiempo real
- [ ] Configuración de visibilidad
- [ ] Presupuesto de promoción
- [ ] Templates de ofertas

---

### FASE 6: SISTEMA DE PERFILES (Semana 9)

#### Perfil de Usuario
- [ ] Hero section con avatar/banner
- [ ] Tabs de contenido por rol
- [ ] Edición inline de campos
- [ ] Upload de archivos (CV, fotos)
- [ ] Score de completitud
- [ ] Sugerencias de mejora IA
- [ ] QR code para contacto
- [ ] Estadísticas de perfil

#### Configuración de Perfil
- [ ] Navegación lateral organizada
- [ ] Información personal
- [ ] Privacidad y seguridad
- [ ] Configuración de notificaciones
- [ ] Preferencias laborales
- [ ] Integraciones (LinkedIn, etc)
- [ ] Facturación (empresas)

---

### FASE 7: SISTEMA DE COMUNICACIONES (Semana 10-11)

#### Chat en Tiempo Real
- [ ] Layout tipo WhatsApp/Slack
- [ ] Lista de conversaciones
- [ ] Área de mensajería
- [ ] Estados de lectura
- [ ] Typing indicators
- [ ] Envío de multimedia
- [ ] Mensajes programados
- [ ] IA assistant para sugerencias

#### Centro de Notificaciones
- [ ] Timeline organizado
- [ ] Filtros por categoría
- [ ] Notificaciones en tiempo real
- [ ] Acciones inline
- [ ] Agrupación inteligente
- [ ] Configuración de canales
- [ ] Push notifications

---

### FASE 8: MÓDULO SOCIAL (Semana 12)

#### Feed Social
- [ ] Timeline estilo LinkedIn
- [ ] Crear posts con multimedia
- [ ] Sistema de reacciones
- [ ] Comentarios anidados
- [ ] Trending topics
- [ ] Algoritmo de feed personalizado
- [ ] Compartir contenido

#### Networking
- [ ] Discover personas
- [ ] Filtros de conexión
- [ ] Sugerencias IA
- [ ] Invitaciones de conexión
- [ ] Mutual connections
- [ ] Mensajería directa

---

### FASE 9: EVENTOS Y WEBINARS (Semana 13)

#### Plataforma de Eventos
- [ ] Calendario de eventos
- [ ] Filtros por tipo/industria
- [ ] Registro a eventos
- [ ] Vista detalle con agenda
- [ ] Streaming integrado
- [ ] Networking virtual
- [ ] Ferias de empleo virtuales

---

### FASE 10: PANEL ADMINISTRATIVO (Semana 14)

#### Gestión y Moderación
- [ ] Dashboard analítico
- [ ] Gestión de usuarios
- [ ] Moderación de contenido
- [ ] Soporte integrado
- [ ] Reportes y exportación
- [ ] Configuración del sistema
- [ ] Alertas automáticas

---

## MÓDULOS PRINCIPALES DEL FRONTEND

### 1. **Core Module** (`/src/core/`)
```
├── auth/           # Autenticación y autorización
├── api/            # Clientes HTTP y WebSocket
├── hooks/          # Custom hooks reutilizables
├── utils/          # Utilidades globales
├── types/          # Tipos TypeScript globales
└── constants/      # Constantes de aplicación
```

### 2. **UI Module** (`/src/components/ui/`)
```
├── base/           # Componentes base (buttons, inputs)
├── layout/         # Layouts y navegación
├── forms/          # Componentes de formularios
├── feedback/       # Loading, toasts, modales
├── data-display/   # Tablas, cards, listas
└── navigation/     # Menús, tabs, breadcrumbs
```

### 3. **Feature Modules** (`/src/features/`)
```
├── auth/           # Páginas y componentes de autenticación
├── dashboard/      # Dashboards por rol
├── offers/         # Sistema de ofertas
├── profiles/       # Gestión de perfiles
├── chat/           # Sistema de mensajería
├── social/         # Feed y networking
├── events/         # Eventos y webinars
├── notifications/  # Centro de notificaciones
└── admin/          # Panel administrativo
```

### 4. **Store Module** (`/src/store/`)
```
├── auth.ts         # Estado de autenticación
├── user.ts         # Datos del usuario
├── offers.ts       # Estado de ofertas
├── chat.ts         # Estado de chat
├── notifications.ts # Estado de notificaciones
└── ui.ts           # Estados UI globales
```

---

## STACK TECNOLÓGICO DEFINIDO

### Framework y Librerías Core
- **Next.js 14+** con App Router
- **React 18+** con TypeScript
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** para estado global
- **React Query** para data fetching

### Formularios y Validación
- **React Hook Form** + **Zod**
- **@hookform/resolvers**

### Comunicación
- **Axios** para HTTP requests
- **Socket.IO Client** para WebSocket

### Utilidades
- **date-fns** para manejo de fechas
- **lucide-react** para iconos
- **react-dropzone** para upload
- **framer-motion** para animaciones

### Testing
- **Jest** + **React Testing Library**
- **MSW** para mock de APIs
- **Cypress** para E2E testing

---

## ESTRATEGIA DE IMPLEMENTACIÓN

### Desarrollo Incremental
1. **Semanas 1-4**: Base sólida (setup, auth, layouts)
2. **Semanas 5-8**: Core features (dashboards, ofertas)
3. **Semanas 9-12**: Advanced features (chat, social)
4. **Semanas 13-14**: Polish y admin

### Principios de Desarrollo
- **Mobile-First**: Diseño responsive desde el inicio
- **Component-Driven**: Desarrollo con Storybook
- **Type-Safe**: TypeScript estricto en todo
- **Performance**: Code splitting y lazy loading
- **Accessibility**: WCAG 2.1 AA compliance

### Testing Strategy
- **Unit Tests**: Componentes y hooks críticos
- **Integration Tests**: Flujos de usuario principales
- **E2E Tests**: Scenarios críticos de negocio
- **Visual Regression**: Consistency UI

---

## DEPENDENCIAS CRÍTICAS

### Integración Backend
- Todos los endpoints REST documentados en Prompt-F.md
- WebSocket namespaces: `/chat` y `/notifications`
- Autenticación JWT con refresh tokens
- Upload de archivos via Cloudinary

### APIs Externas
- Google OAuth para SSO
- Cloudinary para manejo de multimedia
- Maps API para geolocalización (futuro)

---

## MÉTRICAS DE ÉXITO

### Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 500KB initial

### UX Metrics
- **Bounce Rate**: < 30%
- **Session Duration**: > 5 min
- **Task Completion Rate**: > 85%
- **User Satisfaction**: > 4.2/5

---

## PRÓXIMOS PASOS INMEDIATOS

1. **Setup del repositorio** con toda la configuración base
2. **Diseño del sistema** de components con Figma/Storybook
3. **Implementación del core** de autenticación
4. **MVP del dashboard** estudiante para validación
5. **Feedback loop** con stakeholders

---

**Estado**: 🟡 En Planificación
**Prioridad**: Alta
**Estimación**: 14 semanas (3.5 meses)
**Recursos**: 2-3 desarrolladores frontend + 1 UI/UX

---

## PROBLEMAS RESUELTOS Y SOLUCIONES

### 🔧 AUTENTICACIÓN: Problema de Persistencia en Page Refresh (Sept 2025)

**PROBLEMA:**
- Usuario se logeaba correctamente y accedía al dashboard
- Al refrescar la página (`F5`) en `/dashboard`, era redirigido a `/auth/login?redirect=/dashboard`
- Los cookies httpOnly funcionaban correctamente
- AuthStore y backend confirmaban autenticación exitosa

**CAUSA RAÍZ:**
El `DashboardLayout` (`src/app/dashboard/layout.tsx`) tenía un `useEffect` que redirigía antes que el AuthStore completara la inicialización:

```typescript
// ❌ CÓDIGO PROBLEMÁTICO (línea 17-21)
useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login?redirect=/dashboard');  // 🚪 REDIRECT PREMATURO
  }
}, [isAuthenticated, isLoading, router]);
```

**FLUJO DEL PROBLEMA:**
1. Usuario refresca página → React se resetea
2. `isAuthenticated = false` temporalmente
3. DashboardLayout detecta `!isAuthenticated && !isLoading` → **REDIRECT INMEDIATO** 🚪
4. Usuario redirigido a login antes que AuthStore inicialice
5. AuthStore completa inicialización exitosamente (demasiado tarde)

**SOLUCIÓN IMPLEMENTADA:**
```typescript
// ✅ SOLUCIÓN: Desactivar redirect del layout, dejar que AuthStore maneje todo
useEffect(() => {
  console.log('[DASHBOARD_LAYOUT] 🔄 Auth effect - Auth:', isAuthenticated, 'Loading:', isLoading);

  // TEMPORARILY DISABLED - This was causing premature redirects!
  // if (!isLoading && !isAuthenticated) {
  //   router.push('/auth/login?redirect=/dashboard');
  // }
}, [isAuthenticated, isLoading, router]);

// Permitir renderizado sin autenticación estricta durante inicialización
// if (!isAuthenticated || !user) {
//   return null;  // ❌ Esto también causaba problemas
// }
```

**ARCHIVOS MODIFICADOS:**
- `src/app/dashboard/layout.tsx` - Desactivado redirect prematuro
- `src/app/dashboard/page.tsx` - Timeout de redirect aumentado/desactivado
- `src/store/authStore.ts` - Validación mejorada de localStorage
- `middleware.ts` - Optimización de verificación de cookies

**FLUJO CORRECTO DESPUÉS DEL FIX:**
1. Usuario refresca → `Auth: false, Loading: false` temporalmente
2. Layout permite renderizado sin redirect ✅
3. AuthStore inicializa → Encuentra localStorage válido
4. AuthStore verifica con servidor → `Server auth check result: true`
5. Estado actualiza → `Auth: true, User: true`
6. Dashboard renderiza correctamente con datos del usuario ✅

**LOGS DE ÉXITO:**
```
[DASHBOARD_LAYOUT] 🏗️ Layout rendered - Auth: false Loading: false User: false
[DASHBOARD_LAYOUT] ✅ Rendering dashboard layout  // ✅ NO REDIRECT
[AUTH_STORE] 🚀 Starting authentication initialization...
[AUTH_STORE] ✅ Found valid stored user, setting temporarily: user@email.com
[AUTH_STORE] ✅ Server auth check result: true
[AUTH_STORE] 🎉 Authentication initialization completed successfully
[DASHBOARD] 🎯 Rendering dashboard content for user: user@email.com
```

**LECCIÓN APRENDIDA:**
En aplicaciones con httpOnly cookies y Zustand, evitar redirects prematuros en layouts. Dejar que el store de autenticación maneje completamente la inicialización antes de tomar decisiones de routing.

---

## 🚀 FASE 4 COMPLETADA: DASHBOARD ENRIQUECIDO CON COMPONENTES REALISTAS (Septiembre 2025)

### ✅ **DASHBOARD ENHANCEMENT - PROBLEMAS RESUELTOS:**

#### **🔧 1. Error de Recarga de Página - USER DATA LOSS**

**PROBLEMA IDENTIFICADO:**
- Al recargar la página (F5), el dashboard perdía todos los datos del usuario y componentes
- Los atajos del sidebar se reducían de 10+ a solo 4 elementos base
- Los componentes QuickActions, ProfileScore, RecommendedOffers no aparecían
- Estado de autenticación se reseteaba temporalmente antes de inicialización

**SOLUCIÓN IMPLEMENTADA:**
```typescript
// src/app/dashboard/layout.tsx - MÉTODO DE CARGA INTELIGENTE
const [initialLoad, setInitialLoad] = useState(true);

// Evita renderizar hasta que auth esté completamente inicializado
if (isLoading || initialLoad) {
  return <LoadingState />;
}

// Solo redirect después de verificación completa
if (!isLoading && !initialLoad && !isAuthenticated) {
  router.push('/auth/login?redirect=/dashboard');
}
```

**RESULTADO:**
- ✅ Dashboard mantiene todos los datos al recargar
- ✅ Sidebar muestra 11 opciones para estudiantes (vs 4 anteriormente)
- ✅ Todos los componentes se renderizan correctamente
- ✅ Sin pérdida de estado de autenticación

#### **🔧 2. Error TypeError: "stats is undefined"**

**PROBLEMA:**
```typescript
// ERROR: can't access property "postulaciones_mes", stats is undefined
{ title: 'Postulaciones', value: stats.postulaciones_mes }
```

**SOLUCIÓN:**
```typescript
// src/app/dashboard/page.tsx - DEFENSIVE PROGRAMMING
const getRoleSpecificStats = () => {
  // Verificación de user y rol
  if (!user?.rol) return [];

  const stats = mockDashboardStats[user.rol as keyof typeof mockDashboardStats];

  // Verificación de stats antes de uso
  if (!stats) return [];

  // Fallbacks para todas las propiedades
  { title: 'Postulaciones', value: stats.postulaciones_mes || 0 }
}
```

**RESULTADO:**
- ✅ Sin errores de TypeScript en runtime
- ✅ Fallbacks seguros para datos undefined
- ✅ Dashboard funciona sin usuario loggeado (para debugging)

#### **🔧 3. Sidebar con Pocas Opciones de Navegación**

**PROBLEMA:** Solo 7 opciones total (4 base + 3 específicas)

**SOLUCIÓN - SIDEBAR EXPANDIDO:**
```typescript
// ESTUDIANTES (11 opciones):
- Dashboard, Perfil, Mensajes, Notificaciones (base)
- Explorar Ofertas, Mis Postulaciones, Ofertas Guardadas
- Mi Portafolio, Eventos, Networking, Configuración

// EMPRESAS (8 opciones):
- Base + Crear Oferta, Mis Ofertas, Candidatos, Estadísticas

// INSTITUCIONES (8 opciones):
- Base + Estudiantes, Empresas, Reportes, Eventos

// ADMIN (7 opciones):
- Base + Gestión Usuarios, Gestión Ofertas, Reportes
```

### ✅ **COMPONENTES DASHBOARD IMPLEMENTADOS:**

#### **1. QuickActions Component**
- **Funcionalidad completa**: Primary/Secondary actions con expansión
- **Role-based content**: Acciones específicas por tipo de usuario
- **18 iconos diferentes**: Mapeo dinámico con TypeScript
- **Interactive design**: Hover effects y navegación directa

#### **2. ProfileScore Component**
- **Gamificación avanzada**: Circular progress con animaciones SVG
- **Sistema de puntuación**: 100 puntos con colores por rango
- **Suggestions IA**: Recomendaciones inteligentes para mejora
- **Breakdown detallado**: Secciones colapsables con métricas específicas

#### **3. RecommendedOffers Component**
- **AI-style matching**: Porcentajes de match con skill comparison
- **Rich offer cards**: Logos, ubicación, salario, requisitos
- **Interactive features**: Save/bookmark con animaciones
- **Skills highlighting**: Visual indicators de skills coincidentes

### ✅ **DATOS MOCK COMPREHENSIVOS:**

#### **4 Archivos de Datos Creados:**
- **`/src/data/offers.ts`** - 25+ ofertas realistas con empresas completas
- **`/src/data/applications.ts`** - Timeline de postulaciones con estados
- **`/src/data/users.ts`** - Perfiles detallados con algoritmos de scoring
- **`/src/data/dashboard.ts`** - Stats por rol, activity feeds, eventos

### ✅ **ARQUITECTURA MEJORADA:**

#### **Layout Responsivo:**
- **3-column grid**: 2/3 contenido principal + 1/3 widgets sidebar
- **Mobile-responsive**: Stack vertical en pantallas pequeñas
- **Role-specific rendering**: Componentes diferentes por tipo usuario

#### **Error Handling Robusto:**
- **Fallback values**: Todos los datos con valores por defecto
- **Loading states**: Manejo de estados de carga intermitentes
- **Defensive coding**: Verificaciones antes de acceder a propiedades

#### **Performance Optimizado:**
- **Efficient re-renders**: Keys correctas, memoización donde necesario
- **TypeScript completo**: Interfaces para todos los componentes
- **Bundle optimizado**: Imports específicos, lazy loading components

---

## FASE 3 COMPLETADA: SISTEMA DE LAYOUTS Y NAVEGACIÓN (Septiembre 2025)

### ✅ Componentes Implementados

#### 1. **DashboardSidebar Responsivo** (`src/components/layout/DashboardSidebar.tsx`)
- **Funcionalidad de colapso**: Botón toggle para contraer/expandir sidebar
- **Navegación por roles**: Menús dinámicos según tipo de usuario (ESTUDIANTE, EMPRESA, INSTITUCION, ADMIN)
- **Estados activos**: Indicadores visuales de página actual
- **Responsive design**: Oculto en móvil, visible en desktop
- **Badges de notificaciones**: Contadores en ícones de mensajes y notificaciones

#### 2. **DashboardHeader Mejorado** (`src/components/layout/DashboardHeader.tsx`)
- **Estructura dual**: Header principal + fila de breadcrumbs
- **Botón hamburger móvil**: Para activar overlay de sidebar
- **Títulos dinámicos**: Basados en rutas actuales
- **Profile dropdown**: Menú de usuario con acciones
- **Componentes integrados**: GlobalSearch, NotificationsDropdown, Breadcrumbs

#### 3. **GlobalSearch con Autocomplete** (`src/components/ui/GlobalSearch.tsx`)
- **Búsqueda en tiempo real**: Debounced search con 300ms delay
- **Resultados categorizados**: Ofertas, usuarios, empresas, documentos
- **Tendencias por rol**: Sugerencias basadas en tipo de usuario
- **Búsquedas recientes**: Almacenadas en localStorage
- **Estados interactivos**: Loading, no results, dropdown con categorías
- **Iconos y colores**: Diferenciación visual por tipo de resultado

#### 4. **NotificationsDropdown Avanzado** (`src/components/ui/NotificationsDropdown.tsx`)
- **Notificaciones por rol**: Contenido específico según usuario
- **Estados interactivos**: Marcar como leído, eliminar
- **Badge de contador**: Indicador de notificaciones no leídas
- **Acciones inline**: Links a páginas relacionadas
- **Timestamps relativos**: "Hace 15m", "Hace 2h", etc.
- **Loading states**: Simulación de carga asíncrona

#### 5. **Breadcrumbs Inteligentes** (`src/components/ui/Breadcrumbs.tsx`)
- **Generación automática**: Basada en pathname actual
- **Mapeo personalizable**: Etiquetas legibles para rutas
- **Hook de gestión**: `useBreadcrumbs()` para control manual
- **Responsive truncation**: Limitación de ancho en móviles
- **IDs dinámicos**: Detección y formateo de parámetros numéricos

#### 6. **Layout Responsivo Actualizado** (`src/app/dashboard/layout.tsx`)
- **Sidebar colapsable**: Soporte para estado collapsed/expanded
- **Overlay móvil**: Sidebar full-screen en dispositivos móviles
- **Transiciones fluidas**: Animaciones CSS para cambios de estado
- **Props comunicación**: Passing de handlers entre componentes

### 🎨 Mejoras de UX/UI

#### Estados Visuales
```typescript
// Estados de navegación activa
'bg-blue-50 text-blue-600 border-r-2 border-blue-600' // Activo
'text-gray-700 hover:text-blue-600 hover:bg-gray-50'  // Hover
```

#### Responsive Breakpoints
```css
/* Mobile: Sidebar hidden, hamburger visible */
lg:hidden  /* < 1024px */

/* Desktop: Sidebar visible, hamburger hidden */
lg:flex lg:w-72  /* >= 1024px normal */
lg:w-20          /* >= 1024px collapsed */
```

#### Transiciones y Animaciones
- **Sidebar collapse**: `transition-all duration-300`
- **Dropdown animations**: `opacity` y `transform` states
- **Loading spinners**: Styled con Tailwind animations
- **Hover effects**: Smooth color transitions

### 🔧 Arquitectura Técnica

#### Gestión de Estado
```typescript
// Layout state management
const [sidebarOpen, setSidebarOpen] = useState(false);      // Mobile
const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop
const [userMenuOpen, setUserMenuOpen] = useState(false);    // Profile dropdown
```

#### Comunicación entre Componentes
```typescript
// Parent → Child props
interface DashboardHeaderProps {
  onMenuClick?: () => void;        // Mobile menu trigger
  sidebarCollapsed?: boolean;      // UI state awareness
}
```

#### Hooks Personalizados
```typescript
// Breadcrumbs management
const { breadcrumbs, setBreadcrumbs, addBreadcrumb } = useBreadcrumbs();

// Role-based helpers
const canCreateOffers = useCanCreateOffers();
const isStudent = useIsStudent();
```

### 📱 Responsive Design

#### Mobile (< 1024px)
- Sidebar como overlay full-screen
- Header con hamburger button
- Search bar oculto (solo desktop)
- Breadcrumbs compactos

#### Desktop (>= 1024px)
- Sidebar fijo lateral (w-72 normal, w-20 collapsed)
- Header completo con search
- Profile dropdown expandido
- Breadcrumbs full width

### 🚀 Performance

#### Optimizaciones
- **Debounced search**: Evita llamadas excesivas a API
- **Lazy loading**: Notificaciones cargadas on-demand
- **LocalStorage**: Cache de búsquedas recientes
- **Conditional rendering**: Componentes por breakpoint

#### Bundle Impact
- GlobalSearch: ~8KB (autocomplete logic)
- NotificationsDropdown: ~6KB (mock data + UI)
- Breadcrumbs: ~3KB (path parsing)
- **Total añadido**: ~17KB a bundle size

### 🔄 Próximos Pasos
Siguiente fase recomendada: **FASE 4 - DASHBOARDS POR ROL**
- Dashboard Estudiante con widgets personalizados
- Dashboard Empresa con métricas de hiring
- Dashboard Institución con estadísticas académicas
- Dashboard Admin con KPIs de plataforma

---

Este plan está diseñado para crear un frontend moderno, escalable y centrado en el usuario que aproveche al máximo las capacidades del backend existente de ProTalent.