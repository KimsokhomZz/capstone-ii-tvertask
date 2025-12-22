import React from "react";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { Task } from "../../api/taskApi";

interface DashboardTasksSectionProps {
  activeTab: string;
  completedTasks: number;
  totalTasks: number;
  showCompleted: boolean;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
  loadingTasks: boolean;
  userTasks: Task[];
  visibleTasks: Task[];
  handleEditTask: (task: Task) => void;
  handleDeleteTask: (id: number, name: string) => void;
}

const DashboardTasksSection: React.FC<DashboardTasksSectionProps> = ({
  activeTab,
  completedTasks,
  totalTasks,
  showCompleted,
  setShowCompleted,
  setShowCreateModal,
  loadingTasks,
  userTasks,
  visibleTasks,
  handleEditTask,
  handleDeleteTask,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm mb-8 ${
        darkMode ? "bg-[#1d2942]" : "bg-white"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            {activeTab} Tasks
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {completedTasks}/{totalTasks} completed
          </div>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className={`border px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              darkMode
                ? "border-gray-600 text-white hover:bg-gray-700/50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {showCompleted ? "Hide" : "Show"} completed
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
          >
            + Add task
          </button>
        </div>
      </div>

      {loadingTasks ? (
        <div
          className={`text-center py-12 ${
            darkMode ? "text-gray-400" : "text-gray-400"
          }`}
        >
          Loading tasks...
        </div>
      ) : userTasks.length === 0 ? (
        <div className="text-center py-12">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              darkMode ? "bg-yellow-500/20" : "bg-yellow-100"
            }`}
          >
            <span className="text-3xl">📝</span>
          </div>
          <h4
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No tasks found
          </h4>
          <p
            className={`text-sm mb-4 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Add your tasks to grow your avatar 🌱
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
          >
            + Add your task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className={`flex justify-between items-center p-5 border rounded-2xl transition-all outline-none cursor-pointer ${
                task.status === "completed"
                  ? darkMode
                    ? "bg-gray-700/20 border-gray-600"
                    : "bg-gray-50 border-gray-200 shadow-sm"
                  : darkMode
                  ? "bg-[#1d2942] border-gray-600 hover:border-yellow-400/50 hover:shadow-sm"
                  : "bg-white border-gray-200 hover:border-yellow-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span
                  className={`font-semibold text-base select-none truncate ${
                    task.status === "completed"
                      ? darkMode
                        ? "line-through text-gray-500"
                        : "line-through text-gray-400"
                      : darkMode
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-xl shadow-sm ${
                    task.status === "completed"
                      ? darkMode
                        ? "bg-gray-700/40 text-gray-500"
                        : "bg-gray-100 text-gray-400"
                      : darkMode
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-linear-to-r from-yellow-100 to-orange-100 text-yellow-700"
                  }`}
                >
                  <Clock size={16} />
                  <span>{task.focus_time}m</span>
                </div>

                <button
                  onClick={() => handleEditTask(task)}
                  className={`p-2 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                    darkMode
                      ? "bg-gray-700/30 border-gray-600 text-white hover:bg-yellow-500/20 hover:border-yellow-400/50 hover:text-yellow-400"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
                  }`}
                  aria-label="Edit task"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDeleteTask(task.id, task.title)}
                  className={`p-2 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                    darkMode
                      ? "bg-gray-700/30 border-gray-600 text-white hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-400"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                  }`}
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardTasksSection;
