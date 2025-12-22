import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const handleLogout = () => alert("Logged out!");
  const location = useLocation();
  const { darkMode } = useTheme();
  const isFocusPage = location.pathname.includes("/focus");
  const isTaskListPage =
    location.pathname === "/focus" || location.pathname === "/";

  return (
    <div
      className={`min-h-screen flex ${
        darkMode ? "bg-[#101828]" : "bg-[#FFFBF6]"
      }`}
    >
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm z-10">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Main content area - adjust layout based on route */}
      <main
        className={`flex-1 ${
          isFocusPage
            ? "pl-90 pt-10 min-h-screen w-[calc(100%-16rem)]"
            : "pl-64 min-h-screen"
        }`}
      >
        <div
          className={`min-h-screen overflow-y-auto ${
            isTaskListPage
              ? "max-w-5xl mx-auto pt-12 px-4"
              : location.pathname.includes("/pomodoro")
              ? "w-full"
              : "max-w-5xl mx-auto py-12"
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
