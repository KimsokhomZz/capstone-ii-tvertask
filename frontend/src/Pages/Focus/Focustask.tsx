import { useState } from "react";
import PomodoroTimerCard from "../../Components/PomodoroTimerCard";
import QuickNoteCard from "../../Components/QuickNoteCard";
import SessionNotesList from "../../Components/SessionNotesList";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const location = useLocation() as {
    state?: { title?: string; description?: string };
  };
  const taskTitle = location.state?.title ?? "Task 1";
  const taskDescription = location.state?.description ?? "";
  const taskDuration = (() => {
    const d = (location as any).state?.duration;
    const n =
      typeof d === "string" ? parseInt(d, 10) : typeof d === "number" ? d : 25;
    return Number.isFinite(n) && n > 0 ? n : 25;
  })();

  return (
    <div className="space-y-8">
      <Link
        to="/focus"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 rounded-lg px-2 py-1 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-gray-600">Back To TaskList</span>
      </Link>

      <PomodoroTimerCard taskTitle={taskTitle} defaultFocus={taskDuration} />

      <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Title:</span> {taskTitle}
          </p>
          {taskDescription && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              <span className="font-medium">Description:</span>{" "}
              {taskDescription}
            </p>
          )}
        </div>
      </div>

      <QuickNoteCard
        draft={draft}
        setDraft={setDraft}
        tags={tags}
        setTags={(fn) => setTags((prev) => fn(prev))}
        onAdd={() => {
          if (!draft.trim()) return;
          setNotes((prev) => [{ id: Date.now(), text: draft.trim() }, ...prev]);
          setDraft("");
        }}
      />

      <SessionNotesList
        notes={notes}
        setNotes={(fn) => setNotes((prev) => fn(prev))}
      />
    </div>
  );
}
