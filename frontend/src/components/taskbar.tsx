import { Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type TaskBarProps = {
  id: number | string;
  label: string;
  duration: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  highlighted?: boolean;
  onClick?: () => void;
};

export default function TaskBar({
  id,
  label,
  duration,
  checked = false,
  onCheckedChange,
  highlighted = false,
  onClick,
}: TaskBarProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`flex justify-between items-center p-4 border rounded-2xl transition-shadow outline-none ${
        highlighted
          ? "bg-yellow-50 border-yellow-100 shadow-sm"
          : "hover:bg-yellow-50 border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) =>
            onCheckedChange?.(typeof v === "boolean" ? v : false)
          }
          onClick={(e) => e.stopPropagation()}
          aria-label={`Toggle ${label}`}
        />
        <span
          className={`font-medium select-none ${
            checked ? "line-through text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      </div>

      <div
        className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
          checked
            ? "bg-gray-100 text-gray-400"
            : "bg-yellow-100 text-yellow-600"
        }`}
      >
        <Clock size={16} />
        {duration}
      </div>
    </div>
  );
}
