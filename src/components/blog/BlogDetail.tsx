import React, { useState, useEffect } from 'react';
import { Post, TipoReaccion, CreateReaccionDTO } from '@/types/social.types';
import { Calendar, User, Heart, ThumbsUp, Laugh, Frown, Eye, X, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { socialService } from '@/services/social.service';
import { useAuthStore } from '@/store/authStore';
import CommentSection from '@/components/blog/CommentSection';
import Image from 'next/image';

interface PostDetailProps {
  post: Post;
}

const reactionIcons: { [key in TipoReaccion]: React.ElementType } = {
  LIKE: ThumbsUp,
  LOVE: Heart,
  HAHA: Laugh,
  WOW: Eye,
  SAD: Frown,
  ANGRY: X,
};

const reactionColors: { [key in TipoReaccion]: string } = {
  LIKE: 'text-blue-500',
  LOVE: 'text-red-500',
  HAHA: 'text-yellow-500',
  WOW: 'text-yellow-500',
  SAD: 'text-yellow-500',
  ANGRY: 'text-red-500',
};

const reactionLabels: { [key in TipoReaccion]: string } = {
  LIKE: 'Me gusta',
  LOVE: 'Me encanta',
  HAHA: 'Jajaja',
  WOW: 'Guau',
  SAD: 'Triste',
  ANGRY: 'Grrr',
};

export default function BlogDetail({ post }: PostDetailProps) {
  const user = useAuthStore(state => state.user);
  const [currentPost, setCurrentPost] = useState<Post>(post);
  const [userReaction, setUserReaction] = useState<TipoReaccion | null>(null);
  const [totalReactions, setTotalReactions] = useState(post.totalReacciones || 0);

  useEffect(() => {
    if (post.yaReaccionado && post.tipoReaccionUsuario) {
      setUserReaction(post.tipoReaccionUsuario as TipoReaccion);
    }
    setCurrentPost(post);
    setTotalReactions(post.totalReacciones || 0);
  }, [post]);

  const handleToggleReaction = async (tipo: TipoReaccion) => {
    if (!user) return;

    const reactionData: CreateReaccionDTO = {
      tipo,
      postId: currentPost.id,
    };

    try {
      const result = await socialService.toggleReaccion(reactionData);
      console.log('Resultado de toggleReaccion:', result);
      
      // Verificar si result tiene la estructura esperada
      if (result && typeof result === 'object') {
        setCurrentPost((prev: Post) => ({
          ...(prev as Post),
          totalReacciones: result.reaccion ? (prev.totalReacciones || 0) + 1 : (prev.totalReacciones || 0) - 1,
          yaReaccionado: !!result.reaccion,
          tipoReaccionUsuario: result.reaccion ? result.reaccion.tipo : undefined,
        }));
        setTotalReactions(result.reaccion ? totalReactions + 1 : totalReactions - 1);
        setUserReaction(result.reaccion ? tipo : null);
      }
    } catch (error) {
      console.error('Error al procesar la reacción:', error);
      // Mostrar mensaje de error al usuario
      alert('Error al procesar la reacción. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 lg:p-8 max-w-4xl mx-auto my-8"
    >
      {/* Contenido del Post */}
      <p className="text-xl text-gray-800 leading-relaxed mb-6">
        {currentPost.contenido}
      </p>
      <div className="flex items-center text-gray-600 text-sm mb-6 space-x-4">
        {currentPost.autor && (
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>{currentPost.autor.nombre} {currentPost.autor.apellido}</span>
          </div>
        )}
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>
            {format(new Date(currentPost.createdAt), 'dd MMMM yyyy', { locale: es })}
          </span>
        </div>
      </div>

      {/* Imágenes y Videos (si existen) */}
      {(currentPost.imagenes && currentPost.imagenes.length > 0) && (
        <div className="mb-6 grid grid-cols-1 gap-4">
          {currentPost.imagenes.map((imageUrl: string, index: number) => (
            <div key={index} className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
      {(currentPost.videos && currentPost.videos.length > 0) && (
        <div className="mb-6 grid grid-cols-1 gap-4">
          {currentPost.videos.map((videoUrl: string, index: number) => (
            <div key={index} className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-900">
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain rounded-lg"
              >
                Tu navegador no soporta la etiqueta de video.
              </video>
            </div>
          ))}
        </div>
      )}

      {/* Reacciones - Estilo Facebook */}
      <div className="border-t border-b border-gray-200 py-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>{totalReactions}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>{currentPost.totalComentarios || 0} comentarios</span>
          </div>
        </div>
      </div>

      {/* Botones de reacción - Estilo Facebook */}
      <div className="flex justify-between py-2 border-b border-gray-200 mb-6">
        {Object.values(TipoReaccion).map((tipo: TipoReaccion) => {
          const Icon = reactionIcons[tipo];
          const isSelected = userReaction === tipo;
          return (
            <button
              key={tipo.toString()}
              onClick={() => handleToggleReaction(tipo)}
              className={`flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 flex-1 mx-1
                ${isSelected 
                  ? `${reactionColors[tipo]} bg-gray-100 font-semibold` 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
              `}
              title={reactionLabels[tipo]}
            >
              <Icon className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{reactionLabels[tipo]}</span>
            </button>
          );
        })}
      </div>

      {/* Sección de Comentarios */}
      <CommentSection 
        postId={currentPost.id} 
        initialComments={currentPost.comentarios || []} 
        totalInitialComments={currentPost.totalComentarios || 0} 
      />
    </motion.div>
  );
}