import { Clock, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type TaskBarProps = {
  id: number | string;
  label: string;
  duration: number;
  checked?: boolean;
  completed?: boolean;
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
  completed = false,
  onCheckedChange,
  highlighted = false,
  onClick,
  onEdit,
  onDelete,
}: TaskBarProps) {
  const { darkMode } = useTheme();

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
      whileTap={{ scale: 0.99 }}
      className={`flex justify-between items-center p-5 border rounded-2xl transition-all outline-none cursor-pointer ${
        highlighted
          ? darkMode
            ? "bg-yellow-500/20 border-yellow-400/50 shadow-lg ring-2 ring-yellow-400/50"
            : "bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg ring-2 ring-yellow-200"
          : checked
          ? darkMode
            ? "bg-gray-700/20 border-gray-600 shadow-sm"
            : "bg-gray-50 border-gray-200 shadow-sm"
          : darkMode
          ? "bg-[#1d2942] border-gray-600 hover:border-yellow-400/50 hover:shadow-sm"
          : "bg-white border-gray-200 hover:border-yellow-300 hover:shadow-sm"
      }`}
      data-id={id}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <motion.div whileTap={{ scale: 0.9 }}>
          <Checkbox
            checked={checked}
            disabled={completed}
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
            checked
              ? darkMode
                ? "line-through text-gray-500"
                : "line-through text-gray-400"
              : darkMode
              ? "text-white"
              : "text-gray-800"
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
              ? darkMode
                ? "bg-gray-700/40 text-gray-500"
                : "bg-gray-100 text-gray-400"
              : darkMode
              ? "bg-yellow-500/20 text-yellow-300"
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
            className={`p-2 rounded-xl border shadow-sm hover:shadow-md transition-all ${
              darkMode
                ? "bg-gray-700/30 border-gray-600 text-gray-400 hover:bg-yellow-500/20 hover:border-yellow-400/50 hover:text-yellow-400"
                : "bg-white border-gray-200 text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
            }`}
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
            className={`p-2 rounded-xl border shadow-sm hover:shadow-md transition-all ${
              darkMode
                ? "bg-gray-700/30 border-gray-600 text-gray-400 hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-400"
                : "bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            }`}
          >
            <Trash2 size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
