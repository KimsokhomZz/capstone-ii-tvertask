import React from "react";
import { Clock, Pencil, Trash2 } from "lucide-react";
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
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
        <h3 className="text-xl font-bold text-black">{activeTab} Tasks</h3>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm text-gray-500">
          {completedTasks}/{totalTasks} completed
        </div>
        <button
          onClick={() => setShowCompleted((v) => !v)}
          className="border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
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
      <div className="text-center py-12 text-gray-400">Loading tasks...</div>
    ) : userTasks.length === 0 ? (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          No tasks found
        </h4>
        <p className="text-gray-500 text-sm mb-4">
          Add your tasks to grow your avatar 🌱
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-yellow-500 hover:text-yellow-600 text-sm font-medium"
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
                ? "bg-gray-50 border-gray-200 shadow-sm"
                : "bg-white border-gray-200 hover:border-yellow-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 cursor-pointer"
              /> */}
              <span
                className={`font-semibold text-base select-none truncate ${
                  task.status === "completed"
                    ? "line-through text-gray-400"
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
                    ? "bg-gray-100 text-gray-400"
                    : "bg-linear-to-r from-yellow-100 to-orange-100 text-yellow-700"
                }`}
              >
                <Clock size={16} />
                <span>{task.focus_time}m</span>
              </div>

              <button
                onClick={() => handleEditTask(task)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 shadow-sm hover:shadow-md transition-all"
                aria-label="Edit task"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDeleteTask(task.id, task.title)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm hover:shadow-md transition-all"
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

export default DashboardTasksSection;
