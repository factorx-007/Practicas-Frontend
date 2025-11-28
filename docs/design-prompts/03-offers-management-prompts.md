# Prompts de Diseño - Gestión de Ofertas

## Contexto del Proyecto
Módulo central de ProTalent para exploración, creación y gestión de ofertas laborales. Incluye funcionalidades avanzadas de búsqueda, filtrado inteligente, y gestión completa del ciclo de vida de las ofertas.

---

## 1. EXPLORAR OFERTAS (`/offers`)

### Prompt de Diseño Principal:
```
Diseña una página de exploración de ofertas moderna y eficiente como la mejor versión de LinkedIn Jobs + Indeed:

**Layout Principal:**
- Header con búsqueda global prominente
- Sidebar izquierdo (280px) con filtros inteligentes
- Área principal (flex) con lista de ofertas
- Opcional: Sidebar derecho con mapa/stats

**Barra de Búsqueda Hero:**
- Input grande con placeholder inteligente: "Busca por puesto, empresa o skill..."
- Búsqueda por ubicación con autocomplete
- Filtros rápidos como chips: [Remoto] [Junior] [Tech] [Tiempo completo]
- Botón búsqueda prominente con ícono
- Sugerencias de búsqueda trending debajo

**Sidebar de Filtros (Izquierdo):**
- Secciones colapsables organizadas:

"Ubicación" 📍
- Campo búsqueda de ciudades
- Checkboxes para ciudades populares
- Slider para radio de distancia
- Toggle "Incluir ofertas remotas"

"Tipo de Empleo" 💼
- Checkboxes: Tiempo completo, Medio tiempo, Freelance, Prácticas
- Visual icons para cada tipo

"Experiencia Requerida" 📈
- Radio buttons: Sin experiencia, 1-2 años, 3-5 años, 5+ años
- Slider como alternativa

"Rango Salarial" 💰
- Dual-handle slider con inputs numéricos
- Checkbox "Mostrar solo con salario visible"
- Moneda selector (MXN/USD)

"Modalidad" 🏠
- Radio: Presencial, Remoto, Híbrido
- Icons descriptivos

"Empresa" 🏢
- Search input para filtrar por empresa
- Checkboxes para empresas populares
- "Solo empresas verificadas" toggle

"Skills y Tecnologías" 🛠️
- Input de búsqueda con autocomplete
- Tags seleccionados como chips removibles
- Categorías populares: Frontend, Backend, Mobile, etc.

"Fecha de Publicación" 📅
- Radio: Última semana, Último mes, Últimos 3 meses
- Date picker para rango personalizado

**Lista de Ofertas (Principal):**
- Cards de ofertas optimizadas para scanning:

Card Layout:
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] TechCorp                                   [❤️] │
│        Senior Frontend Developer                        │
│        CDMX • Híbrido • Tiempo completo               │
│                                                         │
│ 🎯 Match: 92% │ 💰 $80k-$100k │ ⏰ Publicado hace 2d │
│                                                         │
│ Skills: React•TypeScript•Node.js•AWS                   │
│                                                         │
│ "Buscamos desarrollador senior para equipo de          │
│ producto. Experiencia con React y TypeScript..."       │
│                                                         │
│ [Ver detalles] [Postular] [Guardar]                   │
└─────────────────────────────────────────────────────────┘
```

**Elementos de Card:**
- Logo empresa (60x60px) + nombre empresa
- Título de posición prominente
- Ubicación + modalidad + tipo con iconos
- Match percentage con color coding (verde >80%, amarillo 60-80%, gris <60%)
- Rango salarial si disponible
- Skills como tags coloridos
- Snippet de descripción (2 líneas max)
- CTAs claros y diferenciados
- Ícono corazón para guardar (hollow/filled states)

**Vista Alternativa - Lista Compacta:**
- Toggle para cambiar a vista más densa
- Información esencial en una línea
- Ideal para users que escanean muchas ofertas

**Funcionalidades Avanzadas:**
- Ordenamiento: Relevancia, Fecha, Salario, Match score
- Filtro "Aplicación rápida" para ofertas con proceso simplificado
- Badge "Urgente" para ofertas con pocos días restantes
- Badge "Destacada" para ofertas promocionadas
- "Ofertas similares" suggestions

**Estados y Loading:**
- Skeleton cards durante carga
- Empty state con sugerencias de ampliar búsqueda
- Error state con retry options
- Loading more con intersection observer

**Colores y Estilo:**
- Primarios: Azul ProTalent (#3B82F6)
- Cards: Blanco con border sutil, hover shadow
- Badges match: Verde (#10B981), Amarillo (#F59E0B), Gris (#6B7280)
- Skills tags: Azul claro con buen contraste
```

### Funcionalidades Específicas:

#### Match Score Visual:
```
Diseña un indicador de match inteligente y motivacional:

**Visual Design:**
- Círculo pequeño con porcentaje (92%)
- Color coding:
  - 90-100%: Verde brillante (#10B981) "Excelente match"
  - 75-89%: Verde normal (#059669) "Buen match"
  - 60-74%: Amarillo (#F59E0B) "Match parcial"
  - <60%: Gris (#6B7280) "Considera aplicar"

**Tooltip Detallado:**
- Skills coincidentes vs requeridos
- Experiencia match
- Ubicación compatibility
- Tipo de empleo preference
- Sugerencias para mejorar match

**Interacciones:**
- Hover muestra breakdown detallado
- Click abre modal con análisis completo
- "¿Por qué este match?" link educativo
```

#### Búsqueda Inteligente:
```
Diseña una experiencia de búsqueda avanzada:

**Autocomplete Inteligente:**
- Sugerencias por categorías:
  - Puestos: "Frontend Developer", "UX Designer"
  - Empresas: "Google", "TechCorp", "StartupXYZ"
  - Skills: "React", "Python", "Figma"
  - Ubicaciones: "CDMX", "Guadalajara", "Remoto"

**Recent Searches:**
- Lista de búsquedas recientes del usuario
- Opción de guardar búsquedas como alerts
- Quick filters basados en historial

**Search Results Enhancements:**
- Highlighted terms en resultados
- "Did you mean?" suggestions
- Trending searches showcase
- Advanced search modal para power users
```

---

## 2. DETALLE DE OFERTA (`/offers/[id]`)

### Prompt de Diseño Principal:
```
Diseña una página de detalle de oferta inmersiva y convincente que maximice conversiones a aplicación:

**Layout Inmersivo:**
- Header full-width con branding empresa
- Contenido principal centrado (max-width 1200px)
- Sidebar sticky con acciones y info clave
- Navegación breadcrumb clara

**Hero Section:**
- Banner empresa como fondo sutil
- Logo empresa prominente (120x120px)
- Título puesto muy grande y claro
- Ubicación + modalidad + tipo con iconos grandes
- Salario destacado si disponible
- Badge "Urgente" si aplica
- Match score prominente para usuario loggeado

**CTAs Principales (Sticky):**
```
┌─────────────────────────────────────────────────────────┐
│ [Postular Ahora] [💾 Guardar] [🔗 Compartir] [💬 Chat]│
└─────────────────────────────────────────────────────────┘
```

**Navegación por Tabs:**
- [Descripción] [Requisitos] [Empresa] [Proceso] [Beneficios]
- Smooth scroll a secciones correspondientes
- Progress indicator si user navega secuencialmente

**Tab: Descripción**
- Contenido rich text bien formateado
- Secciones claras: Responsabilidades, Qué harás día a día
- Bullets y listas bien estructuradas
- Destacar palabras clave de skills

**Tab: Requisitos**
- Lista clara de requisitos obligatorios vs deseables
- Skills con indicadores: ✅ Lo tienes, ⚠️ Similar, ❌ Te falta
- Años de experiencia requeridos
- Educación necesaria
- "Gap analysis" personalizado

**Tab: Empresa**
- Información corporativa atractiva
- Misión/visión/valores
- Tamaño empresa y año fundación
- Cultura empresarial con fotos/videos
- Otros empleados en LinkedIn-style cards
- "¿Por qué trabajar aquí?" section

**Tab: Proceso de Selección**
- Timeline visual del proceso:
  1. Aplicación (1 día)
  2. Revisión CV (3-5 días)
  3. Entrevista inicial (1 semana)
  4. Entrevista técnica (1 semana)
  5. Decisión final (3 días)
- Preparación recomendada para cada fase
- Testimonios de empleados sobre el proceso

**Sidebar Sticky (Derecho):**
```
┌─────────────────────────────────┐
│ Quick Info                      │
├─────────────────────────────────┤
│ 💰 Salario: $80k - $100k       │
│ 📍 Ubicación: CDMX, Híbrido    │
│ ⏰ Publicado: hace 3 días       │
│ 👥 25 candidatos aplicados     │
│ ⏳ Cierra en: 15 días          │
│                                 │
│ 🎯 Tu Match: 92%               │
│ [Ver análisis detallado]       │
│                                 │
│ Skills Match:                   │
│ ✅ React (Expert)              │
│ ✅ TypeScript (Advanced)       │
│ ⚠️ AWS (Basic)                 │
│ ❌ Kubernetes                  │
│                                 │
│ [Postular Ahora]              │
│ [Guardar Oferta]              │
│ [Compartir]                    │
│                                 │
│ Similar Offers:                 │
│ • Frontend Dev - StartupXYZ     │
│ • React Developer - TechCo      │
│ • Sr Developer - InnovateCorp   │
└─────────────────────────────────┘
```

**Sección: Ofertas Similares**
- Carrusel de 3-4 ofertas relacionadas
- Basado en skills, ubicación, nivel
- CTAs rápidos para comparar

**Footer de Conversión:**
- Última oportunidad para aplicar
- Recordatorios de deadline
- Social proof: "X personas aplicaron hoy"
- Trust signals: empresa verificada, etc.

**Elementos de Confianza:**
- Badge "Empresa Verificada"
- Testimonios de empleados actuales
- Glassdoor rating si disponible
- Certificaciones empresa
```

### Modal de Postulación:
```
Diseña un proceso de postulación fluido y motivacional:

**Paso 1: Pre-validación**
- Revisar requisitos mínimos
- Match score confirmation
- "¿Estás seguro que quieres aplicar?"
- Tips rápidos para destacar

**Paso 2: Carta de Presentación**
- Textarea con placeholder inteligente
- Sugerencias personalizadas basadas en perfil
- Template suggestions
- Contador de caracteres (300-500 recomendado)
- Previsualización en tiempo real

**Paso 3: CV Selection**
- Mostrar CV actual con preview
- Opción "Subir CV específico para esta posición"
- Tips: "Asegúrate que tu CV incluye [skills específicos]"

**Paso 4: Preguntas Personalizadas**
- Preguntas específicas de la empresa
- Variedad de tipos: text, multiple choice, scale
- Progress indicator
- Guardado automático

**Paso 5: Confirmación**
- Resumen de aplicación
- "Tu aplicación se verá así"
- Última chance para editar
- Botón "Enviar Aplicación" prominente
- Expectativas de timing de respuesta

**Success State:**
- Confirmación entusiasta
- Próximos pasos claros
- Enlace a tracking de aplicación
- Sugerencias de ofertas similares
- Social sharing opcional
```

---

## 3. CREAR OFERTA (`/offers/create`) - Vista Empresa

### Prompt de Diseño Principal:
```
Diseña un flujo de creación de ofertas profesional y eficiente para empresas:

**Layout de Wizard:**
- Progress stepper prominente en top
- Navegación lateral con pasos y validación
- Área principal con formulario en secciones
- Preview sticky sidebar (desktop)

**Step Indicator:**
```
[1] [2] [3] [4] [5]
 ●   ○   ○   ○   ○
Info → Req → Comp → Proc → Rev
```

**Paso 1: Información Básica**
- Título del puesto (input grande, placeholder inteligente)
- Departamento/área (dropdown con opciones comunes)
- Descripción del puesto (rich text editor)
  - Toolbar: Bold, italic, bullets, links
  - Sugerencias de contenido por tipo de puesto
  - Contador de caracteres con recomendaciones
- Tipo de empleo (radio buttons con iconos)
- Modalidad de trabajo (radio con descripiones)
- Ubicación (autocomplete con múltiples ubicaciones)

**Paso 2: Requisitos y Skills**
- Nivel de experiencia (slider visual: 0-10+ años)
- Educación requerida (dropdown: Bachillerato, Licenciatura, etc.)
- Skills técnicos requeridos:
  - Input con autocomplete inteligente
  - Tags seleccionados como chips
  - Clasificación: Indispensable vs Deseable
  - Nivel requerido por skill (Básico/Intermedio/Avanzado)
- Idiomas requeridos
- Certificaciones específicas

**Paso 3: Compensación y Beneficios**
- Rango salarial (dual slider + checkbox "Negociable")
- Tipo de salario (Mensual/Anual/Por hora)
- Moneda selector
- Beneficios (checkboxes multiple):
  - Seguro médico, Vales de despensa, Home office
  - Capacitación, Horario flexible, Aguinaldo
  - Custom benefits input
- Esquema de bonos/comisiones
- Equity/stock options (para startups)

**Paso 4: Proceso de Selección**
- Fases del proceso (drag & drop para reordenar):
  - Default: Aplicación → Revisión → Entrevista → Decisión
  - Customizable: Agregar pasos técnicos, múltiples entrevistas
- Tiempo estimado por fase
- Preguntas personalizadas para candidatos:
  - Texto libre, múltiple opción, escala
  - Preview en tiempo real
- Configuración de notificaciones

**Paso 5: Revisión y Publicación**
- Preview completo como lo verán candidatos
- Checklist de optimización:
  - ✅ Título atractivo
  - ⚠️ Agregar más beneficios
  - ✅ Rango salarial incluido
  - ⚠️ Descripción podría ser más específica
- Configuración de visibilidad:
  - Pública, Solo red de empresa, Privada
- Configuración de promoción (paid features)
- Fecha de cierre automático
- Botón "Publicar Oferta" prominente

**Preview Sidebar (Desktop):**
- Vista mini de cómo se ve la oferta
- Updates en tiempo real mientras tipea
- "Ver preview completo" link
- Indicadores de calidad/completitud

**Validaciones y Ayuda:**
- Validación en tiempo real
- Tooltips explicativos
- Sugerencias basadas en ofertas similares exitosas
- "Guardar como borrador" en cada paso
- Auto-save cada 30 segundos

**Colores Empresariales:**
- Azul corporativo para CTAs principales
- Verde para validaciones exitosas
- Amarillo para warnings/sugerencias
- Gris para elementos secundarios
- UI más formal que vista estudiante
```

### Templates y Asistencia:
```
Diseña un sistema de templates inteligente para acelerar creación:

**Template Gallery:**
- Templates por industria:
  - "Desarrollador Frontend - Startup"
  - "Analista de Datos - Corporativo"
  - "Diseñador UX - Agencia"
- Templates por nivel:
  - Junior, Mid-level, Senior, Lead
- Templates populares de la plataforma

**Smart Suggestions:**
- "Empresas similares ofrecen $X-$Y para este puesto"
- "Skills trending para este tipo de posición"
- "Candidatos en ProTalent buscan principalmente..."
- "Beneficios más valorados por candidatos junior"

**AI Writing Assistant:**
- Generar descripción base a partir de título
- Mejorar texto existente
- Sugerir skills relevantes
- Optimizar para SEO interno

**Collaboration Features:**
- Compartir borrador con colegas
- Comentarios y feedback inline
- Workflow de aprobación
- Historial de versiones
```

---

## 4. MIS OFERTAS (`/offers/my-offers`) - Vista Empresa

### Prompt de Diseño Principal:
```
Diseña un dashboard de gestión de ofertas para empresas con vista ejecutiva:

**Layout de Gestión:**
- Header con métricas quick y acciones globales
- Toolbar con filtros, búsqueda y ordenamiento
- Lista/tabla híbrida de ofertas
- Sidebar con estadísticas detalladas

**Header con Quick Stats:**
```
┌─────────────────────────────────────────────────────────┐
│ Mis Ofertas                           [+ Nueva Oferta] │
├─────────────────────────────────────────────────────────┤
│ [8] Activas  [12] En Proceso  [5] Cerradas  [3] Draft │
└─────────────────────────────────────────────────────────┘
```

**Toolbar de Gestión:**
- Búsqueda en ofertas propias
- Filtros: Estado, Departamento, Fecha, Performance
- Ordenamiento: Fecha, Aplicaciones, Performance
- Vista: Cards vs Tabla
- Bulk actions: Cerrar múltiples, Clonar, etc.

**Cards de Ofertas (Vista Principal):**
```
┌─────────────────────────────────────────────────────────┐
│ [Icon] Senior Frontend Developer                  [⋯] │
│ CDMX • Híbrido • Publicado hace 5 días                │
├─────────────────────────────────────────────────────────┤
│ 📊 Performance:                                        │
│ • 23 aplicaciones (🎯 objetivo: 30)                   │
│ • 78% tasa de calidad                                  │
│ • 4.2/5 match promedio                                │
│                                                         │
│ Estado: 🟢 Activa • Cierra en 10 días                 │
│                                                         │
│ [Ver Candidatos] [Editar] [Estadísticas] [Cerrar]     │
└─────────────────────────────────────────────────────────┘
```

**Información por Card:**
- Título y ubicación
- Estado visual con color coding
- Métricas de performance clave
- Tiempo restante hasta cierre
- Quick actions contextuales
- Indicadores de urgencia/atención

**Estados de Ofertas:**
- 🟢 Activa: Recibiendo aplicaciones
- 🟡 En Proceso: Entrevistando candidatos
- 🔵 En Pausa: Temporalmente no visible
- 🟠 Por Vencer: Menos de 3 días
- ⚫ Cerrada: Posición llena o vencida
- 📝 Borrador: No publicada aún

**Vista Tabla (Alternativa):**
- Información más densa para power users
- Ordenamiento por columnas
- Bulk selection con checkboxes
- Export functionality
- Columnas customizables

**Sidebar de Analytics:**
```
┌─────────────────────────────────┐
│ Analytics Overview              │
├─────────────────────────────────┤
│ Este Mes:                       │
│ • 45 aplicaciones totales       │
│ • 12 entrevistas programadas    │
│ • 3 ofertas aceptadas          │
│ • 18 días tiempo promedio       │
│                                 │
│ Top Performing:                 │
│ • "React Developer" (89% qual)  │
│ • "UX Designer" (78% qual)      │
│                                 │
│ Needs Attention:                │
│ • "Backend Dev" (baja aplicac.) │
│ • "DevOps Engineer" (vence)     │
│                                 │
│ [Ver Reporte Completo]         │
└─────────────────────────────────┘
```

**Acciones de Gestión:**
- Clonar oferta (para posiciones similares)
- Editar oferta (con versioning)
- Promover oferta (paid feature)
- Pausar/reactivar
- Cerrar anticipadamente
- Exportar datos de candidatos
- Generar reporte de hiring
```

---

## 5. COMPONENTES REUTILIZABLES

### 5.1 Offer Card Component:
```
Diseña un componente de oferta reutilizable para múltiples contextos:

**Variantes:**
- Compact: Para listas densas, información mínima
- Standard: Balanceado, para exploración general
- Detailed: Para bookmarks y ofertas guardadas
- Management: Para empresas, con métricas

**Estados:**
- Default: Estado normal
- Saved: Destacado para ofertas guardadas
- Applied: Indicador de ya aplicado
- Expired: Desaturado, no aplicable
- Featured: Border destacado para ofertas promocionadas

**Responsive Behavior:**
- Desktop: Full layout con todos los elementos
- Tablet: Información esencial, CTAs compactos
- Mobile: Stack vertical, información prioritaria
```

### 5.2 Filter Sidebar Component:
```
Diseña un sidebar de filtros avanzado y reutilizable:

**Characteristics:**
- Collapsible sections con estado persistente
- Clear all filters option
- Applied filters summary en top
- Mobile-friendly (drawer/modal)
- Smart defaults basados en perfil usuario

**Filter Types:**
- Checkboxes: Múltiple selección
- Radio buttons: Selección única
- Sliders: Rangos numéricos
- Date pickers: Rangos de fecha
- Search inputs: Filtrado por texto
- Chips: Tags seleccionables

**UX Enhancements:**
- Contador de resultados por filtro
- "Save search" como alert
- Quick filters como shortcuts
- Recent filters history
```

---

## 6. RESPONSIVE DESIGN

### Mobile Optimization:
```
Adapta toda la experiencia de ofertas para mobile:

**Explorar Ofertas Mobile:**
- Búsqueda hero simplificada
- Filtros en drawer lateral
- Cards optimizadas para scroll vertical
- Infinite scroll suave
- Quick actions swipe gestures

**Detalle Oferta Mobile:**
- Header compacto con info esencial
- CTAs sticky en bottom
- Tabs como carousel horizontal
- Sidebar info como expandable sections
- Share sheet nativo

**Crear Oferta Mobile:**
- One step per screen
- Progress indicator adaptado
- Inputs optimizados para touch
- Auto-save agresivo
- Preview como modal full-screen
```

### Performance Considerations:
```
Optimizaciones para carga y UX:

**Lazy Loading:**
- Cards de ofertas con intersection observer
- Imágenes empresa lazy load
- Infinite scroll con buffer

**Caching Strategy:**
- Cache de filtros aplicados
- Local storage para borradores
- Service worker para offline browsing

**Progressive Enhancement:**
- Core functionality sin JavaScript
- Enhanced features con JS
- Fallbacks elegantes para funciones avanzadas
```

Estos prompts proporcionan especificaciones completas para crear una experiencia de gestión de ofertas competitiva y moderna en ProTalent.