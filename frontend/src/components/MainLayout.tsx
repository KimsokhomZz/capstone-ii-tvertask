import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function MainLayout() {
  const handleAddTask = () => alert("Add new task clicked!");
  const handleLogout = () => alert("Logged out!");

  return (
    <div className="min-h-screen bg-[#FFFBF6]">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm">
        <Sidebar onAddTask={handleAddTask} onLogout={handleLogout} />
      </aside>
      {/* Scrollable Content */}
      <main className="pl-64">
        <div className="min-h-screen overflow-y-auto">
          <div className="max-w-5xl mx-auto pt-12 px-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
