import React, { createContext, useState, useCallback } from "react";
import {
  type Notification,
  getUserNotifications,
  getUnreadCount,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationApi,
  deleteAllNotifications as deleteAllNotificationsApi,
} from "@/api/notificationApi";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (
    userId: number,
    options?: { limit?: number; offset?: number; unreadOnly?: boolean }
  ) => Promise<void>;
  fetchUnreadCount: (userId: number) => Promise<void>;
  markAsRead: (userId: number, notificationIds: number[]) => Promise<void>;
  markAllAsRead: (userId: number) => Promise<void>;
  deleteNotification: (notificationId: number, userId: number) => Promise<void>;
  deleteAllNotifications: (userId: number) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (
      userId: number,
      options?: { limit?: number; offset?: number; unreadOnly?: boolean }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserNotifications(userId, options);
        setNotifications(response.data);
        setUnreadCount(response.unreadCount);
      } catch (err: any) {
        setError(err.message || "Failed to fetch notifications");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchUnreadCount = useCallback(async (userId: number) => {
    try {
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (err: any) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

  const markAsRead = useCallback(
    async (userId: number, notificationIds: number[]) => {
      try {
        await markNotificationsAsRead(userId, notificationIds);

        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notificationIds.includes(notif.id)
              ? { ...notif, read: true }
              : notif
          )
        );

        // Update unread count
        const wasUnread = notifications.filter(
          (n) => notificationIds.includes(n.id) && !n.read
        ).length;
        setUnreadCount((prev) => Math.max(0, prev - wasUnread));
      } catch (err: any) {
        console.error("Error marking notifications as read:", err);
        throw err;
      }
    },
    [notifications]
  );

  const markAllAsRead = useCallback(async (userId: number) => {
    try {
      await markAllNotificationsAsRead(userId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: number, userId: number) => {
      try {
        await deleteNotificationApi(notificationId, userId);

        // Update local state
        const notification = notifications.find((n) => n.id === notificationId);
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err: any) {
        console.error("Error deleting notification:", err);
        throw err;
      }
    },
    [notifications]
  );

  const deleteAllNotifications = useCallback(async (userId: number) => {
    try {
      await deleteAllNotificationsApi(userId);

      // Update local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      console.error("Error deleting all notifications:", err);
      throw err;
    }
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
