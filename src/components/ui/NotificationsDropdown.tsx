'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, X, Check, Clock, Briefcase, Users, MessageCircle, Star, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'application' | 'message' | 'system' | 'achievement';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
  avatar?: string;
}

interface NotificationsDropdownProps {
  className?: string;
}

export default function NotificationsDropdown({ className = "" }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const getMockNotifications = useCallback((): Notification[] => {
    const baseNotifications: Notification[] = [];

    if (user?.rol === 'ESTUDIANTE') {
      baseNotifications.push(
        {
          id: '1',
          title: 'Nueva oferta recomendada',
          message: 'Desarrollador React Junior en TechCorp coincide con tu perfil',
          type: 'offer',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
          actionUrl: '/offers/1',
          actionText: 'Ver oferta'
        },
        {
          id: '2',
          title: 'Postulación actualizada',
          message: 'Tu postulación para Frontend Developer ha pasado a entrevista',
          type: 'application',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          actionUrl: '/applications/2',
          actionText: 'Ver estado'
        },
        {
          id: '3',
          title: 'Nuevo mensaje',
          message: 'TechStart te ha enviado un mensaje sobre tu postulación',
          type: 'message',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          actionUrl: '/chat/techstart',
          actionText: 'Leer mensaje'
        }
      );
    } else if (user?.rol === 'EMPRESA') {
      baseNotifications.push(
        {
          id: '1',
          title: 'Nueva postulación',
          message: 'Juan Pérez se ha postulado a Desarrollador Senior',
          type: 'application',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
          actionUrl: '/candidates/juan-perez',
          actionText: 'Ver candidato'
        },
        {
          id: '2',
          title: 'Oferta por expirar',
          message: 'La oferta "Marketing Digital" expira en 3 días',
          type: 'system',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          actionUrl: '/offers/my-offers',
          actionText: 'Extender plazo'
        }
      );
    }

    // Common notifications
    baseNotifications.push(
      {
        id: '4',
        title: 'Perfil destacado',
        message: 'Tu perfil ha sido visto 50 veces esta semana',
        type: 'achievement',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        actionUrl: '/profile',
        actionText: 'Ver estadísticas'
      },
      {
        id: '5',
        title: 'Actualización del sistema',
        message: 'Nuevas funciones disponibles en la plataforma',
        type: 'system',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        actionUrl: '/help/whats-new',
        actionText: 'Ver novedades'
      }
    );

    return baseNotifications;
  }, [user?.rol]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load notifications when opened
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setNotifications(getMockNotifications());
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, getMockNotifications, notifications.length]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'offer': return Briefcase;
      case 'application': return Users;
      case 'message': return MessageCircle;
      case 'achievement': return Star;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'offer': return 'text-blue-600 bg-blue-50';
      case 'application': return 'text-green-600 bg-green-50';
      case 'message': return 'text-purple-600 bg-purple-50';
      case 'achievement': return 'text-yellow-600 bg-yellow-50';
      case 'system': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition-colors duration-200"
      >
        <span className="sr-only">Ver notificaciones</span>
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando notificaciones...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No tienes notificaciones</p>
                <p className="text-xs text-gray-400 mt-1">Te notificaremos cuando haya algo nuevo</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`relative px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {notification.message}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                  title="Marcar como leído"
                                >
                                  <Check className="w-3 h-3 text-gray-500" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                title="Eliminar notificación"
                              >
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>

                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {notification.actionText}
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <a
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas las notificaciones
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}