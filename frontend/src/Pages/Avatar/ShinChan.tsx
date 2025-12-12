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

interface ShinChanProps {
  showControls?: boolean;
  className?: string;
}

const ShinChan: React.FC<ShinChanProps> = ({
  showControls = true,
  className = "",
}) => {
  const [state, setState] = useState<AnimationState>(AnimationState.IDLE);
  // Internal animation ticks for idle movement
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Automatically reset to idle after any animation
  useEffect(() => {
    if (state !== AnimationState.IDLE) {
      const timer = setTimeout(() => setState(AnimationState.IDLE), 2500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Helper to determine styles based on state
  const isWiggling = state === AnimationState.WIGGLE;
  const isTalking = state === AnimationState.TALKING;
  const isShocked = state === AnimationState.SHOCK;
  const isShy = state === AnimationState.SHY;
  const isLaughing = state === AnimationState.LAUGHING;
  const isInLove = state === AnimationState.LOVE;
  const isCrying = state === AnimationState.CRY;
  const isEating = state === AnimationState.EAT;
  const isAngry = state === AnimationState.ANGRY;

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full ${className}`}
    >
      {/* Animation Stage */}
      <div
        className={`relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center transition-transform duration-300 ${
          showControls ? "mb-12" : "mb-0"
        }`}
      >
        <style>{`
          @keyframes eyebrow-wiggle {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-15px) rotate(-5deg); }
            50% { transform: translateY(5px) rotate(5deg); }
            75% { transform: translateY(-10px) rotate(-2deg); }
          }
          @keyframes mouth-talk {
            0%, 100% { d: path("M 155,200 Q 165,210 175,200"); fill: transparent; }
            50% { d: path("M 150,195 Q 165,225 180,195"); fill: #900; }
          }
          @keyframes head-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
          @keyframes butt-wiggle { /* Head version of his dance */
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg) translateX(-5px); }
            75% { transform: rotate(5deg) translateX(5px); }
          }
          @keyframes heart-beat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          @keyframes shake-cry {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-2px, 2px) rotate(-1deg); }
            75% { transform: translate(2px, -2px) rotate(1deg); }
          }
          @keyframes tears-fall {
            0% { transform: translateY(0); opacity: 0.8; }
            100% { transform: translateY(50px); opacity: 0; }
          }
          @keyframes chew {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.6); }
          }
          @keyframes snack-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(10deg); }
          }
          @keyframes crumb-fall {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0; }
          }
          @keyframes fire-pulse {
             0%, 100% { transform: scale(1); opacity: 0.9; }
             50% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes shake-angry {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-2px, -2px); }
            20% { transform: translate(2px, 2px); }
            30% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            50% { transform: translate(-2px, 0); }
            60% { transform: translate(2px, 0); }
            70% { transform: translate(0, 2px); }
            80% { transform: translate(0, -2px); }
          }
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

        {/* Message Bubble for Angry State */}
        {isAngry && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce whitespace-nowrap">
            <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
              <span className="text-2xl font-black text-red-600 tracking-widest uppercase">
                KDM AH THAI !!!
              </span>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-black rotate-45"></div>
            </div>
          </div>
        )}

        {/* Main SVG Container */}
        <svg
          viewBox="0 0 300 300"
          className={`w-full h-full drop-shadow-xl ${
            isWiggling
              ? "animate-dance"
              : isCrying
              ? "animate-shake"
              : isAngry
              ? "animate-angry"
              : "animate-head-bob"
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* --- DEFS --- */}
          <defs>
            <filter id="crayon-texture">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.5"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>

          {/* --- EARS --- */}
          {/* Left Ear */}
          <path
            d="M 40,160 C 30,150 20,160 25,180 C 30,195 45,190 55,180"
            fill={isAngry ? "#FFD0C0" : "#FFE0BD"}
            stroke="#000"
            strokeWidth="3"
          />
          {/* Right Ear */}
          <path
            d="M 260,150 C 270,140 280,150 275,170 C 270,185 255,180 245,170"
            fill={isAngry ? "#FFD0C0" : "#FFE0BD"}
            stroke="#000"
            strokeWidth="3"
          />

          {/* --- FACE SHAPE (The famous potato) --- */}
          <path
            d="
              M 50,120 
              C 50,80 80,40 150,40 
              C 220,40 250,80 250,130 
              C 250,180 260,200 240,230 
              C 220,260 180,260 130,250 
              C 80,240 30,220 40,160 
              Q 45,140 50,120
            "
            fill={isShy || isInLove || isAngry ? "#FFD0C0" : "#FFE0BD"}
            stroke="#000"
            strokeWidth="4"
            className="transition-colors duration-500"
          />

          {/* --- HAIR --- */}
          <path
            d="
              M 45,130 
              C 50,90 90,45 150,45 
              C 210,45 245,90 252,135
              L 245,130
              C 240,100 200,60 150,60
              C 100,60 60,100 55,130
              Z
            "
            fill="#000"
          />
          {/* Sideburns/Hairline */}
          <path
            d="M 45,130 L 55,135 L 48,145 L 58,150 L 50,160"
            fill="none"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* --- EYEBROWS (The thick ones) --- */}
          <g
            className={`${
              isWiggling || isInLove || isEating ? "animate-eyebrows" : ""
            } transition-transform duration-200`}
          >
            {/* Left Eyebrow */}
            <path
              d={isAngry ? "M 70,80 Q 90,100 110,95" : "M 70,90 Q 90,60 110,90"}
              fill="none"
              stroke="#000"
              strokeWidth="14"
              strokeLinecap="round"
              className={isShocked ? "-translate-y-4" : ""}
              transform={isAngry ? "rotate(15 90 90)" : ""}
            />
            {/* Right Eyebrow */}
            <path
              d={
                isAngry
                  ? "M 130,95 Q 150,100 170,80"
                  : "M 130,90 Q 150,60 170,90"
              }
              fill="none"
              stroke="#000"
              strokeWidth="14"
              strokeLinecap="round"
              className={isShocked ? "-translate-y-4" : ""}
              transform={isAngry ? "rotate(-15 150 90)" : ""}
            />
          </g>

          {/* --- EYES --- */}
          <g className="transition-transform duration-300">
            {isAngry ? (
              <g className="animate-fire">
                {/* Fire Eyes using text emojis for requested effect */}
                <text x="65" y="150" fontSize="50">
                  🔥
                </text>
                <text x="135" y="150" fontSize="50">
                  🔥
                </text>
              </g>
            ) : isInLove ? (
              <g className="animate-heart">
                {/* Left Heart Eye */}
                <path
                  d="M 90,148 C 70,135 65,110 90,122 C 115,110 110,135 90,148 Z"
                  fill="#FF0055"
                  stroke="#000"
                  strokeWidth="2"
                />
                {/* Right Heart Eye */}
                <path
                  d="M 150,148 C 130,135 125,110 150,122 C 175,110 170,135 150,148 Z"
                  fill="#FF0055"
                  stroke="#000"
                  strokeWidth="2"
                />
              </g>
            ) : isCrying ? (
              <g>
                {/* Left Squeezed Eye */}
                <path
                  d="M 75,125 L 90,132 L 75,140"
                  fill="none"
                  stroke="#000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Right Squeezed Eye */}
                <path
                  d="M 165,125 L 150,132 L 165,140"
                  fill="none"
                  stroke="#000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Tears Left */}
                <circle
                  cx="80"
                  cy="145"
                  r="5"
                  fill="#50E0FF"
                  className="animate-tears"
                />
                <circle
                  cx="85"
                  cy="155"
                  r="4"
                  fill="#50E0FF"
                  className="animate-tears"
                  style={{ animationDelay: "0.2s" }}
                />
                {/* Tears Right */}
                <circle
                  cx="155"
                  cy="145"
                  r="5"
                  fill="#50E0FF"
                  className="animate-tears"
                  style={{ animationDelay: "0.1s" }}
                />
                <circle
                  cx="150"
                  cy="155"
                  r="4"
                  fill="#50E0FF"
                  className="animate-tears"
                  style={{ animationDelay: "0.3s" }}
                />
              </g>
            ) : isEating ? (
              // Happy closed eyes for eating
              <g>
                <path
                  d="M 80,130 Q 90,120 100,130"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 140,130 Q 150,120 160,130"
                  fill="none"
                  stroke="#000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <>
                {/* Left Eye */}
                <ellipse
                  cx="90"
                  cy="130"
                  rx={isLaughing ? "18" : "22"}
                  ry={isLaughing ? "2" : isShocked ? "28" : "22"}
                  fill="#FFF"
                  stroke="#000"
                  strokeWidth="3"
                />
                {!isLaughing && (
                  <circle cx={isShy ? "85" : "90"} cy="130" r="3" fill="#000" />
                )}

                {/* Right Eye */}
                <ellipse
                  cx="150"
                  cy="130"
                  rx={isLaughing ? "18" : "22"}
                  ry={isLaughing ? "2" : isShocked ? "28" : "22"}
                  fill="#FFF"
                  stroke="#000"
                  strokeWidth="3"
                />
                {!isLaughing && (
                  <circle
                    cx={isShy ? "145" : "150"}
                    cy="130"
                    r="3"
                    fill="#000"
                  />
                )}
              </>
            )}
          </g>

          {/* --- BLUSH --- */}
          {(isShy ||
            isLaughing ||
            isInLove ||
            isCrying ||
            isEating ||
            isAngry) && (
            <g opacity={isAngry ? "0.8" : "0.6"}>
              <ellipse
                cx="60"
                cy="180"
                rx="15"
                ry="8"
                fill={isAngry ? "#FF0000" : "#FF8080"}
              />
              <ellipse
                cx="230"
                cy="180"
                rx="15"
                ry="8"
                fill={isAngry ? "#FF0000" : "#FF8080"}
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

          {/* --- MOUTH & SNACK --- */}
          <g className="transition-all duration-200">
            {isTalking ? (
              <path className="animate-talk" stroke="#000" strokeWidth="3" />
            ) : isShocked ? (
              <circle
                cx="165"
                cy="200"
                r="15"
                fill="#500"
                stroke="#000"
                strokeWidth="3"
              />
            ) : isAngry ? (
              <path
                d="M 150,210 Q 165,200 180,210 Q 170,230 160,210"
                fill="#500"
                stroke="#000"
                strokeWidth="3"
              />
            ) : isLaughing ? (
              <path
                d="M 140,200 Q 165,230 190,200 Z"
                fill="#900"
                stroke="#000"
                strokeWidth="3"
              />
            ) : isInLove ? (
              <path
                d="M 160,205 Q 165,200 170,205 Q 175,200 180,205"
                fill="none"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : isCrying ? (
              <path
                d="M 145,210 Q 165,200 185,210 Q 180,230 165,230 Q 150,230 145,210"
                fill="#A00"
                stroke="#000"
                strokeWidth="3"
              />
            ) : isEating ? (
              <g>
                {/* Star Snack */}
                <path
                  d="M 125,210 L 130,225 L 145,225 L 135,235 L 140,250 L 125,240 L 110,250 L 115,235 L 105,225 L 120,225 Z"
                  fill="#D2691E"
                  stroke="#8B4513"
                  strokeWidth="2"
                  className="animate-snack"
                />
                {/* Chewing Mouth */}
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
                {/* Crumbs */}
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

      {/* Controls Grid */}
      {showControls && (
        <div className="flex flex-row flex-nowrap gap-3 w-full max-w-full overflow-x-auto p-4 z-50 items-center justify-start md:justify-center no-scrollbar">
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <button
            onClick={() => setState(AnimationState.WIGGLE)}
            className="flex-shrink-0 p-3 bg-yellow-300 border-2 border-black hover:bg-yellow-200 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">〰️</span>
            <span className="text-xs font-bold mt-1">Wiggle</span>
          </button>
          <button
            onClick={() => setState(AnimationState.SHY)}
            className="flex-shrink-0 p-3 bg-pink-300 border-2 border-black hover:bg-pink-200 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😳</span>
            <span className="text-xs font-bold mt-1">Shy</span>
          </button>
          <button
            onClick={() => setState(AnimationState.SHOCK)}
            className="flex-shrink-0 p-3 bg-purple-400 border-2 border-black hover:bg-purple-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😱</span>
            <span className="text-xs font-bold mt-1">Shock</span>
          </button>
          <button
            onClick={() => setState(AnimationState.LAUGHING)}
            className="flex-shrink-0 p-3 bg-green-400 border-2 border-black hover:bg-green-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😆</span>
            <span className="text-xs font-bold mt-1">Laugh</span>
          </button>
          <button
            onClick={() => setState(AnimationState.LOVE)}
            className="flex-shrink-0 p-3 bg-red-400 border-2 border-black hover:bg-red-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😍</span>
            <span className="text-xs font-bold mt-1">Love</span>
          </button>
          <button
            onClick={() => setState(AnimationState.CRY)}
            className="flex-shrink-0 p-3 bg-blue-400 border-2 border-black hover:bg-blue-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">😭</span>
            <span className="text-xs font-bold mt-1">Cry</span>
          </button>
          <button
            onClick={() => setState(AnimationState.ANGRY)}
            className="flex-shrink-0 p-3 bg-red-600 border-2 border-black hover:bg-red-500 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center text-white min-w-[80px]"
          >
            <span className="text-3xl">😡</span>
            <span className="text-xs font-bold mt-1">Angry</span>
          </button>
          <button
            onClick={() => setState(AnimationState.EAT)}
            className="flex-shrink-0 p-3 bg-orange-400 border-2 border-black hover:bg-orange-300 transition-colors rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex flex-col items-center min-w-[80px]"
          >
            <span className="text-3xl">
              <i className="fa-solid fa-cookie"></i>
            </span>
            <span className="text-xs font-bold mt-1">Eat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShinChan;
