import DeleteConfirmation from "@/components/DeleteConfirmation";
import { Toast } from "@/components/ConfirmDialog";
import { useState } from "react";

type Note = { id: number; text: string; editing?: boolean };

type SessionNotesListProps = {
  notes: Note[];
  setNotes: (fn: (prev: Note[]) => Note[]) => void;
};

export default function SessionNotesList({
  notes,
  setNotes,
}: SessionNotesListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  return (
    <div className="bg-card rounded-[28px] shadow-xl border border-border p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Session Notes</h3>
        <span className="text-xs bg-primary/10 text-primary border border-border px-2.5 py-1 rounded-full">
          {notes.length}
        </span>
      </div>
      <div className="space-y-3">
        {notes.length === 0 && (
          <div className="text-sm text-muted-foreground">No notes yet</div>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between bg-secondary/50 border border-border rounded-2xl px-4 py-3"
          >
            <div className="flex-1 pr-3">
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
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              ) : (
                <div className="text-foreground text-sm">{n.text}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {n.editing ? (
                <>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors"
                    onClick={() => {
                      setNotes((prev) =>
                        prev.map((x) =>
                          x.id === n.id ? { ...x, editing: false } : x
                        )
                      );
                      setToast({ message: "Note updated successfully!" });
                      setTimeout(() => setToast(null), 2000);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-black hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                    onClick={() =>
                      setNotes((prev) =>
                        prev.map((x) =>
                          x.id === n.id ? { ...x, editing: false } : x
                        )
                      )
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-colors"
                    onClick={() => setDeleteId(n.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-black hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                    onClick={() =>
                      setNotes((prev) =>
                        prev.map((x) =>
                          x.id === n.id ? { ...x, editing: true } : x
                        )
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-colors"
                    onClick={() => setDeleteId(n.id)}
                  >
                    Delete
                  </button>
                </>
              )}
              <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
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
        onConfirm={() => {
          if (deleteId === null) return;
          setNotes((prev) => prev.filter((x) => x.id !== deleteId));
          setDeleteId(null);
          setToast({ message: "Note deleted successfully!" });
          setTimeout(() => setToast(null), 2000);
        }}
      />
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
