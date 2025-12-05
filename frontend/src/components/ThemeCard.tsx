import { Sun, Moon, Layers } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type ThemeCardProps = {
  transparent: boolean;
  onTransparentChange: (val: boolean) => void;
  onOpenGallery?: () => void;
  className?: string;
};

export default function ThemeCard({ transparent, onTransparentChange, onOpenGallery, className }: ThemeCardProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  const setLight = () => {
    if (darkMode) toggleDarkMode();
  };
  const setDark = () => {
    if (!darkMode) toggleDarkMode();
  };

  return (
    <div className={`bg-card rounded-2xl border border-border p-3 flex items-center gap-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={setLight}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          !darkMode
            ? "bg-primary/10 text-black border-primary/20"
            : "bg-secondary text-black border-border hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-pressed={!darkMode}
      >
        <Sun className="w-4 h-4" />
        White
      </button>

      <button
        type="button"
        onClick={setDark}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          darkMode
            ? "bg-primary/10 text-black border-primary/20"
            : "bg-secondary text-black border-border hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-pressed={darkMode}
      >
        <Moon className="w-4 h-4" />
        Dark
      </button>

      <div className="ml-2 h-5 w-px bg-border" />

      <button
        type="button"
        onClick={() => onTransparentChange(!transparent)}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
          transparent
            ? "bg-primary/10 text-black border-primary/20"
            : "bg-secondary text-black border-border hover:bg-accent hover:text-accent-foreground"
        }`}
        aria-pressed={transparent}
        title="Make all cards transparent so the page theme shows through"
      >
        <Layers className="w-4 h-4" />
        Transparent cards
      </button>

      {onOpenGallery && (
        <button
          type="button"
          onClick={onOpenGallery}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors bg-secondary text-black border-border hover:bg-accent hover:text-accent-foreground"
          title="Choose a background when transparent mode is on"
        >
          Backgrounds
        </button>
      )}
    </div>
  );
}
