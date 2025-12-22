import { useTheme } from "@/context/ThemeContext";

type ThemeCardProps = {
  onOpenGallery?: () => void;
  className?: string;
};

export default function ThemeCard({
  onOpenGallery,
  className,
}: ThemeCardProps) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`rounded-2xl p-3 flex items-center gap-2 transition-colors ${
        darkMode ? "bg-[#101828]" : "bg-card border-border"
      } ${className ?? ""}`}
    >
      {onOpenGallery && (
        <button
          type="button"
          onClick={onOpenGallery}
          className={`group inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            darkMode
              ? "bg-[#101828] hover:bg-[#1a2332] border-white/30 text-white hover:text-white shadow-sm hover:shadow-md"
              : "bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-yellow-200 hover:border-yellow-300 text-yellow-400 hover:text-yellow-500 shadow-sm hover:shadow-md"
          }`}
          title="Choose a background theme for the page"
        >
          {/* Icon */}
          <svg
            className="w-4 h-4 transition-transform group-hover:rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Backgrounds
        </button>
      )}
    </div>
  );
}
