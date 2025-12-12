import React, { useContext, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext, { useAuth } from "@/context/AuthContext";
import { NotificationContext } from "@/context/NotificationContext";

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { user } = useContext(AuthContext) as any;
  const { unreadCount, fetchUnreadCount } = useContext(NotificationContext)!;

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount(user.id);
      const interval = setInterval(() => {
        fetchUnreadCount(user.id);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id, fetchUnreadCount]);

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
      navigate("/login");
    } catch (error) {
      // Silent error handling
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Focus", icon: <Target size={20} />, path: "/focus" },
    { name: "Leaderboard", icon: <Trophy size={20} />, path: "/leaderboard" },
    { name: "Avatar", icon: <User size={20} />, path: "/avatar" },
    { name: "Analytics", icon: <BarChart2 size={20} />, path: "/analytics" },
  ];

  return (
    <aside className="flex flex-col justify-between h-screen w-64 shadow-xl">
      <div>
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 pb-8"
        >
          <div className="relative w-full border-b-2 border-yellow-200 pb-4">
            <img
              src="../src/assets/logo1.svg"
              alt="TverTask Logo"
              className="w-full h-full object-contain rounded-2xl"
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
              path: "/support",
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
                    ? "bg-yellow-100 text-yellow-700 font-semibold shadow-sm"
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
                ? "bg-yellow-100 text-yellow-700 font-semibold shadow-sm"
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

        {/* Logout Section */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full bg-linear-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 py-3 px-3 rounded-2xl transition-all border border-yellow-200 shadow-sm hover:shadow-md"
        >
          <div className="bg-linear-to-br from-yellow-400 to-orange-500 rounded-full p-2 shrink-0 shadow-md">
            <LogOut size={18} className="text-white" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-gray-800">Logout</div>
            <div className="text-xs text-gray-500">See you later! 👋</div>
          </div>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
