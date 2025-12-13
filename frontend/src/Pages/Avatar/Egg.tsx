import React, { useState, useEffect } from "react";

// --- TYPES (Consolidated from types.ts) ---
export enum Emotion {
  NEUTRAL = "NEUTRAL",
  ANGRY = "ANGRY",
  SAD = "SAD",
  DANCE = "DANCE",
  WAVE = "WAVE",
  LOVE = "LOVE",
  KISS = "KISS",
}

export interface EggResponse {
  text: string;
  emotion: Emotion;
}

// --- METADATA (Consolidated from metadata.json) ---
export const METADATA = {
  name: "Eggbert the Interactive Egg",
  description:
    "A fully animated, interactive egg character. Eggbert reacts to your conversation with dynamic emotions, gestures, and personality.",
  requestFramePermissions: [],
};

// --- EGG COMPONENT ---

interface EggProps {
  emotion?: Emotion;
  showControls?: boolean;
}

const Egg: React.FC<EggProps> = ({
  emotion = Emotion.NEUTRAL,
  showControls = false,
}) => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(emotion);

  // Sync with prop changes (from global mood)
  useEffect(() => {
    setCurrentEmotion(emotion);
  }, [emotion]);

  // --- Animation Classes ---
  const getBodyAnimation = () => {
    switch (currentEmotion) {
      case Emotion.DANCE:
        return "animate-dance";
      case Emotion.ANGRY:
        return "shake";
      // Use breathe for Love, Wave, Kiss, Sad, Neutral so it stays in place
      default:
        return "animate-breathe";
    }
  };

  // --- Dynamic Parts Config ---

  // Mouth Logic
  const getMouthPath = (isPartner = false) => {
    // Kissing mouth: Small smile/u-shape instead of pucker/arch
    if (currentEmotion === Emotion.KISS) return "M 45 68 Q 50 76 55 68";

    switch (currentEmotion) {
      case Emotion.LOVE:
        return "M 35 65 Q 50 75 65 65"; // Big Smile
      case Emotion.DANCE:
        return "M 40 65 Q 50 80 60 65"; // Open Smile
      case Emotion.SAD:
        return "M 35 75 Q 50 65 65 75"; // Frown
      case Emotion.ANGRY:
        return "M 35 75 L 65 75"; // Flat line
      case Emotion.WAVE:
        return "M 40 70 Q 50 75 60 70"; // Friendly smile
      default:
        return "M 40 70 Q 50 75 60 70"; // Neutral smile
    }
  };

  // Eyes Logic
  const getEyeShape = (isPartner = false) => {
    if (currentEmotion === Emotion.KISS) return "scaleY(0.1)"; // Closed eyes for kissing
    if (currentEmotion === Emotion.LOVE) return "scale(1.1)";
    if (currentEmotion === Emotion.SAD) return "rotate(10deg)";
    if (currentEmotion === Emotion.ANGRY) return "rotate(-15deg)";
    return "none";
  };

  // --- Single Egg Render Helper ---
  const renderEgg = (isPartner = false) => {
    // Summer color for main egg, slightly pinker for partner
    const eggColor = isPartner ? "#FFD6D6" : "#FFFACD"; // LemonChiffon (Summer) vs Light Pink

    // Arms Config
    let leftArmY = 60;
    let rightArmY = 60;
    let leftArmX = 10;
    let rightArmX = 90;

    let leftArmClass = "transition-all duration-300";
    let rightArmClass = "transition-all duration-300";

    // Face orientation logic for kissing (Face-to-Face)
    let faceTransform = "translate(0, 0)";
    if (currentEmotion === Emotion.KISS) {
      if (!isPartner) {
        faceTransform = "translate(12, 0)"; // Main egg looks Right
      } else {
        faceTransform = "translate(-12, 0)"; // Partner egg looks Left
      }
    }

    if (!isPartner) {
      if (currentEmotion === Emotion.WAVE) {
        leftArmClass += " animate-wave-hand";
        leftArmY = 30; // Raised
        leftArmX = 5;
      } else if (currentEmotion === Emotion.DANCE) {
        leftArmY = 30;
        rightArmY = 30;
      } else if (currentEmotion === Emotion.ANGRY) {
        leftArmX = 15;
        rightArmX = 85; // Hands on hips
      }
    } else {
      // Partner arms
      leftArmY = 50;
      rightArmY = 50;
    }

    return (
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        {/* Legs - Black */}
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

        {/* Body */}
        <ellipse
          cx="50"
          cy="55"
          rx="35"
          ry="45"
          fill={eggColor}
          stroke="#F4C430"
          strokeWidth="1.5"
        />

        {/* Hair Tie for Partner Egg (Static on body) */}
        {isPartner && (
          <g transform="translate(50, 10)">
            <path d="M -10 -5 Q 0 5 10 -5 Q 0 0 -10 -5" fill="#FF69B4" />{" "}
            {/* Bow loop */}
            <circle cx="0" cy="0" r="4" fill="#FF1493" /> {/* Center knot */}
          </g>
        )}

        {/* --- Face Group (Moves for looking direction) --- */}
        <g
          transform={faceTransform}
          className="transition-transform duration-500"
        >
          {/* Eyes Group - White and Brown */}
          <g
            className={
              currentEmotion === Emotion.ANGRY ||
              currentEmotion === Emotion.KISS
                ? ""
                : "animate-blink"
            }
            style={{ transformOrigin: "50% 45%" }}
          >
            {/* Left Eye */}
            <g
              transform={getEyeShape(isPartner)}
              style={{
                transformOrigin: "35% 45%",
                transition: "transform 0.3s",
              }}
            >
              <circle
                cx="35"
                cy="45"
                r="8"
                fill="white"
                stroke="black"
                strokeWidth="0.5"
              />
              <circle cx="37" cy="45" r="3" fill="#8B4513" /> {/* Brown Iris */}
              <circle cx="38" cy="44" r="1" fill="white" opacity="0.6" />
            </g>

            {/* Right Eye */}
            <g
              transform={getEyeShape(isPartner)}
              style={{
                transformOrigin: "65% 45%",
                transition: "transform 0.3s",
              }}
            >
              <circle
                cx="65"
                cy="45"
                r="8"
                fill="white"
                stroke="black"
                strokeWidth="0.5"
              />
              <circle cx="63" cy="45" r="3" fill="#8B4513" /> {/* Brown Iris */}
              <circle cx="62" cy="44" r="1" fill="white" opacity="0.6" />
            </g>
          </g>

          {/* Eyebrows for Angry */}
          {currentEmotion === Emotion.ANGRY && !isPartner && (
            <g>
              <line
                x1="28"
                y1="35"
                x2="42"
                y2="40"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="72"
                y1="35"
                x2="58"
                y2="40"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Blush for Kiss/Love */}
          {(currentEmotion === Emotion.KISS ||
            currentEmotion === Emotion.LOVE) && (
            <g opacity="0.4">
              <ellipse cx="25" cy="60" rx="6" ry="3" fill="#FF69B4" />
              <ellipse cx="75" cy="60" rx="6" ry="3" fill="#FF69B4" />
            </g>
          )}

          {/* Mouth */}
          <path
            d={getMouthPath(isPartner)}
            fill={
              currentEmotion === Emotion.DANCE ||
              currentEmotion === Emotion.LOVE
                ? "#374151"
                : "none"
            }
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transition: "d 0.3s ease-out" }}
          />
        </g>
        {/* --- End Face Group --- */}

        {/* Arms - Black (Outside face group to stay attached to sides) */}
        <line
          x1="20"
          y1="55"
          x2={leftArmX}
          y2={leftArmY}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          className={leftArmClass}
        />
        <line
          x1="80"
          y1="55"
          x2={rightArmX}
          y2={rightArmY}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          className={rightArmClass}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <style>{`
          @keyframes wave-hand {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
          }
          @keyframes dance-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shake {
             0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes float-up {
            0% { transform: translateY(20px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-50px); opacity: 0; }
          }
          @keyframes slide-in {
             from { transform: translateX(100px); opacity: 0; }
             to { transform: translateX(0); opacity: 1; }
          }
          .animate-wave-hand { animation: wave-hand 0.5s infinite ease-in-out; transform-origin: 20px 55px; }
          .animate-dance { animation: dance-bounce 0.5s infinite; }
          .shake { animation: shake 0.5s; animation-iteration-count: infinite; }
          .animate-breathe { animation: breathe 3s infinite ease-in-out; }
          .animate-float-up { animation: float-up 2s infinite ease-out; }
          .animate-slide-in { animation: slide-in 0.5s ease-out; }
      `}</style>

      {/* Animation Stage */}
      <div
        className={`relative flex items-center justify-center transition-all duration-500 h-80 ${
          showControls ? "mb-8" : "mb-0"
        }`}
      >
        {/* Love Hearts (General) */}
        {currentEmotion === Emotion.LOVE && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="absolute top-0 right-10 text-4xl animate-heartbeat">
              ❤️
            </div>
            <div
              className="absolute top-10 left-0 text-3xl animate-heartbeat"
              style={{ animationDelay: "0.2s" }}
            >
              ❤️
            </div>
            <div
              className="absolute -top-10 left-20 text-5xl animate-heartbeat"
              style={{ animationDelay: "0.4s" }}
            >
              ❤️
            </div>
          </div>
        )}

        {/* Kissing Heart (Between them) */}
        {currentEmotion === Emotion.KISS && (
          <div className="absolute z-30 pointer-events-none left-1/2 bottom-1/2 -translate-x-1/2 translate-y-10">
            <div className="text-6xl animate-float-up">❤️</div>
            <div
              className="text-4xl absolute top-4 -left-8 animate-float-up"
              style={{ animationDelay: "0.5s" }}
            >
              💕
            </div>
            <div
              className="text-4xl absolute top-4 -right-8 animate-float-up"
              style={{ animationDelay: "0.8s" }}
            >
              💕
            </div>
          </div>
        )}

        {/* Main Egg */}
        <div
          className={`w-64 h-80 z-10 transition-transform duration-500 ${getBodyAnimation()} ${
            currentEmotion === Emotion.KISS ? "-translate-x-14" : ""
          }`}
        >
          {renderEgg(false)}
        </div>

        {/* Partner Egg (Only for Kiss) */}
        {currentEmotion === Emotion.KISS && (
          <div className="w-64 h-80 absolute z-20 animate-slide-in left-28">
            {renderEgg(true)}
          </div>
        )}

        {/* Shadow */}
        <div className="absolute -bottom-4 w-40 h-4 bg-black/10 rounded-full blur-sm" />
      </div>

      {/* Controls */}
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
            onClick={() => setCurrentEmotion(Emotion.WAVE)}
            className="flex-shrink-0 p-3 bg-blue-100 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center"
          >
            <span className="text-2xl">👋</span>
            <span className="text-xs font-bold mt-1">Wave</span>
          </button>

          <button
            onClick={() => setCurrentEmotion(Emotion.DANCE)}
            className="flex-shrink-0 p-3 bg-green-100 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center"
          >
            <span className="text-2xl">💃</span>
            <span className="text-xs font-bold mt-1">Dance</span>
          </button>

          <button
            onClick={() => setCurrentEmotion(Emotion.LOVE)}
            className="flex-shrink-0 p-3 bg-pink-100 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center"
          >
            <span className="text-2xl">😍</span>
            <span className="text-xs font-bold mt-1">Love</span>
          </button>

          <button
            onClick={() => setCurrentEmotion(Emotion.KISS)}
            className="flex-shrink-0 p-3 bg-red-100 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center"
          >
            <span className="text-2xl">😘</span>
            <span className="text-xs font-bold mt-1">Kiss</span>
          </button>

          <button
            onClick={() => setCurrentEmotion(Emotion.ANGRY)}
            className="flex-shrink-0 p-3 bg-red-500 text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center"
          >
            <span className="text-2xl">😡</span>
            <span className="text-xs font-bold mt-1">Angry</span>
          </button>

          <button
            onClick={() => setCurrentEmotion(Emotion.SAD)}
            className="flex-shrink-0 p-3 bg-blue-300 text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 min-w-[80px] flex flex-col items-center"
          >
            <span className="text-2xl">😢</span>
            <span className="text-xs font-bold mt-1">Sad</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Egg;
