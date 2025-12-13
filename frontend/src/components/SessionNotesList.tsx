import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

type Note = { id: number; text: string; editing?: boolean };

type SessionNotesListProps = {
  notes: Note[];
  setNotes: (fn: (prev: Note[]) => Note[]) => void;
  onUpdate?: (id: number, text: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export default function SessionNotesList({
  notes,
  setNotes,
  onUpdate,
  onDelete,
  loading = false,
  error = null,
}: SessionNotesListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (loading && notes.length === 0) {
    return (
      <div className="bg-card rounded-[28px] shadow-xl border border-border p-6 md:p-8">
        <div className="text-sm text-muted-foreground">Loading notes…</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[28px] shadow-md border border-border p-6 md:p-8">
      {error && <div className="text-sm text-destructive mb-3">{error}</div>}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">
          💡 Session Notes
        </h3>
        <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full">
          {notes.length}
        </span>
      </div>
      <div className="space-y-3">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm text-muted-foreground">No notes yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Add your first note to get started
            </p>
          </div>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            className="group flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
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
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  autoFocus
                />
              ) : (
                <div className="text-foreground text-sm leading-relaxed break-words">
                  {n.text}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {n.editing ? (
                <>
                  <button
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 font-medium transition-all ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
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
                    className={`text-xs px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-all ${
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
                    className={`text-xs px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-all ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
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
                    className={`text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-all ${
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
                    className={`text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-all ${
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
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
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
