import { useEffect, useState, useContext } from "react";
import TaskBar from "@/components/taskbar";
import { useNavigate } from "react-router-dom";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { fetchTask } from "../../api/taskApi";
import {
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from "../../api/taskApi";
import AuthContext from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target } from "lucide-react";
import CreateTaskModal from "./components/CreateTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import ConfirmCompleteModal from "./components/ConfirmCompleteModal";
import { toast as showToastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use the Task type from your API if possible, otherwise define here:
type Task = {
  id: number;
  title: string;
  description?: string | null;
  focus_time?: number;
  duration?: string;
  name?: string;
  status?: string;
};

// Define NewTask type for creating/updating tasks
type NewTask = {
  title: string;
  description?: string | null;
  duration?: string | number;
};

export default function TodoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmComplete, setConfirmComplete] = useState<null | {
    taskId: number;
    xp: number;
  }>(null);
  const { user } = useContext(
    AuthContext
  ) as import("@/context/AuthContext").AuthContextType;

  useEffect(() => {
    const getTasks = async () => {
      const fetchedTasks = await fetchTask();
      if (fetchedTasks) {
        setTasks(fetchedTasks);
        // Initialize checkedMap based on completed status
        const initialCheckedMap: Record<number, boolean> = {};
        fetchedTasks.forEach((task) => {
          initialCheckedMap[task.id] = task.status === "completed";
        });
        setCheckedMap(initialCheckedMap);
      }
    };
    getTasks();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    showToastify[type](message);
  };

  // Update a task (full update)
  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    const updated = await updateTask(id, updates);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast("Task updated successfully! 🎉", "success");
    } else {
      showToast("Failed to update task. 🚫", "error");
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
  showToast("Task deleted successfully! 🎉", "success");
    } else {
      showToast("Failed to delete task. 🚫", "error");
    }
  };

  // Complete a task
  const handleCompleteTask = async (id: number) => {
    const taskToComplete = tasks.find((task) => task.id === id);
    if (!taskToComplete || !user) return;

    const xp = Math.floor((taskToComplete.focus_time ?? 25) / 5) * 10;

    // Call completeTask API
    const success = await completeTask(user.id, id, xp);
    if (success) {
      // Option 1: Remove the task from the list (if you want to hide completed tasks)
      // setTasks((prev) => prev.filter((t) => t.id !== id));

      // Option 2: Mark as completed in the list (recommended)
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
      );
      setCheckedMap((prev) => ({ ...prev, [id]: true }));
      showToast(`Task completed! You earned ${xp} XP. 🏆`, "success");
    } else {
      showToast("Failed to complete task. 🚫", "error");
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
                  completed={task.status === "completed"}
                  onCheckedChange={(v) => {
                    if (v && task.status !== "completed") {
                      const xp = Math.floor((task.focus_time ?? 25) / 5) * 10;
                      setConfirmComplete({ taskId: task.id, xp });
                    }
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

      <CreateTaskModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={async (t: NewTask) => {
          if (!user) {
            showToast("User not found. Please log in. ⛔", "error");
            return;
          }
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
            showToast("Task created successfully! 🚀", "success");
          } else {
            showToast("Failed to create task. 🚫", "error");
          }
        }}
        user={user}
        showToast={showToast}
        setTasks={setTasks}
        createTask={createTask}
      />

      <EditTaskModal
        editingTask={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={async (t: NewTask) => {
          if (editingTask) {
            await handleUpdateTask(editingTask.id, {
              title: t.title,
              description: t.description,
              focus_time: Number(t.duration ?? "25"),
            });
            setEditingTask(null);
          }
        }}
      />

      <ConfirmCompleteModal
        show={!!confirmComplete}
        onCancel={() => setConfirmComplete(null)}
        onConfirm={async () => {
          if (!user) {
            showToast("⛔ User not found. Please log in.", "error");
            setConfirmComplete(null);
            return;
          }
          if (confirmComplete) {
            const { taskId, xp } = confirmComplete;
            await handleCompleteTask(taskId);
          }
          setConfirmComplete(null);
        }}
      />

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
    </div>
  );
}
