import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Header from "../Components/header";
import FocusMusicApp from "../Pages/music/Musictask";
import { useTheme } from "../context/ThemeContext";

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
  >("popular");
  const { darkMode } = useTheme();

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

      // notify music player about fullscreen change so it can resume audio if needed
      try {
        window.dispatchEvent(
          new CustomEvent("fullscreenToggled", {
            detail: { action: isFs ? "enter" : "exit" },
          })
        );
      } catch {
        /* ignore in older browsers */
      }
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

  return (
    <div
      ref={cardRef}
      // when fullscreen make this the fullscreen container and center the inner card
      className={`transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 flex items-center justify-center overflow-auto p-6"
          : ""
      }`}
      style={
        isFullscreen
          ? themeBackground
            ? { background: "transparent" }
            : darkMode
            ? { background: "transparent" }
            : { background: "#ffffff" }
          : {}
      }
    >
      <div
        // remove border when fullscreen
        className={`bg-white ${
          isFullscreen ? "" : "border border-border"
        } backdrop-blur-lg text-foreground rounded-[28px] p-6 md:p-8 transition-all w-full ${
          isFullscreen ? "max-w-4xl mx-4 my-8" : ""
        }`}
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
                  className="px-3 py-1 rounded-full bg-secondary border border-border hover:bg-accent hover:shadow-md text-md transition-colors cursor-pointer"
                >
                  🛠️
                </button>

                {/* Change time / presets popup (restored from modified) */}
                {showPicker && (
                  <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 w-72 max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold   text-gray-800 flex items-center gap-2">
                        ⚙️ Timer Settings
                      </h3>
                      <button
                        onClick={() => setShowPicker(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Presets Section */}
                    <div className="mb-5">
                      <div className="text-sm font-semibold text-gray-600 mb-2">
                        📋 Quick Presets
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
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border-2 transition-all duration-200 ${
                                active
                                  ? "bg-linear-to-r from-blue-50 to-indigo-50 border-blue-400 shadow-md"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                    active
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {active && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm font-medium ${
                                    active ? "text-blue-700" : "text-gray-700"
                                  }`}
                                >
                                  {p.label}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-gray-500">
                                {p.focus} • {p.short} • {p.long}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Custom Settings */}
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        🎨 Custom Duration
                      </div>
                      <div className="space-y-2">
                        {/* Pomodoro Slider */}
                        <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-xl p-3 border border-red-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                              🎯 Focus
                            </span>
                            <span className="text-sm font-bold text-red-600 bg-white px-2 py-0.5 rounded-full">
                              {sliderMinutes} min
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={100}
                            value={sliderMinutes}
                            onChange={(e) => {
                              setSelectedPreset("custom");
                              setSliderMinutes(
                                Math.min(
                                  100,
                                  Math.max(1, Number(e.target.value))
                                )
                              );
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                          />
                        </div>

                        {/* Short Break Slider */}
                        <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                              ☕ Short Rest
                            </span>
                            <span className="text-sm font-bold text-yellow-600 bg-white px-2 py-0.5 rounded-full">
                              {sliderShort} min
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={100}
                            value={sliderShort}
                            onChange={(e) => {
                              setSelectedPreset("custom");
                              setSliderShort(
                                Math.min(
                                  100,
                                  Math.max(1, Number(e.target.value))
                                )
                              );
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                          />
                        </div>

                        {/* Long Break Slider */}
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                              🌴 Long Rest
                            </span>
                            <span className="text-sm font-bold text-green-600 bg-white px-2 py-0.5 rounded-full">
                              {sliderLong} min
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={100}
                            value={sliderLong}
                            onChange={(e) => {
                              setSelectedPreset("custom");
                              setSliderLong(
                                Math.min(
                                  100,
                                  Math.max(1, Number(e.target.value))
                                )
                              );
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                          />
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={() => {
                            const focusVal = Math.min(
                              100,
                              Math.max(1, sliderMinutes)
                            );
                            const restVal = Math.min(
                              100,
                              Math.max(1, sliderShort)
                            );
                            const longVal = Math.min(
                              100,
                              Math.max(1, sliderLong)
                            );
                            setIsRunning(false);
                            setIsBreak(false);
                            setSelectedFocus(focusVal);
                            setShortBreak(restVal);
                            setLongBreak(longVal);
                            setTimeLeft(focusVal * 60);
                            setShowPicker(false);
                            setSelectedPreset("custom");
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                          ✓ Apply Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <span
              className={`text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-2 rounded-full ${
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
                  <feComposite
                    operator="over"
                    in="shadow"
                    in2="SourceGraphic"
                  />
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
                strokeWidth="12"
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
                strokeWidth="8"
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
                    width="36"
                    height="36"
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
                onClick={() => {
                  // just open the music modal — do not pause the global player
                  setIsMusicOpen(true);
                }}
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
        {/* Music modal (kept mounted so player doesn't unmount on close) */}
        <div
          // keep mounted to preserve iframe/player state; toggle visibility via opacity & pointer-events
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
            isMusicOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          // click outside content closes modal
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMusicOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl p-4 md:p-6 relative shadow-xl w-[944px] h-auto max-h-[90vh] overflow-auto">
            {/* removed internal Close button — click outside overlay to close */}
            <FocusMusicApp embedded={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
