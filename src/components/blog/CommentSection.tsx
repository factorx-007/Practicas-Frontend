import React, { useState, useEffect, useCallback } from 'react';
import { Comentario, TipoReaccion, CreateReaccionDTO } from '@/types/social.types';
import { MessageCircle, User, Send, Edit, Trash2, Heart, ThumbsUp, Laugh, Frown, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { socialService } from '@/services/social.service';
import { useAuthStore } from '@/store/authStore';
import { Reaccion } from '@/types/social.types';
import Image from 'next/image';

interface CommentSectionProps {
  postId: string;
  initialComments: Comentario[];
  totalInitialComments: number;
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

const CommentItem: React.FC<{ comment: Comentario; postId: string; onCommentUpdated: () => void }> = ({ comment, postId, onCommentUpdated }) => {
  const user = useAuthStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.contenido);
  const isAuthor = user?.id === comment.autorId;

  const handleUpdateComment = async () => {
    if (editedContent.trim() === comment.contenido) {
      setIsEditing(false);
      return;
    }
    try {
      await socialService.updateComentario(comment.id, { contenido: editedContent });
      onCommentUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      alert('Error al actualizar el comentario. Por favor, inténtalo de nuevo.');
    }
  };

  const handleDeleteComment = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await socialService.deleteComentario(comment.id);
        onCommentUpdated();
      } catch (error) {
        console.error('Error al eliminar comentario:', error);
        alert('Error al eliminar el comentario. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleToggleReaction = async (tipo: TipoReaccion) => {
    if (!user) return;

    const reactionData: CreateReaccionDTO = {
      tipo,
      comentarioId: comment.id,
    };

    try {
      await socialService.toggleReaccion(reactionData);
      onCommentUpdated(); // Refrescar para obtener el nuevo estado de reacciones
    } catch (error) {
      console.error('Error al procesar la reacción en comentario:', error);
      alert('Error al procesar la reacción. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {comment.autor?.avatar ? (
            <Image
              src={comment.autor.avatar}
              alt={comment.autor.nombre || 'Autor'}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-semibold text-gray-800">{comment.autor?.nombre} {comment.autor?.apellido}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{format(new Date(comment.createdAt), 'dd MMM yyyy', { locale: es })}</span>
          </div>
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-gray-600 rounded-md hover:bg-gray-100">Cancelar</button>
                <button onClick={handleUpdateComment} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-1">{comment.contenido}</p>
          )}

          {/* Reacciones del comentario - Estilo Facebook */}
          <div className="flex items-center mt-2">
            <div className="flex items-center space-x-1 text-gray-500 text-xs">
              <Heart className="w-3 h-3 text-red-500 fill-current" />
              <span>{comment.reacciones?.length || 0}</span>
            </div>
          </div>

          {/* Botones de reacción - Estilo Facebook */}
          <div className="flex space-x-1 mt-2">
            {Object.values(TipoReaccion).map((tipo: TipoReaccion) => {
              const Icon = reactionIcons[tipo];
              const userHasReacted = comment.reacciones?.some((r: Reaccion) => r.usuarioId === user?.id && r.tipo === tipo);
              return (
                <button
                  key={tipo.toString()}
                  onClick={() => handleToggleReaction(tipo)}
                  className={`p-1 rounded-full transition-colors ${userHasReacted ? `${reactionColors[tipo]} bg-gray-100` : 'text-gray-400 hover:bg-gray-100'}`}
                  title={reactionLabels[tipo]}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {isAuthor && !isEditing && (
            <div className="flex items-center space-x-2 mt-2">
              <button onClick={() => setIsEditing(true)} className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                <Edit className="w-4 h-4 mr-1" /> Editar
              </button>
              <button onClick={handleDeleteComment} className="flex items-center text-red-600 hover:text-red-800 text-sm">
                <Trash2 className="w-4 h-4 mr-1" /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.respuestas && comment.respuestas.length > 0 && (
        <div className="ml-10 mt-4 space-y-4">
          {comment.respuestas.map((reply: Comentario) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} onCommentUpdated={onCommentUpdated} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentSection({ postId, initialComments, totalInitialComments }: CommentSectionProps) {
  const user = useAuthStore(state => state.user);
  const [comments, setComments] = useState<Comentario[]>(initialComments);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(totalInitialComments);
  const limit = 5; // Comentarios por página

  const fetchComments = useCallback(async () => {
    try {
      const response = await socialService.getComentarios({
        postId,
        page,
        limit,
        incluirRespuestas: true,
        orderBy: 'createdAt',
        order: 'asc',
      });
      setComments(response.comentarios);
      setTotalComments(response.pagination.total);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      alert('Error al cargar comentarios. Por favor, recarga la página.');
    }
  }, [postId, page, limit]);

  useEffect(() => {
    fetchComments();
  }, [postId, page, limit, fetchComments]);

  const handleAddComment = async () => {
    if (newCommentContent.trim() === '') return;
    if (!user) return; // O manejar redirección a login

    try {
      await socialService.createComentario({
        postId,
        contenido: newCommentContent,
      });
      setNewCommentContent('');
      fetchComments(); // Recargar comentarios
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      alert('Error al añadir el comentario. Por favor, inténtalo de nuevo.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalComments / limit);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <MessageCircle className="w-6 h-6 mr-2 text-blue-500" />
        Comentarios ({totalComments})
      </h3>

      {user && (
        <div className="mb-6 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.nombre || 'Usuario'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Escribe un comentario..."
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5 mr-2" /> Enviar Comentario
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((commentItem: Comentario) => (
            <CommentItem key={commentItem.id} comment={commentItem} postId={postId} onCommentUpdated={fetchComments} />
          ))
        ) : (
          <p className="text-gray-600 text-center py-4">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >Anterior</button>
          <span className="text-gray-700">Página {page} de {totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >Siguiente</button>
        </div>
      )}
    </div>
  );
}