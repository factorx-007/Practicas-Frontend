# Prompts de Diseño - Sistema de Chat y Comunicación

## Contexto del Proyecto
Sistema de comunicación en tiempo real para ProTalent que facilita la interacción profesional entre estudiantes, empresas e instituciones durante procesos de reclutamiento y networking.

---

## 1. VISTA PRINCIPAL DE CHAT (`/chat`)

### Prompt de Diseño Principal:
```
Diseña una interfaz de chat moderna estilo Discord/Slack pero optimizada para comunicación profesional:

**Layout Principal:**
- Diseño de 3 columnas adaptativo
- Sidebar izquierdo (320px): Lista de conversaciones
- Área central (flex): Conversación activa
- Opcional sidebar derecho (280px): Info contextual

**Sidebar de Conversaciones (Izquierdo):**
```
┌─────────────────────────────────────┐
│ 💬 Mensajes                    [+] │
├─────────────────────────────────────┤
│ [🔍 Buscar conversaciones...]      │
├─────────────────────────────────────┤
│ Filtros: [Todas] [No leídas] [★]  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏢 TechCorp Recruiting    [3] 2m│ │
│ │ "¿Cuándo puedes empezar?"       │ │
│ │ ● Online                        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Ana García Mentor        1h │ │
│ │ "Excelente presentación!"       │ │
│ │ ○ Offline                       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📁 React Developers MX      2d │ │
│ │ 👥 15 mensajes nuevos           │ │
│ │ ○ Grupo                         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Crear nuevo chat]                  │
└─────────────────────────────────────┘
```

**Elementos de Chat Item:**
- Avatar con indicador de estado (online/offline/grupo)
- Nombre + rol/empresa
- Último mensaje preview (1 línea, truncado)
- Timestamp relativo (2m, 1h, 2d)
- Badge de mensajes no leídos
- Tipo de chat: 🏢 Empresa, 👤 Persona, 📁 Grupo, 🛡️ Soporte

**Área de Conversación Central:**
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] TechCorp Recruiting              [📞] [🎥] [ℹ]│
│ ● En línea • Último visto hace 5 min                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Área de mensajes con scroll infinito]                 │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Sistema • Hoy 2:30 PM                               │ │
│ │ 🤖 Tu postulación para "Frontend Dev" ha sido vista │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│      Hola Juan, hemos revisado tu perfil y nos         │
│      parece muy interesante para la posición. 👋       │
│ TechCorp • 2:35 PM                                [✓✓] │
│                                                         │
│ ¡Muchas gracias por considerar mi perfil!              │
│ Me emociona mucho la oportunidad... 🚀                 │
│                                           Tú • 2:37 PM │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📅 Entrevista programada                            │ │
│ │ 15 de Octubre, 2024 • 3:00 PM                      │ │
│ │ Video llamada en Zoom                               │ │
│ │ [Ver detalles] [Confirmar] [Reagendar]             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Ana está escribiendo... 💭                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [📎] [😊] [Escribe tu mensaje...] [🎤] [➤]             │
└─────────────────────────────────────────────────────────┘
```

**Header de Conversación:**
- Avatar + nombre del contacto/grupo
- Estado online/offline con timestamp
- Acciones rápidas: Llamada, video, información
- Breadcrumb si es conversación de proceso específico

**Tipos de Mensajes:**
1. **Texto normal**: Bubbles diferenciados enviado/recibido
2. **Sistema**: Notificaciones automáticas de plataforma
3. **Rich cards**: Entrevistas, documentos, ofertas
4. **Archivos**: Preview para imágenes, descarga para documentos
5. **Enlaces**: Preview automático con metadata

**Input de Mensaje:**
- Textarea expandible automáticamente
- Botones de acción: Adjuntar, emojis, voz, enviar
- Shortcuts de teclado visibles
- Typing indicators
- Draft saving automático

**Estados de Mensaje:**
- Enviando: Spinner sutil
- Enviado: ✓ gris
- Entregado: ✓✓ gris
- Leído: ✓✓ azul
- Error: ⚠️ rojo con retry

**Colores y Estilo:**
- Fondo principal: Gris muy claro (#F8FAFC)
- Bubbles enviados: Azul ProTalent (#3B82F6)
- Bubbles recibidos: Blanco con border sutil
- Sistema: Fondo amarillo claro para destacar
- Typography: Sans-serif legible, 14px base
```

### Funcionalidades Avanzadas:

#### Rich Message Types:
```
Diseña mensajes enriquecidos para contextos profesionales:

**Mensaje de Entrevista:**
┌─────────────────────────────────────────────────────────┐
│ 📅 Entrevista Programada                                │
├─────────────────────────────────────────────────────────┤
│ Posición: Frontend Developer                            │
│ Fecha: 15 Oct 2024, 3:00 PM - 4:00 PM                 │
│ Modalidad: 🎥 Video llamada (Zoom)                     │
│ Preparación: Tener proyecto React listo para demo      │
│                                                         │
│ [Ver detalles] [Confirmar] [Reagendar] [Agregar a 📅] │
└─────────────────────────────────────────────────────────┘

**Mensaje de Documento:**
┌─────────────────────────────────────────────────────────┐
│ 📄 CV_JuanPerez_2024.pdf                               │
├─────────────────────────────────────────────────────────┤
│ 📊 2.3 MB • Subido hace 5 min                          │
│ Vista previa disponible                                │
│                                                         │
│ [📖 Ver] [⬇️ Descargar] [📤 Compartir]                 │
└─────────────────────────────────────────────────────────┘

**Mensaje de Oferta:**
┌─────────────────────────────────────────────────────────┐
│ 💼 Nueva Oferta Compartida                              │
├─────────────────────────────────────────────────────────┤
│ TechCorp • Senior Frontend Developer                   │
│ 💰 $80k-$100k • 📍 CDMX, Híbrido                      │
│ 🎯 Match: 92% con tu perfil                            │
│                                                         │
│ [Ver oferta] [Postular] [Guardar]                     │
└─────────────────────────────────────────────────────────┘
```

#### Templates de Respuesta:
```
Diseña un sistema de respuestas rápidas profesionales:

**Para Estudiantes:**
- "Muchas gracias por considerar mi perfil"
- "¿Podrían contarme más sobre el proceso?"
- "Confirmo mi disponibilidad para la entrevista"
- "¿Cuáles son los siguientes pasos?"

**Para Empresas:**
- "Hemos revisado tu perfil y nos interesa"
- "¿Podrías programar una entrevista para X fecha?"
- "Necesitamos documentación adicional"
- "Hemos decidido continuar con otros candidatos"

**Customizable:**
- Templates personalizados por empresa
- Variables dinámicas: {nombre}, {posicion}, {fecha}
- Shortcuts de teclado para acceso rápido
```

---

## 2. CHAT MÓVIL (RESPONSIVE)

### Prompt de Diseño Mobile:
```
Adapta la experiencia de chat para móviles con navegación intuitiva:

**Layout Mobile:**
- Full-screen por vista (lista o conversación)
- Header compacto con navegación clara
- Bottom input sticky para fácil acceso
- Gestos naturales para navegación

**Lista de Chats (Mobile):**
```
┌─────────────────────────┐
│ ← Mensajes         [+] │
├─────────────────────────┤
│ [🔍 Buscar...]         │
├─────────────────────────┤
│ ● TechCorp         [2] │
│ "¿Cuándo puedes...  5m │
├─────────────────────────┤
│ ○ Ana García           │
│ "Excelente pres... 1h │
├─────────────────────────┤
│ 📁 React Devs      [15]│
│ "👥 Nueva discusión 2d │
└─────────────────────────┘
```

**Conversación (Mobile):**
```
┌─────────────────────────┐
│ ← TechCorp     [📞] [⋯]│
│ ● En línea              │
├─────────────────────────┤
│                         │
│ Mensaje del sistema  🤖 │
│                         │
│     Hola Juan! 👋       │
│ Hemos revisado tu...    │
│                   14:30 │
│                         │
│ ¡Muchas gracias!        │
│ Me emociona mucho... 🚀 │
│ 14:32                   │
│                         │
│ [Ana está escribiendo...│
│                         │
├─────────────────────────┤
│[📎][😊] Mensaje... [→] │
└─────────────────────────┘
```

**Gestos Mobile:**
- Swipe right: Volver a lista de chats
- Swipe left: Archivar conversación
- Long press mensaje: Opciones (copiar, reaccionar, eliminar)
- Pull down: Cargar mensajes anteriores
- Double tap: Reaccionar rápido con ❤️

**Optimizaciones Mobile:**
- Input que empuja contenido hacia arriba
- Auto-resize de textarea
- Teclado optimizado según contexto
- Vibration feedback para notificaciones
- Picture-in-picture para video calls
```

---

## 3. NUEVO CHAT MODAL

### Prompt de Diseño:
```
Diseña un modal para iniciar nuevas conversaciones profesionales:

**Modal Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Nuevo Mensaje                                      [✕] │
├─────────────────────────────────────────────────────────┤
│ Para: [🔍 Buscar usuarios, empresas o grupos...]       │
│                                                         │
│ Sugerencias:                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏢 TechCorp (Empresa)                    [Mensaje] │ │
│ │ 👤 Ana García (UX Designer)              [Mensaje] │ │
│ │ 📁 Frontend Developers CDMX (Grupo)      [Unirse] │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Motivo del contacto:                                   │
│ ○ Consulta sobre oferta laboral                        │
│ ○ Networking profesional                               │
│ ○ Colaboración en proyecto                             │
│ ○ Mentoría                                            │
│ ○ Otro                                                │
│                                                         │
│ Mensaje inicial:                                       │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Hola, me interesa conectar contigo porque...        │ │
│ │                                                     │ │
│ │ [Template suggestions aparecen aquí]                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [Cancelar] [Enviar Mensaje]                           │
└─────────────────────────────────────────────────────────┘
```

**Búsqueda Inteligente:**
- Autocomplete con personas, empresas, grupos
- Filtros por rol, ubicación, industria
- Resultados categorizados
- Preview de perfil en hover

**Templates Contextuales:**
- Mensajes pre-escritos según motivo seleccionado
- Personalización con variables del perfil
- Sugerencias basadas en interacciones exitosas
- One-click templates para solicitudes comunes

**Validaciones:**
- Verificar que el usuario permite mensajes
- Warning si ya existe conversación
- Límites de mensajes por día (anti-spam)
- Sugerencias de conexión si no hay conexión directa
```

---

## 4. CHAT GRUPAL Y EVENTOS

### Prompt de Diseño:
```
Diseña interfaces para chats grupales y comunicación en eventos:

**Chat de Grupo:**
```
┌─────────────────────────────────────────────────────────┐
│ [Avatar] React Developers México               [👥] [⚙] │
│ 247 miembros • 15 en línea                             │
├─────────────────────────────────────────────────────────┤
│ Canales:                                               │
│ # general • # empleos • # eventos • # ayuda           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📌 Mensaje fijado por @Moderador                       │
│ Reglas del grupo y bienvenida a nuevos miembros        │
│                                                         │
│ @CarlosDev • Hoy 2:30 PM                              │
│ ¿Alguien ha trabajado con Next.js 13? Tengo dudas     │
│ sobre Server Components...                             │
│ 👍 5  💬 3  📎 React.js                                │
│                                                         │
│ @AnaSenior • Hoy 2:45 PM                              │
│ @CarlosDev sí, en mi último proyecto. Te comparto      │
│ algunos recursos útiles...                             │
│                                                         │
│ [😊] [@] [#] [Escribe en #general...] [➤]             │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades Grupales:**
- Mentions con @usuario
- Hashtags para organizar temas
- Reacciones a mensajes
- Threads/hilos para conversaciones largas
- Moderación: Silenciar, eliminar mensajes, banear

**Chat de Evento:**
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 Tech Talk: "Futuro del Frontend" • EN VIVO          │
│ 👥 1,247 asistentes • Chat moderado                    │
├─────────────────────────────────────────────────────────┤
│ [General] [Q&A] [Networking]                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎤 Moderador • Ahora                                   │
│ ¡Bienvenidos al evento! Usen #pregunta para Q&A        │
│                                                         │
│ @EstudianteTech • Ahora                                │
│ #pregunta ¿React Server Components reemplazarán SPA?   │
│ 👍 23  ❤️ 12                                           │
│                                                         │
│ @DevSenior • Ahora                                     │
│ Excelente pregunta! En mi experiencia...               │
│                                                         │
│ Solo moderadores y speakers pueden escribir            │
│ [👍] [❤️] [👏] [🔥] - Reacciones rápidas              │
└─────────────────────────────────────────────────────────┘
```

**Características de Eventos:**
- Chat moderado (solo lectura para asistentes)
- Reacciones rápidas para engagement
- Q&A separado del chat general
- Networking room para conexiones
- Polls en tiempo real
```

---

## 5. CONFIGURACIÓN Y PREFERENCIAS

### Prompt de Diseño:
```
Diseña un panel de configuración completo para el sistema de chat:

**Configuración de Chat:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Configuración de Mensajes                           │
├─────────────────────────────────────────────────────────┤
│ Privacidad:                                            │
│ ¿Quién puede enviarte mensajes?                        │
│ ● Cualquier usuario verificado                         │
│ ○ Solo mis conexiones                                  │
│ ○ Solo conexiones de segundo grado                     │
│ ○ Nadie (solo grupos)                                  │
│                                                         │
│ ☑️ Permitir mensajes de empresas verificadas           │
│ ☑️ Permitir invitaciones a grupos                      │
│ ☐ Mostrar cuando estoy escribiendo                     │
│ ☐ Mostrar cuando estoy en línea                        │
│                                                         │
│ Notificaciones:                                        │
│ ☑️ Sonido para nuevos mensajes                         │
│ ☑️ Notificaciones push                                 │
│ ☑️ Emails para mensajes perdidos                       │
│ ☐ Vibración (móvil)                                   │
│                                                         │
│ Horarios No Molestar:                                  │
│ Desde: [22:00] Hasta: [08:00]                         │
│ Fines de semana: ☑️ Aplicar                           │
│                                                         │
│ Auto-respuestas:                                       │
│ ☑️ Activar respuesta automática cuando no disponible   │
│ Mensaje: [Gracias por tu mensaje. Te responderé...]   │
│                                                         │
│ [Guardar Configuración]                               │
└─────────────────────────────────────────────────────────┘
```

**Gestión de Conversaciones:**
- Archivar conversaciones automáticamente
- Eliminar conversaciones después de X tiempo
- Backup de conversaciones importantes
- Exportar historial de chat
- Bloquear usuarios específicos

**Shortcuts y Productividad:**
- Atajos de teclado personalizables
- Templates de respuesta personalizados
- Quick actions configurables
- Integración con calendario para disponibilidad
```

---

## 6. MODERACIÓN Y SEGURIDAD

### Prompt de Diseño:
```
Diseña herramientas de moderación y seguridad para el chat:

**Panel de Moderación (Admin):**
```
┌─────────────────────────────────────────────────────────┐
│ 🛡️ Moderación de Chat                                  │
├─────────────────────────────────────────────────────────┤
│ Reportes Pendientes: [⚠️ 5]                           │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Reporte #1247 • Hace 2h                            │ │
│ │ Usuario: @spammer123                               │ │
│ │ Tipo: Spam comercial                               │ │
│ │ Reportado por: @usuarioLegitimo                    │ │
│ │                                                     │ │
│ │ Mensaje reportado:                                  │ │
│ │ "¡Gana dinero rápido! Haz click aquí..."          │ │
│ │                                                     │ │
│ │ [Ver historial] [Bloquear] [Advertir] [Ignorar]   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Filtros Automáticos Activos:                          │
│ ✅ Detección de spam                                   │
│ ✅ Enlaces sospechosos                                 │
│ ✅ Lenguaje ofensivo                                   │
│ ✅ Phishing attempts                                   │
│                                                         │
│ Estadísticas (24h):                                   │
│ • 45 mensajes bloqueados automáticamente              │
│ • 12 usuarios alertados                               │
│ • 3 usuarios bloqueados temporalmente                 │
└─────────────────────────────────────────────────────────┘
```

**Herramientas de Usuario:**
- Reportar mensaje/usuario fácilmente
- Bloquear usuario (con unblock option)
- Silenciar conversación
- Solicitar verificación de empresa sospechosa

**Protecciones Automáticas:**
- Detección de patrones de spam
- Validación de enlaces externos
- Rate limiting de mensajes
- Verificación de empresas nuevas
- Encriptación end-to-end para mensajes sensibles
```

---

## 7. COMPONENTES REUTILIZABLES

### 7.1 Message Bubble Component:
```
Diseña bubbles de mensaje flexibles y reutilizables:

**Variantes:**
- Sent: Alineado derecha, fondo azul, texto blanco
- Received: Alineado izquierda, fondo blanco, texto negro
- System: Centrado, fondo amarillo claro, bordrs redondeados
- Rich: Contenedor para cards de entrevistas/documentos

**Estados:**
- Sending: Opacity reducida + spinner
- Failed: Border rojo + retry button
- Edited: Indicador "editado" sutil
- Deleted: "Mensaje eliminado" placeholder

**Responsive:**
- Max-width adaptativo según viewport
- Text wrapping inteligente
- Link preview responsive
- Image/video responsive embeds
```

### 7.2 Chat Input Component:
```
Diseña un input de chat avanzado y profesional:

**Características:**
- Auto-resize vertical hasta max-height
- Rich text básico (bold, italic, links)
- Mention autocomplete con @
- Emoji picker integrado
- File upload con drag & drop
- Voice message recording

**Professional Features:**
- Spell check automático
- Professional tone suggestions
- Template insertion
- Scheduled sending
- Draft auto-save
- Character counter para mensajes largos

**Mobile Optimizations:**
- Touch-friendly controls
- Native file picker integration
- Voice recording con gesture
- Keyboard shortcuts accessibility
```

---

## 8. INTEGRACIONES Y FUTURAS FUNCIONALIDADES

### Video Llamadas Integradas:
```
Diseña UI para video llamadas directas desde chat:

**In-chat Video Call:**
- Picture-in-picture window
- Controles overlay: mute, camera, hang up
- Screen sharing para demos técnicas
- Recording option (con consentimiento)
- Background blur/virtual backgrounds

**Call Scheduling:**
- Calendar integration
- Time zone handling
- Reminder notifications
- Reschedule options
- Meeting notes integration
```

### AI Assistant Integration:
```
Integra asistencia AI para mejorar comunicación:

**Smart Suggestions:**
- Respuesta rápida suggestions
- Tone adjustment (más formal/casual)
- Grammar correction
- Translation en tiempo real
- Scheduling assistance

**Professional Coaching:**
- Tips para mejores respuestas en entrevistas
- Networking conversation starters
- Follow-up reminders
- Professional etiquette suggestions
```

Estos prompts proporcionan una base completa para crear un sistema de chat profesional, moderno y optimizado para el contexto de reclutamiento y networking de ProTalent.