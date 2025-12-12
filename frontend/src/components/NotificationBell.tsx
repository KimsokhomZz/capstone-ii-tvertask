import { Bell } from "lucide-react";

interface NotificationBellProps {
  unreadCount: number;
  className?: string;
}

export default function NotificationBell({
  unreadCount,
  className = "",
}: NotificationBellProps) {
  return (
    <div className="relative">
      <button
        className={`relative p-2 hover:bg-accent rounded-lg transition-colors ${className}`}
        aria-label="Notifications"
      >
        <Bell size={24} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
