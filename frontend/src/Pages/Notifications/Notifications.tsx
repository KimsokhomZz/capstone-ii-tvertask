import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "@/context/NotificationContext";
// @ts-ignore
import AuthContext from "@/context/AuthContext";
import NotificationItem from "@/components/NotificationItem";
import { Bell, CheckCheck, Trash2, Search, AlertTriangle } from "lucide-react";
import { Toast, ConfirmDialog } from "@/components/ConfirmDialog";

export default function NotificationsPage() {
  const { user } = useContext(
    AuthContext
  ) as import("@/context/AuthContext").AuthContextType;

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useContext(NotificationContext)!;

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [displayLimit, setDisplayLimit] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id, {
        limit: 100,
      });
    }
  }, [user?.id]);

  // Reset display limit and scroll when filter changes
  useEffect(() => {
    setDisplayLimit(8);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        document.getElementById("notification-search")?.focus();
      }
      // Escape to clear search
      if (e.key === "Escape" && searchQuery) {
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [searchQuery]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleMarkAsRead = async (id: number) => {
    if (!user?.id) return;
    try {
      await markAsRead(user.id, [id]);
      showToast("Notification marked as read");
    } catch (err) {
      showToast("Failed to mark as read", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!user?.id) return;
    try {
      await deleteNotification(id, user.id);
      showToast("Notification deleted");
    } catch (err) {
      showToast("Failed to delete notification", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await markAllAsRead(user.id);
      showToast("All notifications marked as read");
    } catch (err) {
      showToast("Failed to mark all as read", "error");
    }
  };

  const handleDeleteAll = async () => {
    if (!user?.id) return;
    setShowDeleteConfirm(false);

    try {
      await deleteAllNotifications(user.id);
      showToast("All notifications deleted");
    } catch (err) {
      showToast("Failed to delete all notifications", "error");
    }
  };

  // Apply filters
  let filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  // Apply search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredNotifications = filteredNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        n.type.toLowerCase().includes(query)
    );
  }

  const displayedNotifications = filteredNotifications.slice(0, displayLimit);
  const hasMore = filteredNotifications.length > displayLimit;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    const currentScrollHeight = document.documentElement.scrollHeight;
    setTimeout(() => {
      setDisplayLimit((prev) => prev + 8);
      setIsLoadingMore(false);
      // Scroll to where new content starts
      setTimeout(() => {
        const newScrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({
          top: currentScrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            📣 Notifications
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Stay updated with your achievements, quests, and progress
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[28px] shadow-lg border border-gray-100">
        <div className="relative">
          <Search
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            id="notification-search"
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFC94A] focus:border-transparent text-sm transition-all text-gray-900 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-semibold transition-colors"
              aria-label="Clear search"
              title="Clear search (Esc)"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[28px] shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex gap-1.5 sm:gap-2 bg-[#F5F2FF] p-1 rounded-full w-full sm:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                filter === "all"
                  ? "bg-[#FFC94A] text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                filter === "unread"
                  ? "bg-[#FFC94A] text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Mark all read</span>
                <span className="xs:hidden">Mark all</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Delete all</span>
                <span className="xs:hidden">Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Notifications List */}
        {loading && notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="w-12 h-12 border-4 border-[#FFC94A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-12 sm:py-16 text-center px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#F5F2FF] via-[#FFF8E1] to-[#FFC94A]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
              {searchQuery ? (
                <Search size={40} className="text-[#FFC94A] sm:w-12 sm:h-12" />
              ) : (
                <Bell size={40} className="text-[#FFC94A] sm:w-12 sm:h-12" />
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {searchQuery
                ? "No matching notifications"
                : filter === "unread"
                ? "All caught up! 🎉"
                : "No notifications yet"}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto mb-4">
              {searchQuery
                ? `No notifications found matching "${searchQuery}". Try different keywords.`
                : filter === "unread"
                ? "You've read all your notifications. Great job!"
                : "You'll see updates about your quests, achievements, and more here"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 px-5 sm:px-6 py-2 bg-[#FFC94A] text-black rounded-full text-sm font-semibold hover:bg-[#FFD700] transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4 sm:pt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FFC94A] to-[#FFD666] text-black hover:from-[#FFD666] hover:to-[#FFC94A] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden xs:inline">
                        Load More ({filteredNotifications.length - displayLimit}{" "}
                        remaining)
                      </span>
                      <span className="xs:hidden">Load More</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Showing count */}
            <div className="text-center pt-3 sm:pt-4">
              <p className="text-xs text-gray-500">
                Showing {displayedNotifications.length} of{" "}
                {filteredNotifications.length} notifications
              </p>
            </div>
          </>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete All Notifications?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-red-900 font-medium">
                This action cannot be undone
              </p>
              <p className="text-sm text-red-700 mt-1">
                All {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""} will be permanently
                deleted.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
            >
              Delete All
            </button>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
