import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface MusicCardProps {
  onOpenMusic?: () => void;
  // new props: volume (0-100) and callback to notify parent
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

  // keep small WebAudio test tone but use parent's volume when available
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
      // use parent's volume (0-100) mapped to 0-1
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

  // sync gain when parent's volume prop changes
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
      setCurrentTrack("Lo-Fi Focus Beats (test)");
      // notify parent to open full music view
      onOpenMusic?.();
    }
  };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-xl w-full max-w-[944px]"
    >
      <button
        onClick={togglePlay}
        aria-pressed={!!currentTrack}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        {currentTrack ? (
          <Pause className="w-5 h-5 text-gray-700" />
        ) : (
          <Play className="w-5 h-5 text-gray-700" />
        )}
      </button>

      <div className="flex flex-col ml-4 flex-1">
        <span className="text-gray-800 font-medium">
          {currentTrack ? currentTrack : "No track selected"}
        </span>
        <span className="text-gray-500 text-sm">
          {currentTrack ? "Now playing..." : "Choose a track to start playing"}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <Volume2 className="w-5 h-5 text-gray-700 cursor-pointer" />
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          onChange={(e) => onVolumeChange?.(Number(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default MusicCard;
