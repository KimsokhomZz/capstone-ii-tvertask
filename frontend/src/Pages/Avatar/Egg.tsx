import React, { useState, useEffect } from "react";

export enum Emotion {
  NEUTRAL = "NEUTRAL",
  ANGRY = "ANGRY",
  SAD = "SAD",
  DANCE = "DANCE",
  WAVE = "WAVE",
  LOVE = "LOVE",
  KISS = "KISS",
}

const CONTROLS = [
  { id: Emotion.WAVE, icon: "👋", label: "Wave", cls: "bg-blue-100" },
  { id: Emotion.DANCE, icon: "💃", label: "Dance", cls: "bg-green-100" },
  { id: Emotion.LOVE, icon: "😍", label: "Love", cls: "bg-pink-100" },
  { id: Emotion.KISS, icon: "😘", label: "Kiss", cls: "bg-red-100" },
  {
    id: Emotion.ANGRY,
    icon: "😡",
    label: "Angry",
    cls: "bg-red-500 text-white",
  },
  { id: Emotion.SAD, icon: "😢", label: "Sad", cls: "bg-blue-300 text-white" },
];

const Egg: React.FC<{
  emotion?: Emotion;
  showControls?: boolean;
  persistKey?: string;
}> = ({ emotion = Emotion.NEUTRAL, showControls = false, persistKey }) => {
  const [curr, setCurr] = useState<Emotion>(emotion);

  // load persisted emotion if persistKey set
  useEffect(() => {
    if (!persistKey) {
      setCurr(emotion);
      return;
    }
    const raw = localStorage.getItem(persistKey);
    if (!raw) {
      setCurr(emotion);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.emotion)
        setCurr(parsed.emotion as Emotion);
      else if (typeof parsed === "string") setCurr(parsed as Emotion);
    } catch {
      setCurr(raw as Emotion);
    }
  }, [emotion, persistKey]);

  // persist curr when it changes
  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, JSON.stringify({ emotion: curr }));
    } catch {}
  }, [curr, persistKey]);

  const anim = {
    [Emotion.DANCE]: "animate-dance",
    [Emotion.ANGRY]: "shake",
    [Emotion.WAVE]: "animate-breathe",
    [Emotion.LOVE]: "animate-breathe",
    [Emotion.KISS]: "animate-breathe",
    [Emotion.SAD]: "animate-breathe",
    [Emotion.NEUTRAL]: "animate-breathe",
  }[curr];

  const getPath = (isP = false) => {
    if (curr === Emotion.KISS) return "M 45 68 Q 50 76 55 68";
    if (curr === Emotion.LOVE) return "M 35 65 Q 50 75 65 65";
    if (curr === Emotion.DANCE) return "M 40 65 Q 50 80 60 65";
    if (curr === Emotion.SAD) return "M 35 75 Q 50 65 65 75";
    if (curr === Emotion.ANGRY) return "M 35 75 L 65 75";
    return "M 40 70 Q 50 75 60 70";
  };

  const eyeT =
    curr === Emotion.KISS
      ? "scaleY(0.1)"
      : curr === Emotion.LOVE
      ? "scale(1.1)"
      : curr === Emotion.SAD
      ? "rotate(10deg)"
      : curr === Emotion.ANGRY
      ? "rotate(-15deg)"
      : "none";

  const renderEgg = (isPartner = false) => {
    const isWave = !isPartner && curr === Emotion.WAVE;
    const isAngry = !isPartner && curr === Emotion.ANGRY;
    const faceX = curr === Emotion.KISS ? (isPartner ? -12 : 12) : 0;

    return (
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <line
          x1="40"
          y1="95"
          x2="35"
          y2="115"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="60"
          y1="95"
          x2="65"
          y2="115"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <ellipse
          cx="50"
          cy="55"
          rx="35"
          ry="45"
          fill={isPartner ? "#FFD6D6" : "#FFFACD"}
          stroke="#F4C430"
          strokeWidth="1.5"
        />
        {isPartner && (
          <g transform="translate(50, 10)">
            <path d="M -10 -5 Q 0 5 10 -5 Q 0 0 -10 -5" fill="#FF69B4" />
            <circle r="4" fill="#FF1493" />
          </g>
        )}

        <g
          transform={`translate(${faceX}, 0)`}
          className="transition-transform duration-500"
        >
          <g
            className={
              curr === Emotion.ANGRY || curr === Emotion.KISS
                ? ""
                : "animate-blink"
            }
            style={{ transformOrigin: "50% 45%" }}
          >
            {[35, 65].map((cx, i) => (
              <g
                key={i}
                transform={eyeT}
                style={{
                  transformOrigin: `${cx}% 45%`,
                  transition: "transform 0.3s",
                }}
              >
                <circle
                  cx={cx}
                  cy="45"
                  r="8"
                  fill="white"
                  stroke="black"
                  strokeWidth="0.5"
                />
                <circle
                  cx={cx + (i === 0 ? 2 : -2)}
                  cy="45"
                  r="3"
                  fill="#8B4513"
                />
                <circle
                  cx={cx + (i === 0 ? 3 : -3)}
                  cy="44"
                  r="1"
                  fill="white"
                  opacity="0.6"
                />
              </g>
            ))}
          </g>
          {isAngry && (
            <>
              <line
                x1="28"
                y1="35"
                x2="42"
                y2="40"
                stroke="black"
                strokeWidth="2"
              />
              <line
                x1="72"
                y1="35"
                x2="58"
                y2="40"
                stroke="black"
                strokeWidth="2"
              />
            </>
          )}
          {(curr === Emotion.KISS || curr === Emotion.LOVE) && (
            <g opacity="0.4" fill="#FF69B4">
              <ellipse cx="25" cy="60" rx="6" ry="3" />
              <ellipse cx="75" cy="60" rx="6" ry="3" />
            </g>
          )}
          <path
            d={getPath(isPartner)}
            fill={
              curr === Emotion.DANCE || curr === Emotion.LOVE
                ? "#374151"
                : "none"
            }
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-[d] duration-300"
          />
        </g>

        <line
          x1="20"
          y1="55"
          x2={isWave ? 5 : isAngry ? 15 : 10}
          y2={isWave ? 30 : isAngry ? 55 : isPartner ? 50 : 60}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          className={`transition-all duration-300 ${
            isWave ? "animate-wave-hand" : ""
          }`}
        />
        <line
          x1="80"
          y1="55"
          x2={isAngry ? 85 : 90}
          y2={isAngry ? 55 : isPartner ? 50 : 60}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <style>{`
        @keyframes wave-hand { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }
        @keyframes dance-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes float-up { 0% { transform: translateY(20px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-50px); opacity: 0; } }
        @keyframes slide-in { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-wave-hand { animation: wave-hand 0.5s infinite ease-in-out; transform-origin: 20px 55px; }
        .animate-dance { animation: dance-bounce 0.5s infinite; }
        .shake { animation: shake 0.5s infinite; }
        .animate-breathe { animation: breathe 3s infinite ease-in-out; }
        .animate-float-up { animation: float-up 2s infinite ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
      `}</style>

      <div
        className={`relative flex items-center justify-center transition-all duration-500 h-80 ${
          showControls ? "mb-8" : ""
        }`}
      >
        {curr === Emotion.LOVE && (
          <div className="absolute inset-0 z-20 pointer-events-none text-4xl">
            <div className="absolute top-0 right-10 animate-heartbeat">❤️</div>
            <div
              className="absolute top-10 left-0 animate-heartbeat"
              style={{ animationDelay: "0.2s" }}
            >
              ❤️
            </div>
          </div>
        )}
        {curr === Emotion.KISS && (
          <div className="absolute z-30 pointer-events-none left-1/2 bottom-1/2 -translate-x-1/2 translate-y-10">
            <div className="text-6xl animate-float-up">❤️</div>
            <div
              className="text-4xl absolute top-4 -left-8 animate-float-up"
              style={{ animationDelay: "0.5s" }}
            >
              💕
            </div>
          </div>
        )}

        <div
          className={`w-64 h-80 z-10 transition-transform duration-500 ${anim} ${
            curr === Emotion.KISS ? "-translate-x-14" : ""
          }`}
        >
          {renderEgg(false)}
        </div>
        {curr === Emotion.KISS && (
          <div className="w-64 h-80 absolute z-20 animate-slide-in left-28">
            {renderEgg(true)}
          </div>
        )}
        <div className="absolute -bottom-4 w-40 h-4 bg-black/10 rounded-full blur-sm" />
      </div>

      {showControls && (
        <div className="flex gap-3 w-full overflow-x-auto p-4 z-50 justify-start md:justify-center no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
          {CONTROLS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCurr(c.id)}
              className={`flex-shrink-0 p-3 ${c.cls} border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center`}
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-xs font-bold mt-1">{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Egg;
