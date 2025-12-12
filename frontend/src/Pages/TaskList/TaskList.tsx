import { useEffect, useState, useContext } from "react";
import TaskBar from "@/components/taskbar";
import { useNavigate } from "react-router-dom";
import TaskForm, { type NewTask } from "@/components/TaskForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Header from "@/components/header";
import { Toast } from "@/components/ConfirmDialog";
import { fetchTask } from "../../api/taskApi";
import {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../../api/taskApi";
import AuthContext from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target } from "lucide-react";

// Use the Task type from your API if possible, otherwise define here:
type Task = {
  id: number;
  title: string;
  description?: string | null;
  focus_time?: number;
  duration?: string;
  name?: string;
};

export default function TodoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const { user } = useContext(
    AuthContext
  ) as import("@/context/AuthContext").AuthContextType;

  useEffect(() => {
    const getTasks = async () => {
      console.log("Fetching tasks...");
      const fetchedTasks = await fetchTask();
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      }
    };
    getTasks();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Update a task (full update)
  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    const updated = await updateTask(id, updates);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast("Task updated successfully!", "success");
    } else {
      showToast("Failed to update task", "error");
    }
  };

  // Update only status
  const handleUpdateTaskStatus = async (id: number, status: string) => {
    const updated = await updateTaskStatus(id, status);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast("Task status updated!", "success");
    } else {
      showToast("Failed to update status", "error");
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("Task deleted!", "success");
    } else {
      showToast("Failed to delete task", "error");
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-md w-full max-w-4xl border border-gray-100">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-1">
          <div>
            {/* <Target className="w-7 h-7 text-white" /> */}
            <span className="text-5xl">🎯</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Focus Session
            </h2>
            <p className="text-sm text-gray-500">Choose your focus task</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </motion.button>
      </motion.div>

      {/* Task Count Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700">
          <span className="font-semibold">{tasks.length}</span>
          <span>{tasks.length === 1 ? "task" : "tasks"}</span>
        </div>
      </motion.div>

      {/* Task List */}
      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No tasks yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your first focus task to get started
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <TaskBar
                  id={task.id}
                  label={task.title || task.name || ""}
                  duration={task.focus_time ?? Number(task.duration) ?? 25}
                  highlighted={selectedId === task.id}
                  checked={!!checkedMap[task.id]}
                  onCheckedChange={(v) => {
                    setCheckedMap((prev) => ({ ...prev, [task.id]: v }));
                    setSelectedId(v ? task.id : null);
                  }}
                  onClick={() =>
                    navigate(`/pomodoro/${task.id}`, {
                      state: {
                        title: task.title || task.name || "",
                        description: task.description ?? "",
                        duration:
                          task.focus_time ?? Number(task.duration) ?? 25,
                        taskId: task.id,
                      },
                    })
                  }
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => setDeleteId(task.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowCreate(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Create Task
              </h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-500 hover:bg-yellow-50 rounded-md px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <TaskForm
              onSubmit={async (t: NewTask) => {
                if (!user) {
                  showToast("User not found. Please log in.", "error");
                  return;
                }
                // Prepare the payload
                const payload = {
                  user_id: user.id,
                  title: t.title,
                  description: t.description,
                  focus_time: Number(t.duration ?? "25"),
                  status: "todo",
                };
                const created = await createTask(payload);
                if (created) {
                  setTasks((prev) => [...prev, created]);
                  setShowCreate(false);
                  showToast("Task created successfully!", "success");
                } else {
                  showToast("Failed to create task", "error");
                }
              }}
              onCancel={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setEditingTask(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-500 hover:bg-yellow-50 rounded-md px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <TaskForm
              initial={{
                title: editingTask.title || editingTask.name || "",
                description: editingTask.description ?? "",
                duration: editingTask.duration ?? "25",
              }}
              onSubmit={async (t: NewTask) => {
                await handleUpdateTask(editingTask.id, {
                  title: t.title,
                  description: t.description,
                  focus_time: Number(t.duration ?? "25"),
                });
                setEditingTask(null);
              }}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={deleteId !== null}
        taskName={
          tasks.find((t) => t.id === deleteId)?.title ||
          tasks.find((t) => t.id === deleteId)?.name ||
          "this task"
        }
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          handleDeleteTask(deleteId);
          setDeleteId(null);
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
