import type { Notification } from "@/api/notificationApi";
import { CheckCircle, Trash2, Trophy, Zap, Target, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type ReactElement } from "react";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  compact?: boolean;
}

const iconMap: Record<string, ReactElement> = {
  quest: <Target size={20} className="text-blue-500" />,
  achievement: <Trophy size={20} className="text-yellow-500" />,
  xp: <Zap size={20} className="text-purple-500" />,
  badge: <Award size={20} className="text-green-500" />,
  task: <CheckCircle size={20} className="text-indigo-500" />,
  streak: <Zap size={20} className="text-orange-500" />,
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const icon = iconMap[notification.type] || (
    <CheckCircle size={20} className="text-gray-500" />
  );

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={`${
        notification.read
          ? "bg-white"
          : "bg-gradient-to-r from-[#FFF8E1] to-[#F5F2FF]"
      } p-3 sm:p-4 rounded-2xl sm:rounded-[20px] border ${
        notification.read ? "border-gray-200" : "border-[#FFC94A]/30"
      } hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
              notification.read ? "bg-gray-100" : "bg-white shadow-sm"
            }`}
          >
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4
                className={`text-xs sm:text-sm font-semibold ${
                  notification.read ? "text-gray-700" : "text-gray-900"
                } break-words`}
              >
                {notification.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2 break-words">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1.5 sm:mt-2">{timeAgo}</p>
            </div>

            {/* Actions */}
            {!compact && (
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-green-50 rounded-full transition-all hover:shadow-md hover:scale-110 active:scale-95"
                    title="Mark as read"
                  >
                    <CheckCircle
                      size={16}
                      className="text-green-500 sm:w-[18px] sm:h-[18px]"
                    />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-red-50 rounded-full transition-all hover:shadow-md hover:scale-110 active:scale-95"
                  title="Delete"
                >
                  <Trash2
                    size={16}
                    className="text-red-500 sm:w-[18px] sm:h-[18px]"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact actions */}
      {compact && (
        <div className="flex items-center gap-2 mt-2 ml-8">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-all hover:underline"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-all hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
