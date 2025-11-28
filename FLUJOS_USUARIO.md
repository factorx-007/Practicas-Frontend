# Flujos de Usuario - ProTalent

## Introducción

Este documento mapea los flujos de procesos completos que cada tipo de usuario debe seguir para utilizar eficazmente la plataforma ProTalent. La plataforma maneja cuatro tipos de usuarios principales: **Estudiantes**, **Empresas**, **Instituciones** y **Administradores**.

## Estados del Usuario

### Estados Globales
1. **No Registrado** - Usuario visitante sin cuenta
2. **Registrado No Verificado** - Cuenta creada pero email sin verificar
3. **Verificado Perfil Incompleto** - Email verificado pero perfil sin completar
4. **Usuario Activo** - Perfil completo y cuenta activa
5. **Usuario Suspendido** - Cuenta temporalmente deshabilitada
6. **Usuario Inactivo** - Cuenta sin uso prolongado

---

## 1. FLUJO DE ESTUDIANTES

### 1.1 Proceso de Registro e Ingreso

#### **Paso 1: Registro Inicial**
```
[Landing Page] → [Registro] → [Formulario Estudiante]
```

**Datos Requeridos:**
- Email (único)
- Contraseña (segura)
- Nombre y Apellido
- Rol: ESTUDIANTE
- Universidad (opcional)
- Carrera (opcional)

**Validaciones:**
- Email único en sistema
- Contraseña con criterios de seguridad
- Nombres con mínimo 2 caracteres

#### **Paso 2: Verificación de Email**
```
[Email Enviado] → [Click en Enlace] → [Email Verificado] → [Redirección a Completar Perfil]
```

**Estados:**
- Email pendiente de verificación
- Reenvío de email disponible
- Enlace con expiración (24 horas)

#### **Paso 3: Completar Perfil Académico**
```
[Perfil Básico] → [Información Académica] → [Habilidades] → [Preferencias Laborales]
```

**Información Académica:**
- Universidad (requerida)
- Carrera (requerida)
- Semestre actual
- Promedio académico
- Fecha estimada de graduación

**Habilidades y Competencias:**
- Habilidades técnicas
- Idiomas y niveles
- Certificaciones
- Proyectos destacados

**Preferencias Laborales:**
- Tipos de empleo de interés
- Modalidades preferidas (remoto/presencial/híbrido)
- Ubicaciones preferidas
- Rango salarial esperado
- Disponibilidad de inicio

#### **Paso 4: Perfil Activo**
```
[Dashboard Estudiante] - Funcionalidades disponibles
```

### 1.2 Flujos de Uso Principal

#### **A. Búsqueda y Postulación a Ofertas**
```
[Dashboard] → [Explorar Ofertas] → [Filtros] → [Ver Detalle] → [Postular]
```

**Proceso de Postulación:**
1. Revisar requisitos de la oferta
2. Preparar carta de presentación (si es requerida)
3. Adjuntar CV actualizado
4. Responder preguntas personalizadas (si las hay)
5. Enviar postulación
6. Seguimiento de estado

#### **B. Gestión de Postulaciones**
```
[Mis Postulaciones] → [Ver Estado] → [Mensajes] → [Entrevistas]
```

**Estados de Postulación:**
- PENDIENTE: En revisión
- ACEPTADA: Preseleccionado para entrevista
- RECHAZADA: No seleccionado
- EN_PROCESO: En proceso de entrevista
- CONTRATADO: Oferta aceptada

#### **C. Gestión de Perfil**
```
[Perfil] → [Editar Información] → [Experiencia] → [Proyectos] → [CV]
```

**Secciones del Perfil:**
- Información personal
- Formación académica
- Experiencia laboral
- Proyectos y portafolio
- Habilidades y certificaciones
- Referencias

---

## 2. FLUJO DE EMPRESAS

### 2.1 Proceso de Registro e Ingreso

#### **Paso 1: Registro Inicial**
```
[Landing Page] → [Registro Empresa] → [Formulario Empresa]
```

**Datos Requeridos:**
- Email corporativo
- Contraseña
- Nombre y Apellido del representante
- Rol: EMPRESA
- Nombre de la empresa (requerido)
- Cargo del representante

#### **Paso 2: Verificación Empresarial**
```
[Verificación Email] → [Verificación Empresarial] → [Aprobación Admin]
```

**Proceso de Verificación:**
- Verificación de email corporativo
- Validación de existencia de empresa
- Revisión de documentación (opcional)
- Aprobación manual por administrador

#### **Paso 3: Completar Perfil Empresarial**
```
[Información Básica] → [Detalles Empresa] → [Cultura y Beneficios]
```

**Información Empresarial:**
- Descripción de la empresa
- Industria/sector
- Tamaño de empresa
- Ubicación y oficinas
- Sitio web
- Año de fundación
- Misión, visión y valores
- Beneficios ofrecidos
- Cultura empresarial

#### **Paso 4: Configuración de Reclutamiento**
```
[Preferencias] → [Procesos] → [Integraciones]
```

### 2.2 Flujos de Uso Principal

#### **A. Publicación de Ofertas**
```
[Dashboard] → [Nueva Oferta] → [Formulario Detallado] → [Vista Previa] → [Publicar]
```

**Información de la Oferta:**
- Título y descripción del puesto
- Tipo de empleo y modalidad
- Ubicación y requisitos de presencialidad
- Rango salarial y beneficios
- Requisitos técnicos y experiencia
- Habilidades deseadas
- Nivel educativo requerido
- Fecha límite de postulación
- Preguntas personalizadas para candidatos

#### **B. Gestión de Candidatos**
```
[Mis Ofertas] → [Ver Postulaciones] → [Revisar Candidatos] → [Proceso de Selección]
```

**Proceso de Selección:**
1. Revisar postulaciones recibidas
2. Filtrar candidatos por criterios
3. Revisar perfiles detallados
4. Contactar candidatos preseleccionados
5. Programar entrevistas
6. Tomar decisiones finales
7. Comunicar resultados

#### **C. Comunicación con Candidatos**
```
[Chat Integrado] → [Mensajes] → [Programación Entrevistas] → [Feedback]
```

---

## 3. FLUJO DE INSTITUCIONES EDUCATIVAS

### 3.1 Proceso de Registro e Ingreso

#### **Paso 1: Registro Institucional**
```
[Registro Especial] → [Formulario Institución] → [Verificación Académica]
```

**Datos Requeridos:**
- Email institucional (.edu o similar)
- Información del representante
- Nombre de la institución
- Tipo de institución
- Documentación oficial

#### **Paso 2: Verificación y Aprobación**
```
[Verificación Documentos] → [Validación Institucional] → [Aprobación Admin]
```

**Proceso Riguroso:**
- Verificación de legitimidad institucional
- Validación de representante autorizado
- Revisión de documentación legal
- Aprobación por equipo especializado

#### **Paso 3: Configuración Institucional**
```
[Perfil Institución] → [Programas Académicos] → [Convenios Existentes]
```

### 3.2 Flujos de Uso Principal

#### **A. Gestión de Estudiantes**
```
[Dashboard] → [Estudiantes Registrados] → [Seguimiento] → [Reportes]
```

**Funcionalidades:**
- Ver estudiantes de la institución
- Seguimiento de postulaciones y empleabilidad
- Estadísticas de inserción laboral
- Reportes de desempeño

#### **B. Facilitación Universidad-Empresa**
```
[Conexiones] → [Empresas Aliadas] → [Convenios] → [Eventos]
```

**Gestión de Relaciones:**
- Establecer convenios con empresas
- Organizar ferias de empleo virtuales
- Facilitar prácticas profesionales
- Seguimiento de graduados

---

## 4. FLUJO DE ADMINISTRADORES

### 4.1 Acceso Administrativo

#### **Acceso Restringido**
```
[Login Admin] → [Verificación 2FA] → [Dashboard Administrativo]
```

### 4.2 Funcionalidades Principales

#### **A. Gestión de Usuarios**
```
[Usuarios] → [Verificación] → [Moderación] → [Soporte]
```

**Capacidades:**
- Aprobar/rechazar cuentas empresariales
- Verificar instituciones educativas
- Moderar contenido inapropiado
- Gestionar reportes de usuarios
- Soporte técnico

#### **B. Gestión de Contenido**
```
[Ofertas] → [Moderación] → [Reportes] → [Estadísticas]
```

#### **C. Análisis y Reportes**
```
[Dashboard Analítico] → [Métricas] → [Reportes] → [Exportación]
```

---

## 5. FLUJOS TRANSVERSALES

### 5.1 Proceso de Autenticación

#### **Login Estándar**
```
[Email + Password] → [Verificación] → [Redirección según Rol]
```

#### **Recuperación de Contraseña**
```
[Olvidé Contraseña] → [Email Recuperación] → [Nueva Contraseña] → [Login]
```

#### **Autenticación con Google**
```
[Google OAuth] → [Autorización] → [Creación/Login Automático] → [Completar Perfil]
```

### 5.2 Flujo de Notificaciones

#### **Tipos de Notificaciones**
- **Estudiantes**: Nuevas ofertas relevantes, actualizaciones de postulaciones, mensajes de empresas
- **Empresas**: Nuevas postulaciones, mensajes de candidatos, vencimiento de ofertas
- **Instituciones**: Actividad de estudiantes, nuevos convenios disponibles
- **Admins**: Nuevos registros pendientes, reportes, alertas del sistema

### 5.3 Sistema de Mensajería

#### **Comunicación Estudiante-Empresa**
```
[Postulación Aceptada] → [Chat Habilitado] → [Comunicación Directa] → [Proceso Continuo]
```

### 5.4 Flujo de Verificación de Identidad

#### **Verificación Básica**
- Email válido y verificado
- Información personal completa

#### **Verificación Avanzada (Empresas/Instituciones)**
- Documentación oficial
- Verificación manual
- Seguimiento continuo

---

## 6. CASOS ESPECIALES Y EXCEPCIONES

### 6.1 Estudiantes sin Universidad
```
[Registro] → [Estudiante Independiente] → [Verificación Manual] → [Perfil Adaptado]
```

### 6.2 Empresas Multinacionales
```
[Registro Principal] → [Múltiples Ubicaciones] → [Gestión Centralizada] → [Permisos Distribuidos]
```

### 6.3 Cambio de Rol de Usuario
```
[Solicitud Cambio] → [Verificación] → [Aprobación Admin] → [Migración Datos] → [Nuevo Perfil]
```

### 6.4 Cuentas Inactivas
```
[Detección Inactividad] → [Notificaciones] → [Suspensión Temporal] → [Reactivación]
```

---

## 7. MÉTRICAS Y SEGUIMIENTO

### 7.1 KPIs por Tipo de Usuario

#### **Estudiantes:**
- Tiempo para completar perfil
- Número de postulaciones por mes
- Tasa de respuesta a postulaciones
- Tiempo hasta primer empleo

#### **Empresas:**
- Tiempo de verificación
- Número de ofertas publicadas
- Tiempo promedio de llenado de vacantes
- Calidad de candidatos

#### **Instituciones:**
- Número de estudiantes activos
- Tasa de empleabilidad de graduados
- Convenios activos
- Participación en eventos

### 7.2 Puntos de Fricción Identificados

1. **Proceso de verificación empresarial largo**
2. **Complejidad en completar perfil estudiantil**
3. **Falta de guidance en proceso de postulación**
4. **Comunicación limitada entre partes**

---

## 8. RECOMENDACIONES DE UX

### 8.1 Onboarding Progresivo
- Completar perfil en etapas
- Tutoriales interactivos
- Progreso visual claro

### 8.2 Personalización por Rol
- Dashboards específicos por tipo de usuario
- Funcionalidades relevantes destacadas
- Navegación adaptada

### 8.3 Feedback Continuo
- Estados claros en todos los procesos
- Notificaciones relevantes y oportunas
- Métricas de progreso visibles

---

Este mapeo de flujos servirá como base para diseñar interfaces intuitivas que guíen efectivamente a cada tipo de usuario a través de sus procesos específicos, minimizando la fricción y maximizando el valor obtenido de la plataforma.