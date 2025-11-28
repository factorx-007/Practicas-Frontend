'use client';

import { 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  MessageCircle,
  Heart,
  User as UserIcon,
  Share2,
  ThumbsUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { Post, TipoReaccion, CreateReaccionDTO, Comentario } from '@/types/social.types';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import { getRoleColor, getRoleIcon } from './UserHighlights';
import { socialService } from '@/services/social.service';
import { useState, useEffect } from 'react';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onView?: (postId: string) => void;
}

const reactionEmojis: { [key in TipoReaccion]: string } = {
  LIKE: '👍',
  LOVE: '❤️',
  HAHA: '😂',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😠',
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

export default function BlogCard({
  post,
  onEdit,
  onDelete,
  onView
}: PostCardProps) {
  const user = useAuthStore(state => state.user);
  const [userReaction, setUserReaction] = useState<TipoReaccion | null>(null);
  const [totalReactions, setTotalReactions] = useState(post.totalReacciones || 0);
  const [totalComments, setTotalComments] = useState(post.totalComentarios || 0);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comentario[]>(post.comentarios || []);

  useEffect(() => {
    // Initialize user reaction and total reactions from post data
    if (post.yaReaccionado && post.tipoReaccionUsuario) {
      setUserReaction(post.tipoReaccionUsuario as TipoReaccion);
    } else {
      setUserReaction(null);
    }
    setTotalReactions(post.totalReacciones || 0);
    setTotalComments(post.totalComentarios || 0);
    setComments(post.comentarios || []);
  }, [post]);

  const truncateContent = (content: string, maxLength = 120) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  const isAuthor = user?.id === post.autorId;

  const handleToggleReaction = async (tipo: TipoReaccion) => {
    if (!user) return;

    const reactionData: CreateReaccionDTO = {
      tipo,
      postId: post.id,
    };

    try {
      const result = await socialService.toggleReaccion(reactionData);
      
      // Update state based on the result from backend
      if (result && typeof result === 'object') {
        if (result.accion === 'creada') {
          // New reaction created
          setUserReaction(tipo);
          setTotalReactions(prev => prev + 1);
        } else if (result.accion === 'actualizada') {
          // Reaction updated (changed type)
          setUserReaction(tipo);
          // Total reactions count stays the same when changing reaction type
        } else if (result.accion === 'eliminada') {
          // Reaction removed (same reaction clicked again)
          setUserReaction(null);
          setTotalReactions(prev => prev - 1);
        }
        
        // Hide reactions panel after selection
        setShowReactions(false);
        
        // Fetch updated post to ensure we have the latest reaction state
        try {
          const updatedPost = await socialService.getPostById(post.id);
          if (updatedPost.yaReaccionado && updatedPost.tipoReaccionUsuario) {
            setUserReaction(updatedPost.tipoReaccionUsuario as TipoReaccion);
          } else {
            setUserReaction(null);
          }
          setTotalReactions(updatedPost.totalReacciones || 0);
        } catch (fetchError) {
          console.error('Error fetching updated post:', fetchError);
        }
      }
    } catch (error) {
      console.error('Error al procesar la reacción:', error);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Compartir post',
          text: post.contenido.substring(0, 100),
          url: `${window.location.origin}/dashboard/blog/${post.id}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/dashboard/blog/${post.id}`);
        toast.success('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Error al compartir');
    }
  };

  // Removed unused function handleCommentsUpdate

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0,0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className={`
        bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden 
        transform transition-all duration-300 relative group
      `}
    >
      {/* Indicador de privacidad */}
      {post.privado && (
        <Badge variant="secondary" className="absolute top-3 right-3 bg-red-100 text-red-700 z-10">
          Privado
        </Badge>
      )}

      {/* Multimedia (imágenes o videos) */}
      {(post.imagenes && post.imagenes.length > 0) ? (
        <div className="relative w-full h-80 overflow-hidden bg-gray-100 flex items-center justify-center">
          <Image
            src={post.imagenes[0]}
            alt="Imagen del post"
            fill
            style={{ objectFit: 'contain' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (post.videos && post.videos.length > 0) ? (
        <div className="relative w-full h-80 overflow-hidden bg-gray-200 flex items-center justify-center">
          <video controls src={post.videos[0]} className="w-full h-full object-contain" />
        </div>
      ) : (
        <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <UserIcon className="w-20 h-20 text-gray-300 opacity-50" />
        </div>
      )}

      {/* Contenido del post */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        {/* Información del autor */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200">
            {post.autor?.avatar ? (
              <Image
                src={post.autor.avatar}
                alt={post.autor.nombre || 'Autor'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm font-semibold">
                {post.autor?.nombre ? post.autor.nombre.charAt(0) : 'A'}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-base">
              {post.autor?.rol === 'EMPRESA' && post.autor.empresa?.nombre_empresa
                ? post.autor.empresa.nombre_empresa
                : post.autor?.nombre ? `${post.autor.nombre} ${post.autor.apellido}` : 'Autor Desconocido'
              }
            </span>
            {post.autor?.rol && (
              <Badge variant="secondary" className={`text-xs ${getRoleColor(post.autor.rol)}`}>
                {getRoleIcon(post.autor.rol)} {post.autor.rol}
              </Badge>
            )}
          </div>
        </div>

        {/* Título y Contenido */} 
        <Link href={`/dashboard/blog/${post.id}`} className="block mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors mb-2">
            {truncateContent(post.contenido, 70)}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {truncateContent(post.contenido, 150)}
          </p>
        </Link>

        {/* Reacciones - Estilo Facebook */}
        <div className="border-t border-b border-gray-200 py-2 my-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>{totalReactions}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{totalComments} comentarios</span>
            </div>
          </div>
        </div>

        {/* Botones de acción - Estilo Facebook */}
        <div className="relative flex justify-between py-2 border-b border-gray-200 mb-4">
          {/* Botón de reacción */}
          <div 
            className="relative flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex-1"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            <button
              className="flex items-center justify-center w-full"
              onClick={() => setShowReactions(!showReactions)}
            >
              {userReaction ? (
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`text-xl ${reactionColors[userReaction]}`}
                >
                  {reactionEmojis[userReaction]}
                </motion.span>
              ) : (
                <ThumbsUp className="w-5 h-5 mr-2" />
              )}
              <span className={userReaction ? reactionColors[userReaction] : ""}>
                {userReaction ? reactionLabels[userReaction] : "Me gusta"}
              </span>
            </button>

            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex space-x-1 border border-gray-200"
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {Object.values(TipoReaccion).map((tipo: TipoReaccion) => {
                    return (
                      <motion.button
                        key={tipo.toString()}
                        whileHover={{ scale: 1.3, y: -10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleReaction(tipo);
                        }}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 text-2xl hover:bg-gray-100`}
                        title={reactionLabels[tipo]}
                      >
                        {reactionEmojis[tipo]}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón de comentarios */}
          <button
            className={`flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 flex-1 ${
              showComments ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            onClick={handleCommentClick}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            <span>Comentar</span>
            {showComments ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </button>

          {/* Botón de compartir */}
          <button
            className="flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex-1"
            onClick={handleShareClick}
          >
            <Share2 className="w-5 h-5 mr-2" />
            <span>Compartir</span>
          </button>
        </div>

        {/* Metadatos y Estadísticas */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {format(new Date(post.createdAt), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4 text-gray-400" />
              <span>{totalComments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-gray-400" />
              <span>{totalReactions}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-2">
            {onView && (
              <button
                onClick={() => onView(post.id)}
                className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                title="Ver post"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}

            {isAuthor && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(post.id)}
                    className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-50"
                    title="Editar post"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(post.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Eliminar post"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sección de comentarios expandible */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 pt-4 mt-4"
            >
              <CommentSection 
                postId={post.id} 
                initialComments={comments} 
                totalInitialComments={totalComments}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}