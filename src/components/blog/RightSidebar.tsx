import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Zap, MessageCircle, Users, Briefcase, Plus, Filter, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import ChatUsersHighlights from './ChatUsersHighlights';
import AvailableUsersList from './AvailableUsersList';
import JobOffersList from './JobOffersList';
import { notificationsService, Notification } from '@/services/notifications.service';
import { useAuthStore } from '@/store/authStore';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFilters?: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose, onOpenFilters }) => {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const response = await notificationsService.getMyNotifications({ limit: 5 });
      setNotifications(response?.notificaciones || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NUEVA_OFERTA': return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'POSTULACION': return <Users className="w-4 h-4 text-green-500" />;
      case 'MENSAJE': return <MessageCircle className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:static lg:h-[calc(100vh-6rem)] lg:w-full lg:shadow-none lg:bg-transparent lg:z-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-full overflow-y-auto p-4 lg:p-0 space-y-6 custom-scrollbar">
          {/* Mobile Header */}
          <div className="flex justify-between items-center lg:hidden mb-6">
            <h2 className="text-xl font-bold text-gray-900">Panel Derecho</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Actions (Moved from top) */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
            {user && (
              <button
                onClick={() => router.push('/dashboard/blog/create')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              >
                <Plus className="w-5 h-5 mr-2" /> Crear Publicación
              </button>
            )}

            {onOpenFilters && (
              <button
                onClick={onOpenFilters}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
              >
                <Filter className="w-5 h-5 mr-2" /> Filtros
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-bold text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="space-y-2">
              {user?.rol === 'EMPRESA' ? (
                <>
                  <button
                    onClick={() => router.push('/dashboard/offers/create')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                  >
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" /> Publicar oferta
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/candidates')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                  >
                    <Users className="w-4 h-4 mr-2 text-gray-400" /> Buscar candidatos
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/dashboard/offers')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                  >
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" /> Buscar empleo
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
                  >
                    <Users className="w-4 h-4 mr-2 text-gray-400" /> Actualizar perfil
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notifications Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-bold text-gray-900">Notificaciones</h3>
              </div>
              <button onClick={fetchNotifications} className="text-xs text-blue-600 hover:underline">
                Actualizar
              </button>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {isLoadingNotifications ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">No tienes notificaciones nuevas</p>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-3 p-2 rounded-lg transition-colors ${notification.leida ? 'opacity-70' : 'bg-blue-50'}`}>
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {notification.mensaje}
                      </p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(notification.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                    {!notification.leida && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Marcar como leída"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Existing Widgets */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Chats Recientes</h3>
            </div>
            <ChatUsersHighlights />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Usuarios Conectados</h3>
            </div>
            <AvailableUsersList />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <Briefcase className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Ofertas de Trabajo</h3>
            </div>
            <JobOffersList />
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default RightSidebar;