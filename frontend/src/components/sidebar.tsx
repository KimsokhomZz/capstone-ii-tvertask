import React from "react";
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
  // Plus,
  // Lightbulb,
  // Pencil,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // @ts-ignore

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
    <aside className="flex flex-col justify-between h-screen w-64 bg-linear-to-b from-yellow-50 via-white to-white shadow-lg">
      <div>
        {/* Logo Section */}
        <div className="p-2 pb-8">
          <div className="flex items-center gap-3 mb-1">
            {/* SVG Logo */}
            <div className="relative w-full">
              <img
                src="../src/assets/logo.svg"
                alt="TverTask Logo"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isFocus = item.path === "/focus";
            const isPomodoro = location.pathname.startsWith("/pomodoro/");
            const isActive = isFocus
              ? location.pathname === "/focus" || isPomodoro
              : location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-white font-semibold shadow-lg shadow-yellow-200"
                    : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-4">
        {/* Bottom Actions */}
        <div className="space-y-1">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm">
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all text-sm">
            <HelpCircle size={18} />
            <span>Support</span>
          </button>
        </div>

        {/* Illustration Card */}
        {/* <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
          <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
            <BarChart2
              size={80}
              className="text-purple-400 mx-auto"
              strokeWidth={1.5}
            />
          </div>
        </div> */}

        {/* Add Task Button */}
        {/* <button className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold py-3 px-4 rounded-full shadow-lg shadow-yellow-200 transition-all duration-200 hover:shadow-xl">
          <span className="text-sm">Add a New Task</span>
          <div className="bg-yellow-500 rounded-full p-1">
            <Plus size={16} strokeWidth={3} />
          </div>
        </button> */}

        {/* Logout Section */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full bg-yellow-50 hover:bg-yellow-100 py-2 px-2 rounded-2xl transition-all border border-yellow-100"
        >
          <div className="bg-yellow-400 rounded-full p-2 shrink-0">
            <LogOut size={18} className="text-white" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-gray-800">Logout</div>
            <div className="text-xs text-gray-500">
              Don't stay away too long 😊
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
