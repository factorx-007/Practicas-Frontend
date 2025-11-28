import { Post, CreatePostDTO, UpdatePostDTO, PostQueryParams, PostsResponse, Comentario, CreateComentarioDTO, UpdateComentarioDTO, ComentarioQueryParams, ComentariosResponse, CreateReaccionDTO, Reaccion } from '@/types/social.types';
import { api } from '../lib/api';

const API_URL = '/social';

export const socialService = {
  // === POSTS ===
  createPost: async (postData: CreatePostDTO, images?: File[], videos?: File[]): Promise<Post> => {
    const formData = new FormData();
    
    // Añadir campos de texto
    formData.append('contenido', postData.contenido);
    if (postData.privado !== undefined) {
      formData.append('privado', String(postData.privado));
    }

    // Añadir imágenes
    if (images && images.length > 0) {
      console.log('Añadiendo imágenes:', images);
      images.forEach((image) => {
        formData.append(`images`, image, image.name);
      });
    } else {
      console.log('No hay imágenes para subir');
    }

    // Añadir videos
    if (videos && videos.length > 0) {
      console.log('Añadiendo videos:', videos);
      videos.forEach((video) => {
        formData.append(`videos`, video, video.name);
      });
    } else {
      console.log('No hay videos para subir');
    }

    try {
      const response = await api.post<Post>(`${API_URL}/posts`, formData);
      return response.data as Post;
    } catch (error) {
      console.error('Error al crear post:', error);
      throw error;
    }
  },

  getPosts: async (params?: PostQueryParams): Promise<PostsResponse> => {
    console.log('[SOCIAL_SERVICE] 📤 Solicitando posts con params:', params);
    const response = await api.get<PostsResponse>(`${API_URL}/posts`, { params });
    console.log('[SOCIAL_SERVICE] 📥 Respuesta completa:', response);
    console.log('[SOCIAL_SERVICE] 📥 response.data:', response.data);
    
    return response.data as PostsResponse;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get<Post>(`${API_URL}/posts/${id}`);
    return response.data as Post;
  },

  updatePost: async (id: string, postData: UpdatePostDTO): Promise<Post> => {
    const response = await api.put<Post>(`${API_URL}/posts/${id}`, postData);
    return response.data as Post;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/posts/${id}`);
  },

  // === COMENTARIOS ===
  createComentario: async (comentarioData: CreateComentarioDTO): Promise<Comentario> => {
    const response = await api.post<Comentario>(`${API_URL}/comentarios`, comentarioData);
    return response.data as Comentario;
  },

  getComentarios: async (params: ComentarioQueryParams): Promise<ComentariosResponse> => {
    const response = await api.get<ComentariosResponse>(`${API_URL}/comentarios`, { params });
    return response.data as ComentariosResponse;
  },

  updateComentario: async (id: string, comentarioData: UpdateComentarioDTO): Promise<Comentario> => {
    const response = await api.put<Comentario>(`${API_URL}/comentarios/${id}`, comentarioData);
    return response.data as Comentario;
  },

  deleteComentario: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/comentarios/${id}`);
  },

  // === REACCIONES ===
  toggleReaccion: async (reaccionData: CreateReaccionDTO): Promise<{ accion: string; reaccion: Reaccion | null }> => {
    const response = await api.post<{ accion: string; reaccion: Reaccion | null }>(`${API_URL}/reacciones`, reaccionData);
    return response.data as { accion: string; reaccion: Reaccion | null };
  },
};