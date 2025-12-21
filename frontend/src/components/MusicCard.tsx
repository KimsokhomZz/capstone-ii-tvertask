import React, { useState, useEffect, useRef } from "react";
import { Play, Music, Disc3 } from "lucide-react";
import { motion } from "framer-motion";

interface MusicCardProps {
  onOpenMusic?: () => void;
  trackTitle?: string;
  isPlaying?: boolean; // controlled play state from parent
  onTogglePlay?: () => void; // parent toggler
}

const MusicCard: React.FC<MusicCardProps> = ({
  onOpenMusic,
  trackTitle,
  isPlaying,
  onTogglePlay,
}) => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Sync local display state with parent-controlled play state / title
  useEffect(() => {
    const playing = typeof isPlaying === "boolean" ? isPlaying : !!currentTrack;
    if (playing) {
      setCurrentTrack(trackTitle ?? currentTrack);
    } else {
      setCurrentTrack(null);
    }
  }, [isPlaying, trackTitle]);

  useEffect(() => {
    const handler = () => {
      setCurrentTrack(null);
      if (rootRef.current) {
        try {
          rootRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          rootRef.current.focus();
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("showMusicCard", handler);
    return () => window.removeEventListener("showMusicCard", handler);
  }, []);

  const togglePlay = () => {
    onTogglePlay?.();
    onOpenMusic?.();
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest("button, input, a, textarea, select")) return;
    // open music UI only — do not auto-start playback
    onOpenMusic?.();
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // open music UI only — do not auto-start playback
      onOpenMusic?.();
    }
  };

  const controlledPlaying =
    typeof isPlaying === "boolean" ? isPlaying : !!currentTrack;

  return (
    <motion.div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-pressed={!!currentTrack}
      onClick={handleContainerClick}
      onKeyDown={handleContainerKeyDown}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card rounded-[28px] shadow-md border border-border p-6 md:p-8 w-full max-w-[944px] cursor-pointer transition-all duration-300 ${
        controlledPlaying ? "ring-2 ring-yellow-400 shadow-2xl" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900">Focus Music</h3>
        </div>
        {controlledPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-600 font-medium">
              Now Playing
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-pressed={!!currentTrack}
          className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-all ${
            controlledPlaying
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          {controlledPlaying ? (
            <Disc3 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <motion.div
            initial={false}
            animate={{ opacity: controlledPlaying ? 1 : 0.6 }}
            className="space-y-1"
          >
            <p className="text-foreground font-medium truncate">
              {controlledPlaying
                ? trackTitle ?? currentTrack
                : "No track selected"}
            </p>
            <p className="text-sm text-muted-foreground">
              {controlledPlaying
                ? "Relaxing beats to help you focus"
                : "Click play to start"}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
