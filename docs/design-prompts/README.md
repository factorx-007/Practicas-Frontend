# Design Prompts - ProTalent Frontend

Esta colección de prompts de diseño proporciona especificaciones detalladas para crear interfaces modernas y funcionales para cada módulo de ProTalent.

## 🎯 Propósito

Los prompts están diseñados para ser utilizados con:
- **Herramientas de IA de diseño** (Midjourney, DALL-E, Figma AI)
- **Diseñadores UI/UX** como especificaciones detalladas
- **Desarrolladores frontend** como guía de implementación
- **Product managers** para validación de features

## 📁 Estructura de Archivos

### 01. Authentication Design Prompts
**Archivo**: `01-authentication-design-prompts.md`
**Contenido**:
- Páginas de registro multi-paso
- Login con OAuth integrado
- Recuperación de contraseña
- Verificación de email
- Login administrativo
- Componentes reutilizables (inputs, botones)

### 02. Dashboard Design Prompts
**Archivo**: `02-dashboard-design-prompts.md`
**Contenido**:
- Dashboard estudiante (ofertas, progreso, métricas)
- Dashboard empresa (KPIs, candidatos, pipeline)
- Dashboard institución (estadísticas académicas)
- Dashboard admin (métricas globales, moderación)
- Widgets especializados por rol

### 03. Offers Management Prompts
**Archivo**: `03-offers-management-prompts.md`
**Contenido**:
- Exploración de ofertas con filtros avanzados
- Detalle de oferta inmersivo
- Creación de ofertas (wizard empresas)
- Gestión de ofertas publicadas
- Match scoring visual

### 04. Chat Communication Prompts
**Archivo**: `04-chat-communication-prompts.md`
**Contenido**:
- Interface de chat en tiempo real
- Chat móvil optimizado
- Mensajes enriquecidos (entrevistas, documentos)
- Chat grupal y eventos
- Moderación y seguridad

## 🎨 Principios de Diseño

### Design System Unificado
```
Colores Primarios:
- Azul ProTalent: #3B82F6
- Azul Oscuro: #1D4ED8
- Verde Éxito: #10B981
- Amarillo Warning: #F59E0B
- Rojo Error: #EF4444

Tipografía:
- Sistema: Inter, system-ui, sans-serif
- Tamaños: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px

Espaciado:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

Border Radius:
- sm: 4px, md: 8px, lg: 12px, xl: 16px, full: 9999px
```

### Responsive Strategy
- **Mobile-first**: 320px → 768px → 1024px → 1440px
- **Progressive enhancement** desde funcionalidad básica
- **Touch-friendly** targets mínimo 44px
- **Gestos naturales** para navegación móvil

### Accesibilidad (WCAG 2.1 AA)
- **Contraste**: Mínimo 4.5:1 para texto normal
- **Navegación**: Completa por teclado
- **Screen readers**: Labels y alt text apropiados
- **Focus indicators**: Visibles y claros

## 🚀 Cómo Usar los Prompts

### Para Herramientas de IA
1. **Copia el prompt completo** incluyendo contexto del proyecto
2. **Ajusta especificaciones** según necesidades específicas
3. **Itera con variaciones** para obtener mejores resultados
4. **Combina prompts** para vistas complejas

### Para Diseñadores
1. **Lee el contexto del proyecto** para entender el dominio
2. **Usa las especificaciones** como wireframes detallados
3. **Adapta los design tokens** a tu herramienta preferida
4. **Considera las interacciones** descritas en cada prompt

### Para Desarrolladores
1. **Usa como referencia** durante implementación
2. **Valida componentes** contra especificaciones
3. **Implementa estados** descritos (loading, error, empty)
4. **Sigue patrones responsive** detallados

## 📋 Checklist de Implementación

### Por cada Vista Diseñada:
- [ ] **Responsive design** en 3+ breakpoints
- [ ] **Estados de carga** implementados
- [ ] **Manejo de errores** con UX clara
- [ ] **Empty states** motivacionales
- [ ] **Accesibilidad** validada
- [ ] **Performance** optimizada
- [ ] **Interacciones** fluidas

### Componentes Reutilizables:
- [ ] **Design tokens** consistentes
- [ ] **Variantes** por contexto/rol
- [ ] **Props interface** clara
- [ ] **Documentación** completa
- [ ] **Testing** visual automatizado

## 🔄 Iteración y Feedback

### Validation Process:
1. **Crear prototipos** basados en prompts
2. **Testing con usuarios reales** de cada rol
3. **Iterar diseños** basado en feedback
4. **Actualizar prompts** con learnings
5. **Documentar decisiones** de diseño

### Metrics de Éxito:
- **Task completion rate** > 85%
- **User satisfaction** > 4.2/5
- **Time to complete core tasks** optimizado
- **Accessibility score** > 95%
- **Performance score** > 90%

## 🛠️ Herramientas Recomendadas

### Design:
- **Figma** - Diseño colaborativo
- **Framer** - Prototipos interactivos
- **Principle** - Micro-interacciones
- **Lottie** - Animaciones

### AI-Assisted Design:
- **Figma AI** - Generación automática
- **Midjourney** - Ilustraciones y concepts
- **Remove.bg** - Procesamiento de imágenes
- **Unsplash** - Fotos stock de calidad

### Development:
- **Storybook** - Component documentation
- **Chromatic** - Visual regression testing
- **Percy** - Visual testing automático
- **Lighthouse** - Performance auditing

## 📚 Recursos Adicionales

### Inspiración de Diseño:
- **LinkedIn** - Professional networking UI patterns
- **Indeed/Glassdoor** - Job marketplace interactions
- **Slack/Discord** - Chat and communication UX
- **Notion** - Modern dashboard layouts

### Design Systems de Referencia:
- **Ant Design** - Enterprise components
- **Material Design** - Google design principles
- **Human Interface Guidelines** - Apple standards
- **Atlassian Design System** - Professional tools UX

### Tendencias UX 2024:
- **Glassmorphism** sutil para profundidad
- **Dark mode** como opción estándar
- **Micro-interactions** para feedback
- **AI-powered** personalization
- **Voice interfaces** para accesibilidad

## 🔮 Roadmap Futuro

### Próximas Funcionalidades:
- **AR/VR integration** para virtual job fairs
- **AI-powered** resume optimization
- **Blockchain** credentials verification
- **Advanced analytics** dashboards
- **Multi-language** support

### Design Evolution:
- **Design system** automatizado con tokens
- **Component library** open source
- **Design patterns** documentation
- **Accessibility** first approach
- **Performance** budgets integration

---

**Versión**: 1.0
**Última actualización**: Octubre 2024
**Mantenido por**: Equipo Frontend ProTalent

Para sugerencias o mejoras a estos prompts, crear issue en el repositorio del proyecto.