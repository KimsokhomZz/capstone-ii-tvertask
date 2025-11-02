import { useState } from "react";
import PomodoroTimerCard from "../../components/PomodoroTimerCard";
import MusicCard from "../../components/MusicCard";
import QuickNoteCard from "../../components/QuickNoteCard";
import SessionNotesList from "../../components/SessionNotesList";
import Musictask from "../music/Musictask"; // added import

type Note = { id: number; text: string; editing?: boolean };

export default function Focustask() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showMusic, setShowMusic] = useState(false); // added state

  return (
    <div className="space-y-8">
      <PomodoroTimerCard taskTitle="Task 1" defaultFocus={25} />

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
  );
}
