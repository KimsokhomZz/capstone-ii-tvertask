import Header from "../../components/header";
import { Target } from "lucide-react";
import { useState, useEffect } from "react";
import TaskBar from "@/components/taskbar";
import { useNavigate } from "react-router-dom";
import { fetchTask, type Task } from "../../api/taskApi";

export default function TodoList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

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

  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-xl w-full max-w-4xl border border-gray-100">
      <Header title="Focus Session" icon={<Target size={36} />} />
      <p className="text-gray-500 mb-4">Choose your focus task</p>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskBar
            key={task.id}
            id={task.id}
            label={task.title}
            duration={task.focus_time}
            highlighted={selectedId === task.id}
            checked={!!checkedMap[task.id]}
            onCheckedChange={(v) => {
              setCheckedMap((prev) => ({ ...prev, [task.id]: v }));
              setSelectedId(v ? task.id : null);
            }}
            onClick={() => navigate(`/pomodoro/${task.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
