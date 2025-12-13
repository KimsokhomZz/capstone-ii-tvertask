import { useEffect, useMemo, useRef, useState } from "react";
// import { Target } from "lucide-react";
import Header from "./header";
import ClaimXpModal from "./ClaimXpModal";
import FocusMusicApp from "../Pages/music/Musictask";
import {
  Settings,
  Play,
  Pause,
  Check,
  RotateCcw,
  Maximize,
  Minimize,
  Music,
} from "lucide-react";

type PomodoroTimerCardProps = {
  taskTitle?: string;
  defaultFocus?: number;
  onComplete?: () => void;
  themeBackground?: string; // ⬅ NEW
};

export default function PomodoroTimerCard({
  taskTitle = "Task 1",
  defaultFocus = 25,
  onComplete,
  themeBackground = "",
}: PomodoroTimerCardProps) {
  // --- ORIGINAL LOGIC STATES (kept exactly) ---
  const [selectedFocus, setSelectedFocus] = useState<number>(defaultFocus);
  const [timeLeft, setTimeLeft] = useState(defaultFocus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [completedRests, setCompletedRests] = useState(0);
  const [completedLongRests, setCompletedLongRests] = useState(0);
  const [shortsSinceLong, setShortsSinceLong] = useState(0);
  const [shortBreak, setShortBreak] = useState<number>(5);
  const [longBreak, setLongBreak] = useState<number>(15);

  // --- UI / Presets / Picker (from modified file) ---
  const [showPicker, setShowPicker] = useState(false);
  const [sliderMinutes, setSliderMinutes] = useState<number>(defaultFocus);
  const [sliderShort, setSliderShort] = useState<number>(5);
  const [sliderLong, setSliderLong] = useState<number>(15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<
    "baby" | "popular" | "medium" | "extended" | "custom"
  >("custom");

  // Claim modal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const CLAIM_XP_AMOUNT = 20; // change if you want variable amount

  const presets = [
    { key: "baby" as const, label: "Baby step", focus: 10, short: 5, long: 10 },
    {
      key: "popular" as const,
      label: "Popular",
      focus: 20,
      short: 5,
      long: 15,
    },
    { key: "medium" as const, label: "Medium", focus: 40, short: 8, long: 20 },
    {
      key: "extended" as const,
      label: "Extended",
      focus: 60,
      short: 10,
      long: 25,
    },
  ];

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Toggle timer uses original isRunning state
  const toggleTimer = () => setIsRunning((v) => !v);

  const resetTimer = () => {
    setIsRunning(false);
    const isLong = shortsSinceLong === 4;
    const breakLen = isLong ? longBreak : shortBreak;
    setTimeLeft((isBreak ? breakLen : selectedFocus) * 60);
  };

  // --- ORIGINAL timer useEffect (kept intact) ---
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!isBreak) {
            setCompletedPomodoros((v) => v + 1);
            // Open claim modal instead of immediately notifying parent.
            // Parent will be called when user clicks "Claim XP".
            setIsRunning(false);
            setShowClaimModal(true);
            return 0; // show 00:00 until user picks claim / later
          } else {
            const wasLong = shortsSinceLong === 4;
            if (wasLong) {
              setCompletedLongRests((v) => v + 1);
              setShortsSinceLong(0);
            } else {
              setCompletedRests((v) => v + 1);
              setShortsSinceLong((v) => Math.min(4, v + 1));
            }
            setIsBreak(false);
            return selectedFocus * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // dependencies kept same as original
  }, [
    isRunning,
    isBreak,
    selectedFocus,
    shortsSinceLong,
    shortBreak,
    longBreak,
  ]);

  // When break/selectedFocus/shortsSinceLong/shortBreak/longBreak changes, update timeLeft (original)
  useEffect(() => {
    const isLong = shortsSinceLong === 4;
    setTimeLeft(
      (isBreak ? (isLong ? longBreak : shortBreak) : selectedFocus) * 60
    );
  }, [isBreak, selectedFocus, shortsSinceLong, shortBreak, longBreak]);

  // Track fullscreen changes to update label and styles (original)
  useEffect(() => {
    const handler = () => {
      const isFs = document.fullscreenElement === cardRef.current;
      setIsFullscreen(isFs);
      // when exiting fullscreen hide/stop the music control
      if (!isFs) setIsMusicOpen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const totalSeconds = useMemo(() => {
    const isLong = shortsSinceLong === 4;
    return (isBreak ? (isLong ? longBreak : shortBreak) : selectedFocus) * 60;
  }, [isBreak, selectedFocus, shortsSinceLong, shortBreak, longBreak]);

  // original progress formula
  const progress = useMemo(
    () => 1 - timeLeft / totalSeconds,
    [timeLeft, totalSeconds]
  );
  // clamp progress for visuals
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const displayPercentage = Math.round(clampedProgress * 100);

  // SVG ring values (use r=80 to match modified UI)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, clampedProgress)) * circumference;

  return (
    <div
      ref={cardRef}
      className={`
      bg-white/30 backdrop-blur-lg text-foreground rounded-[28px] shadow-xl border border-white/30 p-6 md:p-8 transition-all
      ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen w-screen overflow-y-auto"
          : ""
      }
    `}
      style={isFullscreen ? { background: "transparent" } : {}}
    >
      {" "}
      {isFullscreen && themeBackground && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage:
              themeBackground && themeBackground.includes("url")
                ? themeBackground.match(/url\(['"]?([^'")]+)['"]?\)/)?.[0] ||
                  "none"
                : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {/* Header */}
      <div
        className={`flex items-center justify-between w-full max-w-3xl mt-5 mx-auto `}
      >
        {!isFullscreen && (
          <Header
            title="Focus Session"
            icon={<span className="text-4xl">🎯</span>}
            titleClassName="text-xs md:text-md"
          />
        )}
        <div className="flex items-center gap-2 relative">
          {!isBreak && (
            <div>
              <button
                onClick={() => setShowPicker((s) => !s)}
                className="px-3 py-1 rounded-xl bg-secondary text-black border border-border hover:bg-accent hover:shadow-md text-sm transition-colors cursor-pointer"
              >
                <Settings size={20} className="w-6 h-6 " />
              </button>

              {/* Change time / presets popup (restored from modified) */}
              {showPicker && (
                <div className="absolute right-0 mt-2 z-10 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg p-3 w-64">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      Customize focus level
                    </div>
                    <div className="space-y-1">
                      {presets.map((p) => {
                        const active = selectedPreset === p.key;
                        return (
                          <button
                            key={p.key}
                            onClick={() => {
                              const f = Math.min(100, p.focus);
                              const s = Math.min(100, p.short);
                              const l = Math.min(100, p.long);
                              setSelectedPreset(p.key);
                              setIsRunning(false);
                              setIsBreak(false);
                              setSelectedFocus(f);
                              setShortBreak(s);
                              setLongBreak(l);
                              setSliderMinutes(f);
                              setSliderShort(s);
                              setSliderLong(l);
                              setTimeLeft(f * 60);
                              setShowPicker(false);
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left border ${
                              active
                                ? "bg-accent/50 border-primary"
                                : "border-border hover:bg-accent/30 hover:shadow-md dark:bg-gray-800/50"
                            } ${
                              active
                                ? "text-black"
                                : "text-black/90 hover:text-black"
                            } cursor-pointer`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block h-3.5 w-3.5 rounded-full border ${
                                  active
                                    ? "border-primary ring-2 ring-primary/60"
                                    : "border-border dark:border-gray-600"
                                }`}
                              />
                              <span className="text-sm text-black">
                                {p.label}
                              </span>
                            </div>
                            <span className="text-md text-foreground">
                              {p.focus} • {p.short} • {p.long} min
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-sm font-medium text-foreground mb-2">
                    Custom (1–100 min)
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-md text-foreground mb-1">
                        <span>Pomodoro</span>
                        <span>{sliderMinutes} min</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={sliderMinutes}
                        onChange={(e) => {
                          setSelectedPreset("custom");
                          setSliderMinutes(
                            Math.min(100, Math.max(1, Number(e.target.value)))
                          );
                        }}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Rest</span>
                        <span>{sliderShort} min</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={sliderShort}
                        onChange={(e) => {
                          setSelectedPreset("custom");
                          setSliderShort(
                            Math.min(100, Math.max(1, Number(e.target.value)))
                          );
                        }}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Long Rest</span>
                        <span>{sliderLong} min</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        value={sliderLong}
                        onChange={(e) => {
                          setSelectedPreset("custom");
                          setSliderLong(
                            Math.min(100, Math.max(1, Number(e.target.value)))
                          );
                        }}
                        className="w-full"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const focusVal = Math.min(
                          100,
                          Math.max(1, sliderMinutes)
                        );
                        const restVal = Math.min(100, Math.max(1, sliderShort));
                        const longVal = Math.min(100, Math.max(1, sliderLong));
                        setIsRunning(false);
                        setIsBreak(false);
                        setSelectedFocus(focusVal);
                        setShortBreak(restVal);
                        setLongBreak(longVal);
                        setTimeLeft(focusVal * 60);
                        setShowPicker(false);
                        setSelectedPreset("custom");
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-primary border border-border text-black text-sm hover:bg-accent hover:text-foreground hover:shadow-md cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <span
            className={`bg-accent text-accent-foreground px-4 py-1.5 rounded-full ${
              isFullscreen ? "text-base font-medium" : "text-sm"
            }`}
          >
            {isBreak
              ? shortsSinceLong === 4
                ? `${longBreak}m`
                : `${shortBreak}m`
              : `${selectedFocus}m`}
          </span>
        </div>
      </div>
      {/* TIMER SVG + Ben10 character (modified UI) */}
      <div className="flex justify-center items-center">
        <div
          ref={timerContainerRef}
          className={`relative mb-6 ${
            isFullscreen ? "h-88 w-88" : "h-72 w-88"
          }`}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <filter
                id="innerShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feOffset dx="0" dy="1" />
                <feGaussianBlur stdDeviation="0.5" result="offset-blur" />
                <feComposite
                  operator="out"
                  in="SourceGraphic"
                  in2="offset-blur"
                  result="inverse"
                />
                <feFlood
                  floodColor="#D9D9D9"
                  floodOpacity="0.9"
                  result="color"
                />
                <feComposite
                  operator="in"
                  in="color"
                  in2="inverse"
                  result="shadow"
                />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>

              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#de4a4aff" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {/* background ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="20"
              fill="transparent"
              filter="url(#innerShadow)"
              className="fill-transparent stroke-white"
            />

            {/* progress trail */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - clampedProgress)}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />

            {/* character on ring using same progress */}
            <g transform={`rotate(${360 * clampedProgress} 100 100)`}>
              <g transform="translate(101, 20)">
                <image
                  href={
                    isRunning
                      ? "/promodoro/ben10-running.gif"
                      : "/promodoro/ben10-stand.gif"
                  }
                  width="38"
                  height="38"
                  x="-15"
                  y="-22"
                />
              </g>
            </g>

            {/* center timer text */}
            <text
              x="100"
              y="100"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-xl fill-current text-yellow-400 font-mono font-bold"
            >
              {formatTime(timeLeft)}
            </text>
          </svg>

          <div className="text-md text-center text-foreground mb-1">
            {displayPercentage}% Complete
          </div>
        </div>
      </div>
      {/* Title + subtext */}
      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold text-foreground mb-1">
          {taskTitle}
        </div>
        <div className="text-md text-foreground mb-3">
          {isBreak
            ? shortsSinceLong === 4
              ? `Long Rest ${completedLongRests + 1}`
              : `Rest ${completedRests + 1}`
            : `Pomodoro ${completedPomodoros + 1}`}
        </div>
      </div>
      {/* Controls including Complete button (restored) */}
      <div className="flex items-center gap-4 justify-center mb-3">
        {/* Start / Pause */}
        <button
          onClick={toggleTimer}
          className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-yellow-200 hover:shadow-md transition !cursor-pointer"
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Complete */}
        <button
          onClick={() => {
            if (!isBreak) {
              setIsRunning(false);
              setShowClaimModal(true);
            } else {
              const wasLong = shortsSinceLong === 4;
              if (wasLong) {
                setCompletedLongRests((v) => v + 1);
                setShortsSinceLong(0);
              } else {
                setCompletedRests((v) => v + 1);
                setShortsSinceLong((v) => Math.min(4, v + 1));
              }
              setIsBreak(false);
              setIsRunning(false);
              setTimeLeft(selectedFocus * 60);
            }
          }}
          className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-accent hover:shadow-md transition !cursor-pointer"
          title="Complete"
        >
          <Check size={20} />
        </button>

        {/* Reset */}
        <button
          onClick={resetTimer}
          className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-accent hover:shadow-md transition !cursor-pointer"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen?.();
            } else {
              cardRef.current?.requestFullscreen?.();
            }
          }}
          className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-accent hover:shadow-md transition !cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Music (fullscreen only) */}
        {isFullscreen && (
          <button
            onClick={() => setIsMusicOpen(true)}
            className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-yellow-50 hover:shadow-md transition !cursor-pointer"
            title="Music"
          >
            <Music size={20} />
          </button>
        )}
      </div>
      {/* Music modal (inside the card) */}
      {isMusicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-4 md:p-6 relative shadow-xl w-[944px] h-auto max-h-[90vh] overflow-auto">
            <button
              onClick={() => setIsMusicOpen(false)}
              className="absolute top-3 right-3 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 !cursor-pointer"
            >
              Close
            </button>
            <FocusMusicApp embedded={true} />
          </div>
        </div>
      )}
      {/* Claim XP Modal (inside the card) */}
      <ClaimXpModal
        open={showClaimModal}
        xpAmount={CLAIM_XP_AMOUNT}
        onClaim={async () => {
          try {
            await onComplete?.();
            // Only after successful claim, increment the counter and move to rest
            setCompletedPomodoros((v) => v + 1);
            const isLong = shortsSinceLong === 4;
            setIsBreak(true);
            setTimeLeft((isLong ? longBreak : shortBreak) * 60);
          } catch (e) {
            console.error("Failed to claim XP:", e);
          } finally {
            setShowClaimModal(false);
          }
        }}
        onClose={() => {
          // If they click "Later", still move to rest but don't give XP
          const isLong = shortsSinceLong === 4;
          setCompletedPomodoros((v) => v + 1);
          setIsBreak(true);
          setTimeLeft((isLong ? longBreak : shortBreak) * 60);
          setShowClaimModal(false);
        }}
      />
    </div>
  );
}
