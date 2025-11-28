'use client';

import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Bienvenido a ProTalent',
            message: 'Gracias por unirte a nuestra plataforma. Completa tu perfil para empezar.',
            date: 'Hace 2 horas',
            read: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'Nueva oferta recomendada',
            message: 'Hemos encontrado una oferta que coincide con tu perfil: Desarrollador Frontend Junior.',
            date: 'Hace 1 día',
            read: true,
            type: 'job'
        }
    ]);

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                    <p className="text-gray-600 mt-1">Mantente al día con tus actividades</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Marcar todas como leídas
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'job' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                                                title="Marcar como leída"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tienes notificaciones</h3>
                        <p className="text-gray-500 mt-2">Te avisaremos cuando haya novedades importantes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
