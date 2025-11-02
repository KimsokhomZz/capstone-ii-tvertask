import Header from "../../components/header";
import { Target } from "lucide-react";
import { useState } from "react";
import TaskBar from "@/components/taskbar";
import { useNavigate } from "react-router-dom";

export default function TodoList() {
  const navigate = useNavigate();
  const tasks = [
    { id: 1, name: "Task 1", duration: "25m" },
    { id: 2, name: "Task 2", duration: "45m" },
    { id: 3, name: "Task 3", duration: "25m" },
    { id: 4, name: "Task 4", duration: "45m" },
    { id: 5, name: "Task 5", duration: "25m" },
  ];

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
            label={task.name}
            duration={task.duration}
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
