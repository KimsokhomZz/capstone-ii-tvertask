import React, { useState, useEffect } from "react";
import {
  Music,
  Cloud,
  Zap,
  Headphones,
  Play,
  Pause,
  ChevronDown,
} from "lucide-react";
import MusicCard from "../../components/MusicCard";

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

// added optional prop so parent can request embedded (inline) compact card
const FocusMusicApp: React.FC<{ embedded?: boolean }> = ({
  embedded = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>("lofi");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [time, setTime] = useState<number>(0); // current play time in seconds
  const [showCompact, setShowCompact] = useState<boolean>(false); // new state

  // shared volume (0-100) used by MusicCard; parent keeps the value so compact/full versions stay in sync
  const [volume, setVolume] = useState<number>(50);

  // simulate timer since we can’t read actual YouTube progress
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
      youtubeId: "Viu_ptw9MrU", // 👈 new track
    },
    {
      id: "3",
      title: "Coffee Shop Vibes",
      category: "Study Flow",
      description: "Cozy atmosphere with gentle melodies",
      duration: "1:00",
      genre: "nature",
    },
    {
      id: "4",
      title: "Midnight Study",
      category: "Focus Collective",
      description: "Late night concentration companion",
      duration: "1:00",
      isPremium: true,
      genre: "ambient",
    },
    {
      id: "5",
      title: "Peaceful Flow",
      category: "Calm Minds",
      description: "Gentle melodies for sustained focus",
      duration: "1:00",
      genre: "focus",
    },
  ];

  const tabs = [
    { id: "lofi", label: "Lo-Fi", icon: Music },
    { id: "nature", label: "Nature", icon: Cloud },
    { id: "ambient", label: "Ambient", icon: Zap },
    { id: "focus", label: "Focus", icon: Headphones },
  ];

  const visibleTracks = tracks.filter((t) => t.genre === activeTab);

  // helper to format seconds → mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(1, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // find currently playing track (used to keep the audio iframe mounted)
  const currentTrack = tracks.find((t) => t.id === playingTrack);

  // when compact mode is active, render compact MusicCard inline if embedded,
  // otherwise render the centered full-page compact view.
  if (showCompact) {
    if (embedded) {
      return (
        // inline compact version — no min-h-screen, minimal spacing so parent layout isn't affected
        <div className="mb-4">
          <MusicCard
            onOpenMusic={() => setShowCompact(false)}
            volume={volume}
            onVolumeChange={setVolume}
          />
          {/* keep audio iframe mounted so playback continues while compact is shown */}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <MusicCard
          onOpenMusic={() => setShowCompact(false)}
          volume={volume}
          onVolumeChange={setVolume}
        />
        {/* keep audio iframe mounted so playback continues while compact is shown */}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        {/* toggle between header and compact MusicCard */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-[#F9C80E] rounded-2xl flex items-center justify-center">
            <Music className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">Focus Music</h3>
          <button
            aria-label="Show compact music card"
            onClick={() => setShowCompact(true)}
            className="ml-auto"
          >
            <ChevronDown className="w-10 h-10 text-[#F9C80E]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPlayingTrack(null); // stop when switching
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                  isActive
                    ? "bg-[#F9C80E] text-white shadow-lg shadow-emerald-200"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Track List */}
        <div className="space-y-4">
          {visibleTracks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No tracks for this category.
            </div>
          ) : (
            visibleTracks.map((track) => {
              const isPlaying = playingTrack === track.id;
              return (
                <div
                  key={track.id}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-purple-500" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {track.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {track.description}
                      </p>
                    </div>

                    {/* Play button here */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setPlayingTrack(isPlaying ? null : track.id)
                        }
                        className="p-3 hover:bg-gray-100 rounded-full transition"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Time tracker */}
                  {isPlaying && (
                    <div className="mt-3 text-sm text-gray-500">
                      {formatTime(time)} / {track.duration}
                    </div>
                  )}

                  {/* removed per-track iframe; a single persistent iframe is kept below */}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* persistent (hidden) YouTube iframe so audio keeps playing even when UI switches */}
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
};

export default FocusMusicApp;
