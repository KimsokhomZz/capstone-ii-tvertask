type QuickNoteCardProps = {
  draft: string;
  setDraft: (v: string) => void;
  tags: string[];
  setTags: (fn: (prev: string[]) => string[]) => void;
  onAdd: () => void;
};

export default function QuickNoteCard({ draft, setDraft, tags, setTags, onAdd }: QuickNoteCardProps) {
  return (
    <div className="bg-card rounded-[28px] shadow-xl border border-border p-6 md:p-8">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Quick Note</h3>
        <span className="text-xs bg-primary/10 text-primary border border-border px-2.5 py-1 rounded-full">+5 XP</span>
      </div>
      <div className="mb-3 text-sm text-muted-foreground">Add context tags</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {["idea", "blocker", "win", "plan", "bug", "note"].map((t) => {
          const active = tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                active
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-secondary text-black border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write down your thought, idea, breakthroughs or blocker..."
          className="w-full resize-none h-28 rounded-xl border border-input bg-background p-3 focus:outline-none focus:ring-2 focus:ring-ring/50 text-foreground"
        />
        <button 
          onClick={onAdd} 
          className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 py-2 cursor-pointer transition-colors font-medium"
        >
          Add note
        </button>
      </div>
    </div>
  );
}
