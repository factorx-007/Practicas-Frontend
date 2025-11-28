# Prompts de Diseño - Dashboards por Rol

## Contexto del Proyecto
ProTalent es una plataforma que conecta estudiantes con empresas. Cada tipo de usuario tiene un dashboard personalizado con widgets y funcionalidades específicas según su rol y necesidades.

---

## 1. DASHBOARD ESTUDIANTE (`/dashboard/estudiante`)

### Prompt de Diseño Principal:
```
Diseña un dashboard moderno y motivacional para estudiantes universitarios buscando empleo:

**Layout Principal:**
- Grid responsivo 12 columnas
- Header con navegación breadcrumb + acciones rápidas
- Sidebar colapsable con navegación contextual
- Área principal dividida en widgets organizados

**Sección Hero (Top):**
- Bienvenida personalizada: "¡Hola [Nombre]! 👋"
- Widget de progreso de perfil gamificado (circular progress)
- Score actual: 85/100 con colores dinámicos
- Sugerencias de mejora en tooltip/dropdown
- Quick actions: [Completar perfil] [Ver ofertas] [Mensajes]

**Widget: Ofertas Recomendadas (Principal):**
- Título: "Ofertas perfectas para ti 🎯"
- Cards de ofertas con:
  - Logo empresa + nombre
  - Título posición
  - Match percentage (85%, 92%, etc.) con color coding
  - Ubicación + modalidad (Remoto/Híbrido/Presencial)
  - Skills requeridas vs tus skills (visual match)
  - Salario estimado (si disponible)
  - Tiempo publicado ("hace 2 días")
  - CTAs: [Ver detalles] [Postular] [Guardar]
- Scroll horizontal en mobile
- "Ver todas las ofertas" link al final

**Widget: Mis Postulaciones (Lateral):**
- Estado actual resumido: "5 activas, 2 en proceso"
- Timeline de últimas actividades:
  - "TechCorp vio tu perfil" - hace 2h
  - "Entrevista programada con StartupXYZ" - mañana 3pm
  - "Nueva respuesta de CloudCompany" - ayer
- Indicadores visuales por estado (colores, iconos)
- Quick access a detalles de cada postulación

**Widget: Próximos Eventos:**
- "Eventos que te pueden interesar 📅"
- Lista compacta de eventos:
  - "React Workshop" - 15 Oct, 7pm
  - "Feria Virtual de Empleos" - 20 Oct
  - "Networking Tech CDMX" - 25 Oct
- CTAs: [Registrarse] [Ver agenda]

**Métricas de Rendimiento:**
- Gráfico simple de postulaciones del mes
- Tasa de respuesta visual
- Tendencia de views de perfil
- Comparación con promedios de tu carrera

**Colores y Estilo:**
- Primarios: Azules vibrantes (#3B82F6, #1D4ED8)
- Acentos: Verde éxito (#10B981), Naranja warning (#F59E0B)
- Neutros: Grises modernos (#6B7280, #E5E7EB)
- Cards con sombras sutiles y border radius 12px
- Typography: Sans-serif moderna, jerarquía clara
```

### Widget Específico - Progreso de Perfil:
```
Diseña un widget de progreso de perfil gamificado:

**Elemento Central:**
- Círculo de progreso SVG animado
- Porcentaje grande en el centro (85%)
- Colores dinámicos:
  - 0-30%: Rojo (#EF4444)
  - 31-60%: Amarillo (#F59E0B)
  - 61-80%: Azul (#3B82F6)
  - 81-100%: Verde (#10B981)

**Desglose de Secciones:**
- "Información básica" ✅ Completo
- "Experiencia laboral" ⚠️ 60% completo
- "Habilidades" ✅ Completo
- "Educación" ⚠️ 80% completo
- "Portafolio" ❌ Sin completar

**Sugerencias de Mejora:**
- "Agrega 2 proyectos más para destacar (+15%)"
- "Completa tu experiencia laboral (+10%)"
- "Sube tu foto de perfil (+5%)"

**Motivación:**
- Badge current: "Perfil Prometedor ⭐"
- Next badge: "Candidato Destacado 🌟" (en 15%)
- Progress bar hacia siguiente nivel

**Interacciones:**
- Click en sección incompleta → Redirect a edición
- Hover en sugerencias → Más detalles
- Animación de celebración al completar sección
```

---

## 2. DASHBOARD EMPRESA (`/dashboard/empresa`)

### Prompt de Diseño Principal:
```
Diseña un dashboard profesional y orientado a métricas para empresas reclutadoras:

**Layout Ejecutivo:**
- Header con company branding space
- KPIs principales prominentes en top row
- Grid de métricas y gestión centralizada
- Sidebar con navegación de funciones empresariales

**KPIs Row (Top):**
- Cards de métricas principales:
  - "Nuevos Candidatos": 23 (↗️ +15% vs mes pasado)
  - "Ofertas Activas": 8 (⏰ 3 vencen en 7 días)
  - "Entrevistas Programadas": 12 (📅 4 esta semana)
  - "Posiciones Llenas": 5 (🎯 tiempo promedio: 18 días)
- Cada KPI con icono, número grande, trend indicator
- Colores: Verde para crecimiento, Rojo para alertas

**Widget: Ofertas Activas (Principal):**
- Tabla/cards de ofertas en curso
- Cada oferta muestra:
  - Título + departamento
  - Candidatos aplicados (23/50 objetivo)
  - Progress bar de aplicaciones
  - Calidad promedio candidatos (4.2/5 estrellas)
  - Días restantes hasta cierre
  - Quick actions: [Ver candidatos] [Editar] [Promover]
- Filtros: Por departamento, estado, urgencia
- Ordenamiento por múltiples criterios

**Widget: Nuevos Candidatos (Lateral):**
- Stream de candidatos recientes
- Preview cards con:
  - Foto + nombre + universidad
  - Posición aplicada
  - Match score prominente (92%)
  - Skills highlight
  - Tiempo desde aplicación
  - Quick actions: [Ver perfil] [Preseleccionar] [Rechazar]
- Badge para candidatos "hot" (alta calidad)

**Analytics Dashboard:**
- Gráfico de funnel de conversión
- Tiempo promedio por fase del proceso
- Sources de candidatos más efectivos
- Comparación con benchmarks de industria

**Pipeline de Candidatos:**
- Vista Kanban compacta:
  - Nuevos (23) | Revisando (15) | Entrevista (8) | Final (3)
- Drag & drop functionality visual
- Color coding por urgencia/calidad

**Colores Empresariales:**
- Primarios: Azul corporativo (#1E40AF), Gris profesional
- Acentos: Verde métricas positivas, Ámbar alertas
- Estado: Rojo urgente, Verde completado
- UI más formal y menos colorida que estudiante
```

### Widget Específico - Pipeline de Candidatos:
```
Diseña un widget de pipeline estilo Kanban para gestión de candidatos:

**Columnas del Pipeline:**
- "Nuevos" (23 candidatos) - Azul claro
- "En Revisión" (15 candidatos) - Amarillo
- "Entrevista" (8 candidatos) - Naranja
- "Decisión Final" (3 candidatos) - Verde
- "Contratados" (2 candidatos) - Verde oscuro

**Cards de Candidatos:**
- Avatar circular + nombre
- Posición aplicada en texto pequeño
- Match score como badge (92%)
- Días en esta fase
- Priority indicator (Alta/Media/Baja)
- Quick preview on hover

**Interactions:**
- Drag & drop between columns
- Click card → Modal con detalles completos
- Bulk actions: Select multiple → Move all
- Filters: Por posición, calidad, tiempo

**Visual Cues:**
- Cards "stuck" más de X días → Border rojo
- High-priority candidates → Glow effect
- Recent activity → Pulse animation
- Empty states → Motivational illustrations
```

---

## 3. DASHBOARD INSTITUCIÓN (`/dashboard/institucion`)

### Prompt de Diseño Principal:
```
Diseña un dashboard académico y analítico para instituciones educativas:

**Layout Académico:**
- Header institucional con logo y colores marca
- Navegación académica especializada
- Widgets orientados a estadísticas educativas
- Vista general de programas y estudiantes

**Métricas Institucionales (Top):**
- "Estudiantes Activos": 1,247 (📈 +5% este semestre)
- "Tasa de Empleabilidad": 78% (🎯 vs 75% meta)
- "Empresas Aliadas": 45 (🤝 +3 nuevas este mes)
- "Eventos Programados": 8 (📅 próximos 30 días)

**Widget: Estudiantes por Programa:**
- Gráfico de barras o donut chart
- Programas con más estudiantes activos
- Drill-down por carrera:
  - Ingeniería en Sistemas: 342 estudiantes
  - Administración: 234 estudiantes
  - Diseño Gráfico: 187 estudiantes
- Enlaces a vista detallada por programa

**Widget: Empleabilidad por Carrera:**
- Tabla comparativa de programas académicos
- Métricas por carrera:
  - % de graduados empleados en 6 meses
  - Salario promedio primer empleo
  - Tiempo promedio para conseguir empleo
  - Empresas más comunes de contratación
- Tendencias históricas por programa

**Widget: Actividad de Estudiantes:**
- Timeline de actividades recientes:
  - "Ana García (Sistemas) consiguió empleo en TechCorp"
  - "15 estudiantes aplicaron a ofertas esta semana"
  - "Workshop de CV tuvo 67 asistentes"
- Filtros por programa, tipo de actividad

**Convenios y Colaboraciones:**
- Lista de empresas aliadas
- Estado de convenios (Activo/Renovar/Nuevo)
- Oportunidades de nuevas alianzas
- Eventos conjuntos programados

**Colores Académicos:**
- Primarios: Azul académico (#1E3A8A), Blanco institucional
- Acentos: Dorado/amarillo para logros (#F59E0B)
- Departamentales: Diferentes colores por carrera
- Formal pero accesible, serif typography optional
```

---

## 4. DASHBOARD ADMIN (`/admin/dashboard`)

### Prompt de Diseño Principal:
```
Diseña un dashboard administrativo completo y poderoso para gestión de plataforma:

**Layout de Comando:**
- Header admin con global search y user management
- Sidebar con navegación completa de admin
- Real-time alerts y notificaciones prominentes
- Grid flexible para múltiples vistas de datos

**Métricas Globales de Plataforma:**
- "Usuarios Totales": 15,672 (↗️ +12% mensual)
- "Empresas Verificadas": 234 (⏳ 12 pendientes)
- "Ofertas Activas": 1,456 (🔥 23% más que mes pasado)
- "Tasa de Match": 68% (📊 vs 65% benchmark)

**Panel de Alertas y Moderación:**
- Alerts críticas que requieren atención:
  - "12 empresas pendientes de verificación"
  - "3 reportes de contenido inapropiado"
  - "Sistema de pagos requiere atención"
- Color coding por prioridad: Rojo (crítico), Amarillo (atención), Azul (info)

**Widget: Actividad en Tiempo Real:**
- Stream live de actividades de plataforma:
  - "Nuevo usuario registrado: Ana García (Estudiante)"
  - "TechCorp publicó nueva oferta: Senior Developer"
  - "15 postulaciones en los últimos 10 minutos"
- Auto-refresh cada 30 segundos
- Filtros por tipo de actividad

**Analytics Ejecutivos:**
- Gráficos de crecimiento temporal
- Funnels de conversión de usuarios
- Geografía de usuarios (mapa interactivo)
- Revenue analytics y proyecciones
- Comparaciones período a período

**Gestión Rápida:**
- Quick actions para tareas administrativas comunes:
  - Aprobar empresas pendientes
  - Moderar contenido reportado
  - Enviar comunicaciones masivas
  - Generar reportes ejecutivos

**System Health Monitor:**
- Uptime indicators
- Performance metrics
- Database health
- API response times
- Error rate tracking

**Colores Administrativos:**
- Primarios: Gris carbón (#374151), Azul profundo (#1E40AF)
- Estados: Rojo alertas, Verde healthy, Amarillo warning
- Más serio y técnico que otros dashboards
- Monospace fonts para datos técnicos
```

---

## 5. COMPONENTES COMPARTIDOS

### 5.1 Widget Container Base:
```
Diseña un contenedor base reutilizable para todos los widgets:

**Estructura:**
- Card con border radius 12px
- Padding interno consistente (24px desktop, 16px mobile)
- Header con título + opcional action button
- Body con contenido flexible
- Footer opcional para acciones secundarias

**Variantes:**
- Default: Fondo blanco, sombra sutil
- Highlighted: Border colorido según contexto
- Compact: Menos padding para dashboards densos
- Expandable: Con collapse/expand functionality

**Estados:**
- Loading: Skeleton placeholders
- Error: Error message con retry action
- Empty: Ilustración + mensaje motivacional
- Success: Con subtle green accent
```

### 5.2 Metric Card Component:
```
Diseña cards de métricas reutilizables:

**Layout:**
- Icono grande a la izquierda
- Métrica principal (número) prominente
- Label descriptivo debajo
- Trend indicator (↗️ +15%, ↘️ -5%)
- Opcional: Mini gráfico sparkline

**Variantes por Rol:**
- Estudiante: Colores vibrantes, iconos amigables
- Empresa: Colores corporativos, iconos business
- Institución: Colores académicos, iconos educativos
- Admin: Colores neutros, iconos técnicos

**Estados:**
- Positive trend: Verde
- Negative trend: Rojo
- Neutral: Gris
- Critical alert: Rojo pulsante
```

---

## 6. RESPONSIVE DESIGN

### Mobile Adaptation:
```
Adapta todos los dashboards para mobile:

**Layout Changes:**
- Sidebar → Bottom tab navigation
- Grid 12 cols → Single column stack
- Horizontal scroll para cards múltiples
- Sticky headers para navegación

**Widget Adaptations:**
- Métricas: 2x2 grid en lugar de 1x4
- Tablas → Cards apilables
- Gráficos → Versiones simplificadas
- Actions → Swipe gestures

**Touch Interactions:**
- Minimum 44px touch targets
- Swipe para acciones secundarias
- Pull-to-refresh en feeds
- Tap para expand/collapse widgets
```

### Breakpoint Strategy:
```
Mobile: 320px - 767px
- Single column layout
- Stacked widgets
- Bottom navigation

Tablet: 768px - 1023px
- 2-column layout
- Condensed widgets
- Sidebar toggleable

Desktop: 1024px+
- Full grid layout
- All widgets visible
- Fixed sidebar
```

---

## 7. STATES Y LOADING

### Loading States:
```
Diseña loading states elegantes para cada dashboard:

**Initial Load:**
- Skeleton screens que replican el layout final
- Shimmer animation sutil
- Progressive loading (crítico primero)

**Data Refresh:**
- Subtle pulse en widgets actualizándose
- Micro-spinners en métricas específicas
- Toast notifications para actualizaciones exitosas

**Empty States:**
- Ilustraciones específicas por contexto:
  - Estudiante: "¡Empieza explorando ofertas!"
  - Empresa: "Publica tu primera oferta"
  - Institución: "Conecta con más estudiantes"
- CTAs claros para primera acción
```

### Error Handling:
```
Diseña error states informativos:

**Network Errors:**
- Mensaje claro sin jerga técnica
- Botón retry prominente
- Opción de contactar soporte

**Permission Errors:**
- Explicación del nivel de acceso requerido
- Contacto con admin/superior

**Data Errors:**
- Explicación de qué salió mal
- Alternativas o pasos a seguir
- Formulario de reporte de bug
```

Estos prompts proporcionan especificaciones detalladas para crear dashboards personalizados que optimicen la experiencia de cada tipo de usuario en ProTalent.