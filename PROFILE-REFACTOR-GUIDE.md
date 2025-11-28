# 🎨 Guía de Refactorización del Sistema de Perfiles

## 📋 Resumen de Implementación

Se ha implementado un **sistema completo de perfiles minimalista y moderno** para ProTalent con las siguientes características:

### ✅ Componentes Implementados

#### 1. **Sistema de Tipos TypeScript** (`src/types/profile.types.ts`)
- ✅ Tipos completos que reflejan la estructura exacta del backend API
- ✅ Tipos para operaciones CRUD (create, update, delete, upsert)
- ✅ Enums y labels para todos los campos de selección
- ✅ Request DTOs para actualización de perfiles

#### 2. **Servicios API Actualizados** (`src/services/users.service.ts`)
- ✅ Método `updateStudentProfile` con soporte completo para operaciones anidadas
- ✅ Tipado fuerte con TypeScript
- ✅ Documentación clara de capacidades

#### 3. **Componentes UI Minimalistas**

**Componentes Base:**
- ✅ `MinimalModal` - Modal reutilizable con animaciones
- ✅ `MinimalInput` - Input de texto con validación
- ✅ `MinimalTextarea` - Textarea con validación
- ✅ `MinimalSelect` - Select con iconos
- ✅ `MinimalButton` - Botón con variantes y estados de carga
- ✅ `MinimalCard` - Card con acciones de edición/eliminación

**Modales de Edición:**
- ✅ `ProfessionalProfileModal` - Edición de perfil profesional
- ✅ `ExperienceModal` - Gestión de experiencia laboral
- ✅ `EducationModal` - Gestión de educación académica

**Componentes de Vista:**
- ✅ `StudentOverviewNew` - Resumen del perfil con edición inline
- ✅ `StudentExperienceNew` - Lista de experiencias con CRUD completo
- ✅ `StudentEducationNew` - Lista de educación con CRUD completo

---

## 🎯 Características Principales

### 🎨 Diseño Minimalista
- **Paleta de colores reducida**: Negro (#000), Gris (#666), Blanco (#FFF)
- **Tipografía limpia**: Font weights limitados (400, 500, 600)
- **Espaciado consistente**: Sistema de spacing basado en múltiplos de 4px
- **Bordes sutiles**: 1px solid con colores neutros

### 🚀 Funcionalidad Completa
- **Edición inline**: Botones de editar en cada card
- **Modales coherentes**: Mismo diseño en todos los modales
- **Validación de formularios**: React Hook Form + validación nativa
- **Feedback visual**: Toast notifications con react-hot-toast
- **Estados de carga**: Loading states en botones y modales

### 🔄 Operaciones CRUD
- **Create**: Agregar nuevos items con modales
- **Read**: Visualización limpia en cards
- **Update**: Edición inline con modales pre-poblados
- **Delete**: Confirmación antes de eliminar

---

## 📁 Estructura de Archivos Creados

```
Practicas-Frontend/
├── src/
│   ├── types/
│   │   └── profile.types.ts ✨ NUEVO
│   │
│   ├── services/
│   │   └── users.service.ts ✏️ ACTUALIZADO
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── MinimalModal.tsx ✨ NUEVO
│   │   │   ├── MinimalInput.tsx ✨ NUEVO
│   │   │   ├── MinimalTextarea.tsx ✨ NUEVO
│   │   │   ├── MinimalSelect.tsx ✨ NUEVO
│   │   │   ├── MinimalButton.tsx ✨ NUEVO
│   │   │   └── MinimalCard.tsx ✨ NUEVO
│   │   │
│   │   └── profile/
│   │       ├── modals/
│   │       │   ├── ProfessionalProfileModal.tsx ✨ NUEVO
│   │       │   ├── ExperienceModal.tsx ✨ NUEVO
│   │       │   └── EducationModal.tsx ✨ NUEVO
│   │       │
│   │       └── student/
│   │           ├── StudentOverviewNew.tsx ✨ NUEVO
│   │           ├── StudentExperienceNew.tsx ✨ NUEVO
│   │           └── StudentEducationNew.tsx ✨ NUEVO
│   │
│   └── ...
```

---

## 🔧 Cómo Integrar los Nuevos Componentes

### Opción 1: Reemplazar Componentes Existentes

```bash
# Opción recomendada: Renombrar archivos antiguos como backup
cd /home/darkness/Escritorio/Proyectos-A/Practicas-Frontend/src/components/profile/student

mv StudentOverview.tsx StudentOverview.old.tsx
mv StudentExperience.tsx StudentExperience.old.tsx
mv StudentEducation.tsx StudentEducation.old.tsx

# Renombrar los nuevos componentes
mv StudentOverviewNew.tsx StudentOverview.tsx
mv StudentExperienceNew.tsx StudentExperience.tsx
mv StudentEducationNew.tsx StudentEducation.tsx
```

### Opción 2: Actualizar Imports en StudentProfile.tsx

```typescript
// Cambiar imports en src/components/profile/student/StudentProfile.tsx

// ❌ ANTES:
import StudentOverview from './StudentOverview';
import StudentExperience from './StudentExperience';
import StudentEducation from './StudentEducation';

// ✅ DESPUÉS:
import StudentOverview from './StudentOverviewNew';
import StudentExperience from './StudentExperienceNew';
import StudentEducation from './StudentEducationNew';
```

### Paso Adicional: Agregar Callback de Actualización

Actualizar `StudentProfile.tsx` para recargar datos después de ediciones:

```typescript
// src/components/profile/student/StudentProfile.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UsersService from '@/services/users.service';

export default function StudentProfile({ profileId }: { profileId?: string }) {
  const { data: profile, refetch } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => profileId
      ? UsersService.getUserProfile(profileId)
      : UsersService.getMyProfile(),
  });

  const handleProfileUpdate = () => {
    refetch(); // Recargar datos después de editar
  };

  return (
    <ProfileLayout>
      <div className="p-6">
        {activeTab === 'resumen' && (
          <StudentOverview
            profile={profile?.data}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
        {activeTab === 'experiencia' && (
          <StudentExperience
            profile={profile?.data}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
        {activeTab === 'educacion' && (
          <StudentEducation
            profile={profile?.data}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </ProfileLayout>
  );
}
```

---

## 🧪 Ejemplo de Uso: Actualizar Perfil Profesional

```typescript
import UsersService from '@/services/users.service';

// Crear o actualizar perfil profesional
await UsersService.updateStudentProfile({
  perfilProfesional: {
    upsert: {
      create: {
        resumen: 'Desarrollador Full Stack con 3 años de experiencia...',
        disponibilidad: 'INMEDIATA',
        modalidad_trabajo: ['REMOTO', 'HIBRIDO'],
        salario_minimo: 3000,
        salario_maximo: 5000,
        moneda: 'PEN',
      },
      update: {
        resumen: 'Desarrollador Full Stack actualizado...',
      },
    },
  },
});
```

---

## 🧪 Ejemplo de Uso: Agregar Experiencia

```typescript
// Agregar nueva experiencia
await UsersService.updateStudentProfile({
  experiencias: {
    create: [
      {
        cargo: 'Desarrollador Full Stack',
        empresa: 'Tech Company SAC',
        fecha_inicio: '2023-01-01T00:00:00.000Z',
        es_actual: true,
        modalidad: 'REMOTO',
        descripcion: 'Desarrollo de aplicaciones web...',
        responsabilidades: [
          'Desarrollar features del producto',
          'Code reviews',
        ],
        logros: [
          'Mejoré el rendimiento en 40%',
        ],
      },
    ],
  },
});
```

---

## 🧪 Ejemplo de Uso: Editar Educación

```typescript
// Editar educación existente
await UsersService.updateStudentProfile({
  educacion: {
    update: [
      {
        where: { id: 'edu-id-123' },
        data: {
          promedio: 17.5,
          en_curso: false,
          fecha_fin: '2024-12-15T00:00:00.000Z',
        },
      },
    ],
  },
});
```

---

## 🧪 Ejemplo de Uso: Eliminar Item

```typescript
// Eliminar experiencia
await UsersService.updateStudentProfile({
  experiencias: {
    delete: [{ id: 'exp-id-456' }],
  },
});
```

---

## 🎨 Paleta de Colores del Diseño Minimalista

```css
/* Colores Principales */
--color-black: #000000;     /* Textos principales, botones primary */
--color-gray-900: #111827;  /* Textos títulos */
--color-gray-700: #374151;  /* Textos secundarios */
--color-gray-500: #6B7280;  /* Textos auxiliares */
--color-gray-200: #E5E7EB;  /* Bordes */
--color-gray-100: #F3F4F6;  /* Backgrounds secundarios */
--color-gray-50: #F9FAFB;   /* Backgrounds suaves */
--color-white: #FFFFFF;     /* Background principal */

/* Colores de Estado */
--color-blue-500: #3B82F6;  /* Links, focus states */
--color-green-600: #16A34A; /* Success */
--color-red-500: #EF4444;   /* Danger, errors */
```

---

## ⚡ Próximos Pasos Recomendados

### Componentes Pendientes de Implementar:

1. **Gestión de Habilidades**
   - Modal para agregar/editar habilidades con niveles
   - Visualización con badges y niveles de dominio

2. **Gestión de Proyectos**
   - Modal con upload de imágenes
   - Tecnologías usadas
   - Links a repositorio y demo

3. **Gestión de Certificaciones**
   - Modal con fechas de emisión/expiración
   - Links de verificación
   - Badges de certificados

4. **Gestión de Idiomas**
   - Modal con niveles independientes (oral, escrito, lectura)
   - Visualización con flags de países

5. **Indicador de Completitud**
   - Progress bar con porcentaje
   - Sugerencias de qué completar
   - Gamificación con niveles

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module '@/types/profile.types'"

```bash
# Verificar que el archivo exista
ls -la /home/darkness/Escritorio/Proyectos-A/Practicas-Frontend/src/types/profile.types.ts

# Si no existe, crearlo con el contenido proporcionado
```

### Error: "Property 'onProfileUpdate' does not exist"

Asegúrate de agregar el callback en los componentes padre:

```typescript
<StudentOverview
  profile={profile}
  onProfileUpdate={() => refetch()}
/>
```

### Error de CORS al hacer peticiones

Verifica que el backend esté corriendo en `http://localhost:5000` y que las variables de entorno estén correctamente configuradas.

---

## 📚 Recursos y Referencias

- **Backend API**: `http://localhost:5000/api/users/me/student`
- **Documentación Backend**: `/home/darkness/Escritorio/Proyectos-A/ANALISIS-PERFILES.md`
- **Tipos del Backend**: `/home/darkness/Escritorio/Proyectos-A/Practicas-Backend/src/types/user.types.ts`
- **React Hook Form**: https://react-hook-form.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 📞 Soporte

Si encuentras algún problema o necesitas ayuda adicional:

1. Verifica que ambos servidores estén corriendo (backend y frontend)
2. Revisa la consola del navegador para errores específicos
3. Verifica que los tipos TypeScript coincidan con el backend
4. Consulta los ejemplos de uso en este documento

---

**Última actualización**: 26 de Octubre de 2025
**Estado**: ✅ Componentes base listos para integración
**Próximo paso**: Integrar componentes en StudentProfile.tsx y probar funcionalidad completa
