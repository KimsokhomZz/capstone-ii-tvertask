import { useState } from "react";
import PomodoroTimerCard from "../../Components/PomodoroTimerCard";
import MusicCard from "../../Components/MusicCard";
import QuickNoteCard from "../../Components/QuickNoteCard";
import SessionNotesList from "../../Components/SessionNotesList";
import Musictask from "../music/Musictask"; // added import
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { awardXp } from "@/api/userXpApi"; // <-- add this import

type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showMusic, setShowMusic] = useState(false);
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

  // call awardXp from userXpApi
  const onSessionComplete = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const result = await awardXp(userId, 20, "pomodoro-complete");
      if (result?.success) {
        console.log("XP awarded:", result.data);
        // OPTIONAL: refresh XP/status, show toast, update local UI
        // e.g. await getStatus(userId) or set local state
      }
    } catch (err) {
      console.error("Failed to award XP", err);
    }
  };

  return (
    <div className="space-y-8">
      <Link
        to="/focus"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 rounded-lg px-2 py-1 transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-gray-600">Back To TaskList</span>
      </Link>

      <PomodoroTimerCard
        taskTitle={taskTitle}
        defaultFocus={taskDuration}
        onComplete={onSessionComplete}
      />

      <div className="mt-4">
        <button
          onClick={onSessionComplete}
          className="px-3 py-2 bg-yellow-400 text-white rounded-md shadow-sm hover:bg-yellow-500"
        >
          Award 20 XP (test)
        </button>
      </div>

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

      {/* render MusicCard or full Musictask when opened */}
      {showMusic ? (
        // request embedded (inline) compact behavior to avoid huge vertical spacing
        <Musictask embedded />
      ) : (
        <MusicCard onOpenMusic={() => setShowMusic(true)} />
      )}

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
