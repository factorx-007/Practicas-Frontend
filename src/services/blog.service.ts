import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { Blog, CrearEditarBlogData, ListaBlogsRespuesta } from '@/types/blog.types';
import { toast } from 'sonner';

export const BlogService = {
  /**
   * Crear un nuevo blog
   * @param blogData Datos del blog a crear
   * @returns Blog creado o error
   */
  async crearBlog(blogData: CrearEditarBlogData): Promise<Blog | null> {
    try {
      // Crear FormData para manejar archivos
      const formData = new FormData();
      
      // Añadir campos de texto
      formData.append('titulo', blogData.titulo);
      formData.append('contenido', blogData.contenido);
      formData.append('estado', blogData.estado);
      formData.append('privado', blogData.privado.toString());

      // Añadir etiquetas
      if (blogData.etiquetas && blogData.etiquetas.length > 0) {
        blogData.etiquetas.forEach(etiqueta => {
          formData.append('etiquetas[]', etiqueta);
        });
      }

      // Añadir imágenes
      if (blogData.imagenes && blogData.imagenes.length > 0) {
        blogData.imagenes.forEach(imagen => {
          formData.append('images', imagen);
        });
      }

      // Añadir videos
      if (blogData.videos && blogData.videos.length > 0) {
        blogData.videos.forEach(video => {
          formData.append('videos', video);
        });
      }

      const response = await api.post<Blog>(API_ENDPOINTS.BLOG.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.success && response.data) {
        toast.success('Blog creado exitosamente');
        return response.data;
      } else {
        const errorMessage = response.message || 'Error al crear el blog';
        console.error('Error en la respuesta del servidor:', errorMessage);
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error creando blog:', error);
      toast.error('Error al crear el blog');
      return null;
    }
  },

  /**
   * Obtener lista de blogs
   * @param params Parámetros de consulta
   * @returns Lista de blogs o null
   */
  async obtenerBlogs(params: {
    page?: number;
    limit?: number;
    autor?: string;
    etiquetas?: string[];
    estado?: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
    busqueda?: string;
    orderBy?: 'fechaCreacion' | 'popularidad';
    order?: 'asc' | 'desc';
  } = {}): Promise<ListaBlogsRespuesta | null> {
    try {
      const response = await api.get<ListaBlogsRespuesta>(API_ENDPOINTS.BLOG.LIST, { 
        params 
      });

      if (response.success && response.data) {
        return response.data;
      } else {
        const errorMessage = response.message || 'Error al obtener blogs';
        console.error('Error en la respuesta del servidor:', errorMessage);
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo blogs:', error);
      toast.error('Error al obtener blogs');
      return null;
    }
  },

  /**
   * Obtener un blog por su ID
   * @param blogId ID del blog
   * @returns Blog o null
   */
  async obtenerBlogPorId(blogId: string): Promise<Blog | null> {
    try {
      const response = await api.get<Blog>(`${API_ENDPOINTS.BLOG.BASE}/${blogId}`);

      if (response.success && response.data) {
        return response.data;
      } else {
        toast.error(response.message || 'No se encontró el blog solicitado');
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo blog:', error);
      toast.error('Error al obtener el blog');
      return null;
    }
  },

  /**
   * Actualizar un blog existente
   * @param blogId ID del blog a actualizar
   * @param blogData Datos actualizados del blog
   * @returns Blog actualizado o null
   */
  async actualizarBlog(blogId: string, blogData: CrearEditarBlogData): Promise<Blog | null> {
    try {
      // Crear FormData para manejar archivos
      const formData = new FormData();
      
      // Añadir campos de texto
      formData.append('titulo', blogData.titulo);
      formData.append('contenido', blogData.contenido);
      formData.append('estado', blogData.estado);
      formData.append('privado', blogData.privado.toString());

      // Añadir etiquetas
      if (blogData.etiquetas && blogData.etiquetas.length > 0) {
        blogData.etiquetas.forEach(etiqueta => {
          formData.append('etiquetas[]', etiqueta);
        });
      }

      // Añadir imágenes
      if (blogData.imagenes && blogData.imagenes.length > 0) {
        blogData.imagenes.forEach(imagen => {
          formData.append('images', imagen);
        });
      }

      // Añadir videos
      if (blogData.videos && blogData.videos.length > 0) {
        blogData.videos.forEach(video => {
          formData.append('videos', video);
        });
      }

      const response = await api.put<Blog>(`${API_ENDPOINTS.BLOG.BASE}/${blogId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.success && response.data) {
        toast.success('Blog actualizado exitosamente');
        return response.data;
      } else {
        toast.error(response.message || 'Error al actualizar el blog');
        return null;
      }
    } catch (error) {
      console.error('Error actualizando blog:', error);
      toast.error('Error al actualizar el blog');
      return null;
    }
  },

  /**
   * Eliminar un blog
   * @param blogId ID del blog a eliminar
   * @returns Booleano indicando éxito o fracaso
   */
  async eliminarBlog(blogId: string): Promise<boolean> {
    try {
      const response = await api.delete(`${API_ENDPOINTS.BLOG.BASE}/${blogId}`);

      if (response.success) {
        toast.success('Blog eliminado exitosamente');
        return true;
      } else {
        toast.error(response.message || 'Error al eliminar el blog');
        return false;
      }
    } catch (error) {
      console.error('Error eliminando blog:', error);
      toast.error('Error al eliminar el blog');
      return false;
    }
  }
};

