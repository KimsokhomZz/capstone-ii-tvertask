type QuickNoteCardProps = {
  draft: string;
  setDraft: (v: string) => void;
  tags: string[];
  setTags: (fn: (prev: string[]) => string[]) => void;
  onAdd: () => void;
};

export default function QuickNoteCard({ draft, setDraft, tags, setTags, onAdd }: QuickNoteCardProps) {
  return (
    <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Quick Note</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">+5 XP</span>
      </div>
      <div className="mb-3 text-sm text-gray-600">Add context tags</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {["idea", "blocker", "win", "plan", "bug", "note"].map((t) => {
          const active = tags.includes(t);
          return (
            <button
              key={t}
              onClick={() => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
              className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
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
          className="w-full resize-none h-28 rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        />
        <button onClick={onAdd} className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black py-2">
          Add note
        </button>
      </div>
    </div>
  );
}
