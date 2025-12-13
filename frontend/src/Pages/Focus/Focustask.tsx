import { useState } from "react";
import PomodoroTimerCard from "../../components/PomodoroTimerCard";
import MusicCard from "../../components/MusicCard";
import QuickNoteCard from "../../components/QuickNoteCard";
import SessionNotesList from "../../components/SessionNotesList";
import Musictask from "../music/Musictask";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ThemeCard from "../../components/ThemeCard";
import ThemeGallery from "../../components/ThemeGallery";
import { themeOptions } from "../../components/ThemeOptions"; // ⬅ NEW IMPORT
import { awardXp } from "../../api/userXpApi";

type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const { darkMode } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showMusic, setShowMusic] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bgId, setBgId] = useState<string>();

  const selectedBg =
    bgId && bgId !== "none"
      ? darkMode
        ? themeOptions.find((o) => o.id === bgId)?.dark?.className ?? ""
        : themeOptions.find((o) => o.id === bgId)?.light?.className ?? ""
      : "";

  const location = useLocation() as {
    state?: { title?: string; description?: string; duration?: number };
  };

  const taskTitle = location.state?.title ?? "Task 1";
  const taskDescription = location.state?.description ?? "";
  const taskDuration =
    typeof location.state?.duration === "number" ? location.state.duration : 25;

  const getStoredUserId = () => {
    const direct = localStorage.getItem("userId");
    if (direct) return direct;

    const json = localStorage.getItem("user");
    if (!json) return null;

    try {
      const u = JSON.parse(json);
      return u?.id ?? u?.userId ?? null;
    } catch {
      return null;
    }
  };

  const onSessionComplete = async () => {
    const userId = getStoredUserId();
    if (!userId) return alert("You must be signed in to award XP.");
    try {
      const res = await awardXp(userId, 20, "pomodoro-complete");
      alert(res?.success ? "Awarded 20 XP" : "Failed to award XP");
    } catch {
      alert("Error awarding XP");
    }
  };

  const handleAddNote = async () => {
    const text = draft.trim();
    if (!text) return alert("Write a note before adding.");

    const newNote = { id: Date.now(), text };
    setNotes((prev) => [newNote, ...prev]);
    setDraft("");

    const userId = getStoredUserId();
    if (!userId) return alert("Note saved, sign in for XP.");

    try {
      const res = await awardXp(userId, 5, "quick-note");
      alert(res?.success ? "+5 XP earned!" : "XP award failed");
    } catch {
      alert("Error awarding XP");
    }
  };

  return (
    <div
      className={`min-h-screen p-4 text-black transition-colors ${selectedBg}`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            to="/focus"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:bg-accent"
          >
            <ArrowLeft size={16} />
            <span>Back To TaskList</span>
          </Link>

          <ThemeCard onOpenGallery={() => setGalleryOpen(true)} />
        </div>

        <PomodoroTimerCard
          taskTitle={taskTitle}
          defaultFocus={taskDuration}
          onComplete={onSessionComplete}
          themeBackground={selectedBg}
        />

        <div className="bg-card rounded-[28px] shadow-xl border p-6 md:p-8">
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

        {showMusic ? (
          <Musictask embedded />
        ) : (
          <MusicCard onOpenMusic={() => setShowMusic(true)} />
        )}

        <QuickNoteCard
          draft={draft}
          setDraft={setDraft}
          tags={tags}
          setTags={setTags}
          onAdd={handleAddNote}
        />

        <SessionNotesList notes={notes} setNotes={setNotes} />
      </div>

      <ThemeGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        options={themeOptions}
        selectedId={bgId}
        onSelect={setBgId}
      />
    </div>
  );
}
