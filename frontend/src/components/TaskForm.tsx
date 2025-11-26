import { useState } from "react";

export type NewTask = {
  title: string;
  description: string;
  duration?: string;
};

type TaskFormProps = {
  initial?: Partial<NewTask>;
  onSubmit: (task: NewTask) => void;
  onCancel?: () => void;
};

export default function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>(initial?.duration ?? "25");
  const [preset, setPreset] = useState<"baby" | "popular" | "medium" | "extended" | "custom">("custom");

  const presets = [
    { key: "baby" as const, label: "Baby step", focus: 10, short: 5, long: 10 },
    { key: "popular" as const, label: "Popular", focus: 20, short: 5, long: 15 },
    { key: "medium" as const, label: "Medium", focus: 40, short: 8, long: 20 },
    { key: "extended" as const, label: "Extended", focus: 60, short: 10, long: 25 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), duration });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Input Task"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
          className="w-full h-28 rounded-xl border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timer presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => {
            const active = preset === p.key && Number(duration) === p.focus;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setPreset(p.key);
                  setDuration(String(p.focus));
                }}
                className={`px-3 py-2 rounded-xl border text-left text-sm cursor-pointer transition-colors hover:shadow-md ${
                  active
                    ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-yellow-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${p.key === "baby" || p.key === "popular" ? "text-black" : ""}`}>{p.label}</span>
                  <span className="text-xs text-gray-500">{p.focus} • {p.short} • {p.long} min</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-yellow-50 hover:shadow-md text-gray-800 cursor-pointer transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded-xl bg-yellow-400 border border-gray-200 hover:bg-yellow-50 hover:shadow-md text-black cursor-pointer transition-colors">
          Create Task
        </button>
      </div>
    </form>
  );
}
