import { Clock, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

type TaskBarProps = {
  id: number | string;
  label: string;
  duration: number;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  highlighted?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function TaskBar({
  id,
  label,
  duration,
  checked = false,
  onCheckedChange,
  highlighted = false,
  onClick,
  onEdit,
  onDelete,
}: TaskBarProps) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      // whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={`flex justify-between items-center p-5 border rounded-2xl transition-all outline-none cursor-pointer ${
        highlighted
          ? "bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg ring-2 ring-yellow-200"
          : checked
          ? "bg-gray-50 border-gray-200 shadow-sm"
          : "bg-white border-gray-200 hover:border-yellow-300 hover:shadow-sm"
      }`}
      data-id={id}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Checkbox
            checked={checked}
            onCheckedChange={(v: boolean | "indeterminate") =>
              onCheckedChange?.(typeof v === "boolean" ? v : false)
            }
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              e.stopPropagation()
            }
            aria-label={`Toggle ${label}`}
            className="w-5 h-5"
          />
        </motion.div>
        <span
          className={`font-semibold text-base select-none truncate ${
            checked ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-xl shadow-sm ${
            checked
              ? "bg-gray-100 text-gray-400"
              : "bg-linear-to-r from-yellow-100 to-orange-100 text-yellow-700"
          }`}
        >
          <Clock size={16} />
          <span>{duration} min</span>
        </motion.div>

        {onEdit && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Edit task"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 shadow-sm hover:shadow-md transition-all"
          >
            <Pencil size={16} />
          </motion.button>
        )}

        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Delete task"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm hover:shadow-md transition-all"
          >
            <Trash2 size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
