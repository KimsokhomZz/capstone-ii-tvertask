import Header from "../../Components/header";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";
import TaskBar from "@/Components/taskbar";
import { useNavigate } from "react-router-dom";
import TaskForm, { type NewTask } from "@/Components/TaskForm";
import DeleteConfirmation from "@/Components/DeleteConfirmation";
import { Toast } from "@/Components/ConfirmDialog";

type Task = {
  id: number;
  name: string;
  duration: string;
  description?: string;
};

export default function TodoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem("tasks");
      return raw
        ? (JSON.parse(raw) as Task[])
        : [{ id: 1, name: "Task 1", duration: "25", description: "" }];
    } catch {
      return [{ id: 1, name: "Task 1", duration: "25", description: "" }];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-xl w-full max-w-4xl border border-gray-100">
      <div className="flex items-center justify-between">
        <Header title="Focus Session" icon={<Target size={36} />} />
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-yellow-400 hover:bg-yellow-100 text-black px-3 py-2 text-sm cursor-pointer transition-colors"
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
            label={task.name}
            duration={task.duration}
            highlighted={selectedId === task.id}
            checked={!!checkedMap[task.id]}
            onCheckedChange={(v) => {
              setCheckedMap((prev) => ({ ...prev, [task.id]: v }));
              setSelectedId(v ? task.id : null);
            }}
            onClick={() =>
              navigate(`/pomodoro/${task.id}`, {
                state: {
                  title: task.name,
                  description: task.description ?? "",
                  duration: task.duration,
                },
              })
            }
            onEdit={() => setEditingTask(task)}
            onDelete={() => setDeleteId(task.id)}
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
              onSubmit={(t: NewTask) => {
                setTasks((prev) => [
                  ...prev,
                  {
                    id: prev.length
                      ? Math.max(...prev.map((x) => x.id)) + 1
                      : 1,
                    name: t.title,
                    description: t.description,
                    duration: t.duration ?? "25",
                  },
                ]);
                setShowCreate(false);
                showToast("Task created successfully!", "success");
              }}
              onCancel={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}

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
                title: editingTask.name,
                description: editingTask.description ?? "",
                duration: editingTask.duration,
              }}
              onSubmit={(t: NewTask) => {
                setTasks((prev) =>
                  prev.map((x) =>
                    x.id === editingTask.id
                      ? {
                          ...x,
                          name: t.title,
                          description: t.description,
                          duration: t.duration ?? x.duration,
                        }
                      : x
                  )
                );
                setEditingTask(null);
                showToast("Task updated successfully!", "success");
              }}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={deleteId !== null}
        taskName={tasks.find((t) => t.id === deleteId)?.name ?? "this task"}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId === null) return;
          setTasks((prev) => prev.filter((t) => t.id !== deleteId));
          setCheckedMap((prev) => {
            const copy = { ...prev };
            delete copy[deleteId!];
            return copy;
          });
          if (selectedId === deleteId) setSelectedId(null);
          setDeleteId(null);
          showToast("Task deleted successfully!", "success");
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
