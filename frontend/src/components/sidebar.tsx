import React, { useContext, useEffect, useState } from "react";
import {
  Home,
  Target,
  Trophy,
  User,
  BarChart2,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext, { useAuth } from "@/context/AuthContext";
import { NotificationContext } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { moods } from "@/utils/moods";

interface SidebarProps {
  onLogout?: () => void;
}

interface AuthContextType {
  user: { id: string } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext) as AuthContextType;
  const { unreadCount, fetchUnreadCount } = useContext(NotificationContext)!;

  const [selectedMood, setSelectedMood] = useState<number | null>(() => {
    const stored = localStorage.getItem("selectedMood");
    return stored !== null ? Number(stored) : null;
  });

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount(Number(user.id));
      const interval = setInterval(() => {
        fetchUnreadCount(Number(user.id));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id, fetchUnreadCount]);

  // Listen to localStorage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("selectedMood");
      setSelectedMood(stored !== null ? Number(stored) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also poll localStorage for changes within the same tab
    const interval = setInterval(() => {
      const stored = localStorage.getItem("selectedMood");
      const current = stored !== null ? Number(stored) : null;
      if (current !== selectedMood) {
        setSelectedMood(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedMood]);

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
      navigate("/login");
    } catch {
      // Silent error handling
    }
  };

  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (logoutPending) {
      setCountdown(5);
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      timeout = setTimeout(async () => {
        // finalize logout after 5s
        try {
          await logout();
          if (onLogout) onLogout();
          navigate("/login");
        } catch {
          // ignore
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutPending]);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Focus", icon: <Target size={20} />, path: "/focus" },
    { name: "Leaderboard", icon: <Trophy size={20} />, path: "/leaderboard" },
    { name: "Avatar", icon: <User size={20} />, path: "/avatar" },
    { name: "Analytics", icon: <BarChart2 size={20} />, path: "/analytics" },
  ];

  return (
    <aside
      className={`flex flex-col justify-between h-screen w-64 shadow-xl transition-colors ${
        darkMode ? "bg-[#101828]" : "bg-white"
      }`}
    >
      <div>
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-4"
        >
          <div
            className={`relative w-full border-b-2 ${
              darkMode ? "border-yellow-600" : "border-yellow-200"
            } pb-4 flex justify-center items-center`}
          >
            <img
              src={
                darkMode ? "../src/assets/Tver.svg" : "../src/assets/Logo1.svg"
              }
              alt="TverTask Logo"
              className="w-48 object-contain rounded-2xl"
            />
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="space-y-2 px-4">
          {menuItems.map((item, index) => {
            const isFocus = item.path === "/focus";
            const isPomodoro = location.pathname.startsWith("/pomodoro/");
            const isActive = isFocus
              ? location.pathname === "/focus" || isPomodoro
              : location.pathname === item.path;
            return (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-yellow-400 to-yellow-500 text-white font-semibold shadow-lg"
                    : darkMode
                    ? "text-gray-300 hover:bg-[#1a2f42] hover:text-yellow-400"
                    : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-3">
        {/* Bottom Actions */}
        <div className="space-y-2">
          {[
            {
              label: "Settings",
              icon: <Settings size={18} />,
              path: "/profile",
            },
            {
              label: "Support",
              icon: <HelpCircle size={18} />,
              path: "/sopport",
            },
          ].map(({ label, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <motion.button
                key={label}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(path)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? darkMode
                      ? "bg-[#1a2f42] text-yellow-400 font-semibold shadow-sm"
                      : "bg-yellow-100 text-yellow-700 font-semibold shadow-sm"
                    : darkMode
                    ? "text-gray-400 hover:text-yellow-400 hover:bg-[#1a2f42]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {icon}
                <span>{label}</span>
              </motion.button>
            );
          })}

          {/* Notifications with Badge */}
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/notifications")}
            aria-current={
              location.pathname === "/notifications" ? "page" : undefined
            }
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition-all text-sm ${
              location.pathname === "/notifications"
                ? darkMode
                  ? "bg-[#1a2f42] text-yellow-400 font-semibold shadow-sm"
                  : "bg-yellow-100 text-yellow-700 font-semibold shadow-sm"
                : darkMode
                ? "text-gray-400 hover:text-yellow-400 hover:bg-[#1a2f42]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Mood Display - Moved above logout */}
        {selectedMood !== null && moods[selectedMood] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-3 shadow-md hover:shadow-lg transition-all ${
              darkMode
                ? "bg-[#1a2f42] border-2 border-yellow-600"
                : "bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">
                {moods[selectedMood].emoji}
              </span>
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    darkMode ? "text-yellow-400" : "text-purple-500"
                  }`}
                >
                  Current Mood
                </span>
                <span
                  className={`text-sm font-bold truncate ${
                    darkMode ? "text-yellow-300" : "text-purple-700"
                  }`}
                >
                  {moods[selectedMood].label}
                </span>
              </div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shrink-0"></div>
            </div>
          </motion.div>
        )}

        {/* Logout Section */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogoutModal(true)}
          className={`flex items-center gap-3 w-full py-3 px-3 rounded-2xl transition-all border shadow-sm hover:shadow-md ${
            darkMode
              ? "bg-[#1a2f42] hover:bg-[#253548] border-yellow-600 hover:border-yellow-500"
              : "bg-linear-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-yellow-200"
          }`}
        >
          <div className="bg-linear-to-br from-yellow-400 to-orange-500 rounded-full p-2 shrink-0 shadow-md">
            <LogOut size={18} className="text-white" />
          </div>
          <div className="text-left flex-1">
            <div
              className={`text-sm font-semibold ${
                darkMode ? "text-yellow-300" : "text-gray-800"
              }`}
            >
              Logout
            </div>
            <div
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              See you later! 👋
            </div>
          </div>
        </motion.button>
      </div>

      {/* Logout confirmation modal (modernized) */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity ${
          showLogoutModal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget && !logoutPending)
            setShowLogoutModal(false);
        }}
      >
        <div
          className={`rounded-2xl p-6 w-96 shadow-2xl transform transition-all ${
            showLogoutModal
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 -translate-y-2"
          } ${
            darkMode
              ? "bg-[#1d2942] text-white border border-[#253548]"
              : "bg-white text-black"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="flex-1">
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Confirm Logout
              </h3>
              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-yellow-200/80" : "text-gray-500"
                }`}
              >
                You're about to sign out. Confirm to end your session and return
                to the login screen.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div
              className={`mb-4 text-sm ${
                darkMode ? "text-yellow-200/70" : "text-gray-500"
              }`}
            >
              This action will not delete any data. You can cancel now to stay
              signed in.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  if (!logoutPending) setShowLogoutModal(false);
                }}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  darkMode
                    ? "bg-transparent border-[#2a3f5f] text-yellow-200 hover:bg-[#253548]"
                    : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                disabled={logoutPending}
              >
                Cancel
              </button>

              <button
                onClick={() => setLogoutPending(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60"
                disabled={logoutPending}
              >
                {logoutPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Confirming... ({countdown}s)
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
