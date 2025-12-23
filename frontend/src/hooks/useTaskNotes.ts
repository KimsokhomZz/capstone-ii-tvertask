import { useEffect, useState } from "react";
import {
  getNotesByTask,
  createNote,
  updateNote,
  deleteNote,
} from "../api/taskNoteApi";

type Note = { id: number; text: string; tag?: string; editing?: boolean };

export default function useTaskNotes(taskId?: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setNotes([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    getNotesByTask(taskId)
      .then((remote) => {
        if (!mounted) return;
        setNotes(
          remote.map((n: any) => ({
            id: n.id,
            text: n.text,
            tag: n.tag,
          }))
        );
      })
      .catch((e) => mounted && setError(e?.message || "Failed to load notes"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [taskId]);

  const addNote = async (
    text: string,
    taskIdOverride?: number,
    tag?: string
  ) => {
    const idToUse = taskIdOverride ?? taskId;
    if (!idToUse) throw new Error("Missing taskId");
    const created = await createNote({
      task_id: idToUse,
      text,
      tag,
    });
    return created;
  };

  const saveNote = async (id: number, text: string, tag?: string) => {
    await updateNote(id, { text, tag });
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text, tag, editing: false } : n))
    );
  };

  const removeNote = async (id: number) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, setNotes, loading, error, addNote, saveNote, removeNote };
}
