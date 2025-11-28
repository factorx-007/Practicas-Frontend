# Flujos de Usuario - Centro de Notificaciones

## Visión General
Sistema integral de notificaciones que mantiene a todos los usuarios informados sobre actividades relevantes, actualizaciones de estado y oportunidades dentro de ProTalent.

---

## 1. CENTRO DE NOTIFICACIONES (`/notifications`)

### 1.1 Layout Principal
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Notificaciones" + [⚙️] + [Marcar todo leído] │
├─────────────────────────────────────────────────────────┤
│ Filtros: [Todas] [No leídas] [Importantes] [Hoy]      │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔴 No leídas (5)                                   │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🎯 TechCorp ha visto tu postulación          2m│ │ │
│ │ │ para "Desarrollador Frontend Junior"           │ │ │
│ │ │ [Ver detalles] [Marcar leída]                  │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 💬 Nuevo mensaje de Ana García            [!] 5m│ │ │
│ │ │ "¿Tienes tiempo para una video llamada?"      │ │ │
│ │ │ [Responder] [Ver chat]                         │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🎊 ¡Nueva oferta que coincide con tu perfil!15m│ │ │
│ │ │ "Senior React Developer en StartupXYZ"         │ │ │
│ │ │ Match: 92% • Salario: $80k-$100k              │ │ │
│ │ │ [Ver oferta] [Postular] [No me interesa]      │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Anteriores                                       │ │
│ │                                                     │ │
│ │ ⚪ 👥 Juan Pérez quiere conectar contigo        2h │ │
│ │ ⚪ 📋 Recordatorio: Completa tu perfil          4h │ │
│ │ ⚪ 🎉 Tu post ha recibido 50 likes             6h │ │
│ │ ⚪ 📅 Evento mañana: "React Workshop"           1d │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Cargar más notificaciones...]                         │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Tipos de Notificaciones

#### Estudiantes
- **🎯 Postulaciones**: Estados, respuestas de empresas, entrevistas
- **💼 Ofertas**: Nuevas ofertas coincidentes, alertas guardadas
- **💬 Mensajes**: Nuevos chats, respuestas importantes
- **👥 Social**: Conexiones, menciones, reacciones a posts
- **📅 Eventos**: Recordatorios, nuevos eventos relevantes
- **🏆 Logros**: Completitud de perfil, badges ganados
- **⚠️ Sistema**: Actualizaciones de cuenta, seguridad

#### Empresas
- **📋 Candidatos**: Nuevas postulaciones, respuestas de candidatos
- **💬 Comunicación**: Mensajes de candidatos, consultas
- **📊 Analytics**: Reportes de rendimiento, métricas
- **⏰ Recordatorios**: Ofertas por vencer, entrevistas pendientes
- **👥 Networking**: Solicitudes de conexión, eventos
- **🎯 Promoción**: Rendimiento de ofertas promocionadas
- **⚙️ Cuenta**: Renovaciones, cambios de plan

#### Instituciones
- **🎓 Estudiantes**: Actividad de estudiantes, nuevos registros
- **🏢 Empresas**: Nuevos convenios, oportunidades
- **📊 Reportes**: Estadísticas de empleabilidad, métricas
- **📅 Eventos**: Ferias virtuales, webinars
- **🤝 Colaboraciones**: Propuestas de empresas
- **📈 Analytics**: Rendimiento institucional

---

## 2. NOTIFICACIONES EN TIEMPO REAL

### 2.1 Push Notifications (Browser/Mobile)
```
┌─────────────────────────────────────────┐
│ 🔔 ProTalent                           │
├─────────────────────────────────────────┤
│ TechCorp ha visto tu postulación        │
│ para Desarrollador Frontend Junior      │
│                                         │
│ Hace 2 minutos                          │
│ [Ver] [Cerrar]                         │
└─────────────────────────────────────────┘
```

### 2.2 Email Notifications
```
Asunto: 🎯 Nueva actividad en tu postulación - ProTalent

Hola Juan,

TechCorp ha revisado tu postulación para "Desarrollador Frontend Junior"
y ha pasado a la siguiente fase del proceso.

Próximos pasos:
• Espera contacto directo en las próximas 48 horas
• Mantén tu perfil actualizado
• Prepárate para posibles preguntas técnicas

[Ver detalles completos en ProTalent]

---
ProTalent Team
```

### 2.3 In-App Notifications (Dropdown)
```
┌─────────────────────────────────────────────────────────┐
│ 🔔 Notificaciones                                [5] │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔴 TechCorp vió tu postulación              [2m] │ │
│ │ ⚪ Ana García te envió un mensaje            [5m] │ │
│ │ ⚪ Nueva oferta: React Developer            [15m] │ │
│ │ ⚪ Recordatorio: Evento mañana              [2h] │ │
│ │ ⚪ Tu post recibió 25 likes                 [4h] │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Ver todas] [Marcar como leídas]                       │
└─────────────────────────────────────────────────────────┘
```

---

## 3. CONFIGURACIÓN DE NOTIFICACIONES

### 3.1 Panel de Configuración (`/notifications/settings`)
```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Configuración de Notificaciones                     │
├─────────────────────────────────────────────────────────┤
│ Canales de Notificación:                               │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │               │ App │ Email │ Push │ SMS │           │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Postulaciones │ ☑️  │  ☑️   │  ☑️  │ ☐  │           │ │
│ │ Mensajes      │ ☑️  │  ☐    │  ☑️  │ ☐  │           │ │
│ │ Ofertas       │ ☑️  │  ☑️   │  ☑️  │ ☐  │           │ │
│ │ Social        │ ☑️  │  ☐    │  ☐   │ ☐  │           │ │
│ │ Eventos       │ ☑️  │  ☑️   │  ☑️  │ ☐  │           │ │
│ │ Sistema       │ ☑️  │  ☑️   │  ☐   │ ☐  │           │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Frecuencia de Email:                                   │
│ ● Inmediato (cada notificación)                        │
│ ○ Resumen diario (9:00 AM)                            │
│ ○ Resumen semanal (Lunes 9:00 AM)                     │
│ ○ Solo urgentes                                        │
│                                                         │
│ Horarios No Molestar:                                  │
│ Desde: [22:00] Hasta: [08:00]                         │
│ Fines de semana: ☑️ Activar                           │
│                                                         │
│ Filtros Inteligentes:                                  │
│ ☑️ Agrupar notificaciones similares                    │
│ ☑️ Priorizar notificaciones importantes                │
│ ☑️ Suprimir notificaciones de baja relevancia         │
│                                                         │
│ [Guardar Configuración] [Restaurar Predeterminados]   │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Preferencias por Tipo de Usuario

#### Configuración Estudiante
```
Notificaciones Críticas (siempre activas):
✓ Respuestas a postulaciones
✓ Entrevistas programadas
✓ Ofertas con alta coincidencia (>90%)
✓ Mensajes de empresas

Notificaciones Opcionales:
□ Nuevas ofertas (coincidencia <90%)
□ Actividad social (likes, comentarios)
□ Nuevos eventos
□ Tips de mejora de perfil
```

#### Configuración Empresa
```
Notificaciones Críticas:
✓ Nuevas postulaciones
✓ Respuestas de candidatos
✓ Mensajes urgentes
✓ Vencimiento de ofertas

Notificaciones Opcionales:
□ Métricas semanales
□ Nuevos talentos disponibles
□ Eventos de reclutamiento
□ Actualizaciones de producto
```

---

## 4. TIPOS ESPECÍFICOS DE NOTIFICACIONES

### 4.1 Notificaciones de Postulación (Estudiante)
```
🎯 Estados de Postulación:
┌─────────────────────────────────────────────────────────┐
│ TechCorp ha actualizado tu postulación                 │
│ Estado: PENDIENTE → EN_PROCESO                          │
│                                                         │
│ "Hemos revisado tu perfil y nos gustaría conocerte     │
│ más. Un recruiter te contactará en las próximas 48h."  │
│                                                         │
│ Próximos pasos:                                        │
│ • Mantén tu teléfono disponible                        │
│ • Revisa preguntas técnicas de React                    │
│ • Prepara ejemplos de proyectos                        │
│                                                         │
│ [Ver detalles] [Preparar entrevista] [Chat empresa]   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Notificaciones de Candidatos (Empresa)
```
📋 Nueva Postulación:
┌─────────────────────────────────────────────────────────┐
│ 3 nuevos candidatos para "Senior React Developer"      │
│                                                         │
│ ⭐ Ana García - Match 95%                               │
│ • 5 años experiencia React                              │
│ • Portafolio: github.com/ana-garcia                    │
│ • Disponible: Inmediato                                │
│                                                         │
│ ⭐ Carlos López - Match 88%                             │
│ ⭐ María Fernández - Match 82%                          │
│                                                         │
│ [Revisar candidatos] [Filtrar por criterios]          │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Notificaciones Sociales
```
👥 Actividad Social:
┌─────────────────────────────────────────────────────────┐
│ Tu post "Mi primer día como developer" está trending   │
│                                                         │
│ 📊 Estadísticas (últimas 24h):                        │
│ • 156 likes (+89%)                                     │
│ • 34 comentarios (+156%)                               │
│ • 28 shares (+200%)                                    │
│ • 12 nuevos seguidores                                 │
│                                                         │
│ Comentarios destacados:                                │
│ 💬 "¡Inspirador! Yo también acabo de empezar"         │
│ 💬 "Excelente reflexión sobre el primer día"          │
│                                                         │
│ [Ver post] [Responder comentarios] [Compartir]        │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Notificaciones de Eventos
```
📅 Recordatorio de Evento:
┌─────────────────────────────────────────────────────────┐
│ El evento empieza en 1 hora                            │
│                                                         │
│ 🎯 "React Workshop: Hooks Avanzados"                   │
│ 📅 Hoy, 7:00 PM - 9:00 PM                             │
│ 🌐 Virtual (Zoom)                                      │
│                                                         │
│ Preparación recomendada:                               │
│ • Tener Node.js instalado                              │
│ • Conocimientos básicos de React                       │
│ • Editor de código preparado                           │
│                                                         │
│ [Unirse ahora] [Ver agenda] [Cancelar asistencia]     │
└─────────────────────────────────────────────────────────┘
```

---

## 5. NOTIFICACIONES INTELIGENTES

### 5.1 Agrupación Automática
```
📦 Resumen de Actividad (5 notificaciones):
┌─────────────────────────────────────────────────────────┐
│ Actividad en "Desarrollador Frontend" (3)              │
│ • Nueva postulación de Ana García                      │
│ • Carlos López actualizó su aplicación                 │
│ • Proceso cerrado por límite de candidatos             │
│                                                         │
│ Mensajes nuevos (2)                                    │
│ • StartupXYZ: "¿Interesado en posición remote?"       │
│ • Maria Mentor: "¿Cómo va tu búsqueda de empleo?"     │
│                                                         │
│ [Ver detalles] [Expandir todas]                        │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Notificaciones Predictivas
```
🤖 Sugerencia Inteligente:
┌─────────────────────────────────────────────────────────┐
│ Basado en tu actividad, te recomendamos:               │
│                                                         │
│ 📈 Optimizar tu perfil                                 │
│ Completitud actual: 75%                                │
│ +25% más visibilidad agregando:                        │
│ • Proyectos recientes (5 min)                          │
│ • Certificaciones (3 min)                              │
│ • Referencias profesionales (10 min)                   │
│                                                         │
│ 🎯 Nueva oferta perfecta                               │
│ "Frontend Developer en TechStartup" - Match 94%        │
│ Aplicar antes del viernes para mejor posicionamiento   │
│                                                         │
│ [Optimizar perfil] [Ver oferta] [No mostrar sugerencias]│
└─────────────────────────────────────────────────────────┘
```

### 5.3 Alertas de Oportunidades
```
⚡ Alerta Urgente:
┌─────────────────────────────────────────────────────────┐
│ ¡Oportunidad que expira pronto!                        │
│                                                         │
│ "Senior React Developer en UnicornStartup"             │
│ 💰 $120k - $150k • 🏠 Remote • 🚀 Equity              │
│                                                         │
│ ⏰ Solo 2 días restantes para aplicar                  │
│ 🎯 Match perfecto: 96%                                 │
│ 👥 Solo 5 candidatos han aplicado                      │
│                                                         │
│ ¿Por qué es perfecta para ti?                          │
│ ✓ 5+ años React (tienes 6)                            │
│ ✓ Experiencia startup (tienes 3 años)                 │
│ ✓ Skills en TypeScript (experto)                      │
│ ✓ Liderazgo técnico (demostrado)                      │
│                                                         │
│ [Postular ahora] [Ver detalles] [Recordar mañana]     │
└─────────────────────────────────────────────────────────┘
```

---

## 6. NOTIFICACIONES MÓVILES

### 6.1 Adaptación Mobile
```
Mobile Notification Card:
┌─────────────────────────┐
│ 🔔 ProTalent      [⋯] │
├─────────────────────────┤
│ 💬 Ana García           │
│ "¿Tienes tiempo para    │
│ una video llamada?"     │
│                         │
│ 5 min ago              │
│                         │
│ [Responder] [Ver]      │
└─────────────────────────┘
```

### 6.2 Gestos Mobile
- **Swipe right**: Marcar como leída
- **Swipe left**: Eliminar notificación
- **Long press**: Opciones avanzadas
- **Pull down**: Actualizar notificaciones

---

## 7. CENTRO DE COMANDO (ADMIN)

### 7.1 Panel de Notificaciones Admin
```
┌─────────────────────────────────────────────────────────┐
│ 🛡️ Centro de Notificaciones - Admin                   │
├─────────────────────────────────────────────────────────┤
│ Estadísticas (Últimas 24h):                           │
│ • Notificaciones enviadas: 45,230                      │
│ • Tasa de apertura: 68%                                │
│ • Tasa de interacción: 23%                             │
│ • Opt-outs: 12 (0.03%)                                │
│                                                         │
│ Notificaciones Masivas:                                │
│ [📢 Nuevo Anuncio] [⚠️ Mantenimiento] [🎉 Feature]   │
│                                                         │
│ Alertas del Sistema:                                   │
│ ⚠️ 15 notificaciones push fallaron (revisar)          │
│ ⚠️ Email delivery rate bajo 95% (investigar)          │
│ ✅ Todos los canales funcionando normalmente           │
│                                                         │
│ Segmentación:                                          │
│ • Estudiantes activos: 12,450                         │
│ • Empresas verificadas: 890                           │
│ • Instituciones: 156                                  │
│                                                         │
│ [Analytics Completo] [Configurar Campaña]             │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Broadcast de Notificaciones
```
┌─────────────────────────────────────────────────────────┐
│ 📢 Enviar Notificación Masiva                         │
├─────────────────────────────────────────────────────────┤
│ Audiencia:                                             │
│ ☑️ Todos los usuarios                                  │
│ ☐ Solo estudiantes                                     │
│ ☐ Solo empresas                                        │
│ ☐ Solo instituciones                                   │
│ ☐ Usuarios activos (últimos 7 días)                   │
│ ☐ Filtro personalizado                                 │
│                                                         │
│ Tipo de notificación:                                  │
│ ● Anuncio general                                      │
│ ○ Mantenimiento programado                             │
│ ○ Nueva funcionalidad                                  │
│ ○ Emergencia/Crítico                                   │
│                                                         │
│ Título: [Nueva funcionalidad: Video entrevistas]       │
│                                                         │
│ Mensaje:                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ¡Ya puedes realizar entrevistas por video           │ │
│ │ directamente desde ProTalent! Ahorra tiempo         │ │
│ │ y mejora la experiencia de reclutamiento...         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ CTA: [Probar ahora]                                    │
│                                                         │
│ Programar envío:                                       │
│ ● Inmediato                                            │
│ ○ Programar: [15/10/2024] [09:00]                     │
│                                                         │
│ [Vista Previa] [Programar] [Enviar Ahora]             │
└─────────────────────────────────────────────────────────┘
```

---

## 8. ANALYTICS DE NOTIFICACIONES

### 8.1 Métricas por Usuario
```
📊 Tu Actividad de Notificaciones:
┌─────────────────────────────────────────────────────────┐
│ Estadísticas (Últimos 30 días):                       │
│                                                         │
│ ┌─────────────┬─────────────┬─────────────┬───────────┐ │
│ │ Recibidas   │ Leídas      │ Accionadas  │ Tiempo    │ │
│ │             │             │             │ Respuesta │ │
│ │    234      │    198      │     89      │   2.3h    │ │
│ │   📈 +45    │   📈 +35    │   📈 +12    │  📉 -0.5h │ │
│ └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│ Tipos más frecuentes:                                  │
│ 🎯 Postulaciones: 45% (105 notificaciones)            │
│ 💬 Mensajes: 25% (58 notificaciones)                  │
│ 🎊 Ofertas: 20% (47 notificaciones)                   │
│ 👥 Social: 10% (24 notificaciones)                    │
│                                                         │
│ Mejor horario de respuesta: 9:00 AM - 11:00 AM        │
│ Día más activo: Martes                                 │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Métricas de Sistema (Admin)
```
📈 Performance de Notificaciones (Global):
┌─────────────────────────────────────────────────────────┐
│ KPIs Principales (Últimos 7 días):                    │
│                                                         │
│ ┌─────────────┬─────────────┬─────────────┬───────────┐ │
│ │ Enviadas    │ Entregadas  │ Abiertas    │ CTR       │ │
│ │             │             │             │           │ │
│ │   318.5K    │    315.2K   │   198.4K    │   12.8%   │ │
│ │   99.2%     │    98.9%    │    62.3%    │   📈+1.2% │ │
│ └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│ Por Canal:                                             │
│ 📱 In-App: 95.2% delivery, 78% open rate              │
│ 📧 Email: 94.8% delivery, 45% open rate               │
│ 🔔 Push: 92.1% delivery, 23% open rate                │
│                                                         │
│ Por Tipo de Usuario:                                   │
│ 🎓 Estudiantes: 68% engagement                        │
│ 🏢 Empresas: 73% engagement                           │
│ 🎓 Instituciones: 81% engagement                       │
│                                                         │
│ Problemas detectados:                                  │
│ ⚠️ Push notifications bajo en iOS (88%)               │
│ ⚠️ Email bounces aumentaron 0.3%                      │
└─────────────────────────────────────────────────────────┘
```

---

## 9. INTEGRACIÓN CON OTROS MÓDULOS

### 9.1 Notificaciones desde Postulaciones
```
Trigger: Estado de postulación cambia
↓
Sistema genera notificación automática
↓
Aplicar configuración usuario (canales, horarios)
↓
Enviar por canales habilitados
↓
Trackear delivery y engagement
```

### 9.2 Notificaciones desde Chat
```
Nuevo mensaje recibido
↓
Verificar si usuario está online
↓
Si offline: Generar notificación
↓
Aplicar configuración "Mensajes"
↓
Enviar push + email (si configurado)
```

### 9.3 Notificaciones desde Ofertas
```
Nueva oferta publicada
↓
Calcular match con estudiantes (>70%)
↓
Verificar preferencias notificaciones "Ofertas"
↓
Enviar notificación personalizada
↓
Incluir % match y CTAs relevantes
```

---

Este sistema de notificaciones asegura que todos los usuarios se mantengan informados y comprometidos con la plataforma, mientras respeta sus preferencias y evita el spam de notificaciones.