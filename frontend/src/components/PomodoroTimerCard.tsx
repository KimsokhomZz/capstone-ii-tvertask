import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Header from "./header";
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
  task?: {
    short_break?: number;
    long_break?: number;
  };
  taskTitle?: string;
  defaultFocus?: number;
  onComplete?: () => void;
  themeBackground?: string; // ⬅ NEW
};

export default function PomodoroTimerCard({
  task,
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
  const [shortBreak, setShortBreak] = useState(task?.short_break ?? 5);
  const [longBreak, setLongBreak] = useState(task?.long_break ?? 15);
  const [showPicker, setShowPicker] = useState(false);
  const [sliderMinutes, setSliderMinutes] = useState<number>(defaultFocus);
  const [sliderShort, setSliderShort] = useState<number>(5);
  const [sliderLong, setSliderLong] = useState<number>(15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<
    "baby" | "popular" | "medium" | "extended" | "custom"
  >("custom");

  const CLAIM_XP_AMOUNT = 20;

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
            onComplete?.();
            setIsRunning(false);
            toast.success(`🎉 Pomodoro complete! Added ${CLAIM_XP_AMOUNT} XP!`);
            setIsBreak(true);
            const isLong = shortsSinceLong === 4;
            setTimeLeft((isLong ? longBreak : shortBreak) * 60);
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
      bg-white border border-border backdrop-blur-lg text-foreground rounded-[28px] shadow-md p-6 md:p-8 transition-all
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
        className={`flex items-center justify-between w-full max-w-3xl mb-5 mx-auto `}
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
          className={`relative ${isFullscreen ? "h-88 w-88" : "h-72 w-88"}`}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              {/* Soft inner shadow for background ring */}
              <filter
                id="innerShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feOffset dx="0" dy="2" />
                <feGaussianBlur stdDeviation="2" result="offset-blur" />
                <feComposite
                  operator="out"
                  in="SourceGraphic"
                  in2="offset-blur"
                  result="inverse"
                />
                <feFlood
                  floodColor="#E5E7EB"
                  floodOpacity="0.8"
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

              {/* Outer glow effect for progress ring */}
              <filter
                id="progressGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Drop shadow for progress ring */}
              <filter
                id="dropShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feFlood floodColor="#000000" floodOpacity="0.15" />
                <feComposite in2="offsetblur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Smooth 5-color gradient: Red → Orange → Yellow → Light Green → Green */}
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="25%" stopColor="#F97316" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="75%" stopColor="#84CC16" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>

              {/* Subtle gradient for background ring */}
              <linearGradient
                id="bgRingGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F9FAFB" />
                <stop offset="100%" stopColor="#F3F4F6" />
              </linearGradient>

              {/* Shimmer effect (optional animation) */}
              <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                <animate
                  attributeName="x1"
                  values="-100%;200%"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  values="0%;300%"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>

            {/* Background ring with gradient and shadow */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="16"
              fill="transparent"
              stroke="url(#bgRingGradient)"
              filter="url(#innerShadow)"
              className="transition-all duration-300"
            />

            {/* Subtle inner glow on background */}
            <circle
              cx="100"
              cy="100"
              r={radius - 8}
              strokeWidth="2"
              fill="transparent"
              stroke="white"
              opacity="0.5"
              className="transition-all duration-300"
            />

            {/* Progress ring with gradient, glow, and shadow */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="14"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - clampedProgress)}
              strokeLinecap="round"
              filter="url(#progressGlow)"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transition:
                  "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="drop-shadow-lg"
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
              y="95"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-xl fill-current text-yellow-400 font-mono font-bold"
            >
              {formatTime(timeLeft)}
            </text>
            <text
              x="100"
              y="115"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-[10px] fill-current text-gray-500 font-semibold"
            >
              {displayPercentage}% Complete
            </text>
          </svg>
        </div>
      </div>
      {/* Title + subtext */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center space-y-3 mb-6">
          {/* Task Title */}
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight text-center">
            {taskTitle}
          </h2>

          {/* Status Badge with Icon and Animation */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-linear-to-r from-yellow-50 to-green-50 border border-yellow-200/50 shadow-sm">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              {isBreak ? (
                <>
                  <span className="text-base">☕</span>
                  {shortsSinceLong === 4
                    ? `Long Rest ${completedLongRests + 1}`
                    : `Rest ${completedRests + 1}`}
                </>
              ) : (
                <>
                  <span className="text-base">🎯</span>
                  Pomodoro {completedPomodoros + 1}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleTimer}
            className="px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-accent hover:shadow-md text-black cursor-pointer transition-colors"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          {isFullscreen && (
            <button
              onClick={() => setIsMusicOpen(true)}
              className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-yellow-50 hover:shadow-md text-gray-800 cursor-pointer transition-colors"
            >
              Music
            </button>
          )}
          <button
            onClick={() => {
              if (!isBreak) {
                setCompletedPomodoros((v) => v + 1);
                setIsRunning(false);
                toast.success(
                  `🎉 Pomodoro complete! Added ${CLAIM_XP_AMOUNT} XP!`,
                  {
                    className: "text-sm font-medium",
                  }
                );
                setIsBreak(true);
                const isLong = shortsSinceLong === 4;
                setTimeLeft((isLong ? longBreak : shortBreak) * 60);
                onComplete?.();
                return 0;
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
            className="px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-accent hover:shadow-md text-black cursor-pointer transition-colors"
          >
            Complete
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-accent hover:shadow-md text-black cursor-pointer transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen?.();
              } else {
                cardRef.current?.requestFullscreen?.();
              }
            }}
            className="px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-accent hover:shadow-md text-black cursor-pointer transition-colors"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
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
    </div>
  );
}
