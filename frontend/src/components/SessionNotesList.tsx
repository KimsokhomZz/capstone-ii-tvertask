import DeleteConfirmation from "@Components/DeleteConfirmation";
import { Toast } from "./ConfirmDialog";
import { useState } from "react";

type Note = { id: number; text: string; editing?: boolean };

type SessionNotesListProps = {
  notes: Note[];
  setNotes: (fn: (prev: Note[]) => Note[]) => void;
};



export default function SessionNotesList({ notes, setNotes }: SessionNotesListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  return (
    <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Session Notes</h3>
        <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full">{notes.length}</span>
      </div>
      <div className="space-y-3">
        {notes.length === 0 && <div className="text-sm text-gray-500">No notes yet</div>}
        {notes.map((n) => (
          <div key={n.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex-1 pr-3">
              {n.editing ? (
                <input
                  value={n.text}
                  onChange={(e) => setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, text: e.target.value } : x)))}
                  className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
              ) : (
                <div className="text-gray-800 text-sm">{n.text}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {n.editing ? (
                <>
                  <button
                    className="text-xs px-2 py-1 rounded-lg bg-yellow-400 text-black hover:bg-yellow-100 cursor-pointer"
                    onClick={() => {
                      setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, editing: false } : x)));
                      setToast({ message: "Note updated successfully!" });
                      setTimeout(() => setToast(null), 2000);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-yellow-50 cursor-pointer"
                    onClick={() => setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, editing: false } : x)))}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded-lg bg-red-500 text-black hover:bg-red-100 cursor-pointer"
                    onClick={() => setDeleteId(n.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-xs px-2 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-yellow-50 cursor-pointer"
                    onClick={() => setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, editing: true } : x)))}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded-lg bg-red-500 text-black hover:bg-red-100 cursor-pointer"
                    onClick={() => setDeleteId(n.id)}
                  >
                    Delete
                  </button>
                </>
              )}
              <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
