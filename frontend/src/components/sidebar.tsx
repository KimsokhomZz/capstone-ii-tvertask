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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Focus", icon: <Target size={18} />, path: "/focus" },
    { name: "Leaderboard", icon: <Trophy size={18} />, path: "/leaderboard" },
    { name: "Avatar", icon: <User size={18} />, path: "/avatar" },
    { name: "Analytics", icon: <BarChart2 size={18} />, path: "/analytics" },
  ];

  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-white border-r shadow-sm">
      <div>
        <div className="p-6 text-2xl font-bold text-yellow-500">Questify</div>

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isFocus = item.path === "/focus";
            const isPomodoro = location.pathname.startsWith("/pomodoro/");
            const isActive = isFocus ? (location.pathname === "/focus" || isPomodoro) : location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-gray-700 hover:bg-yellow-100 ${
                  isActive ? "bg-yellow-100 text-yellow-700 font-medium" : ""
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-col text-sm text-gray-500 space-y-2">
          <button className="flex items-center gap-2">
            <Bell size={16} /> Notifications
          </button>
          <button className="flex items-center gap-2">
            <Settings size={16} /> Settings
          </button>
          <button className="flex items-center gap-2">
            <HelpCircle size={16} /> Support
          </button>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 text-gray-600"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
