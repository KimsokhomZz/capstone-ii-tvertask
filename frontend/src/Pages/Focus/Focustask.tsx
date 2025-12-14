import { useState } from "react";
import PomodoroTimerCard from "../../components/PomodoroTimerCard";
import MusicCard from "../../components/MusicCard";
import QuickNoteCard from "../../components/QuickNoteCard";
import SessionNotesList from "../../components/SessionNotesList";
import Musictask from "../music/Musictask";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ThemeCard from "../../components/ThemeCard";
import ThemeGallery from "../../components/ThemeGallery";
import { themeOptions } from "../../components/ThemeOptions";
import { awardXp } from "../../api/userXpApi";
import useTaskNotes from "../../hooks/useTaskNotes";
import { toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const { darkMode } = useTheme();
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
    state?: { title?: string; description?: string; taskId?: number | string };
  };

  const task: {
    short_break?: number;
    long_break?: number;
  } = {
    short_break: (location.state as any)?.short_break ?? 5,
    long_break: (location.state as any)?.long_break ?? 15,
  };

  const taskTitle = location.state?.title ?? "Task 1";
  const taskDescription = location.state?.description ?? "";
  const taskDuration = (() => {
    const d = (location as any).state?.duration;
    const n =
      typeof d === "string" ? parseInt(d, 10) : typeof d === "number" ? d : 25;
    return Number.isFinite(n) && n > 0 ? n : 25;
  })();
  const params = useParams<{ taskId?: string }>();
  const routeTaskId = params.taskId ? Number(params.taskId) : undefined;
  const stateTaskId = (location.state as any)?.taskId
    ? Number((location.state as any).taskId)
    : undefined;
  // resolved task id (number) or undefined
  const taskId = Number.isFinite(routeTaskId ?? stateTaskId ?? NaN)
    ? routeTaskId ?? stateTaskId
    : undefined;

  const { notes, setNotes, addNote, saveNote, removeNote, loading, error } =
    useTaskNotes(taskId ? Number(taskId) : undefined);

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
      const result = await awardXp(userId, 20, "pomodoro-complete");
      console.log("awardXp result:", result);
    } catch (err) {
      console.error("Failed to award XP", err);
      toastify.error("Failed to award XP. Please try again later. 🚨");
    }
  };

  const handleAddNote = async () => {
    const text = draft?.trim();
    if (!text) {
      toastify.error("Please write a note before adding. 🚨");
      return;
    }

    const tempId = -Date.now();
    setNotes((prev) => [{ id: tempId, text }, ...prev]);
    setDraft("");

    if (!taskId) {
      toastify.info("Note saved locally (no task selected). 📝");
      return;
    }

    try {
      // pass explicit taskId number to avoid hook closure missing id
      const created = await addNote(text, Number(taskId));
      setNotes((prev) =>
        prev.map((n) =>
          n.id === tempId ? { id: created.id, text: created.text } : n
        )
      );
      // Award 5 XP to user
      const userId = getStoredUserId();
      if (userId) {
        await awardXp(userId, 5, "note-add");
        toastify.success("You received 5 XP for adding a note! 🥳");
      }
    } catch (err) {
      console.error("🚨 Failed to save note", err);
      toastify.error("Failed to save note. Please try again. 🚨");
    }
  };

  const handleUpdateRemoteNote = async (id: number, text: string) => {
    await saveNote(id, text);
  };

  const handleDeleteRemoteNote = async (id: number) => {
    await removeNote(id);
  };

  return (
    <div
      className={`min-h-screen p-4 text-black transition-colors ${selectedBg}`}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Link
            to="/focus"
            className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-sm font-medium">Back to TaskList</span>
          </Link>

          <ThemeCard onOpenGallery={() => setGalleryOpen(true)} />
        </div>

        <PomodoroTimerCard
          task={task}
          taskTitle={taskTitle}
          defaultFocus={taskDuration}
          onComplete={onSessionComplete}
          themeBackground={selectedBg}
        />

        <div className="bg-card rounded-[28px] shadow-xl border p-6 md:p-8">
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
                <span className="italic text-gray-400">
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
          setTags={setTags}
          onAdd={handleAddNote}
        />

        <SessionNotesList
          notes={notes}
          setNotes={setNotes}
          onUpdate={handleUpdateRemoteNote}
          onDelete={handleDeleteRemoteNote}
          loading={loading}
          error={error}
        />
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
