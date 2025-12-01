import { useEffect, useMemo, useRef, useState } from "react";
// import { Target } from "lucide-react";
import Header from "../components/header";
import ClaimXpModal from "./ClaimXpModal";
import FocusMusicApp from "../Pages/music/Musictask";

type PomodoroTimerCardProps = {
  taskTitle?: string;
  defaultFocus?: number;
  onComplete?: () => void;
};

export default function PomodoroTimerCard({
  taskTitle = "Task 1",
  defaultFocus = 25,
  onComplete,
}: PomodoroTimerCardProps) {
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
  const [showPicker, setShowPicker] = useState(false);
  const [sliderMinutes, setSliderMinutes] = useState<number>(defaultFocus);
  const [sliderShort, setSliderShort] = useState<number>(5);
  const [sliderLong, setSliderLong] = useState<number>(15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<
    "baby" | "popular" | "medium" | "extended" | "custom"
  >("custom");

  // UI: show claim modal when a pomodoro completes
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

  const toggleTimer = () => setIsRunning((v) => !v);

  const resetTimer = () => {
    setIsRunning(false);
    const isLong = shortsSinceLong === 4;
    const breakLen = isLong ? longBreak : shortBreak;
    setTimeLeft((isBreak ? breakLen : selectedFocus) * 60);
  };

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
  }, [
    isRunning,
    isBreak,
    selectedFocus,
    shortsSinceLong,
    shortBreak,
    longBreak,
  ]);

  useEffect(() => {
    const isLong = shortsSinceLong === 4;
    setTimeLeft(
      (isBreak ? (isLong ? longBreak : shortBreak) : selectedFocus) * 60
    );
  }, [isBreak, selectedFocus, shortsSinceLong, shortBreak, longBreak]);

  // Track fullscreen changes to update label and styles
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
  const progress = useMemo(
    () => 1 - timeLeft / totalSeconds,
    [timeLeft, totalSeconds]
  );

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, progress)) * circumference;

  return (
    <div
      ref={cardRef}
      className={`bg-card text-foreground rounded-[28px] shadow-xl border border-border p-6 md:p-8 transition-colors ${
        isFullscreen
          ? "h-screen w-screen rounded-none border-0 flex flex-col items-center justify-center"
          : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <Header
          title="Focus Session"
          icon={<span className="text-4xl">🎯</span>}
          titleClassName="text-xs md:text-md"
        />
        <div className="flex items-center gap-2 relative">
          {!isBreak && (
            <div>
              <button
                onClick={() => setShowPicker((s) => !s)}
                className="px-3 py-1 rounded-xl bg-secondary text-black border border-border hover:bg-accent hover:shadow-md text-sm cursor-pointer transition-colors"
              >
                Change time
              </button>
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
                            }`}
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
                            <span className="text-xs text-muted-foreground">
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
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
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
          <span className="text-sm bg-accent text-accent-foreground px-3 py-1 rounded-full">
            {isBreak
              ? shortsSinceLong === 4
                ? `${longBreak}m`
                : `${shortBreak}m`
              : `${selectedFocus}m`}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div
          ref={timerContainerRef}
          className={`relative mb-6 ${
            isFullscreen ? "h-72 w-72" : "h-56 w-56"
          }`}
        >
          <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="14"
              fill="none"
              style={{ stroke: "var(--muted)" }}
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              fill="none"
              style={{ stroke: "var(--primary)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-foreground">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              {Math.round(progress * 100)}% Complete
            </div>
          </div>
        </div>

        <div className="text-lg font-semibold text-foreground mb-1">
          {taskTitle}
        </div>
        <div className="text-xs text-muted-foreground mb-3">
          {isBreak
            ? shortsSinceLong === 4
              ? `Long Rest ${completedLongRests + 1}`
              : `Rest ${completedRests + 1}`
            : `Pomodoro ${completedPomodoros + 1}`}
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
                // manual completion: show claim modal, don't immediately call parent
                setCompletedPomodoros((v) => v + 1);
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
      {/* Music popup/modal (only shown when music button opened) */}
      {isMusicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-4 md:p-6 relative shadow-xl w-[944px] h-auto max-h-[90vh] overflow-auto">
            <button
              onClick={() => setIsMusicOpen(false)}
              className="absolute top-3 right-3 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Close
            </button>
            {/* Render the music page/component inside the popup (embedded) */}
            <FocusMusicApp embedded={true} />
          </div>
        </div>
      )}

      <ClaimXpModal
        open={showClaimModal}
        xpAmount={CLAIM_XP_AMOUNT}
        onClaim={async () => {
          try {
            await onComplete?.();
          } catch (e) {
            console.warn("onComplete handler threw:", e);
          } finally {
            const isLong = shortsSinceLong === 4;
            setShowClaimModal(false);
            setIsBreak(true);
            setTimeLeft((isLong ? longBreak : shortBreak) * 60);
          }
        }}
        onClose={() => {
          const isLong = shortsSinceLong === 4;
          setShowClaimModal(false);
          setIsBreak(true);
          setTimeLeft((isLong ? longBreak : shortBreak) * 60);
        }}
      />
    </div>
  );
}
