# Flujos de Usuario - Gestión de Postulaciones

## Visión General
Módulo dedicado a la gestión completa del ciclo de vida de las postulaciones, desde la aplicación inicial hasta la contratación final.

---

## 1. FLUJO DE POSTULACIÓN (Estudiante)

### Entrada Principal
- **Vista**: `/applications` (desde sidebar estudiante)
- **Trigger**: Click en "Postular" desde detalle de oferta
- **Estado Inicial**: Usuario autenticado como estudiante

### Sub-flujos de Postulación

#### 1.1 Proceso de Postulación

**Paso 1: Pre-validación**
```
Detalle Oferta → Click "Postular" → Verificación requisitos → Continuar/Alertas
```
- Verificar completitud de perfil (mínimo 70%)
- Comprobar match de skills básicos
- Alertar sobre requisitos faltantes

**Paso 2: Formulario de Postulación**
```
Modal/Page → Carta presentación → CV selection → Preguntas custom → Enviar
```
- Carta de presentación (opcional/requerida según oferta)
- Selección de CV (actual/subir nuevo)
- Responder preguntas personalizadas de la empresa
- Preview de postulación antes de envío

**Paso 3: Confirmación y Seguimiento**
```
Postulación enviada → Confirmación → Redirección Mis Postulaciones → Tracking
```

### Estados de Postulación
- **ENVIADA**: Recién enviada, pendiente de revisión
- **VISTA**: Empresa ha visto la postulación
- **PRESELECCIONADO**: Candidato pasa primera criba
- **ENTREVISTA_PROGRAMADA**: Programada entrevista
- **EN_PROCESO**: En proceso de entrevistas múltiples
- **FINALISTA**: Entre candidatos finales
- **CONTRATADO**: Seleccionado para el puesto
- **RECHAZADO**: No seleccionado
- **RETIRADO**: Candidato se retira del proceso

---

## 2. VISTA MIS POSTULACIONES (`/applications`)

### Layout y Estructura
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Mis Postulaciones" + Filtros + Stats         │
├─────────────────────────────────────────────────────────┤
│ Tabs: [Activas] [En Proceso] [Finalizadas] [Todas]    │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────┬────────────────────────────────┐   │
│ │ Filtros Lateral  │ Lista de Postulaciones         │   │
│ │                  │                                │   │
│ │ • Estado         │ ┌────────────────────────────┐ │   │
│ │ • Fecha          │ │ Card de Postulación        │ │   │
│ │ • Tipo empleo    │ │ • Logo empresa             │ │   │
│ │ • Modalidad      │ │ • Título puesto            │ │   │
│ │ • Salario        │ │ • Estado actual + badge    │ │   │
│ │                  │ │ • Fecha postulación        │ │   │
│ │ Búsqueda rápida  │ │ • Progreso visual          │ │   │
│ │                  │ │ • Acciones: [Ver] [Msg]    │ │   │
│ │ Exportar datos   │ └────────────────────────────┘ │   │
│ └──────────────────┴────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Funcionalidades por Tab

#### Tab "Activas" (Estados: ENVIADA, VISTA, PRESELECCIONADO)
- **Acciones disponibles**: Ver detalle, enviar mensaje follow-up, retirar postulación
- **Indicadores**: Tiempo transcurrido, siguiente acción esperada
- **Notificaciones**: Nuevas actualizaciones destacadas

#### Tab "En Proceso" (Estados: ENTREVISTA_PROGRAMADA, EN_PROCESO, FINALISTA)
- **Acciones**: Ver cronograma, preparar entrevista, subir documentos adicionales
- **Calendar integration**: Próximas entrevistas
- **Recursos**: Tips de entrevista, información empresa

#### Tab "Finalizadas" (Estados: CONTRATADO, RECHAZADO, RETIRADO)
- **Métricas**: Tiempo total del proceso, feedback recibido
- **Acciones**: Ver feedback, solicitar referencias, aplicar a ofertas similares
- **Analytics**: Estadísticas personales de éxito

---

## 3. DETALLE DE POSTULACIÓN (`/applications/[id]`)

### Estructura de Vista Detallada
```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Mis Postulaciones > [Título Oferta]       │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Header de Postulación                               │ │
│ │ • Logo empresa + Nombre empresa                     │ │
│ │ • Título del puesto                                 │ │
│ │ │ Estado actual con badge colorido                  │ │
│ │ • Fecha de postulación                              │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────┬────────────────────────────────┐   │
│ │ Timeline         │ Información de Postulación     │   │
│ │ Proceso          │                                │   │
│ │                  │ Tabs:                          │   │
│ │ ┌──────────────┐ │ [Mi Postulación] [Oferta]      │   │
│ │ │●─────────────│ │ [Empresa] [Comunicación]       │   │
│ │ │ENVIADA       │ │                                │   │
│ │ │●─────────────│ │ Contenido según tab activo:    │   │
│ │ │VISTA         │ │ • CV enviado                   │   │
│ │ │○─────────────│ │ • Carta presentación           │   │
│ │ │ENTREVISTA    │ │ • Respuestas a preguntas       │   │
│ │ │○─────────────│ │ • Documentos adjuntos          │   │
│ │ │DECISION      │ │ • Historial comunicación       │   │
│ │ └──────────────┘ │                                │   │
│ │                  │ Acciones disponibles:          │   │
│ │ Próximos pasos:  │ • Enviar mensaje               │   │
│ │ • Esperar        │ • Actualizar documentos        │   │
│ │   respuesta      │ • Programar entrevista         │   │
│ │ • Preparar       │ • Retirar postulación          │   │
│ │   entrevista     │                                │   │
│ └──────────────────┴────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Timeline Interactiva
**Fases del Proceso:**
1. **Postulación Enviada** ✅
2. **Revisión CV** ⏳
3. **Preselección** ⏳
4. **Entrevista Técnica** ⏳
5. **Entrevista Final** ⏳
6. **Decisión Final** ⏳

**Información por Fase:**
- **Estado actual**: Visual indicator con color
- **Tiempo estimado**: Based on company data
- **Acciones pendientes**: Para candidato y empresa
- **Documentos requeridos**: Por fase

---

## 4. FLUJO DE GESTIÓN DE CANDIDATOS (Empresa)

### Vista Principal (`/candidates`)
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Gestión de Candidatos" + Quick Stats          │
│ [123 Nuevos] [45 En Proceso] [12 Finalizados Hoy]     │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────┬────────────────────────────────┐   │
│ │ Filtros y        │ Lista de Candidatos            │   │
│ │ Búsqueda         │                                │   │
│ │                  │ Agrupado por Oferta:           │   │
│ │ • Por oferta     │                                │   │
│ │ • Por estado     │ ► Desarrollador Senior         │   │
│ │ • Por fecha      │   [15 candidatos]              │   │
│ │ • Por skills     │   ┌──────────────────────────┐ │   │
│ │ • Por rating     │   │ Candidato Card           │ │   │
│ │                  │   │ • Avatar + Nombre        │ │   │
│ │ Acciones bulk:   │   │ • Universidad + Carrera  │ │   │
│ │ • Mover estado   │   │ • Skills match 85%       │ │   │
│ │ • Enviar msg     │   │ • Estado + Fecha         │ │   │
│ │ • Programar      │   │ • [Ver] [Chat] [Mover]   │ │   │
│ │ • Descartar      │   └──────────────────────────┘ │   │
│ └──────────────────┴────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Revisión de Candidatos

#### 4.1 Vista Individual de Candidato (`/candidates/[id]`)
```
┌─────────────────────────────────────────────────────────┐
│ Candidate Profile Header                                │
│ ┌─────────────────┬─────────────────────────────────┐   │
│ │ Avatar + Básicos│ Quick Actions                   │   │
│ │ • Nombre        │ [Aprobar] [Rechazar] [Chat]     │   │
│ │ • Universidad   │ [Programar] [Notas] [CV]        │   │
│ │ • Experiencia   │                                 │   │
│ │ • Match Score   │ Estado actual: [Dropdown]       │   │
│ └─────────────────┴─────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│ Tabs: [Perfil] [CV] [Postulación] [Evaluación] [Chat] │
│                                                         │
│ Contenido del Tab Activo:                              │
│ • Perfil: Skills, experiencia, proyectos               │
│ • CV: Documento subido + análisis automático           │
│ • Postulación: Carta + respuestas preguntas            │
│ • Evaluación: Notas internas + scoring                 │
│ • Chat: Historial conversaciones                       │
└─────────────────────────────────────────────────────────┘
```

#### 4.2 Kanban de Candidatos (Vista Alternativa)
```
┌─────────────────────────────────────────────────────────┐
│ [Nuevos] [Revisando] [Entrevista] [Finales] [Decidido] │
├─────────┬─────────┬───────────┬─────────┬─────────────┤
│ 🟦 Juan │ 🟨 Ana  │ 🟧 Carlos │ 🟪 Luis │ ✅ Selec.   │
│ Dev Jr  │ Dev Sr  │ Designer  │ QA      │ 🚫 Rechaz.  │
│ Match85%│ Match92%│ Match78%  │ Match95%│             │
│ [Ver]   │ [Ver]   │ [Ver]     │ [Ver]   │             │
│         │         │           │         │             │
│ 🟦 María│ 🟨 Pedro│ 🟧 Laura  │         │             │
│ [Ver]   │ [Ver]   │ [Ver]     │         │             │
└─────────┴─────────┴───────────┴─────────┴─────────────┘
```

---

## 5. COMUNICACIÓN EN EL PROCESO

### Chat Integrado (`/applications/[id]/chat`)
```
┌─────────────────────────────────────────────────────────┐
│ Chat: [Nombre Empresa] - [Título Puesto]               │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Área de Mensajes                                    │ │
│ │                                                     │ │
│ │ Sistema: "Tu postulación ha sido revisada"         │ │
│ │                                                     │ │
│ │     Empresa: "Hola Juan, hemos revisado tu perfil   │ │
│ │              y nos interesa conocerte más. ¿Podrías │ │
│ │              contarnos sobre tu experiencia con     │ │
│ │              React?"                          [2:30] │ │
│ │                                                     │ │
│ │ Tú: "¡Hola! Por supuesto, llevo 2 años..."   [2:45] │ │
│ │                                                     │ │
│ │ Sistema: "Entrevista programada para el 15/10"     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Escribe tu mensaje...] [📎] [😊] [Enviar]          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Acciones rápidas:                                      │
│ • Programar entrevista                                 │
│ • Solicitar documentos                                 │
│ • Templates de respuesta                               │
└─────────────────────────────────────────────────────────┘
```

---

## 6. NOTIFICACIONES Y ALERTAS

### Tipos de Notificaciones por Estado

#### Para Estudiantes:
- **Nueva respuesta empresa**: "TechCorp ha enviado un mensaje"
- **Cambio de estado**: "Tu postulación para Dev Jr está EN_PROCESO"
- **Entrevista programada**: "Entrevista programada para mañana 15:00"
- **Documentos requeridos**: "La empresa solicita certificado adicional"
- **Decisión final**: "¡Felicidades! Has sido seleccionado para..."

#### Para Empresas:
- **Nueva postulación**: "3 nuevos candidatos para Desarrollador Senior"
- **Respuesta candidato**: "Juan Pérez ha respondido tu mensaje"
- **Entrevista confirmada**: "Carlos confirmó entrevista para mañana"
- **Plazo vencimiento**: "La oferta 'Dev Frontend' vence en 2 días"

---

## 7. MÉTRICAS Y ANALYTICS

### Dashboard de Métricas (Estudiante)
```
┌─────────────────────────────────────────────────────────┐
│ Mi Rendimiento en Postulaciones                        │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┬─────────────┬─────────────┬───────────┐ │
│ │ Postuladas  │ Vistas      │ Entrevistas │ Ofertas   │ │
│ │     23      │     18      │      7      │     2     │ │
│ │   📈 +5     │   📈 +3     │   📈 +2     │   🎉 +1   │ │
│ └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│ Tasa de respuesta: 78% (📈 +5% vs mes pasado)          │
│ Tiempo promedio hasta entrevista: 8 días               │
│ Skills más solicitados: React, Node.js, Python         │
└─────────────────────────────────────────────────────────┘
```

### Dashboard de Métricas (Empresa)
```
┌─────────────────────────────────────────────────────────┐
│ Rendimiento de Hiring                                   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┬─────────────┬─────────────┬───────────┐ │
│ │ Candidatos  │ Calificados │ Entrevistas │ Contrat.  │ │
│ │    156      │     89      │     34      │    12     │ │
│ │   📈 +23    │   📈 +15    │   📈 +8     │   📈 +3   │ │
│ └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│ Tiempo promedio llenado de vacante: 18 días            │
│ Tasa de aceptación de ofertas: 85%                     │
│ Quality score candidatos: 4.2/5                        │
└─────────────────────────────────────────────────────────┘
```

---

## 8. CASOS EDGE Y MANEJO DE ERRORES

### Situaciones Especiales

#### 8.1 Postulación Duplicada
```
Usuario intenta postular → Sistema detecta postulación previa →
Modal "Ya aplicaste" → Opción "Ver estado" o "Actualizar postulación"
```

#### 8.2 Oferta Cancelada Durante Proceso
```
Sistema detecta oferta cancelada → Notificar candidatos activos →
Opciones: "Ver ofertas similares" / "Guardar perfil empresa"
```

#### 8.3 Candidato No Responde
```
Empresa programa entrevista → 48h sin respuesta candidato →
Auto-reminder → 24h más → Marcar "No respondió" + opciones empresa
```

### Estados de Error
- **POSTULACION_INVALIDA**: Requisitos no cumplidos
- **PROCESO_CANCELADO**: Empresa cancela proceso
- **NO_RESPUESTA**: Candidato no responde en tiempo
- **DOCUMENTOS_INSUFICIENTES**: Faltan documentos requeridos

---

## 9. OPTIMIZACIONES UX

### Mejoras de Experiencia

#### 9.1 Auto-save y Recuperación
- Auto-guardar borradores de cartas de presentación
- Recuperar postulaciones interrumpidas
- Cache de respuestas a preguntas frecuentes

#### 9.2 Sugerencias Inteligentes
- Sugerir mejoras en carta de presentación
- Recomendar skills a destacar según oferta
- Alertar sobre documentos faltantes antes de postular

#### 9.3 Acciones Rápidas
- Templates de respuesta para chat
- Bulk actions para empresas
- Shortcuts de teclado para navegación rápida

---

Este flujo de gestión de postulaciones cubre todo el ciclo de vida desde la aplicación hasta la contratación, optimizando la experiencia tanto para candidatos como para empresas.