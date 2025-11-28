import { useChatNotifications } from '@/hooks/useChatNotifications';
import { cn } from '@/lib/utils';

interface ChatBadgeProps {
  className?: string;
  showOnlyWhenUnread?: boolean;
}

export default function ChatBadge({ className, showOnlyWhenUnread = false }: ChatBadgeProps) {
  const { unreadCount, hasUnreadMessages } = useChatNotifications();

  // Si solo mostrar cuando hay no leídos y no los hay, no renderizar
  if (showOnlyWhenUnread && !hasUnreadMessages) {
    return null;
  }

  // Si no hay mensajes no leídos, mostrar punto verde de "disponible"
  if (!hasUnreadMessages) {
    return (
      <div className={cn(
        "w-2 h-2 bg-green-500 rounded-full",
        className
      )} />
    );
  }

  // Badge con contador de mensajes no leídos
  return (
    <div className={cn(
      "min-w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium",
      unreadCount > 99 ? "px-1" : "w-5",
      className
    )}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  );
}