'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Smile,
  ThumbsUp,
  Laugh,
  Frown,
  Angry,
  PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';

import { Post, TipoReaccion } from '@/types/social.types';
import { useAuthStore } from '@/store/authStore';
import { socialService } from '@/services/social.service';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onUpdate?: (post: Post) => void;
}

const REACTION_ICONS = {
  LIKE: { icon: ThumbsUp, color: 'text-blue-500', label: 'Me gusta' },
  LOVE: { icon: Heart, color: 'text-red-500', label: 'Me encanta' },
  HAHA: { icon: Laugh, color: 'text-yellow-500', label: 'Me divierte' },
  WOW: { icon: Smile, color: 'text-yellow-600', label: 'Me asombra' },
  SAD: { icon: Frown, color: 'text-yellow-700', label: 'Me entristece' },
  ANGRY: { icon: Angry, color: 'text-orange-600', label: 'Me enoja' },
  CELEBRATE: { icon: PartyPopper, color: 'text-purple-500', label: 'Celebrar' },
};

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const user = useAuthStore(state => state.user);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoadingReaction, setIsLoadingReaction] = useState(false);

  const isAuthor = user?.id === post.autorId;
  const userReaction = post.tipoReaccionUsuario;

  // Manejar reacción
  const handleReaction = async (tipo: TipoReaccion) => {
    if (isLoadingReaction) return;

    setIsLoadingReaction(true);
    setShowReactions(false);

    try {
      await socialService.toggleReaccion({
        tipo,
        postId: post.id,
      });

      // Actualizar el post localmente (optimistic update)
      const updatedPost = { ...post };

      if (userReaction === tipo) {
        // Eliminar reacción
        updatedPost.yaReaccionado = false;
        updatedPost.tipoReaccionUsuario = undefined;
        updatedPost.totalReacciones = (post.totalReacciones || 0) - 1;
      } else if (userReaction) {
        // Cambiar reacción
        updatedPost.tipoReaccionUsuario = tipo;
      } else {
        // Nueva reacción
        updatedPost.yaReaccionado = true;
        updatedPost.tipoReaccionUsuario = tipo;
        updatedPost.totalReacciones = (post.totalReacciones || 0) + 1;
      }

      onUpdate?.(updatedPost);
    } catch (error) {
      console.error('Error al reaccionar:', error);
      toast.error('Error al procesar la reacción');
    } finally {
      setIsLoadingReaction(false);
    }
  };

  // Formatear fecha
  const getTimeAgo = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: es
      });
    } catch {
      return format(new Date(date), 'dd MMM yyyy', { locale: es });
    }
  };

  // Obtener icono de reacción actual
  const CurrentReactionIcon = userReaction ? REACTION_ICONS[userReaction].icon : ThumbsUp;
  const reactionColor = userReaction ? REACTION_ICONS[userReaction].color : 'text-gray-600';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
    >
      {/* Header del post */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {post.autor?.avatar ? (
                <Image
                  src={post.autor.avatar}
                  alt={`${post.autor.nombre} ${post.autor.apellido}`}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <span>{post.autor?.nombre?.[0]}{post.autor?.apellido?.[0]}</span>
              )}
            </div>

            {/* Nombre y fecha */}
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.autor?.nombre} {post.autor?.apellido}
              </h3>
              <p className="text-xs text-gray-500">
                {getTimeAgo(post.createdAt)}
                {post.privado && (
                  <span className="ml-2 text-gray-400">• 🔒 Privado</span>
                )}
              </p>
            </div>
          </div>

          {/* Menú de opciones */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                >
                  {isAuthor ? (
                    <>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                        Editar post
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          onDelete?.(post.id);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                      >
                        Eliminar post
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                        Guardar post
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600">
                        Reportar
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Contenido del post */}
        <div className="mt-3">
          <p className="text-gray-800 whitespace-pre-wrap">{post.contenido}</p>
        </div>
      </div>

      {/* Imágenes */}
      {post.imagenes && post.imagenes.length > 0 && (
        <div className={`relative ${
          post.imagenes.length === 1 ? 'h-96' : 'grid grid-cols-2 gap-1'
        }`}>
          {post.imagenes.slice(0, 4).map((imagen, index) => (
            <div
              key={index}
              className={`relative ${
                post.imagenes!.length === 1 ? 'h-96' : 'h-64'
              } bg-gray-100`}
            >
              <Image
                src={imagen}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === 3 && post.imagenes!.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    +{post.imagenes!.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Videos */}
      {post.videos && post.videos.length > 0 && (
        <div className="relative h-96 bg-black">
          <video
            src={post.videos[0]}
            controls
            className="w-full h-full"
          />
        </div>
      )}

      {/* Contador de reacciones y comentarios */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          {post.totalReacciones && post.totalReacciones > 0 && (
            <>
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                  <ThumbsUp className="w-3 h-3 text-white" />
                </div>
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-white">
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </div>
              <span>{post.totalReacciones}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {post.totalComentarios && post.totalComentarios > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:underline"
            >
              {post.totalComentarios} comentario{post.totalComentarios !== 1 && 's'}
            </button>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
        {/* Botón de reacciones */}
        <div className="relative flex-1">
          <button
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            onClick={() => handleReaction(TipoReaccion.LIKE)}
            disabled={isLoadingReaction}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
              userReaction ? reactionColor : 'text-gray-600'
            }`}
          >
            <CurrentReactionIcon className="w-5 h-5" />
            <span className="font-medium text-sm">
              {userReaction ? REACTION_ICONS[userReaction].label : 'Me gusta'}
            </span>
          </button>

          {/* Selector de reacciones */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-full shadow-2xl border border-gray-200 px-2 py-2 flex space-x-1"
              >
                {Object.entries(REACTION_ICONS).map(([tipo, { icon: Icon, color, label }]) => (
                  <button
                    key={tipo}
                    onClick={() => handleReaction(tipo as TipoReaccion)}
                    className="group relative p-2 hover:scale-125 transition-transform"
                    title={label}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botón de comentarios */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Comentar</span>
        </button>

        {/* Botón de compartir */}
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <Share2 className="w-5 h-5" />
          <span className="font-medium text-sm">Compartir</span>
        </button>
      </div>

      {/* Sección de comentarios */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-4">
              <p className="text-center text-gray-500 text-sm">
                Sección de comentarios próximamente...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
