import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata?: any;
  created_at: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export interface CreateNotificationData {
  user_id: number;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (
  userId: number,
  options?: { limit?: number; offset?: number; unreadOnly?: boolean }
): Promise<NotificationResponse> => {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());
    if (options?.unreadOnly) params.append("unreadOnly", "true");

    const response = await axios.get(
      `${API_BASE_URL}/api/notifications/${userId}?${params.toString()}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: number): Promise<number> => {
  try {
    const response = await axios.get<UnreadCountResponse>(
      `${API_BASE_URL}/api/notifications/${userId}/unread-count`,
      { withCredentials: true }
    );
    return response.data.count;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

/**
 * Create a new notification (typically used by system/admin)
 */
export const createNotification = async (
  data: CreateNotificationData
): Promise<Notification> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/notifications`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Mark specific notifications as read
 */
export const markNotificationsAsRead = async (
  userId: number,
  notificationIds: number[]
): Promise<void> => {
  try {
    await axios.patch(
      `${API_BASE_URL}/api/notifications/${userId}/mark-read`,
      { notificationIds },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (
  userId: number
): Promise<void> => {
  try {
    await axios.patch(
      `${API_BASE_URL}/api/notifications/${userId}/mark-all-read`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (
  notificationId: number,
  userId: number
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`, {
      data: { user_id: userId },
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Delete all notifications for a user
 */
export const deleteAllNotifications = async (userId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/notifications/${userId}/all`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
};
