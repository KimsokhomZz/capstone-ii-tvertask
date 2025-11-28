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
import ThemeGallery, { type ThemeOption } from "../../components/ThemeGallery";
import { awardXp } from "../../api/userXpApi";

type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const { darkMode } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showMusic, setShowMusic] = useState(false); // added state
  const [transparentCards, setTransparentCards] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bgId, setBgId] = useState<string | undefined>(undefined);
  const bgOptions: ThemeOption[] = [
    // None option - available in both themes
    { 
      id: "none", 
      name: "None", 
      light: { 
        className: "", 
        preview: "bg-white" 
      },
      dark: { 
        className: "dark:bg-black", 
        preview: "bg-black" 
      }
    },
    // Light theme only options
    {
      id: "sunset",
      name: "Sunset",
      light: {
        className: "bg-gradient-to-br from-orange-300/40 via-pink-300/30 to-fuchsia-300/40",
        preview: "bg-gradient-to-br from-orange-100 via-pink-100 to-fuchsia-100"
      },
      dark: {
        className: "",
        preview: ""
      }
    },
    {
      id: "ocean",
      name: "Ocean",
      light: {
        className: "bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-indigo-600/40",
        preview: "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100"
      },
      dark: {
        className: "",
        preview: ""
      }
    },
    {
      id: "forest",
      name: "Forest",
      light: {
        className: "bg-gradient-to-br from-emerald-400/40 via-teal-400/30 to-lime-400/40",
        preview: "bg-gradient-to-br from-emerald-100 via-teal-100 to-lime-100"
      },
      dark: {
        className: "",
        preview: ""
      }
    },
    {
      id: "ice",
      name: "Ice",
      light: {
        className: "bg-gradient-to-br from-blue-200 to-cyan-200",
        preview: "bg-gradient-to-br from-blue-100 to-cyan-100"
      },
      dark: {
        className: "",
        preview: ""
      }
    },
    {
      id: "sunrise",
      name: "Sunrise",
      light: {
        className: "bg-gradient-to-br from-yellow-200 to-pink-300",
        preview: "bg-gradient-to-br from-yellow-100 to-pink-100"
      },
      dark: {
        className: "",
        preview: ""
      }
    },
    // Dark theme only options
    {
      id: "aurora",
      name: "Aurora",
      light: {
        className: "",
        preview: ""
      },
      dark: {
        className: "dark:bg-gradient-to-br dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-fuchsia-900/40",
        preview: "bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-fuchsia-900/80"
      }
    },
    {
      id: "midnight",
      name: "Midnight",
      light: {
        className: "",
        preview: ""
      },
      dark: {
        className: "dark:bg-gradient-to-br dark:from-slate-800/80 dark:via-slate-900/80 dark:to-black/80",
        preview: "bg-gradient-to-br from-slate-800 via-slate-900 to-black"
      }
    },
    {
      id: "dawn",
      name: "Dawn",
      light: {
        className: "",
        preview: ""
      },
      dark: {
        className: "dark:bg-gradient-to-br dark:from-rose-900/30 dark:to-sky-900/30",
        preview: "bg-gradient-to-br from-rose-900/80 to-sky-900/80"
      }
    },
    {
      id: "peaks",
      name: "Peaks",
      light: {
        className: "",
        preview: ""
      },
      dark: {
        className: "dark:bg-gradient-to-b dark:from-slate-800/60 dark:to-slate-900/60",
        preview: "bg-gradient-to-b from-slate-800 to-slate-900"
      }
    },
  ];
  const selectedBg = bgId && bgId !== "none" 
    ? (darkMode 
        ? bgOptions.find((o) => o.id === bgId)?.dark.className ?? ""
        : bgOptions.find((o) => o.id === bgId)?.light.className ?? ""
      ) 
    : "";
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
    <div className={`min-h-screen text-black transition-colors p-4 ${transparentCards && selectedBg ? selectedBg : ""}`}>
      <div className={`max-w-4xl mx-auto space-y-8 ${transparentCards ? "cards-transparent" : ""}`}>
        <div className="flex items-center justify-between">
          <Link
            to="/focus"
            className="inline-flex items-center gap-2 text-black hover:text-black transition-colors rounded-lg px-3 py-2 hover:bg-accent"
          >
            <ArrowLeft size={16} />
            <span>Back To TaskList</span>
          </Link>
          <ThemeCard
            transparent={transparentCards}
            onTransparentChange={setTransparentCards}
            onOpenGallery={() => setGalleryOpen(true)}
          />
        </div>

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

      <div className="bg-card rounded-[28px] shadow-xl border border-border p-6 md:p-8">
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
      <ThemeGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        options={bgOptions}
        selectedId={bgId}
        onSelect={(id) => setBgId(id)}
      />
    </div>
  );
}
