import React, { useState, useEffect } from "react";
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
import MusicCard from "../../Components/MusicCard";

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

const FocusMusicApp: React.FC<{ embedded?: boolean }> = ({
  embedded = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>("lofi");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [time, setTime] = useState<number>(0);
  const [showCompact, setShowCompact] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (playingTrack) {
      setTime(0);
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [playingTrack]);

  const tracks: Track[] = [
    {
      id: "1",
      title: "Lo-Fi Chill Beat",
      category: "Lo-Fi Focus",
      description: "Soft beats perfect for deep work 🎧",
      duration: "3:50",
      genre: "lofi",
      youtubeId: "BrnDlRmW5hs",
    },
    {
      id: "2",
      title: "Late Night Groove",
      category: "Lo-Fi Lounge",
      description: "Smooth background music for creativity 🌙",
      duration: "4:10",
      genre: "lofi",
      youtubeId: "Viu_ptw9MrU",
    },
    {
      id: "3",
      title: "Coffee Shop Vibes",
      category: "Study Flow",
      description: "Cozy atmosphere with gentle melodies ☕",
      duration: "1:00",
      genre: "nature",
    },
    {
      id: "4",
      title: "Midnight Study",
      category: "Focus Collective",
      description: "Late night concentration companion 🌙",
      duration: "1:00",
      isPremium: true,
      genre: "ambient",
    },
    {
      id: "5",
      title: "Peaceful Flow",
      category: "Calm Minds",
      description: "Gentle melodies for sustained focus 🧘",
      duration: "1:00",
      genre: "focus",
    },
  ];

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

  const visibleTracks = tracks.filter((t) => t.genre === activeTab);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(1, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentTrack = tracks.find((t) => t.id === playingTrack);

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
            isPlaying={!!playingTrack}
            onTogglePlay={() =>
              setPlayingTrack((p) =>
                p ? null : visibleTracks[0]?.id ?? tracks[0].id
              )
            }
          />
          {currentTrack?.youtubeId && (
            <iframe
              className="w-0 h-0 invisible"
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1`}
              title={currentTrack.title}
              allow="autoplay; encrypted-media"
            />
          )}
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
            isPlaying={!!playingTrack}
            onTogglePlay={() =>
              setPlayingTrack((p) =>
                p ? null : visibleTracks[0]?.id ?? tracks[0].id
              )
            }
          />
        </motion.div>
        {currentTrack?.youtubeId && (
          <iframe
            className="w-0 h-0 invisible"
            src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1`}
            title={currentTrack.title}
            allow="autoplay; encrypted-media"
          />
        )}
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
          ? "w-full h-full bg-card rounded-[28px] shadow-md border border-border overflow-hidden p-8"
          : "min-h-screen p-8"
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
            {playingTrack ? (
              <p className="text-sm text-yellow-600 font-medium">
                ▶ Now Playing: {currentTrack?.title}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
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
              className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-75"
            >
              <ChevronDown className="w-6 h-6 text-yellow-500" />
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
                onClick={() => {
                  setActiveTab(tab.id);
                  setPlayingTrack(null);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? `bg-linear-to-r ${tab.color} text-white shadow-lg`
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
                <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No tracks for this category yet.
                </p>
              </div>
            ) : (
              visibleTracks.map((track, index) => {
                const isPlaying = playingTrack === track.id;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${
                      isPlaying ? "ring-2 ring-yellow-400" : ""
                    }`}
                  >
                    {isPlaying && (
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
                        animate={isPlaying ? { rotate: 360 } : {}}
                        className={`w-14 h-14 bg-gradient-to-br ${
                          tabs.find((t) => t.id === track.genre)?.color ||
                          "from-gray-400 to-gray-500"
                        } rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        {isPlaying ? (
                          <Disc3 className="w-7 h-7 text-white animate-spin" />
                        ) : (
                          <Music className="w-7 h-7 text-white" />
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {track.title}
                          {track.isPremium && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              ⭐ Premium
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {track.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isPlaying && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg"
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
                          onClick={() =>
                            setPlayingTrack(isPlaying ? null : track.id)
                          }
                          className={`p-4 rounded-2xl transition-all shadow-md ${
                            isPlaying
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {isPlaying ? (
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

      {currentTrack?.youtubeId && (
        <iframe
          className="w-0 h-0 invisible"
          src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1`}
          title={currentTrack.title}
          allow="autoplay; encrypted-media"
        />
      )}
    </motion.div>
  );
};

export default FocusMusicApp;
