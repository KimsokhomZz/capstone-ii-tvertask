import { useState } from "react";
import PomodoroTimerCard from "../../Components/PomodoroTimerCard";
import MusicCard from "../../Components/MusicCard";
import QuickNoteCard from "../../Components/QuickNoteCard";
import SessionNotesList from "../../Components/SessionNotesList";
import Musictask from "../music/Musictask";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { awardXp } from "../../api/userXpApi";

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

  const getStoredUserId = (): string | number | null => {
    const direct = localStorage.getItem("userId");
    if (direct) return direct;
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    try {
      const u = JSON.parse(userJson);
      return u?.id ?? u?.userId ?? null;
    } catch (e) {
      console.warn("Failed to parse localStorage.user:", e);
      return null;
    }
  };

  // call awardXp from userXpApi
  const onSessionComplete = async () => {
    console.log("onSessionComplete invoked");
    const userId = getStoredUserId();
    console.log("resolved userId:", userId);
    if (!userId) {
      console.warn(
        "No userId in localStorage. User must be signed in to claim XP."
      );
      alert("You must be signed in to award XP.");
      return;
    }
    try {
      console.log("calling awardXp with userId:", userId);
      const result = await awardXp(userId, 20, "pomodoro-complete");
      console.log("awardXp result:", result);
      if (result?.success) {
        console.log("XP awarded:", result.data);
        alert("Awarded 20 XP");
      } else {
        alert("Failed to award XP (server returned unsuccessful).");
      }
    } catch (err) {
      console.error("Failed to award XP", err);
      alert("Error awarding XP. See console for details.");
    }
  };

  const handleAddNote = async () => {
    // Add note locally
    const text = draft?.trim();
    if (!text) {
      alert("Please write a note before adding.");
      return;
    }
    const newNote = { id: Date.now(), text };
    setNotes((prev) => [newNote, ...prev]);
    setDraft("");

    // Award XP for quick note
    try {
      const userId = getStoredUserId();
      if (!userId) {
        // note saved but user not signed in
        alert("Note saved. Sign in to receive XP.");
        return;
      }
      const res = await awardXp(userId, 5, "quick-note");
      if (res?.success) {
        alert("Nice! You earned +5 XP for adding a note.");
      } else {
        console.warn("awardXp response:", res);
        alert("Note saved but awarding XP failed.");
      }
    } catch (err) {
      console.error("Failed to award XP for quick note", err);
      alert("Note saved but error awarding XP. See console for details.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
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

      {/* <div className="mt-4">
        <button
          onClick={onSessionComplete}
          className="px-3 py-2 bg-yellow-400 text-white rounded-md shadow-sm hover:bg-yellow-500"
        >
          Award 20 XP (test)
        </button>
      </div> */}

      <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="space-y-1">
          <p className="text-md text-gray-700">
            <span className="font-medium">Title:</span>{" "}
            <span className="text-yellow-400">{taskTitle}</span>
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            <span className="font-medium">Description:</span>{" "}
            {taskDescription ? (
              <span className="italic text-green-400">{taskDescription}</span>
            ) : (
              <span className="italic text-green-400">
                No description added yet ✨
              </span>
            )}
          </p>
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
        onAdd={handleAddNote}
      />

      <SessionNotesList
        notes={notes}
        setNotes={(fn) => setNotes((prev) => fn(prev))}
      />
    </div>
  );
}
