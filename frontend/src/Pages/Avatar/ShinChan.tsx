import React, { useEffect, useState } from "react";

export enum AnimationState {
  IDLE = "IDLE",
  WIGGLE = "WIGGLE",
  SHOCK = "SHOCK",
  SHY = "SHY",
  TALKING = "TALKING",
  LAUGHING = "LAUGHING",
  LOVE = "LOVE",
  CRY = "CRY",
  EAT = "EAT",
  ANGRY = "ANGRY",
}

const CONTROLS = [
  {
    id: AnimationState.WIGGLE,
    icon: "〰️",
    label: "Wiggle",
    cls: "bg-yellow-300",
  },
  { id: AnimationState.SHY, icon: "😳", label: "Shy", cls: "bg-pink-300" },
  {
    id: AnimationState.SHOCK,
    icon: "😱",
    label: "Shock",
    cls: "bg-purple-400",
  },
  {
    id: AnimationState.LAUGHING,
    icon: "😆",
    label: "Laugh",
    cls: "bg-green-400",
  },
  { id: AnimationState.LOVE, icon: "😍", label: "Love", cls: "bg-red-400" },
  { id: AnimationState.CRY, icon: "😭", label: "Cry", cls: "bg-blue-400" },
  {
    id: AnimationState.ANGRY,
    icon: "😡",
    label: "Angry",
    cls: "bg-red-600 text-white",
  },
  { id: AnimationState.EAT, icon: "🍪", label: "Eat", cls: "bg-orange-400" },
];

const ShinChan: React.FC<{ showControls?: boolean; className?: string }> = ({
  showControls = true,
  className = "",
}) => {
  const [state, setState] = useState<AnimationState>(AnimationState.IDLE);

  useEffect(() => {
    if (state !== AnimationState.IDLE) {
      const timer = setTimeout(() => setState(AnimationState.IDLE), 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const s = (check: AnimationState) => state === check;
  const animClass = s(AnimationState.WIGGLE)
    ? "animate-dance"
    : s(AnimationState.CRY)
    ? "animate-shake"
    : s(AnimationState.ANGRY)
    ? "animate-angry"
    : "animate-head-bob";

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full ${className}`}
    >
      <div
        className={`relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center transition-transform duration-300 ${
          showControls ? "mb-12" : ""
        }`}
      >
        <style>{`
          @keyframes eyebrow-wiggle { 0%,100%{transform:translateY(0) rotate(0);} 25%{transform:translateY(-15px) rotate(-5deg);} 50%{transform:translateY(5px) rotate(5deg);} 75%{transform:translateY(-10px) rotate(-2deg);} }
          @keyframes mouth-talk { 0%,100%{d:path("M 155,200 Q 165,210 175,200");fill:transparent;} 50%{d:path("M 150,195 Q 165,225 180,195");fill:#900;} }
          @keyframes head-bob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(5px);} }
          @keyframes butt-wiggle { 0%,100%{transform:rotate(0);} 25%{transform:rotate(-5deg) translateX(-5px);} 75%{transform:rotate(5deg) translateX(5px);} }
          @keyframes heart-beat { 0%,100%{transform:scale(1);} 50%{transform:scale(1.15);} }
          @keyframes shake-cry { 0%,100%{transform:rotate(0);} 25%{transform:translate(-2px,2px) rotate(-1deg);} 75%{transform:translate(2px,-2px) rotate(1deg);} }
          @keyframes tears-fall { 0%{transform:translateY(0);opacity:0.8;} 100%{transform:translateY(50px);opacity:0;} }
          @keyframes chew { 0%,100%{transform:scaleY(1);} 50%{transform:scaleY(0.6);} }
          @keyframes snack-float { 0%,100%{transform:translateY(0) rotate(0);} 50%{transform:translateY(-5px) rotate(10deg);} }
          @keyframes crumb-fall { 0%{transform:translateY(0);opacity:1;} 100%{transform:translateY(20px);opacity:0;} }
          @keyframes fire-pulse { 0%,100%{transform:scale(1);opacity:0.9;} 50%{transform:scale(1.1);opacity:1;} }
          @keyframes shake-angry { 0%,100%{transform:translate(0,0);} 25%{transform:translate(-2px,2px);} 75%{transform:translate(2px,-2px);} }
          .animate-eyebrows { animation: eyebrow-wiggle 0.4s infinite; }
          .animate-talk { animation: mouth-talk 0.2s infinite; }
          .animate-head-bob { animation: head-bob 2s ease-in-out infinite; }
          .animate-dance { animation: butt-wiggle 0.6s linear infinite; }
          .animate-heart { animation: heart-beat 0.8s infinite ease-in-out; transform-box: fill-box; transform-origin: center; }
          .animate-shake { animation: shake-cry 0.1s infinite; }
          .animate-tears { animation: tears-fall 0.6s infinite linear; }
          .animate-chew { animation: chew 0.4s infinite ease-in-out; transform-box: fill-box; transform-origin: center; }
          .animate-snack { animation: snack-float 2s infinite ease-in-out; }
          .animate-crumb { animation: crumb-fall 0.8s infinite linear; }
          .animate-fire { animation: fire-pulse 0.1s infinite; transform-box: fill-box; transform-origin: center; }
          .animate-angry { animation: shake-angry 0.3s infinite; }
        `}</style>

        {s(AnimationState.ANGRY) && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce whitespace-nowrap">
            <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
              <span className="text-2xl font-black text-red-600 tracking-widest uppercase">
                KDM AH THAI !!!
              </span>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-black rotate-45"></div>
            </div>
          </div>
        )}

        <svg
          viewBox="0 0 300 300"
          className={`w-full h-full drop-shadow-xl ${animClass}`}
          fill="none"
        >
          <defs>
            <filter id="ct">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.5"
                numOctaves="3"
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2" />
            </filter>
          </defs>
          <path
            d="M 40,160 C 30,150 20,160 25,180 C 30,195 45,190 55,180"
            fill={s(AnimationState.ANGRY) ? "#FFD0C0" : "#FFE0BD"}
            stroke="#000"
            strokeWidth="3"
          />
          <path
            d="M 260,150 C 270,140 280,150 275,170 C 270,185 255,180 245,170"
            fill={s(AnimationState.ANGRY) ? "#FFD0C0" : "#FFE0BD"}
            stroke="#000"
            strokeWidth="3"
          />
          <path
            d="M 50,120 C 50,80 80,40 150,40 C 220,40 250,80 250,130 C 250,180 260,200 240,230 C 220,260 180,260 130,250 C 80,240 30,220 40,160 Q 45,140 50,120"
            fill={
              s(AnimationState.SHY) ||
              s(AnimationState.LOVE) ||
              s(AnimationState.ANGRY)
                ? "#FFD0C0"
                : "#FFE0BD"
            }
            stroke="#000"
            strokeWidth="4"
          />
          <path
            d="M 45,130 C 50,90 90,45 150,45 C 210,45 245,90 252,135 L 245,130 C 240,100 200,60 150,60 C 100,60 60,100 55,130 Z"
            fill="#000"
          />
          <path
            d="M 45,130 L 55,135 L 48,145 L 58,150 L 50,160"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <g
            className={`${
              s(AnimationState.WIGGLE) ||
              s(AnimationState.LOVE) ||
              s(AnimationState.EAT)
                ? "animate-eyebrows"
                : ""
            } transition-transform duration-200`}
          >
            <path
              d={
                s(AnimationState.ANGRY)
                  ? "M 70,80 Q 90,100 110,95"
                  : "M 70,90 Q 90,60 110,90"
              }
              stroke="#000"
              strokeWidth="14"
              strokeLinecap="round"
              className={s(AnimationState.SHOCK) ? "-translate-y-4" : ""}
              transform={s(AnimationState.ANGRY) ? "rotate(15 90 90)" : ""}
            />
            <path
              d={
                s(AnimationState.ANGRY)
                  ? "M 130,95 Q 150,100 170,80"
                  : "M 130,90 Q 150,60 170,90"
              }
              stroke="#000"
              strokeWidth="14"
              strokeLinecap="round"
              className={s(AnimationState.SHOCK) ? "-translate-y-4" : ""}
              transform={s(AnimationState.ANGRY) ? "rotate(-15 150 90)" : ""}
            />
          </g>

          <g className="transition-transform duration-300">
            {s(AnimationState.ANGRY) ? (
              <g className="animate-fire">
                <text x="65" y="150" fontSize="50">
                  🔥
                </text>
                <text x="135" y="150" fontSize="50">
                  🔥
                </text>
              </g>
            ) : s(AnimationState.LOVE) ? (
              <g className="animate-heart">
                <path
                  d="M 90,148 C 70,135 65,110 90,122 C 115,110 110,135 90,148 Z"
                  fill="#FF0055"
                  stroke="#000"
                  strokeWidth="2"
                />
                <path
                  d="M 150,148 C 130,135 125,110 150,122 C 175,110 170,135 150,148 Z"
                  fill="#FF0055"
                  stroke="#000"
                  strokeWidth="2"
                />
              </g>
            ) : s(AnimationState.CRY) ? (
              <g>
                <path
                  d="M 75,125 L 90,132 L 75,140 M 165,125 L 150,132 L 165,140"
                  stroke="#000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="80"
                  cy="145"
                  r="5"
                  fill="#50E0FF"
                  className="animate-tears"
                />
                <circle
                  cx="155"
                  cy="145"
                  r="5"
                  fill="#50E0FF"
                  className="animate-tears"
                  style={{ animationDelay: "0.1s" }}
                />
              </g>
            ) : s(AnimationState.EAT) ? (
              <g>
                <path
                  d="M 80,130 Q 90,120 100,130 M 140,130 Q 150,120 160,130"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <>
                <ellipse
                  cx="90"
                  cy="130"
                  rx={s(AnimationState.LAUGHING) ? "18" : "22"}
                  ry={
                    s(AnimationState.LAUGHING)
                      ? "2"
                      : s(AnimationState.SHOCK)
                      ? "28"
                      : "22"
                  }
                  fill="#FFF"
                  stroke="#000"
                  strokeWidth="3"
                />
                {!s(AnimationState.LAUGHING) && (
                  <circle
                    cx={s(AnimationState.SHY) ? "85" : "90"}
                    cy="130"
                    r="3"
                    fill="#000"
                  />
                )}
                <ellipse
                  cx="150"
                  cy="130"
                  rx={s(AnimationState.LAUGHING) ? "18" : "22"}
                  ry={
                    s(AnimationState.LAUGHING)
                      ? "2"
                      : s(AnimationState.SHOCK)
                      ? "28"
                      : "22"
                  }
                  fill="#FFF"
                  stroke="#000"
                  strokeWidth="3"
                />
                {!s(AnimationState.LAUGHING) && (
                  <circle
                    cx={s(AnimationState.SHY) ? "145" : "150"}
                    cy="130"
                    r="3"
                    fill="#000"
                  />
                )}
              </>
            )}
          </g>

          {(s(AnimationState.SHY) ||
            s(AnimationState.LAUGHING) ||
            s(AnimationState.LOVE) ||
            s(AnimationState.CRY) ||
            s(AnimationState.EAT) ||
            s(AnimationState.ANGRY)) && (
            <g opacity={s(AnimationState.ANGRY) ? "0.8" : "0.6"}>
              <ellipse
                cx="60"
                cy="180"
                rx="15"
                ry="8"
                fill={s(AnimationState.ANGRY) ? "#F00" : "#FF8080"}
              />
              <ellipse
                cx="230"
                cy="180"
                rx="15"
                ry="8"
                fill={s(AnimationState.ANGRY) ? "#F00" : "#FF8080"}
              />
              <line
                x1="50"
                y1="180"
                x2="70"
                y2="175"
                stroke="#FFF"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="185"
                x2="70"
                y2="180"
                stroke="#FFF"
                strokeWidth="2"
              />
            </g>
          )}

          <g className="transition-all duration-200">
            {s(AnimationState.TALKING) ? (
              <path className="animate-talk" stroke="#000" strokeWidth="3" />
            ) : s(AnimationState.SHOCK) ? (
              <circle
                cx="165"
                cy="200"
                r="15"
                fill="#500"
                stroke="#000"
                strokeWidth="3"
              />
            ) : s(AnimationState.ANGRY) ? (
              <path
                d="M 150,210 Q 165,200 180,210 Q 170,230 160,210"
                fill="#500"
                stroke="#000"
                strokeWidth="3"
              />
            ) : s(AnimationState.LAUGHING) ? (
              <path
                d="M 140,200 Q 165,230 190,200 Z"
                fill="#900"
                stroke="#000"
                strokeWidth="3"
              />
            ) : s(AnimationState.LOVE) ? (
              <path
                d="M 160,205 Q 165,200 170,205 Q 175,200 180,205"
                fill="none"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : s(AnimationState.CRY) ? (
              <path
                d="M 145,210 Q 165,200 185,210 Q 180,230 165,230 Q 150,230 145,210"
                fill="#A00"
                stroke="#000"
                strokeWidth="3"
              />
            ) : s(AnimationState.EAT) ? (
              <g>
                <path
                  d="M 125,210 L 130,225 L 145,225 L 135,235 L 140,250 L 125,240 L 110,250 L 115,235 L 105,225 L 120,225 Z"
                  fill="#D2691E"
                  stroke="#8B4513"
                  strokeWidth="2"
                  className="animate-snack"
                />
                <ellipse
                  cx="165"
                  cy="205"
                  rx="15"
                  ry="10"
                  fill="#900"
                  stroke="#000"
                  strokeWidth="3"
                  className="animate-chew"
                />
                <circle
                  cx="150"
                  cy="220"
                  r="2"
                  fill="#D2691E"
                  className="animate-crumb"
                />
                <circle
                  cx="170"
                  cy="225"
                  r="2"
                  fill="#D2691E"
                  className="animate-crumb"
                  style={{ animationDelay: "0.3s" }}
                />
              </g>
            ) : (
              <path
                d="M 160,200 Q 170,210 180,200"
                fill="none"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>
        </svg>
      </div>

      {showControls && (
        <div className="flex gap-3 w-full overflow-x-auto p-4 z-50 justify-start md:justify-center no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
          {CONTROLS.map((c) => (
            <button
              key={c.id}
              onClick={() => setState(c.id)}
              className={`flex-shrink-0 p-3 ${c.cls} border-2 border-black hover:opacity-90 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]`}
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs font-bold mt-1">{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShinChan;
