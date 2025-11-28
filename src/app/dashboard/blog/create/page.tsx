'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { socialService } from '@/services/social.service';
import { z } from 'zod';

import BlogForm from '@/components/blog/BlogForm';

// Esquema de validación para posts (adaptado del backend)
const PostSchema = z.object({
  contenido: z.string().min(1, "El contenido no puede estar vacío").max(2000, "El contenido es demasiado largo"),
  privado: z.boolean().optional(),
});

type PostFormValues = z.infer<typeof PostSchema> & { id?: string };

export default function CreateBlogPage() {
  const [_isCreatingPost] = useState(true); // Siempre true en esta página
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit: rhfHandleSubmit,
    formState: { errors } 
  } = useForm<PostFormValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      contenido: '',
      privado: false,
    }
  });

  const onSubmitPost = async (data: PostFormValues, images: File[], videos: File[]) => {
    try {
      console.log('Datos del post:', data);
      console.log('Imágenes:', images);
      console.log('Videos:', videos);

      const newPost = await socialService.createPost(data, images, videos);
      if (newPost) {
        toast.success('Post creado exitosamente!');
        router.push('/dashboard/blog'); // Redirigir al feed del blog
      }
    } catch (error) {
      console.error('Error detallado al crear post:', error);
      toast.error('Error al crear post');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/blog'); // Redirigir al feed del blog al cancelar
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Post</h1>
        <button 
          onClick={handleCancel}
          className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 mr-2" /> Cancelar
        </button>
      </div>

      <AnimatePresence>
        {_isCreatingPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <BlogForm 
              onSubmit={onSubmitPost}
              register={register}
              errors={errors}
              isEditing={false} // Siempre false para la creación
              rhfHandleSubmit={rhfHandleSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
