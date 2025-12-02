import { useEffect, useState, useContext } from "react";
import TaskBar from "@/components/taskbar";
import { useNavigate } from "react-router-dom";
import TaskForm, { type NewTask } from "@/components/TaskForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Header from "@/components/header";
import { Toast } from "@/components/ConfirmDialog";
import { fetchTask } from "../../api/taskApi";
import { Target } from "lucide-react";
import {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../../api/taskApi";
import AuthContext from "@/context/AuthContext";

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
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-xl w-full max-w-4xl border border-gray-100">
      <div className="flex items-center justify-between">
        <Header
          title="Focus Session"
          icon={<Target size={23} />}
          titleClassName="text-xs md:text-md"
        />
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-yellow-400 border border-gray-200 hover:bg-yellow-50 hover:shadow-md text-black px-3 py-2 text-sm cursor-pointer transition-colors"
        >
          + Add Task
        </button>
      </div>
      <p className="text-gray-500 mb-4">Choose your focus task</p>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskBar
            key={task.id}
            id={task.id}
            label={task.title || task.name || ""}
            duration={task.focus_time ?? Number(task.duration) ?? 25}
            highlighted={selectedId === task.id}
            checked={!!checkedMap[task.id]}
            onCheckedChange={(v) => {
              setCheckedMap((prev) => ({ ...prev, [task.id]: v }));
              setSelectedId(v ? task.id : null);
              // Example: update status when checked
              // handleUpdateTaskStatus(task.id, v ? "done" : "todo");
            }}
            onClick={() =>
              navigate(`/pomodoro/${task.id}`, {
                state: {
                  title: task.title || task.name || "",
                  description: task.description ?? "",
                  duration: task.focus_time ?? Number(task.duration) ?? 25,
                },
              })
            }
            onEdit={() => setEditingTask(task)}
            onDelete={() => handleDeleteTask(task.id)}
          />
        ))}
      </div>

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
