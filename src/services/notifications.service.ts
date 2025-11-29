import axios from '@/lib/axios';

export interface Notification {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: 'NUEVA_OFERTA' | 'POSTULACION' | 'MENSAJE' | 'REACCION' | 'COMENTARIO' | 'SEGUIMIENTO' | 'ACTUALIZACION_PERFIL' | 'SISTEMA';
    destinatarioId: string;
    leida: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
    metadata?: any;
    actionUrl?: string; // Helper for frontend navigation
}

export interface NotificationsResponse {
    notificaciones: Notification[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    noLeidas: number;
}

class NotificationsService {
    async getMyNotifications(params: { page?: number; limit?: number; leida?: boolean } = {}) {
        const response = await axios.get<NotificationsResponse>('/notifications/my', { params });
        return response.data;
    }

    async getUnreadCount() {
        const response = await axios.get<{ count: number }>('/notifications/unread-count');
        return response.data;
    }

    async markAsRead(id: string) {
        const response = await axios.patch(`/notifications/${id}/read`);
        return response.data;
    }

    async markAllAsRead() {
        const response = await axios.patch('/notifications/mark-all-read');
        return response.data;
    }

    async deleteNotification(id: string) {
        await axios.delete(`/notifications/${id}`);
    }
}

export const notificationsService = new NotificationsService();
