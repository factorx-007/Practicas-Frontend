# Prompts de Diseño - Módulo de Autenticación

## Contexto del Proyecto
ProTalent es una plataforma de empleos full-stack que conecta estudiantes con empresas e instituciones educativas. El sistema maneja 4 tipos de usuarios: Estudiantes, Empresas, Instituciones y Administradores.

**Stack Técnico Frontend:**
- Next.js 15 con App Router
- TypeScript + Tailwind CSS
- shadcn/ui components
- Zustand para estado global
- React Hook Form + Zod

---

## 1. PÁGINA DE REGISTRO (`/auth/register`)

### Prompt de Diseño:
```
Diseña una página de registro moderna y profesional para ProTalent con las siguientes especificaciones:

**Layout y Estructura:**
- Diseño centrado con fondo degradado sutil (azul/blanco)
- Logo ProTalent prominente en la parte superior
- Wizard de 3 pasos con indicador de progreso visual
- Card principal elevada con sombras suaves

**Paso 1 - Información de Cuenta:**
- Título: "Crea tu cuenta"
- Campos: Email, Contraseña, Confirmar contraseña
- Iconos en inputs (Mail, Lock)
- Validación visual en tiempo real
- Medidor de fortaleza de contraseña
- Botón "Continuar" con gradiente azul

**Paso 2 - Información Personal:**
- Título: "Información personal"
- Campos: Nombre, Apellido en grid 2 columnas
- Selector de rol con cards visuales:
  - 🎓 Estudiante: "Busco prácticas y empleos"
  - 🏢 Empresa: "Busco talento joven"
  - 🎓 Institución: "Conecto estudiantes con empresas"
- Cards con hover effects y selección destacada

**Paso 3 - Información Específica:**
- Campos condicionales según rol seleccionado
- Para Estudiantes: Universidad (opcional), Carrera (opcional)
- Para Empresas: Nombre de empresa (requerido)
- Para Instituciones: Nombre de institución (requerido)
- Botón "Crear cuenta" con loading state

**Elementos de UX:**
- Progress bar animado (1/3, 2/3, 3/3)
- Navegación "Atrás/Continuar"
- Estados de error elegantes
- Animaciones suaves entre pasos
- Footer con links a términos y privacidad

**Colores:**
- Primario: Azules (#2563eb, #1d4ed8)
- Secundario: Grises (#6b7280, #9ca3af)
- Estados: Verde éxito, Rojo error, Amarillo warning
- Fondo: Blanco/gris muy claro

**Responsive:**
- Mobile-first design
- Breakpoints: 320px, 768px, 1024px
- Stack vertical en móvil
- Campos full-width en mobile
```

---

## 2. PÁGINA DE LOGIN (`/auth/login`)

### Prompt de Diseño:
```
Diseña una página de login elegante y funcional para ProTalent:

**Layout Principal:**
- Diseño centrado con mismo fondo que registro
- Logo ProTalent + tagline motivacional
- Card de login compacta pero spaciosa
- Ilustración sutil relacionada con empleos (opcional)

**Formulario de Login:**
- Título: "Bienvenido de vuelta"
- Campo email con validación visual
- Campo contraseña con toggle show/hide
- Checkbox "Recordarme" elegante
- Botón principal "Iniciar sesión" full-width

**Opciones Adicionales:**
- Divider "o continúa con"
- Botón Google OAuth con estilo consistente
- Link "¿Olvidaste tu contraseña?" discreto
- Link "¿No tienes cuenta? Regístrate" al final

**Estados y Feedback:**
- Loading states en botones
- Mensajes de error contextuales
- Éxito con redirección suave
- Validación en tiempo real sutil

**Elementos Visuales:**
- Iconos Lucide React
- Mismo esquema de colores que registro
- Transiciones fluidas
- Microinteracciones en hover/focus

**Responsive:**
- Adaptación mobile completa
- Touch-friendly en todos los elementos
- Optimización para autofill browsers
```

---

## 3. RECUPERACIÓN DE CONTRASEÑA (`/auth/forgot-password`)

### Prompt de Diseño:
```
Diseña una página de recuperación de contraseña simple y tranquilizadora:

**Layout:**
- Mismo estilo visual que login/registro
- Card centrada más estrecha
- Ícono de email o candado prominente

**Contenido:**
- Título: "Recupera tu contraseña"
- Descripción clara del proceso
- Campo email único con validación
- Botón "Enviar enlace de recuperación"
- Link "Volver al login" como texto secundario

**Estados:**
- Estado normal: Campo y botón activos
- Estado loading: Botón con spinner
- Estado éxito: Mensaje de confirmación + ícono check
- Estado error: Mensaje claro de error

**Flujo de Confirmación:**
- Página de confirmación con:
  - Ícono de email enviado
  - "Revisa tu bandeja de entrada"
  - Instrucciones claras
  - Opción "Reenviar email" (con cooldown)
  - Link para volver al login

**UX Considerations:**
- Mensajes de error útiles (email no encontrado, etc.)
- Loading states claros
- Confirmación visual de envío exitoso
- Navegación clara de vuelta al login
```

---

## 4. RESET DE CONTRASEÑA (`/auth/reset-password/[token]`)

### Prompt de Diseño:
```
Diseña una página de reset de contraseña segura y confiable:

**Layout:**
- Consistente con otras páginas de auth
- Card centrada con padding generoso
- Ícono de seguridad/candado

**Formulario:**
- Título: "Crea tu nueva contraseña"
- Campo contraseña nueva con medidor de fortaleza
- Campo confirmar contraseña con validación
- Requisitos de contraseña visibles
- Botón "Actualizar contraseña"

**Validaciones Visuales:**
- Medidor de fortaleza en tiempo real
- Coincidencia de contraseñas
- Criterios de seguridad checklist:
  - Mínimo 8 caracteres ✓
  - Al menos 1 mayúscula ✓
  - Al menos 1 número ✓
  - Al menos 1 carácter especial ✓

**Estados de Error:**
- Token expirado: Mensaje + opción renovar
- Token inválido: Mensaje + volver a solicitar
- Errores de validación contextuales

**Éxito:**
- Confirmación de cambio exitoso
- Redirección automática al login
- Mensaje motivacional
```

---

## 5. VERIFICACIÓN DE EMAIL (`/auth/verify-email/[token]`)

### Prompt de Diseño:
```
Diseña una página de verificación de email amigable:

**Estados Posibles:**

**Verificación en Proceso:**
- Spinner/loader elegante
- Mensaje: "Verificando tu email..."
- Animación sutil de progreso

**Verificación Exitosa:**
- Ícono de check grande y celebratorio
- Título: "¡Email verificado exitosamente!"
- Mensaje de bienvenida personalizado
- Botón CTA: "Completar mi perfil" o "Ir al dashboard"
- Confetti animation sutil (opcional)

**Verificación Fallida:**
- Ícono de error claro pero no alarmante
- Título: "No pudimos verificar tu email"
- Mensaje explicativo según el error:
  - Token expirado: "El enlace ha expirado"
  - Token inválido: "El enlace no es válido"
  - Ya verificado: "Tu email ya está verificado"
- Botón "Reenviar email de verificación"
- Link "Contactar soporte" como último recurso

**Elementos Visuales:**
- Ilustraciones SVG simples para cada estado
- Colores: Verde para éxito, Amarillo para warning, Rojo suave para error
- Animaciones sutiles y celebratorias
- Typography jerárquica clara
```

---

## 6. LOGIN ADMINISTRATIVO (`/auth/admin/login`)

### Prompt de Diseño:
```
Diseña una página de login administrativa más seria y profesional:

**Diferencias con Login Regular:**
- Esquema de colores más sobrio (grises/azul oscuro)
- Layout más formal y minimalista
- Header con logo + "Panel Administrativo"
- Badge o indicador de "Admin Access"

**Seguridad Visual:**
- Elementos que transmitan seguridad
- Posible indicador de https/secure
- Warning discreto sobre acceso restringido
- Campos de login más formales

**Funcionalidades Especiales:**
- Posible campo adicional (código admin)
- 2FA toggle para futura implementación
- Logs de último acceso
- Mensaje de responsabilidad de uso

**Layout:**
- Más compacto y directo al grano
- Menos elementos decorativos
- Focus en funcionalidad
- Posible tema dark mode
```

---

## 7. COMPONENTES REUTILIZABLES

### 7.1 Input con Validación
```
Diseña un componente de input reutilizable con:

**Estados Visuales:**
- Default: Border gris, placeholder sutil
- Focus: Border azul, label animado hacia arriba
- Error: Border rojo, mensaje de error debajo
- Success: Border verde, ícono check sutil
- Disabled: Gris claro, cursor not-allowed

**Elementos:**
- Label flotante animada
- Ícono izquierdo opcional
- Ícono derecho para acciones (show/hide, clear)
- Mensaje de ayuda/error debajo
- Tamaños: sm, md, lg

**Tipos Especializados:**
- Password con toggle visibility
- Email con validación visual
- Search con ícono de búsqueda
- Number con controles +/-
```

### 7.2 Botones de Acción
```
Diseña una familia de botones consistente:

**Variantes:**
- Primary: Azul gradiente, texto blanco
- Secondary: Border azul, texto azul
- Ghost: Sin border, texto azul
- Danger: Rojo, para acciones destructivas

**Estados:**
- Default: Colores normales
- Hover: Ligero darkening/brightening
- Active: Pressed effect
- Loading: Spinner interno
- Disabled: Gris, no interactivo

**Tamaños:**
- xs: 28px height
- sm: 32px height
- md: 40px height (default)
- lg: 48px height
- xl: 56px height

**Iconos:**
- Soporte para ícono izquierdo/derecho
- Loading spinner
- Spacing consistente
```

---

## 8. CONSIDERACIONES TÉCNICAS

### Accesibilidad (WCAG 2.1 AA):
- Contraste mínimo 4.5:1
- Navegación completa por teclado
- Labels apropiados en formularios
- Estados focus visibles
- Screen reader compatibility

### Performance:
- Lazy loading de imágenes/ilustraciones
- Optimización de fuentes
- CSS critical path inline
- Preload de páginas siguientes

### Responsive:
- Mobile-first approach
- Touch targets mínimo 44px
- Gestos naturales en mobile
- Adaptación de layout fluida

### Navegadores:
- Soporte moderno (last 2 versions)
- Fallbacks para CSS Grid/Flexbox
- Progressive enhancement
- Polyfills mínimos necesarios

---

## 9. TOKENS DE DISEÑO

### Spacing Scale:
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Typography Scale:
```
xs: 12px
sm: 14px
base: 16px
lg: 18px
xl: 20px
2xl: 24px
3xl: 30px
4xl: 36px
```

### Shadow Scale:
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.07)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Border Radius:
```
sm: 4px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

Estos prompts pueden ser utilizados con cualquier herramienta de diseño con IA (Midjourney, DALL-E, Figma AI, etc.) o como especificaciones detalladas para diseñadores UI/UX.