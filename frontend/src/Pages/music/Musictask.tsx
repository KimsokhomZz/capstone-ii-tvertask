import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Cloud,
  Zap,
  Headphones,
  Play,
  Pause,
  ChevronDown,
  Clock,
  Disc3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import MusicCard from "../../Components/MusicCard";
import lofi from "../../assets/music/lofi";
import nature from "../../assets/music/nature";
import ambient from "../../assets/music/ambient";
import focus from "../../assets/music/focus";

interface Track {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  isPremium?: boolean;
  genre: string;
  youtubeId?: string;
}

const FocusMusicApp: React.FC<{
  embedded?: boolean;
  themeBackground?: string;
}> = ({ embedded = false, themeBackground }) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("lofi");
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [showCompact, setShowCompact] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const prevTrackId = useRef<string | null>(null);

  // create or reuse a single global hidden iframe for playback to avoid duplicates
  const getOrCreateGlobalIframe = () => {
    let el = document.getElementById(
      "global-music-iframe"
    ) as HTMLIFrameElement | null;
    if (!el) {
      el = document.createElement("iframe");
      el.id = "global-music-iframe";
      el.className = "w-0 h-0 invisible";
      el.allow = "autoplay; encrypted-media";
      // keep it visually hidden/offscreen
      el.style.position = "absolute";
      el.style.left = "-9999px";
      el.style.width = "0";
      el.style.height = "0";
      document.body.appendChild(el);
    }
    iframeRef.current = el;
    return el;
  };

  // update the single global iframe src whenever iframeSrc changes
  useEffect(() => {
    if (!iframeSrc) {
      const el = document.getElementById(
        "global-music-iframe"
      ) as HTMLIFrameElement | null;
      if (el) el.removeAttribute("src");
      return;
    }
    const el = getOrCreateGlobalIframe();
    if (el.src !== iframeSrc) el.src = iframeSrc;
  }, [iframeSrc]);

  // When this instance starts playing, pause other YouTube iframes on the page
  useEffect(() => {
    if (!isPlaying) return;
    // short delay to allow this instance to initialize before pausing others
    const t = setTimeout(() => {
      document.querySelectorAll("iframe").forEach((el) => {
        // keep our global player (by id) and don't pause it
        if ((el as HTMLIFrameElement).id === "global-music-iframe") return;
        const src = el.getAttribute("src") ?? "";
        if (src.includes("youtube.com/embed")) {
          try {
            el.contentWindow?.postMessage(
              JSON.stringify({
                event: "command",
                func: "pauseVideo",
                args: [],
              }),
              "*"
            );
          } catch {
            /* ignore cross-origin */
          }
        }
      });
    }, 150);
    return () => clearTimeout(t);
  }, [isPlaying]);

  // unique instance id to avoid reacting to our own events
  const instanceId = useRef<string>(Math.random().toString(36).slice(2));

  // notify other windows/components when music state changes
  useEffect(() => {
    try {
      window.dispatchEvent(
        new CustomEvent("musicStateChanged", {
          detail: {
            instanceId: instanceId.current,
            currentTrackId,
            isPlaying,
          },
        })
      );
    } catch {
      /* ignore */
    }
  }, [currentTrackId, isPlaying]);

  // ensure imported arrays are treated as Track[]
  const tracks: Track[] = [
    ...(lofi as unknown as Track[]),
    ...(nature as unknown as Track[]),
    ...(ambient as unknown as Track[]),
    ...(focus as unknown as Track[]),
  ];

  // listen for external music state changes and sync (ignore events from self)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const d = ce.detail as
        | {
            instanceId?: string;
            currentTrackId?: string | null;
            isPlaying?: boolean;
          }
        | undefined;
      if (!d || d.instanceId === instanceId.current) return;
      if (
        typeof d.currentTrackId === "string" &&
        d.currentTrackId !== currentTrackId
      ) {
        setCurrentTrackId(d.currentTrackId);
      }
      if (typeof d.isPlaying === "boolean" && d.isPlaying !== isPlaying) {
        setIsPlaying(d.isPlaying);
      }
    };
    window.addEventListener("musicStateChanged", handler as EventListener);
    return () =>
      window.removeEventListener("musicStateChanged", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, isPlaying]);

  // respond to requests to toggle play (dispatched by other components)
  useEffect(() => {
    const onRequest = () => {
      // reuse existing handler logic
      if (currentTrackId) {
        setIsPlaying((p) => !p);
      } else {
        const visibleTracks = tracks.filter((t) => t.genre === activeTab);
        const start = visibleTracks[0]?.id ?? tracks[0]?.id ?? null;
        setCurrentTrackId(start);
        setTime(0);
        setIsPlaying(true);
      }
    };
    window.addEventListener("requestTogglePlay", onRequest as EventListener);
    return () =>
      window.removeEventListener(
        "requestTogglePlay",
        onRequest as EventListener
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, activeTab, tracks]);

  // Listen for an external "ensureMusicPaused" event (dispatched when opening modal)
  // to prevent the embedded player from auto-playing on modal open.
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ onlyIfNotPlaying?: boolean }>;
      // if caller requested "onlyIfNotPlaying", don't pause an already-playing player
      const onlyIfNotPlaying = !!ce?.detail?.onlyIfNotPlaying;
      if (onlyIfNotPlaying && isPlaying) return;
      setIsPlaying(false);
      const el = getOrCreateGlobalIframe();
      if (el && el.contentWindow) {
        try {
          el.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
            "*"
          );
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("ensureMusicPaused", handler as EventListener);
    return () =>
      window.removeEventListener("ensureMusicPaused", handler as EventListener);
  }, []);

  const visibleTracks = tracks.filter((t) => t.genre === activeTab);

  const tabs = [
    {
      id: "lofi",
      label: "Lo-Fi",
      icon: Music,
      color: "from-purple-400 to-pink-400",
    },
    {
      id: "nature",
      label: "Nature",
      icon: Cloud,
      color: "from-green-400 to-cyan-400",
    },
    {
      id: "ambient",
      label: "Ambient",
      icon: Zap,
      color: "from-blue-400 to-indigo-400",
    },
    {
      id: "focus",
      label: "Focus",
      icon: Headphones,
      color: "from-orange-400 to-yellow-400",
    },
  ];

  const currentTrack = tracks.find((t) => t.id === currentTrackId);

  // internal timer for UI
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => setTime((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // set iframeSrc when the currentTrack changes.
  // autoplay only when a new track is loaded (not on simple pause/resume)
  useEffect(() => {
    if (!currentTrack?.youtubeId) {
      // no youtube track — clear src
      setIframeSrc(null);
      prevTrackId.current = currentTrackId;
      return;
    }

    const isNewTrack = prevTrackId.current !== currentTrackId;
    const autoplay = isNewTrack && isPlaying ? 1 : 0;

    setIframeSrc(
      `https://www.youtube.com/embed/${
        currentTrack.youtubeId
      }?enablejsapi=1&autoplay=${autoplay}&origin=${encodeURIComponent(
        window.location.origin
      )}`
    );

    prevTrackId.current = currentTrackId;
  }, [currentTrackId, currentTrack?.youtubeId, isPlaying]);

  // control youtube via postMessage (play/pause)
  useEffect(() => {
    if (!currentTrack?.youtubeId || !iframeRef.current) return;
    const win = iframeRef.current.contentWindow;
    if (!win) return;
    const cmd = isPlaying ? "playVideo" : "pauseVideo";
    // wait a bit for iframe to initialize before sending commands
    const t = setTimeout(() => {
      win.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: [] }),
        "*"
      );
    }, 350);
    return () => clearTimeout(t);
  }, [currentTrack?.youtubeId, isPlaying]);

  // ensure iframe resumes after entering fullscreen (some browsers pause audio on reflow)
  useEffect(() => {
    // Only resume on enter if the player was already playing (isPlaying === true).
    // Include isPlaying in deps so the handler sees the latest play state.
    const onFs = (e: CustomEvent<{ action: string }>) => {
      const action = e?.detail?.action;
      if (
        action === "enter" &&
        iframeRef.current &&
        currentTrack?.youtubeId &&
        isPlaying
      ) {
        const win = iframeRef.current.contentWindow;
        if (!win) return;
        // small delay to allow fullscreen transition / iframe layout
        setTimeout(() => {
          try {
            win.postMessage(
              JSON.stringify({ event: "command", func: "playVideo", args: [] }),
              "*"
            );
          } catch {
            /* ignore */
          }
        }, 250);
      }
    };
    window.addEventListener("fullscreenToggled", onFs as EventListener);
    return () =>
      window.removeEventListener("fullscreenToggled", onFs as EventListener);
  }, [currentTrack?.youtubeId, isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(1, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleTogglePlay = () => {
    if (currentTrackId) {
      setIsPlaying((p) => !p);
    } else {
      // start first visible track
      const start = visibleTracks[0]?.id ?? tracks[0]?.id ?? null;
      setCurrentTrackId(start);
      setTime(0);
      setIsPlaying(true);
      // iframeSrc will be set by useEffect reacting to currentTrackId/isPlaying
    }
  };

  const handleNext = () => {
    const list = visibleTracks.length ? visibleTracks : tracks;
    if (!currentTrackId) {
      const id = list[0]?.id ?? null;
      setCurrentTrackId(id);
      setTime(0);
      setIsPlaying(true);
      return;
    }
    const idx = list.findIndex((t) => t.id === currentTrackId);
    const nextIdx = idx >= 0 ? (idx + 1) % list.length : 0;
    setCurrentTrackId(list[nextIdx]?.id ?? null);
    setTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const list = visibleTracks.length ? visibleTracks : tracks;
    if (!currentTrackId) {
      const id = list[list.length - 1]?.id ?? null;
      setCurrentTrackId(id);
      setTime(0);
      setIsPlaying(true);
      return;
    }
    const idx = list.findIndex((t) => t.id === currentTrackId);
    const prevIdx =
      idx >= 0 ? (idx - 1 + list.length) % list.length : list.length - 1;
    setCurrentTrackId(list[prevIdx]?.id ?? null);
    setTime(0);
    setIsPlaying(true);
  };

  // helper to stop and fully unload the global player
  const stopPlayback = () => {
    try {
      const el = getOrCreateGlobalIframe();
      // ask youtube iframe to stop (resets playback)
      try {
        el.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "stopVideo", args: [] }),
          "*"
        );
      } catch {
        /* ignore cross-origin errors */
      }
      // remove src to guarantee audio is released
      el.removeAttribute("src");
    } catch {
      /* ignore */
    }
    // update local state
    setIsPlaying(false);
    setCurrentTrackId(null);
    setIframeSrc(null);
    setTime(0);
  };

  // listen for external stop requests (UI can dispatch this)
  useEffect(() => {
    const handler = () => stopPlayback();
    window.addEventListener("requestStopMusic", handler as EventListener);
    return () =>
      window.removeEventListener("requestStopMusic", handler as EventListener);
  }, []);

  // UI rendering: always use iframeSrc when rendering the hidden iframe
  if (showCompact) {
    if (embedded) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <MusicCard
            onOpenMusic={() => setShowCompact(false)}
            trackTitle={currentTrack?.title}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </motion.div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <MusicCard
            onOpenMusic={() => setShowCompact(false)}
            trackTitle={currentTrack?.title}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={
        embedded
          ? `w-full h-full rounded-[28px] shadow-md border overflow-hidden p-8 transition-colors ${
              darkMode
                ? "bg-[#101828] border-[#2a3f5f]"
                : "bg-card border-border"
            }`
          : `min-h-screen p-8 transition-colors ${
              darkMode
                ? "bg-[#101828]"
                : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
            }`
      }
      style={
        embedded && themeBackground && themeBackground.includes("url")
          ? {
              backgroundColor: darkMode
                ? "rgba(16, 24, 40, 0.3)"
                : "rgba(255, 255, 255, 0.3)",
            }
          : !embedded && themeBackground && themeBackground.includes("url")
          ? {
              backgroundColor: darkMode
                ? "rgba(16, 24, 40, 0.3)"
                : "rgba(255, 255, 255, 0.3)",
            }
          : {}
      }
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 bg-linear-to-br from-yellow-400/90 to-orange-500/90 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎧</span>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Focus Music
            </h3>
            {currentTrackId ? (
              <p
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-yellow-600"
                }`}
              >
                {isPlaying ? "▶ Now Playing:" : "⏸ Paused:"}{" "}
                {currentTrack?.title}
              </p>
            ) : (
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Curated playlists to boost your productivity
              </p>
            )}
          </div>

          {embedded && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Show compact music card"
              onClick={() => setShowCompact(true)}
              className={`p-3 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-75 ${
                darkMode
                  ? "bg-[#1d2942] border-[#2a3f5f] text-yellow-400"
                  : "bg-white/80 border-gray-200 text-yellow-500"
              }`}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.button>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? `bg-linear-to-r ${tab.color} text-white shadow-lg`
                    : darkMode
                    ? "bg-[#1d2942] text-gray-300 hover:bg-[#253548] shadow-sm border border-[#2a3f5f]"
                    : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Track List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {visibleTracks.length === 0 ? (
              <div className="text-center py-16">
                <Music
                  className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  No tracks for this category yet.
                </p>
              </div>
            ) : (
              visibleTracks.map((track, index) => {
                const isThisPlaying = isPlaying && currentTrackId === track.id;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
                      darkMode
                        ? `bg-[#0f1419] border-[#2a3f5f] ${
                            isThisPlaying ? "ring-2 ring-yellow-400" : ""
                          }`
                        : `bg-white/80 border-gray-200 ${
                            isThisPlaying ? "ring-2 ring-yellow-400" : ""
                          }`
                    }`}
                  >
                    {isThisPlaying && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500">
                        <motion.div
                          className="h-full bg-white/30"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        animate={isThisPlaying ? { rotate: 360 } : {}}
                        className={`w-14 h-14 bg-gradient-to-br ${
                          tabs.find((t) => t.id === track.genre)?.color ||
                          "from-gray-400 to-gray-500"
                        } rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        {isThisPlaying ? (
                          <Disc3 className="w-7 h-7 text-white animate-spin" />
                        ) : (
                          <Music className="w-7 h-7 text-white" />
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold truncate ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {track.title}
                          {track.isPremium && (
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                darkMode
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              ⭐ Premium
                            </span>
                          )}
                        </h3>
                        <p
                          className={`text-sm truncate ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {track.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isThisPlaying && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                              darkMode
                                ? "bg-[#1d2942] text-gray-300"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            <span className="font-mono">
                              {formatTime(time)} / {track.duration}
                            </span>
                          </motion.div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (isThisPlaying) {
                              setIsPlaying(false);
                            } else if (currentTrackId === track.id) {
                              setIsPlaying(true);
                            } else {
                              setCurrentTrackId(track.id);
                              setTime(0);
                              setIsPlaying(true);
                            }
                          }}
                          className={`p-4 rounded-2xl transition-all shadow-md ${
                            isThisPlaying
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : darkMode
                              ? "bg-[#1d2942] text-gray-300 hover:bg-[#253548]"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {isThisPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FocusMusicApp;
