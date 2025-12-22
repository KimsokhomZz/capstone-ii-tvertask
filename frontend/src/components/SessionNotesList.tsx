import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

type Note = { id: number; text: string; editing?: boolean };

type SessionNotesListProps = {
  notes: Note[];
  setNotes: (fn: (prev: Note[]) => Note[]) => void;
  onUpdate?: (id: number, text: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  themeBackground?: string;
};

export default function SessionNotesList({
  notes,
  setNotes,
  onUpdate,
  onDelete,
  loading = false,
  error = null,
  themeBackground,
}: SessionNotesListProps) {
  const { darkMode } = useTheme();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (loading && notes.length === 0) {
    return (
      <div
        className={`rounded-[28px] shadow-xl border p-6 md:p-8 transition-colors ${
          darkMode
            ? "bg-[#101828] border-[#2a3f5f] text-white"
            : "bg-card border-border"
        }`}
      >
        <div
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-muted-foreground"
          }`}
        >
          Loading notes…
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[28px] shadow-md border p-6 md:p-8 transition-colors ${
        darkMode
          ? "bg-[#101828] border-[#2a3f5f] text-white"
          : "bg-card border-border"
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
      {error && (
        <div
          className={`text-sm mb-3 ${
            darkMode ? "text-red-400" : "text-destructive"
          }`}
        >
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-foreground"
          }`}
        >
          💡 Session Notes
        </h3>
        <span
          className={`text-xs border px-2.5 py-1 rounded-full ${
            darkMode
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
              : "bg-yellow-100 text-yellow-700 border-yellow-200"
          }`}
        >
          {notes.length}
        </span>
      </div>
      <div className="space-y-3">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-muted-foreground"
              }`}
            >
              No notes yet
            </p>
            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-gray-500" : "text-muted-foreground/70"
              }`}
            >
              Add your first note to get started
            </p>
          </div>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            className={`group flex items-center gap-3 border rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 ${
              darkMode
                ? "bg-[#0f1419] border-[#2a3f5f] text-white"
                : "bg-white/80 border-gray-200 text-foreground"
            }`}
          >
            <div className="flex-1 min-w-0">
              {n.editing ? (
                <input
                  value={n.text}
                  onChange={(e) =>
                    setNotes((prev) =>
                      prev.map((x) =>
                        x.id === n.id ? { ...x, text: e.target.value } : x
                      )
                    )
                  }
                  className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    darkMode
                      ? "border-[#2a3f5f] bg-[#1a2332] text-white"
                      : "border-input text-foreground"
                  }`}
                  autoFocus
                />
              ) : (
                <div
                  className={`text-sm leading-relaxed break-words ${
                    darkMode ? "text-white" : "text-foreground"
                  }`}
                >
                  {n.text}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {n.editing ? (
                <>
                  <button
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 bg-green-600 hover:bg-green-700"
                    }`}
                    onClick={async () => {
                      if (loading) return;
                      const newText =
                        notes.find((x) => x.id === n.id)?.text ?? "";
                      try {
                        if (onUpdate) await onUpdate(n.id, newText);
                        setNotes((prev) =>
                          prev.map((x) =>
                            x.id === n.id ? { ...x, editing: false } : x
                          )
                        );
                        toast.success("Note updated successfully! 👏");
                      } catch {
                        toast.error("Failed to update note. 🚨");
                      }
                    }}
                  >
                    ✓ Save
                  </button>
                  <button
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      darkMode
                        ? "bg-[#1d2942] text-gray-300 hover:bg-[#253548]"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    onClick={() =>
                      setNotes((prev) =>
                        prev.map((x) =>
                          x.id === n.id ? { ...x, editing: false } : x
                        )
                      )
                    }
                  >
                    ✕ Cancel
                  </button>
                  <button
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => setDeleteId(n.id)}
                  >
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      darkMode
                        ? "bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    } ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    onClick={() =>
                      setNotes((prev) =>
                        prev.map((x) =>
                          x.id === n.id ? { ...x, editing: true } : x
                        )
                      )
                    }
                  >
                    ✏️ Edit
                  </button>
                  <button
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      darkMode
                        ? "bg-red-600/20 text-red-300 hover:bg-red-600/30"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    } ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                    onClick={() => setDeleteId(n.id)}
                  >
                    🗑️
                  </button>
                </>
              )}
              <span
                className={`text-xs border px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                  darkMode
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <DeleteConfirmation
        isOpen={deleteId !== null}
        taskName={notes.find((x) => x.id === deleteId)?.text ?? "this note"}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId === null) return;

          try {
            if (deleteId < 0) {
              setNotes((prev) => prev.filter((x) => x.id !== deleteId));
              setDeleteId(null);
              toast.success("Local note removed. 🗑️");
              return;
            }

            if (onDelete) await onDelete(deleteId);
            setNotes((prev) => prev.filter((x) => x.id !== deleteId));
            setDeleteId(null);
            toast.success("Note deleted successfully! 🗑️");
          } catch {
            toast.error("Failed to delete note. 🚨");
          }
        }}
      />
    </div>
  );
}
