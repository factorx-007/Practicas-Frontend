import { z } from 'zod';

// Esquema de validación para crear blog
export const BlogSchema = z.object({
  titulo: z.string()
    .min(5, { message: "El título debe tener al menos 5 caracteres" })
    .max(100, { message: "El título no puede superar 100 caracteres" }),
  
  contenido: z.string()
    .min(50, { message: "El contenido debe tener al menos 50 caracteres" })
    .max(5000, { message: "El contenido no puede superar 5000 caracteres" }),
  
  etiquetas: z.array(z.string())
    .max(5, { message: "Máximo 5 etiquetas permitidas" })
    .optional(),
  
  imagenes: z.array(z.instanceof(File)).max(5, { message: "Máximo 5 imágenes permitidas" }).optional(),
  
  videos: z.array(z.instanceof(File)).max(2, { message: "Máximo 2 videos permitidos" }).optional(),
  
  estado: z.enum(['BORRADOR', 'PUBLICADO', 'ARCHIVADO']).default('BORRADOR'),
  
  privado: z.boolean().default(false)
});

// Interfaz para representación de Blog
export interface Blog {
  id: string;
  titulo: string;
  contenido: string;
  autorId: string;
  imagenes?: string[];
  videos?: string[];
  etiquetas?: string[];
  privado?: boolean;
  estado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
  fechaPublicacion?: string;
  createdAt: string;
  updatedAt: string;
  
  autor?: {
    id: string;
    nombre: string;
    apellido: string;
    avatar?: string;
  };
  
  comentarios?: number;
  reacciones?: number;
}

// Interfaz para respuesta de lista de blogs
export interface ListaBlogsRespuesta {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Tipo para los datos de creación/edición de blog
export type CrearEditarBlogData = z.infer<typeof BlogSchema>;

