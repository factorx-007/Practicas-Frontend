# Flujos de Usuario - Sistema de Chat y Comunicación

## Visión General
Sistema de comunicación en tiempo real que facilita la interacción entre estudiantes, empresas e instituciones durante todo el proceso de reclutamiento y networking.

---

## 1. ARQUITECTURA DEL CHAT

### Tipos de Conversaciones
1. **Estudiante ↔ Empresa**: Comunicación durante procesos de postulación
2. **Empresa ↔ Institución**: Coordinación de convenios y programas
3. **Estudiante ↔ Estudiante**: Networking y mentoría
4. **Soporte**: Comunicación con administradores
5. **Grupal**: Eventos, webinars y discusiones temáticas

### Estados de Chat
- **ACTIVO**: Conversación en curso
- **ARCHIVADO**: Conversación archivada por usuario
- **BLOQUEADO**: Usuario bloqueado
- **FINALIZADO**: Proceso completado (ej: contratación finalizada)

---

## 2. VISTA PRINCIPAL DE CHAT (`/chat`)

### Layout Principal
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Mensajes" + [Nuevo Chat] + [Configuración]   │
├──────────────────┬──────────────────────────────────────┤
│ Sidebar (320px)  │ Área de Conversación (flex)          │
│                  │                                      │
│ ┌──────────────┐ │ ┌──────────────────────────────────┐ │
│ │ Búsqueda     │ │ │ Header Conversación              │ │
│ │ [🔍 Buscar]  │ │ │ • Avatar + Nombre                │ │
│ └──────────────┘ │ │ • Estado (online/offline)        │ │
│                  │ │ • Tipo conversación              │ │
│ Filtros:         │ │ • [📞] [🎥] [ℹ️] [⚙️]            │ │
│ [Todos] [No      │ └──────────────────────────────────┘ │
│  leídos] [Activos│                                      │
│  ] [Archivados]  │ ┌──────────────────────────────────┐ │
│                  │ │ Área de Mensajes                 │ │
│ Lista Chats:     │ │ (scroll infinito)                │ │
│ ┌──────────────┐ │ │                                  │ │
│ │ Chat Item    │ │ │ ┌──────────────────────────────┐ │ │
│ │ • Avatar     │ │ │ │ Mensaje Enviado              │ │ │
│ │ • Nombre     │ │ │ │ "Hola, me interesa la        │ │ │
│ │ • Último msg │ │ │ │ posición..."          [14:30] │ │ │
│ │ • Timestamp  │ │ │ └──────────────────────────────┘ │ │
│ │ • Badge (3)  │ │ │                                  │ │ │
│ └──────────────┘ │ │ ┌──────────────────────────────┐ │ │
│                  │ │ │ Mensaje Recibido             │ │ │
│ [+ Nuevo Chat]   │ │ │ ┌────────┐ "¡Hola! Revisé   │ │ │
│                  │ │ │ │ Avatar │ tu perfil..."     │ │ │
│                  │ │ │ └────────┘           [14:32] │ │ │
│                  │ │ └──────────────────────────────┘ │ │
│                  │ └──────────────────────────────────┘ │
│                  │                                      │
│                  │ ┌──────────────────────────────────┐ │
│                  │ │ Input de Mensaje                 │ │
│                  │ │ [📎][💭][😊] [Escribe...] [➤]   │ │
│                  │ └──────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────┘
```

### Lista de Conversaciones (Sidebar)

#### Item de Chat
```
┌──────────────────────────────────────┐
│ ┌────┐ TechCorp Recruiter      [2m] │
│ │ 🏢 │ "¿Cuándo puedes empezar?"     │
│ └────┘ 💬 3                         │
└──────────────────────────────────────┘
```

**Información mostrada:**
- Avatar personalizado por tipo (empresa/estudiante/institución)
- Nombre de contacto + rol
- Último mensaje (truncado)
- Timestamp relativo
- Badge de mensajes no leídos
- Indicador de estado (online/offline)
- Iconos especiales (importante, archivado, etc.)

---

## 3. FLUJO DE INICIO DE CONVERSACIÓN

### 3.1 Desde Postulación (Automático)
```
Estudiante postula → Sistema crea chat → Notifica empresa →
Empresa responde → Chat activado para ambos
```

### 3.2 Networking (Manual)
```
Perfil usuario → [Enviar mensaje] → Modal nuevo chat →
Seleccionar motivo → Escribir mensaje → Enviar →
Notificación destinatario → Aceptar/Rechazar
```

### 3.3 Nuevo Chat Modal
```
┌─────────────────────────────────────────────────────────┐
│ Nuevo Mensaje                                      [✕] │
├─────────────────────────────────────────────────────────┤
│ Para: [🔍 Buscar usuario o empresa...]                 │
│                                                         │
│ Motivo: [Dropdown]                                     │
│ • Consulta sobre oferta                                │
│ • Networking profesional                               │
│ • Colaboración en proyecto                             │
│ • Mentoría                                            │
│ • Otro                                                │
│                                                         │
│ Mensaje:                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Hola, me interesa conectar contigo...]             │ │
│ │                                                     │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Cancelar] [Enviar Mensaje]                            │
└─────────────────────────────────────────────────────────┘
```

---

## 4. TIPOS DE MENSAJES Y CONTENIDO

### 4.1 Mensajes de Texto
- Mensajes estándar con markdown support
- Menciones @usuario
- Enlaces automáticos
- Emojis y reacciones

### 4.2 Mensajes del Sistema
```
🤖 Sistema: "Tu postulación para 'Desarrollador Junior' ha sido vista"
🤖 Sistema: "Entrevista programada para el 15/10/2024 a las 15:00"
🤖 Sistema: "Documento subido: CV_actualizado.pdf"
```

### 4.3 Archivos Adjuntos
- **Documentos**: CV, certificados, portafolios
- **Imágenes**: Screenshots de proyectos, diseños
- **Enlaces**: GitHub, LinkedIn, portfolios online
- **Calendarios**: Invitaciones a entrevistas

### 4.4 Templates de Mensajes
```
Para Empresas:
• "Gracias por tu postulación. Hemos revisado tu perfil..."
• "Nos gustaría programar una entrevista. ¿Qué disponibilidad tienes?"
• "Hemos decidido continuar con otros candidatos..."

Para Estudiantes:
• "Muchas gracias por considerar mi perfil..."
• "Me interesa mucho la posición, ¿podrían contarme más sobre...?"
• "Confirmo mi disponibilidad para la entrevista del..."
```

---

## 5. FUNCIONALIDADES AVANZADAS DE CHAT

### 5.1 Estados de Lectura
- **Enviado**: ✓ (gris)
- **Entregado**: ✓✓ (gris)
- **Leído**: ✓✓ (azul)
- **Typing**: "Usuario está escribiendo..."

### 5.2 Programación de Entrevistas
```
┌─────────────────────────────────────────────────────────┐
│ 📅 Programar Entrevista                                │
├─────────────────────────────────────────────────────────┤
│ Fecha: [📅 Seleccionar fecha]                          │
│ Hora: [🕐 Seleccionar hora]                            │
│ Duración: [⏱️ 30min ▼]                                │
│ Modalidad: [💻 Virtual ▼] [🏢 Presencial]              │
│                                                         │
│ Enlace/Dirección:                                      │
│ [Zoom link se generará automáticamente]               │
│                                                         │
│ Notas adicionales:                                     │
│ [Preparar demo de tu proyecto en React...]             │
│                                                         │
│ [Cancelar] [Programar Entrevista]                     │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Compartir Documentos
```
┌─────────────────────────────────────────────────────────┐
│ 📎 Compartir Archivo                                   │
├─────────────────────────────────────────────────────────┤
│ Arrastra archivos aquí o [Seleccionar archivo]        │
│                                                         │
│ Tipos permitidos:                                      │
│ • PDF (CV, certificados) - max 5MB                    │
│ • DOC/DOCX (documentos) - max 5MB                     │
│ • JPG/PNG (imágenes) - max 2MB                        │
│ • ZIP (portfolios) - max 10MB                         │
│                                                         │
│ [Agregar descripción del archivo...]                   │
│                                                         │
│ [Cancelar] [Subir y Compartir]                        │
└─────────────────────────────────────────────────────────┘
```

---

## 6. CHAT GRUPAL Y EVENTOS

### 6.1 Chats de Eventos
```
Estructura:
📅 "Webinar: Tendencias Tech 2024"
👥 45 participantes
📝 Descripción del evento
🎤 Moderadores destacados
💬 Chat general + Chat de Q&A
```

### 6.2 Moderación de Chats Grupales
- **Moderadores**: Pueden silenciar usuarios
- **Filtros automáticos**: Spam y contenido inapropiado
- **Reportes**: Sistema de reportes por usuarios
- **Q&A separado**: Para eventos formales

---

## 7. NOTIFICACIONES DE CHAT

### 7.1 Notificaciones Push
- **Nuevo mensaje**: "Tienes un nuevo mensaje de TechCorp"
- **Mention**: "@JuanPerez ¿puedes revisar este documento?"
- **Entrevista programada**: "Nueva entrevista programada para mañana"
- **Documento compartido**: "Ana compartió CV_actualizado.pdf"

### 7.2 Configuración de Notificaciones
```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Configuración de Notificaciones                     │
├─────────────────────────────────────────────────────────┤
│ Mensajes directos:                                     │
│ ☑️ Push notifications                                  │
│ ☑️ Email notifications                                 │
│ ☑️ Sound alerts                                        │
│                                                         │
│ Chats grupales:                                        │
│ ☐ Todos los mensajes                                  │
│ ☑️ Solo menciones                                      │
│ ☐ Solo moderadores                                    │
│                                                         │
│ Horarios:                                              │
│ No molestar: [22:00] - [08:00]                        │
│ Fines de semana: [☐ Activar]                          │
│                                                         │
│ [Guardar Configuración]                               │
└─────────────────────────────────────────────────────────┘
```

---

## 8. CHAT MÓVIL (RESPONSIVE)

### 8.1 Adaptación Mobile
```
Mobile Layout:
┌─────────────────────┐
│ [←] Chat TechCorp   │ ← Header simplificado
├─────────────────────┤
│                     │
│ Mensajes            │ ← Full screen
│ (área principal)    │
│                     │
│                     │
├─────────────────────┤
│ [📎][😊] Input [>] │ ← Input compacto
└─────────────────────┘

Lista de chats:
┌─────────────────────┐
│ 🔍 Buscar chats     │
├─────────────────────┤
│ TechCorp      [3] 2m│
│ StartupXYZ    [1] 5m│
│ Ana García      45m │
│ MentorJoe       2h  │
└─────────────────────┘
```

### 8.2 Gestos Mobile
- **Swipe right**: Respuesta rápida
- **Swipe left**: Archivar chat
- **Long press**: Opciones del mensaje
- **Pull to refresh**: Actualizar chats

---

## 9. INTEGRACIÓN CON OTRAS FUNCIONALIDADES

### 9.1 Desde Perfil de Usuario
```
Perfil Empresa → [Contactar] → Modal chat →
Motivo + mensaje → Envío automático
```

### 9.2 Desde Postulaciones
```
Mi Postulación → Tab "Comunicación" →
Chat específico para esa postulación
```

### 9.3 Desde Eventos
```
Detalle Evento → [Chat del evento] →
Unirse a conversación grupal
```

---

## 10. ADMINISTRACIÓN Y MODERACIÓN

### 10.1 Panel de Moderación (Admin)
```
┌─────────────────────────────────────────────────────────┐
│ 🛡️ Moderación de Chats                                │
├─────────────────────────────────────────────────────────┤
│ Reportes pendientes: [⚠️ 5]                           │
│ Usuarios bloqueados: [🚫 12]                          │
│ Chats monitoreados: [👁️ 23]                          │
│                                                         │
│ Filtros automáticos:                                   │
│ • Spam detectado: 45 mensajes bloqueados              │
│ • Contenido inapropiado: 12 mensajes flagged          │
│ • Enlaces sospechosos: 8 mensajes revisados           │
│                                                         │
│ Acciones recientes:                                    │
│ • Usuario @spammer123 bloqueado temporalmente         │
│ • Mensaje reportado por contenido ofensivo revisado   │
│ • Chat grupal "Evento Tech" moderado                  │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Sistema de Reportes
```
Reportar mensaje/usuario:
• Spam o contenido comercial no deseado
• Lenguaje ofensivo o acoso
• Contenido inapropiado
• Suplantación de identidad
• Phishing o enlaces maliciosos
```

---

## 11. FUNCIONALIDADES FUTURAS

### 11.1 IA Assistant
- **Sugerencias de respuesta**: Respuestas inteligentes contextuales
- **Traducción automática**: Para comunicación internacional
- **Resúmenes**: Resumen de conversaciones largas
- **Scheduling assistant**: Ayuda para programar entrevistas

### 11.2 Video Llamadas Integradas
- **WebRTC**: Llamadas directas desde el chat
- **Screen sharing**: Para demos técnicas
- **Recording**: Grabación de entrevistas (con consentimiento)
- **Virtual backgrounds**: Para entrevistas profesionales

### 11.3 Integraciones
- **Calendar apps**: Sincronización con Google Calendar, Outlook
- **GitHub**: Compartir repositorios directamente
- **LinkedIn**: Import de conexiones profesionales
- **Zoom/Teams**: Integración con plataformas de video

---

## 12. MÉTRICAS Y ANALYTICS

### 12.1 Métricas para Usuarios
```
Estadísticas de Chat (Estudiante):
• Mensajes enviados: 156
• Respuesta promedio: 2.3 horas
• Chats activos: 8
• Entrevistas programadas via chat: 5
```

### 12.2 Métricas para Empresas
```
Estadísticas de Chat (Empresa):
• Candidatos contactados: 89
• Tasa de respuesta: 78%
• Tiempo promedio primera respuesta: 4.2 horas
• Entrevistas programadas: 23
```

### 12.3 Métricas Administrativas
```
Salud del Sistema:
• Mensajes por día: 12,450
• Usuarios activos en chat: 2,340
• Tiempo promedio de respuesta: 1.8 horas
• Reportes resueltos: 98.5%
```

---

Este sistema de chat proporciona una comunicación fluida y profesional entre todos los actores de la plataforma, optimizando el proceso de reclutamiento y facilitando el networking efectivo.