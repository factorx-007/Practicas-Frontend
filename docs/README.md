# Documentación Frontend - ProTalent

Esta documentación completa proporciona flujos de usuario detallados y prompts de diseño para implementar el frontend de ProTalent, una plataforma de empleos que conecta estudiantes con empresas e instituciones educativas.

## 📋 Índice de Contenidos

### 📊 Flujos de Usuario
Documentación detallada del comportamiento y navegación por cada módulo:

#### [🔐 01. Authentication Flows](./user-flows/01-authentication-flows.md)
- Registro multi-paso por roles
- Login con OAuth y recuperación
- Verificación y seguridad
- Estados de error y validaciones

#### [📋 02. Applications Management](./user-flows/02-applications-management.md)
- Proceso completo de postulación
- Gestión de estados de aplicación
- Seguimiento de candidatos (empresas)
- Timeline y comunicación

#### [💬 03. Chat Communication](./user-flows/03-chat-communication.md)
- Sistema de mensajería en tiempo real
- Chat individual y grupal
- Mensajes enriquecidos y archivos
- Moderación y seguridad

#### [👥 04. Social Networking](./user-flows/04-social-networking.md)
- Feed social profesional
- Sistema de conexiones
- Mentorías y grupos
- Eventos y networking

#### [🔔 05. Notifications Center](./user-flows/05-notifications-center.md)
- Centro de notificaciones unificado
- Configuración por canal y tipo
- Notificaciones inteligentes
- Push, email y in-app

### 🎨 Prompts de Diseño
Especificaciones detalladas para crear interfaces modernas:

#### [🔐 01. Authentication Design Prompts](./design-prompts/01-authentication-design-prompts.md)
- Páginas de login y registro
- Recuperación de contraseña
- Componentes de formularios
- Estados y validaciones visuales

#### [📊 02. Dashboard Design Prompts](./design-prompts/02-dashboard-design-prompts.md)
- Dashboards por rol (Estudiante, Empresa, Institución, Admin)
- Widgets especializados
- Métricas y analytics
- Responsive design

#### [💼 03. Offers Management Prompts](./design-prompts/03-offers-management-prompts.md)
- Exploración de ofertas con filtros
- Vista detalle inmersiva
- Creación y gestión de ofertas
- Sistema de matching

#### [💬 04. Chat Communication Prompts](./design-prompts/04-chat-communication-prompts.md)
- Interface de chat profesional
- Mensajes enriquecidos
- Chat móvil optimizado
- Moderación y herramientas

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Framework**: Next.js 15 con App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand para estado global
- **Formularios**: React Hook Form + Zod
- **HTTP**: Axios con interceptores
- **Real-time**: Socket.IO cliente

### Estructura de Rutas
```
/app/
├── (auth)/                 # Autenticación
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/            # Dashboards por rol
│   ├── estudiante/
│   ├── empresa/
│   ├── institucion/
│   └── admin/
├── (shared)/               # Rutas compartidas
│   ├── profile/
│   ├── chat/
│   ├── notifications/
│   └── offers/
└── (public)/               # Páginas públicas
    ├── landing/
    └── about/
```

### Roles de Usuario
1. **🎓 ESTUDIANTE**: Busca empleos, gestiona aplicaciones, networking
2. **🏢 EMPRESA**: Publica ofertas, gestiona candidatos, analytics
3. **🎓 INSTITUCION**: Supervisa estudiantes, estadísticas, convenios
4. **👑 ADMIN**: Moderación, métricas globales, configuración

## 🎯 Funcionalidades Principales

### Para Estudiantes
- ✅ Perfil profesional completo
- ✅ Exploración de ofertas con IA matching
- ✅ Sistema de postulaciones
- ✅ Chat con empresas
- ✅ Red social profesional
- ✅ Eventos y webinars

### Para Empresas
- ✅ Publicación de ofertas
- ✅ Gestión de candidatos (pipeline Kanban)
- ✅ Analytics de reclutamiento
- ✅ Chat con candidatos
- ✅ Promoción de ofertas

### Para Instituciones
- ✅ Gestión de estudiantes
- ✅ Estadísticas de empleabilidad
- ✅ Convenios empresariales
- ✅ Reportes académicos

### Para Administradores
- ✅ Panel de moderación
- ✅ Métricas de plataforma
- ✅ Gestión de usuarios
- ✅ Configuración global

## 📱 Diseño Responsive

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large**: 1440px+

### Adaptaciones Mobile
- Bottom tab navigation
- Gestos naturales (swipe, pull-to-refresh)
- Input optimization para teclados móviles
- Touch targets mínimo 44px
- Progressive Web App capabilities

## 🎨 Design System

### Colores Principales
```css
--primary-blue: #3B82F6
--primary-dark: #1D4ED8
--success-green: #10B981
--warning-yellow: #F59E0B
--error-red: #EF4444
--gray-primary: #6B7280
--gray-light: #E5E7EB
```

### Tipografía
```css
--font-system: Inter, system-ui, sans-serif
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
```

### Espaciado
```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
```

## 🔄 Patrones de Interacción

### Estados Universales
- **Loading**: Skeleton screens y spinners
- **Empty**: Ilustraciones motivacionales
- **Error**: Mensajes claros con acciones
- **Success**: Confirmaciones con next steps

### Navegación
- Breadcrumbs contextuales
- Sidebar colapsable (desktop)
- Bottom tabs (mobile)
- Búsqueda global

### Feedback
- Toast notifications
- Inline validation
- Progress indicators
- Micro-interacciones

## 📊 Métricas de UX

### KPIs de Éxito
- **Task completion rate**: >85%
- **User satisfaction**: >4.2/5
- **Time to first job application**: <10 min
- **Chat response rate**: >70%
- **Return user rate**: >60%

### Performance Goals
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1

## 🛠️ Herramientas de Desarrollo

### Diseño
- **Figma**: Diseño colaborativo
- **Storybook**: Documentación de componentes
- **Chromatic**: Visual regression testing

### Testing
- **Jest + RTL**: Testing de componentes
- **Cypress**: E2E testing
- **Percy**: Visual testing
- **Lighthouse**: Performance auditing

### Code Quality
- **ESLint + Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Type safety
- **SonarQube**: Code quality metrics

## 🚀 Deployment Strategy

### Environments
- **Development**: Local + hot reload
- **Staging**: Preview deploys per PR
- **Production**: Optimized builds + CDN

### CI/CD Pipeline
1. **Code push** → GitHub Actions
2. **Tests** → Jest + Cypress
3. **Build** → Next.js optimized
4. **Deploy** → Vercel/AWS
5. **Monitor** → Sentry + Analytics

## 📚 Recursos Adicionales

### Documentación Técnica
- [CLAUDE.md](../CLAUDE.md) - Instrucciones para Claude Code
- [README.md](../README.md) - Setup del proyecto
- [Package.json](../package.json) - Dependencias

### Referencias Existentes
- [FLUJOS_USUARIO.md](../FLUJOS_USUARIO.md) - Flujos originales
- [DISTRIBUCION_VISTAS_MEJORADA.md](../DISTRIBUCION_VISTAS_MEJORADA.md) - Arquitectura de vistas

## 🤝 Contribución

### Workflow de Desarrollo
1. **Fork** del repositorio
2. **Feature branch** desde main
3. **Implement** siguiendo design prompts
4. **Test** completo (unit + integration)
5. **PR** con descripción detallada
6. **Review** por equipo
7. **Merge** después de aprobación

### Standards de Código
- TypeScript estricto
- Componentes funcionales con hooks
- Props interface documentadas
- Accessibility compliance
- Performance optimizations

---

**Versión**: 1.0
**Última actualización**: Octubre 2024
**Equipo**: Frontend ProTalent

Esta documentación es un recurso vivo que evoluciona con el proyecto. Para sugerencias o mejoras, crear un issue en el repositorio.