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
    { key: "baby" as const, label: "Baby set", minutes: 10 },
    { key: "popular" as const, label: "Popular set", minutes: 25 },
    { key: "medium" as const, label: "Medium", minutes: 40 },
    { key: "extended" as const, label: "Extended", minutes: 60 },
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
          placeholder="e.g. Write report"
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
            const active = preset === p.key && Number(duration) === p.minutes;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setPreset(p.key);
                  setDuration(String(p.minutes));
                }}
                className={`px-3 py-2 rounded-xl border text-sm cursor-pointer transition-colors ${
                  active
                    ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p.label} ({p.minutes}m)
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
        <select
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            setPreset("custom");
          }}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        >
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="45">45</option>
          <option value="60">60</option>
          <option value="90">90</option>
        </select>
      </div>
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-yellow-50 text-gray-800 cursor-pointer transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-100 text-black cursor-pointer transition-colors">
          Save Task
        </button>
      </div>
    </form>
  );
}
