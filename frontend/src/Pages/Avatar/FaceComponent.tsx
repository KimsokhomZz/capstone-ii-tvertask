import React from "react";

// Local types / defaults (kept local to avoid circular imports)
const Mood = {
  HAPPY: "HAPPY",
  ANGRY: "ANGRY",
  SAD: "SAD",
  EATING: "EATING",
  LOVE: "LOVE",
} as const;
type Mood = (typeof Mood)[keyof typeof Mood];

type HatType = "none" | "tophat" | "beanie" | "crown" | "wizard";
type GlassesType = "none" | "round" | "aviator" | "star" | "pixel";

export interface CustomizationState {
  hat: HatType;
  glasses: GlassesType;
  eyeColor: string;
  eyebrowColor: string;
  mouthColor: string;
}

const DEFAULT_CUSTOM: CustomizationState = {
  hat: "none",
  glasses: "none",
  eyeColor: "#000000",
  eyebrowColor: "#000000",
  mouthColor: "#000000",
};

const MOODS: Record<string, any> = {
  [Mood.HAPPY]: {
    cls: "bg-yellow-400",
    shadow: "rgba(250,204,21,0.6)",
    path: "M 60 150 Q 100 190 140 150",
    emoji: "✨",
  },
  [Mood.ANGRY]: {
    cls: "bg-red-500",
    shadow: "rgba(239,68,68,0.6)",
    path: "M 70 160 Q 100 120 130 160",
    emoji: "💢",
  },
  [Mood.SAD]: {
    cls: "bg-blue-400",
    shadow: "rgba(96,165,250,0.6)",
    path: "M 70 160 Q 100 130 130 160",
    emoji: "💧",
  },
  [Mood.EATING]: {
    cls: "bg-yellow-400",
    shadow: "rgba(250,204,21,0.6)",
    path: "M 75 150 Q 100 200 125 150 Q 100 100 75 150",
    emoji: "🍔",
  },
  [Mood.LOVE]: {
    cls: "bg-pink-400",
    shadow: "rgba(236,72,153,0.6)",
    path: "M 70 150 Q 100 180 130 150",
    emoji: "💖",
  },
};

const FaceComponent: React.FC<{ mood: Mood; custom?: CustomizationState }> = ({
  mood,
  custom = DEFAULT_CUSTOM,
}) => {
  const cfg = MOODS[mood] || MOODS[Mood.HAPPY];
  const isLove = mood === Mood.LOVE;
  const lx = 84,
    rx = 172,
    ey = 30;

  const browStyle = (side: "L" | "R") => {
    let r = 0,
      ty = -10;
    if (mood === Mood.ANGRY) {
      r = side === "L" ? 25 : -25;
      ty = 10;
    } else if (mood === Mood.SAD) {
      r = side === "L" ? -20 : 20;
      ty = -5;
    } else if (mood === Mood.LOVE) {
      r = side === "L" ? -10 : 10;
      ty = -15;
    }
    return {
      transform: `rotate(${r}deg) translateY(${ty}px)`,
      backgroundColor: custom.eyebrowColor,
    };
  };

  const Hat = () => {
    const h = custom.hat;
    if (h === "none") return null;
    return (
      <g>
        {h === "tophat" && (
          <>
            <rect
              x="20"
              y="140"
              width="160"
              height="20"
              fill="#1f2937"
              rx="2"
            />
            <rect x="50" y="50" width="100" height="100" fill="#1f2937" />
            <rect x="50" y="120" width="100" height="20" fill="#ef4444" />
          </>
        )}
        {h === "beanie" && (
          <>
            <path
              d="M 40 140 Q 100 40 160 140"
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth="4"
            />
            <rect
              x="35"
              y="135"
              width="130"
              height="30"
              rx="8"
              fill="#60a5fa"
            />
            <circle cx="100" cy="40" r="18" fill="#ef4444" />
          </>
        )}
        {h === "crown" && (
          <>
            <polygon
              points="40,160 70,80 100,150 130,80 160,160 160,180 40,180"
              transform="translate(0, -20)"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle
              cx="70"
              cy="60"
              r="8"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="2"
            />
            <circle
              cx="130"
              cy="60"
              r="8"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="120"
              r="10"
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth="2"
            />
          </>
        )}
        {h === "wizard" && (
          <>
            <path d="M 30 160 Q 100 180 170 160" fill="#5b21b6" />
            <path d="M 40 160 L 100 20 L 160 160" fill="#6d28d9" />
            <text x="85" y="110" fontSize="24" fill="yellow">
              ★
            </text>
          </>
        )}
      </g>
    );
  };

  const Glasses = () => {
    const g = custom.glasses;
    if (g === "none") return null;
    return (
      <g>
        {g === "round" && (
          <g fill="rgba(0,0,0,0.5)" stroke="#333" strokeWidth="4">
            <circle cx={lx} cy={ey} r="28" />
            <circle cx={rx} cy={ey} r="28" />
            <path d={`M ${lx + 28} ${ey} L ${rx - 28} ${ey}`} />
          </g>
        )}
        {g === "aviator" && (
          <g fill="rgba(0,0,0,0.6)" stroke="#333" strokeWidth="3">
            <path
              d={`M ${lx - 30} ${ey - 15} C ${lx - 30} ${ey - 15}, ${lx + 30} ${
                ey - 15
              }, ${lx + 30} ${ey - 15} C ${lx + 30} ${ey - 15}, ${lx + 30} ${
                ey + 25
              }, ${lx + 10} ${ey + 30} C ${lx - 10} ${ey + 35}, ${lx - 30} ${
                ey + 25
              }, ${lx - 30} ${ey - 15} Z`}
            />
            <path
              d={`M ${rx - 30} ${ey - 15} C ${rx - 30} ${ey - 15}, ${rx + 30} ${
                ey - 15
              }, ${rx + 30} ${ey - 15} C ${rx + 30} ${ey - 15}, ${rx + 30} ${
                ey + 25
              }, ${rx + 10} ${ey + 30} C ${rx - 10} ${ey + 35}, ${rx - 30} ${
                ey + 25
              }, ${rx - 30} ${ey - 15} Z`}
            />
            <path
              d={`M ${lx + 30} ${ey - 10} Q ${lx + (rx - lx) / 2} ${ey - 20} ${
                rx - 30
              } ${ey - 10}`}
              fill="none"
            />
          </g>
        )}
        {g === "star" && (
          <g fill="rgba(255,105,180,0.4)" stroke="#db2777" strokeWidth="3">
            <polygon
              points={`${lx},${ey - 25} ${lx + 8},${ey - 8} ${lx + 27},${
                ey - 8
              } ${lx + 12},${ey + 5} ${lx + 18},${ey + 23} ${lx},${ey + 12} ${
                lx - 18
              },${ey + 23} ${lx - 12},${ey + 5} ${lx - 27},${ey - 8} ${
                lx - 8
              },${ey - 8}`}
            />
            <polygon
              points={`${rx},${ey - 25} ${rx + 8},${ey - 8} ${rx + 27},${
                ey - 8
              } ${rx + 12},${ey + 5} ${rx + 18},${ey + 23} ${rx},${ey + 12} ${
                rx - 18
              },${ey + 23} ${rx - 12},${ey + 5} ${rx - 27},${ey - 8} ${
                rx - 8
              },${ey - 8}`}
            />
            <line x1={lx + 20} y1={ey} x2={rx - 20} y2={ey} strokeWidth="4" />
          </g>
        )}
        {g === "pixel" && (
          <g fill="black">
            <rect x={lx - 25} y={ey - 10} width="10" height="10" />
            <rect x={lx + 5} y={ey - 10} width="10" height="10" />
            <rect x={lx - 15} y={ey} width="10" height="10" />
            <rect x={lx + 15} y={ey} width="10" height="10" />
            <rect x={rx - 15} y={ey - 10} width="10" height="10" />
            <rect x={rx + 15} y={ey - 10} width="10" height="10" />
            <rect x={rx - 25} y={ey} width="10" height="10" />
            <rect x={rx + 5} y={ey} width="10" height="10" />
            <rect x={lx + 15} y={ey - 5} width="20" height="5" />
            <rect x={rx - 35} y={ey - 5} width="20" height="5" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-colors duration-1000 ${cfg.cls} rounded-full w-64 h-64`}
      style={{ boxShadow: `0 0 50px ${cfg.shadow}` }}
    >
      <style>{`@keyframes chew{0%{transform:translate(-50%,0) scale(1) rotate(0);opacity:0}20%{opacity:1;transform:translate(-50%,-10px) scale(1.1) rotate(-10deg)}80%{opacity:1;transform:translate(-50%,0) scale(0.5) rotate(0)}100%{opacity:0;transform:translate(-50%,10px) scale(0)}}.animate-chew{animation:chew 2.5s ease-in-out forwards}@keyframes hb{0%,28%,70%{transform:scale(1)}14%,42%{transform:scale(1.3)}}.animate-hb{animation:hb 1.5s infinite}`}</style>

      {custom.hat !== "none" && (
        <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 z-40 pointer-events-none w-[300px] h-[200px] flex justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            className="overflow-visible"
          >
            <Hat />
          </svg>
        </div>
      )}

      <div className="flex justify-between w-32 mb-8 relative z-10">
        {["L", "R"].map((s) => (
          <div key={s} className="relative">
            <div
              className="w-10 h-3 rounded-full absolute -top-6 transition-transform duration-1000 origin-center"
              style={{
                ...browStyle(s as any),
                [s === "L" ? "left" : "right"]: "4px",
              }}
            />
            {isLove ? (
              <div className="w-10 h-10 flex items-center justify-center animate-hb">
                <svg viewBox="0 0 32 32" className="text-red-500 fill-current">
                  <path d="M16 28 C16 28 3 20.5 3 11.5 C3 7.2 6.5 4 11 4 C13.5 4 15.5 5 16 7 C16.5 5 18.5 4 21 4 C25.5 4 29 7.2 29 11.5 C29 20.5 16 28 16 28 Z" />
                </svg>
              </div>
            ) : (
              <>
                <div
                  className="w-10 h-10 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ backgroundColor: custom.eyeColor }}
                />
                <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-60"></div>
              </>
            )}
          </div>
        ))}
      </div>

      {custom.glasses !== "none" && (
        <div className="absolute top-[75px] z-20 pointer-events-none w-full h-24 left-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 256 96"
            className="overflow-visible"
          >
            <Glasses />
          </svg>
        </div>
      )}

      <svg
        width="200"
        height="256"
        viewBox="0 0 200 256"
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
      >
        <path
          d={cfg.path}
          fill="transparent"
          stroke={custom.mouthColor}
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-[d] duration-1000"
        />
      </svg>

      {mood === (Mood as any).EATING && (
        <div className="absolute top-[130px] left-1/2 -translate-x-1/2 z-50 text-5xl pointer-events-none animate-chew">
          🍔
        </div>
      )}

      <div
        className={`absolute top-32 left-8 w-8 h-4 bg-red-500 rounded-full blur-md transition-opacity duration-1000 ${
          ([Mood.HAPPY, Mood.LOVE, Mood.EATING] as Mood[]).includes(mood)
            ? "opacity-20"
            : "opacity-0"
        }`}
      ></div>
      <div
        className={`absolute top-32 right-8 w-8 h-4 bg-red-500 rounded-full blur-md transition-opacity duration-1000 ${
          ([Mood.HAPPY, Mood.LOVE, Mood.EATING] as Mood[]).includes(mood)
            ? "opacity-20"
            : "opacity-0"
        }`}
      ></div>
    </div>
  );
};

export default FaceComponent;
