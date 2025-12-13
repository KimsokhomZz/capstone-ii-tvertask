type ThemeCardProps = {
  onOpenGallery?: () => void;
  className?: string;
};

export default function ThemeCard({
  onOpenGallery,
  className,
}: ThemeCardProps) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border p-3 flex items-center gap-2 ${
        className ?? ""
      }`}
    >
      {onOpenGallery && (
        <button
          type="button"
          onClick={onOpenGallery}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border transition-colors bg-secondary text-black  hover:bg-accent hover:text-accent-foreground"
          title="Choose a background theme for the page"
        >
          Backgrounds
        </button>
      )}
    </div>
  );
}
