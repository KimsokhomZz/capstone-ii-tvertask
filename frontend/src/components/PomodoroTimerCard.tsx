import { useEffect, useMemo, useRef, useState } from "react";

type PomodoroTimerCardProps = {
  taskTitle?: string;
  defaultFocus?: number;
};

export default function PomodoroTimerCard({ taskTitle = "Task 1", defaultFocus = 25 }: PomodoroTimerCardProps) {
  const [selectedFocus, setSelectedFocus] = useState<number>(defaultFocus);
  const [timeLeft, setTimeLeft] = useState(defaultFocus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [completedRests, setCompletedRests] = useState(0);
  const [completedLongRests, setCompletedLongRests] = useState(0);
  const [shortsSinceLong, setShortsSinceLong] = useState(0);
  const SHORT_BREAK = 5;
  const LONG_BREAK = 15;
  const [showPicker, setShowPicker] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsRunning((v) => !v);

  const resetTimer = () => {
    setIsRunning(false);
    const isLong = shortsSinceLong === 4;
    const breakLen = isLong ? LONG_BREAK : SHORT_BREAK;
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
            setIsBreak(true);
            const isLong = shortsSinceLong === 4;
            return (isLong ? LONG_BREAK : SHORT_BREAK) * 60;
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
  }, [isRunning, isBreak, selectedFocus, shortsSinceLong]);

  useEffect(() => {
    const isLong = shortsSinceLong === 4;
    setTimeLeft((isBreak ? (isLong ? LONG_BREAK : SHORT_BREAK) : selectedFocus) * 60);
  }, [isBreak, selectedFocus, shortsSinceLong]);

  const totalSeconds = useMemo(() => {
    const isLong = shortsSinceLong === 4;
    return (isBreak ? (isLong ? LONG_BREAK : SHORT_BREAK) : selectedFocus) * 60;
  }, [isBreak, selectedFocus, shortsSinceLong]);
  const progress = useMemo(() => 1 - timeLeft / totalSeconds, [timeLeft, totalSeconds]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, progress)) * circumference;

  return (
    <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Focus Session</h2>
        <div className="flex items-center gap-2 relative">
          {!isBreak && (
            <div>
              <button
                onClick={() => setShowPicker((s) => !s)}
                className="px-3 py-1 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm"
              >
                Change time
              </button>
              {showPicker && (
                <div className="absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-56">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[25, 30, 40].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setIsRunning(false);
                          setIsBreak(false);
                          setSelectedFocus(m);
                          setTimeLeft(m * 60);
                          setShowPicker(false);
                        }}
                        className={`px-2 py-1 rounded-lg text-sm border ${selectedFocus === m ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Custom minutes</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      placeholder="e.g. 50"
                    />
                    <button
                      onClick={() => {
                        const val = parseInt(customMinutes, 10);
                        if (!Number.isNaN(val) && val > 0) {
                          setIsRunning(false);
                          setIsBreak(false);
                          setSelectedFocus(val);
                          setTimeLeft(val * 60);
                          setShowPicker(false);
                          setCustomMinutes("");
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-yellow-400 text-white text-sm hover:bg-yellow-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <span className="text-sm bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
            {isBreak ? (shortsSinceLong === 4 ? `${LONG_BREAK}m` : `${SHORT_BREAK}m`) : `${selectedFocus}m`}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-56 w-56 mb-6">
          <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} stroke="#FFF7D6" strokeWidth="14" fill="none" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#FACC15"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500">
            <div className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</div>
            <div className="text-xs mt-1 text-yellow-600">{Math.round(progress * 100)}% Complete</div>
          </div>
        </div>

        <div className="text-lg font-semibold text-gray-800 mb-1">{taskTitle}</div>
        <div className="text-xs text-gray-500 mb-3">
          {isBreak ? (shortsSinceLong === 4 ? `Long Rest ${completedLongRests + 1}` : `Rest ${completedRests + 1}`) : `Pomodoro ${completedPomodoros + 1}`}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={toggleTimer} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800">
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => {
              if (!isBreak) {
                setCompletedPomodoros((v) => v + 1);
                setIsBreak(true);
                setIsRunning(false);
                const isLong = shortsSinceLong === 4;
                setTimeLeft((isLong ? LONG_BREAK : SHORT_BREAK) * 60);
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
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Complete
          </button>
          <button onClick={resetTimer} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800">
            Reset
          </button>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800">
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}
