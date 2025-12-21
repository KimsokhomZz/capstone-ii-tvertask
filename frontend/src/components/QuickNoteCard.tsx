import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

type QuickNoteCardProps = {
  draft: string;
  setDraft: (v: string) => void;
  tags: string[];
  setTags: (fn: (prev: string[]) => string[]) => void;
  onAdd: () => void;
  themeBackground?: string;
};

export default function QuickNoteCard({
  draft,
  setDraft,
  tags,
  setTags,
  onAdd,
  themeBackground,
}: QuickNoteCardProps) {
  const { darkMode } = useTheme();
  const [error, setError] = useState<string | null>(null);

  // Wrap onAdd to check for empty text
  const handleAdd = () => {
    if (!draft.trim()) {
      setError("Please write a note before adding.");
      return;
    }
    setError(null);
    onAdd();
  };

  return (
    <div
      className={`rounded-[28px] shadow-md border p-6 md:p-8 transition-colors ${
        darkMode
          ? "bg-[#101828] border-[#2a3f5f] text-white"
          : "bg-card border-border text-gray-900"
      }`}
      style={
        themeBackground && themeBackground.includes("url")
          ? {
              backgroundColor: darkMode
                ? "rgba(16, 24, 40, 0.3)"
                : "rgba(255, 255, 255, 0.3)",
            }
          : {}
      }
    >
      <div className="flex items-start justify-between mb-4">
        <h3
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <span className="text-2xl">🗒️</span> Quick Note
        </h3>
        <span
          className={`text-xs border px-2.5 py-1 rounded-full ${
            darkMode
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
              : "bg-yellow-100 text-yellow-700 border-yellow-200"
          }`}
        >
          +5 XP
        </span>
      </div>
      <div
        className={`mb-3 text-sm ${
          darkMode ? "text-gray-400" : "text-muted-foreground"
        }`}
      >
        Add context tags
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "idea 💡",
          "blocker ⛔",
          "win 🏆",
          "plan 📝",
          "bug ⚠️",
          "note ✍🏻",
        ].map((t) => {
          const active = tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => setTags((prev) => (prev.includes(t) ? [] : [t]))}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                active
                  ? darkMode
                    ? "bg-green-500/20 text-green-300 border-green-400/50"
                    : "bg-green-100 text-primary border-green-700"
                  : darkMode
                  ? "bg-[#1d2942] text-gray-300 border-[#2a3f5f] hover:bg-[#253548]"
                  : "bg-secondary text-black border-border hover:bg-accent"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div>
        <textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Write down your thought, idea, breakthroughs or blocker..."
          className={`w-full resize-none h-28 rounded-xl border bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring/50 ${
            darkMode
              ? error
                ? "border-red-400/50 bg-red-950/20 text-white placeholder-gray-500"
                : "border-[#2a3f5f] bg-[#101828] text-white placeholder-gray-500"
              : error
              ? "border-red-400 bg-red-50 text-foreground"
              : "border-input text-foreground"
          }`}
          style={
            themeBackground && themeBackground.includes("url")
              ? {
                  backgroundColor: darkMode
                    ? "rgba(16, 24, 40, 0.3)"
                    : "rgba(255, 255, 255, 0.3)",
                }
              : {}
          }
        />
        {error && (
          <div
            className={`flex items-center gap-2 text-sm px-2 ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <button
          onClick={handleAdd}
          className={`w-full rounded-xl mt-2 border font-semibold py-2 cursor-pointer transition-all ${
            darkMode
              ? "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500/30 hover:shadow-md"
              : "bg-yellow-400 hover:bg-yellow-50 hover:shadow-md text-white hover:text-yellow-400 border-gray-200"
          }`}
        >
          ➕ Add note
        </button>
      </div>
    </div>
  );
}
