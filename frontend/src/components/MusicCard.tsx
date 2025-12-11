import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Music } from "lucide-react";
import { motion } from "framer-motion";

interface MusicCardProps {
  onOpenMusic?: () => void;
  volume?: number;
  onVolumeChange?: (v: number) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
  onOpenMusic,
  volume = 50,
  onVolumeChange,
}) => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

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

  const ensureAudioNodes = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current!;
    if (!gainRef.current) {
      const g = ctx.createGain();
      g.gain.value = (volume ?? 50) / 100;
      g.connect(ctx.destination);
      gainRef.current = g;
    }
  };

  const startSound = async () => {
    ensureAudioNodes();
    const ctx = audioCtxRef.current!;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        /* ignore */
      }
    }
    if (oscRef.current) return;

    const osc = ctx.createOscillator();
    const gain = gainRef.current!;
    osc.type = "sine";
    osc.frequency.value = 220;
    osc.connect(gain);
    osc.start();
    oscRef.current = osc;
  };

  const stopSound = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {
        /* ignore */
      }
      try {
        oscRef.current.disconnect();
      } catch {
        /* ignore */
      }
      oscRef.current = null;
    }
  };

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.setValueAtTime(
          (volume ?? 50) / 100,
          audioCtxRef.current.currentTime || 0
        );
      } catch {}
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopSound();
      if (gainRef.current) {
        try {
          gainRef.current.disconnect();
        } catch {}
        gainRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (currentTrack) {
      stopSound();
      setCurrentTrack(null);
    } else {
      startSound();
      setCurrentTrack("Lo-Fi Focus Beats");
      onOpenMusic?.();
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest("button, input, a, textarea, select")) return;
    togglePlay();
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
  };

  const isPlaying = !!currentTrack;

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
        isPlaying ? "ring-2 ring-yellow-400 shadow-2xl" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900">Focus Music</h3>
        </div>
        {isPlaying && (
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
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-pressed={!!currentTrack}
          className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-all ${
            isPlaying
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          {currentTrack ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          <motion.div
            initial={false}
            animate={{ opacity: isPlaying ? 1 : 0.6 }}
            className="space-y-1"
          >
            <p className="text-foreground font-medium truncate">
              {currentTrack || "No track selected"}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTrack
                ? "Relaxing beats to help you focus"
                : "Click play to start"}
            </p>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <Volume2
            className={`w-5 h-5 flex-shrink-0 transition-colors ${
              volume === 0 ? "text-gray-400" : "text-yellow-500"
            }`}
          />
          <input
            aria-label="Volume"
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => onVolumeChange?.(Number(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-600"
            style={{
              background: `linear-gradient(to right, #eab308 0%, #eab308 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`,
            }}
          />
          <span className="text-xs text-muted-foreground w-8 text-right">
            {volume}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
