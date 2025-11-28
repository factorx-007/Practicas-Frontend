'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { socialService } from '@/services/social.service';
import { Post } from '@/types/social.types';
import BlogDetail from '@/components/blog/BlogDetail';
import { motion } from 'framer-motion';

export default function PostDetailPage() {
  const { blogId } = useParams(); // Se mantiene blogId por la estructura de la ruta
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      const fetchPost = async () => {
        try {
          setIsLoading(true);
          const fetchedPost = await socialService.getPostById(blogId as string);
          if (fetchedPost) {
            setPost(fetchedPost);
          } else {
            toast.error('Post no encontrado');
          }
        } catch (_error) {
          console.error('Error al cargar el post:', _error);
          toast.error('Error al cargar el post');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Post no disponible</h2>
        <p className="text-gray-600">El post que buscas no pudo ser encontrado o no existe.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BlogDetail post={post} />
    </motion.div>
  );
}
