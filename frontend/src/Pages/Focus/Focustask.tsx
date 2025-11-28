import { useState } from "react";
import PomodoroTimerCard from "../../Components/PomodoroTimerCard";
import MusicCard from "../../Components/MusicCard";
import QuickNoteCard from "../../Components/QuickNoteCard";
import SessionNotesList from "../../Components/SessionNotesList";
import Musictask from "../music/Musictask"; // added import
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ThemeCard from "../../Components/ThemeCard";
import ThemeGallery, { type ThemeOption } from "../../Components/ThemeGallery";

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

      <PomodoroTimerCard taskTitle={taskTitle} defaultFocus={taskDuration} />

      <div className="bg-card rounded-[28px] shadow-xl border border-border p-6 md:p-8">
        <div className="space-y-1">
          <p className="text-sm text-foreground">
            <span className="font-medium">Title:</span> {taskTitle}
          </p>
          {taskDescription && (
            <p className="text-sm text-foreground 
            
            
            space-pre-wrap">
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
