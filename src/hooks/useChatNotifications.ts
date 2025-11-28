import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useChatNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAuthStore(state => state.user);

  // Por ahora, simulamos mensajes no leídos
  // TODO: Integrar con el backend real cuando esté disponible
  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    // Simulación de mensajes no leídos
    // En el futuro esto se conectará con el store real del chat
    const mockUnreadCount = Math.floor(Math.random() * 5); // 0-4 mensajes simulados
    setUnreadCount(mockUnreadCount);
  }, [user?.id]);

  return {
    unreadCount: unreadCount > 99 ? 99 : unreadCount, // Limitar a 99+ como WhatsApp
    hasUnreadMessages: unreadCount > 0
  };
};