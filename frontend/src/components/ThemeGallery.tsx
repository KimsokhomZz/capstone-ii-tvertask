import { X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export type ThemeOption = {
  id: string;
  name: string;
  light?: {
    className: string;
    preview: string;
  } | null;
  dark?: {
    className: string;
    preview: string;
  } | null;
};

type ThemeGalleryProps = {
  open: boolean;
  onClose: () => void;
  options: ThemeOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

function ThemeTabs() {
  const { darkMode, toggleDarkMode } = useTheme();

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: <Sun className="w-5 h-5" />,
      active: !darkMode,
    },
    {
      id: "dark",
      name: "Dark",
      icon: <Moon className="w-5 h-5" />,
      active: darkMode,
    },
  ];

  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium text-gray-500 mb-3">THEME</h3>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => theme.id !== "system" && toggleDarkMode()}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
              theme.active
                ? "bg-primary/10 text-dark"
                : "hover:bg-accent/50 text-black hover:text-black"
            }`}
          >
            <div className="mb-1 ">{theme.icon}</div>
            <span className="text-xs">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ThemeGallery({
  open,
  onClose,
  options,
  selectedId,
  onSelect,
}: ThemeGalleryProps) {
  const { darkMode } = useTheme();
  if (!open) return null;

  // Filter options based on current theme mode
  const filteredOptions = options
    .filter(opt => {
      // Always include the 'none' option
      if (opt.id === 'none') return true;
      // For dark mode, only include options that have a dark theme
      if (darkMode) return opt.dark != null;
      // For light mode, only include options that have a light theme
      return opt.light != null;
    })
    .map(opt => ({
      ...opt,
      className: darkMode 
        ? opt.dark?.className || '' 
        : opt.light?.className || '',
      preview: darkMode 
        ? opt.dark?.preview || '' 
        : opt.light?.preview || ''
    }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="fixed inset-0 transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-xl w-full max-w-3xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Theme Settings
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize your focus experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-dark"
              aria-label="Close theme settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ThemeTabs />

          <div className="p-6">
            <h4 className="text-sm font-medium mb-4 text-gray-900 dark:text-white">
              Backgrounds
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredOptions.map((opt) => (
                <div key={opt.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelect(opt.id)}
                    className={`relative w-full aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedId === opt.id
                        ? "ring-2 ring-primary ring-offset-2"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    aria-pressed={selectedId === opt.id}
                    title={opt.name}
                  >
                    <div className={`absolute inset-0 ${opt.className}`} />
                  </button>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {opt.name}
                    </span>
                    {selectedId === opt.id && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-border flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-secondary text-black border border-border hover:bg-accent"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
