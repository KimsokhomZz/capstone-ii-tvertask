import { useState } from "react";
import PomodoroTimerCard from "../../components/PomodoroTimerCard";
import QuickNoteCard from "../../components/QuickNoteCard";
import SessionNotesList from "../../components/SessionNotesList";

type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <PomodoroTimerCard taskTitle="Task 1" defaultFocus={25} />

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

      <SessionNotesList notes={notes} setNotes={(fn) => setNotes((prev) => fn(prev))} />
    </div>
  );
}
