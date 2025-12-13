import React, { useState, useEffect } from "react";
import ShinChan from "./ShinChan";
import Doraemon from "./Doraemon";
import Egg, { Emotion as EggEmotion } from "./Egg";

// --- Metadata ---
const metadata = {
  name: "Mood Circle Animation",
  description:
    "A React application featuring an animated character that cycles between happy, angry, and sad moods every 5 seconds with smooth transitions.",
};

// --- Types & Constants ---

const Mood = {
  HAPPY: "HAPPY",
  ANGRY: "ANGRY",
  SAD: "SAD",
  EATING: "EATING",
  LOVE: "LOVE",
} as const;

type Mood = (typeof Mood)[keyof typeof Mood];

// --- Cosplay Types ---
type HatType = "none" | "tophat" | "beanie" | "crown" | "wizard";
type GlassesType = "none" | "round" | "aviator" | "star" | "pixel";

interface CustomizationState {
  hat: HatType;
  glasses: GlassesType;
  eyeColor: string;
  eyebrowColor: string;
  mouthColor: string;
}

const DEFAULT_CUSTOMIZATION: CustomizationState = {
  hat: "none",
  glasses: "none",
  eyeColor: "#000000",
  eyebrowColor: "#000000",
  mouthColor: "#000000",
};

const COLOR_PALETTE = [
  "#000000", // Black
  "#374151", // Dark Gray
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#FFFFFF", // White
];

interface MoodConfig {
  colorClass: string;
  shadowColor: string;
  mouthPath: string;
  label: string;
  bgGradient: string;
  emoji: string;
  messages: string[];
}

const MOOD_CYCLE_DURATION = 5000;

const MOOD_CONFIGS: Record<Mood, MoodConfig> = {
  [Mood.HAPPY]: {
    colorClass: "bg-yellow-400",
    shadowColor: "rgba(250, 204, 21, 0.6)",
    mouthPath: "M 60 150 Q 100 190 140 150",
    label: "Happy",
    bgGradient: "from-yellow-100 via-orange-50 to-yellow-50",
    emoji: "✨",
    messages: [
      "I'm feeling great!",
      "Best day ever!",
      "Let's play!",
      "So happy!",
    ],
  },
  [Mood.ANGRY]: {
    colorClass: "bg-red-500",
    shadowColor: "rgba(239, 68, 68, 0.6)",
    mouthPath: "M 70 160 Q 100 120 130 160",
    label: "Angry",
    bgGradient: "from-red-100 via-red-50 to-orange-50",
    emoji: "💢",
    messages: ["Grrr!", "Don't touch me!", "I'm steaming!", "Not now!"],
  },
  [Mood.SAD]: {
    colorClass: "bg-blue-400",
    shadowColor: "rgba(96, 165, 250, 0.6)",
    mouthPath: "M 70 160 Q 100 130 130 160",
    label: "Sad",
    bgGradient: "from-blue-100 via-indigo-50 to-slate-50",
    emoji: "💧",
    messages: ["I feel blue...", "*Sniff*", "Can I have a hug?", "Oh well..."],
  },
  [Mood.EATING]: {
    colorClass: "bg-yellow-400",
    shadowColor: "rgba(250, 204, 21, 0.6)",
    mouthPath: "M 75 150 Q 100 200 125 150 Q 100 100 75 150", // Open mouth
    label: "Eating",
    bgGradient: "from-green-100 via-emerald-50 to-teal-50",
    emoji: "🍔",
    messages: ["Yum yum!", "Delicious!", "More please!", "Nom nom nom"],
  },
  [Mood.LOVE]: {
    colorClass: "bg-pink-400",
    shadowColor: "rgba(236, 72, 153, 0.6)",
    mouthPath: "M 70 150 Q 100 180 130 150", // Gentle smile
    label: "Love",
    bgGradient: "from-pink-100 via-rose-50 to-red-50",
    emoji: "💖",
    messages: ["I love you!", "You're amazing!", "So sweet!", "Hugs & Kisses!"],
  },
};

interface FaceProps {
  mood: Mood;
  customization?: CustomizationState;
}

const Face: React.FC<FaceProps> = ({
  mood,
  customization = DEFAULT_CUSTOMIZATION,
}) => {
  const currentMood = MOOD_CONFIGS[mood] ? mood : Mood.HAPPY;
  const config = MOOD_CONFIGS[currentMood];

  const getEyebrowStyle = (side: "left" | "right") => {
    let rotation = 0;
    let translateY = 0;

    if (currentMood === Mood.ANGRY) {
      rotation = side === "left" ? 25 : -25;
      translateY = 10;
    } else if (currentMood === Mood.SAD) {
      rotation = side === "left" ? -20 : 20;
      translateY = -5;
    } else if (currentMood === Mood.EATING) {
      rotation = 0;
      translateY = -15;
    } else if (currentMood === Mood.LOVE) {
      rotation = side === "left" ? -10 : 10;
      translateY = -15;
    } else {
      rotation = 0;
      translateY = -10;
    }
    return {
      transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
      backgroundColor: customization.eyebrowColor,
    };
  };

  const containerClasses = `${config.colorClass} rounded-full w-64 h-64`;
  const containerShadow = {
    boxShadow: `0 0 50px ${config.shadowColor}`,
    transition: "box-shadow 1s ease-in-out, background-color 1s ease-in-out",
  };

  // Coordinated system: Face is 256px wide.
  // We use a 256 viewbox width for glasses to map 1:1.
  // Left eye center x ~ 84 (calculated from layout).
  // Right eye center x ~ 172.
  const leftEyeX = 84;
  const rightEyeX = 172;
  const eyeY = 30;

  const renderGlasses = () => {
    switch (customization.glasses) {
      case "round":
        return (
          <g fill="rgba(0,0,0,0.5)" stroke="#333" strokeWidth="4">
            <circle cx={leftEyeX} cy={eyeY} r="28" />
            <circle cx={rightEyeX} cy={eyeY} r="28" />
            <path
              d={`M ${leftEyeX + 28} ${eyeY} L ${rightEyeX - 28} ${eyeY}`}
              strokeWidth="4"
            />
          </g>
        );
      case "aviator":
        return (
          <g fill="rgba(0,0,0,0.6)" stroke="#333" strokeWidth="3">
            <path
              d={`M ${leftEyeX - 30} ${eyeY - 15} C ${leftEyeX - 30} ${
                eyeY - 15
              }, ${leftEyeX + 30} ${eyeY - 15}, ${leftEyeX + 30} ${
                eyeY - 15
              } C ${leftEyeX + 30} ${eyeY - 15}, ${leftEyeX + 30} ${
                eyeY + 25
              }, ${leftEyeX + 10} ${eyeY + 30} C ${leftEyeX - 10} ${
                eyeY + 35
              }, ${leftEyeX - 30} ${eyeY + 25}, ${leftEyeX - 30} ${
                eyeY - 15
              } Z`}
            />
            <path
              d={`M ${rightEyeX - 30} ${eyeY - 15} C ${rightEyeX - 30} ${
                eyeY - 15
              }, ${rightEyeX + 30} ${eyeY - 15}, ${rightEyeX + 30} ${
                eyeY - 15
              } C ${rightEyeX + 30} ${eyeY - 15}, ${rightEyeX + 30} ${
                eyeY + 25
              }, ${rightEyeX + 10} ${eyeY + 30} C ${rightEyeX - 10} ${
                eyeY + 35
              }, ${rightEyeX - 30} ${eyeY + 25}, ${rightEyeX - 30} ${
                eyeY - 15
              } Z`}
            />
            <path
              d={`M ${leftEyeX + 30} ${eyeY - 10} Q ${
                leftEyeX + (rightEyeX - leftEyeX) / 2
              } ${eyeY - 20} ${rightEyeX - 30} ${eyeY - 10}`}
              fill="none"
              strokeWidth="3"
            />
          </g>
        );
      case "star":
        return (
          <g fill="rgba(255, 105, 180, 0.4)" stroke="#db2777" strokeWidth="3">
            {/* Centered stars on eyes */}
            <polygon
              points={`${leftEyeX},${eyeY - 25} ${leftEyeX + 8},${eyeY - 8} ${
                leftEyeX + 27
              },${eyeY - 8} ${leftEyeX + 12},${eyeY + 5} ${leftEyeX + 18},${
                eyeY + 23
              } ${leftEyeX},${eyeY + 12} ${leftEyeX - 18},${eyeY + 23} ${
                leftEyeX - 12
              },${eyeY + 5} ${leftEyeX - 27},${eyeY - 8} ${leftEyeX - 8},${
                eyeY - 8
              }`}
            />
            <polygon
              points={`${rightEyeX},${eyeY - 25} ${rightEyeX + 8},${eyeY - 8} ${
                rightEyeX + 27
              },${eyeY - 8} ${rightEyeX + 12},${eyeY + 5} ${rightEyeX + 18},${
                eyeY + 23
              } ${rightEyeX},${eyeY + 12} ${rightEyeX - 18},${eyeY + 23} ${
                rightEyeX - 12
              },${eyeY + 5} ${rightEyeX - 27},${eyeY - 8} ${rightEyeX - 8},${
                eyeY - 8
              }`}
            />
            <line
              x1={leftEyeX + 20}
              y1={eyeY}
              x2={rightEyeX - 20}
              y2={eyeY}
              strokeWidth="4"
            />
          </g>
        );
      case "pixel":
        // Simple pixel glasses representation
        return (
          <g fill="black">
            {/* Left lens blocks */}
            <rect x={leftEyeX - 25} y={eyeY - 10} width="10" height="10" />{" "}
            <rect x={leftEyeX - 15} y={eyeY - 10} width="10" height="10" />{" "}
            <rect x={leftEyeX - 5} y={eyeY - 10} width="10" height="10" />{" "}
            <rect x={leftEyeX + 5} y={eyeY - 10} width="10" height="10" />
            <rect x={leftEyeX - 15} y={eyeY} width="10" height="10" />{" "}
            <rect x={leftEyeX - 5} y={eyeY} width="10" height="10" />{" "}
            <rect x={leftEyeX + 5} y={eyeY} width="10" height="10" />{" "}
            <rect x={leftEyeX + 15} y={eyeY} width="10" height="10" />
            {/* Right lens blocks */}
            <rect
              x={rightEyeX - 15}
              y={eyeY - 10}
              width="10"
              height="10"
            />{" "}
            <rect x={rightEyeX - 5} y={eyeY - 10} width="10" height="10" />{" "}
            <rect x={rightEyeX + 5} y={eyeY - 10} width="10" height="10" />{" "}
            <rect x={rightEyeX + 15} y={eyeY - 10} width="10" height="10" />
            <rect x={rightEyeX - 25} y={eyeY} width="10" height="10" />{" "}
            <rect x={rightEyeX - 15} y={eyeY} width="10" height="10" />{" "}
            <rect x={rightEyeX - 5} y={eyeY} width="10" height="10" />{" "}
            <rect x={rightEyeX + 5} y={eyeY} width="10" height="10" />
            {/* Bridge */}
            <rect x={leftEyeX + 15} y={eyeY - 5} width="20" height="5" />
            <rect x={rightEyeX - 35} y={eyeY - 5} width="20" height="5" />
          </g>
        );
      default:
        return null;
    }
  };

  const renderHat = () => {
    // ViewBox is 0 0 200 200. Center x is 100.
    switch (customization.hat) {
      case "tophat":
        return (
          <g>
            {/* Brim: Center 100 */}
            <rect
              x="20"
              y="140"
              width="160"
              height="20"
              fill="#1f2937"
              rx="2"
            />
            {/* Top */}
            <rect x="50" y="50" width="100" height="100" fill="#1f2937" />
            {/* Band */}
            <rect x="50" y="120" width="100" height="20" fill="#ef4444" />
          </g>
        );
      case "beanie":
        return (
          <g>
            {/* Main body: Semi-circle ish */}
            <path
              d="M 40 140 Q 100 40 160 140"
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth="4"
            />
            {/* Rim */}
            <rect
              x="35"
              y="135"
              width="130"
              height="30"
              rx="8"
              fill="#60a5fa"
            />
            {/* Pom pom */}
            <circle cx="100" cy="40" r="18" fill="#ef4444" />
          </g>
        );
      case "crown":
        return (
          <g>
            {/* Base points - Shifted up 20px to align baseline to ~160 */}
            <polygon
              points="40,160 70,80 100,150 130,80 160,160 160,180 40,180"
              transform="translate(0, -20)"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Gems - Shifted up 20px */}
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
          </g>
        );
      case "wizard":
        return (
          <g>
            {/* Cone */}
            <path d="M 30 160 Q 100 180 170 160" fill="#5b21b6" />
            <path d="M 40 160 L 100 20 L 160 160" fill="#6d28d9" />
            {/* Stars */}
            <text
              x="85"
              y="110"
              fontSize="24"
              fill="yellow"
              style={{ filter: "drop-shadow(0px 0px 2px gold)" }}
            >
              ★
            </text>
            <text
              x="110"
              y="80"
              fontSize="18"
              fill="yellow"
              style={{ filter: "drop-shadow(0px 0px 2px gold)" }}
            >
              ★
            </text>
            <text
              x="75"
              y="60"
              fontSize="14"
              fill="yellow"
              style={{ filter: "drop-shadow(0px 0px 2px gold)" }}
            >
              ★
            </text>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${containerClasses}`}
      style={containerShadow}
    >
      {/* Hat Layer - Centered absolutely */}
      {customization.hat !== "none" && (
        <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 z-40 pointer-events-none w-[300px] h-[200px] flex justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            className="overflow-visible"
          >
            {renderHat()}
          </svg>
        </div>
      )}

      {/* Eyes Container */}
      <div className="flex justify-between w-32 mb-8 relative z-10">
        <div className="relative">
          <div
            className="w-10 h-3 rounded-full absolute -top-6 left-1 transition-transform duration-1000 ease-in-out origin-center"
            style={getEyebrowStyle("left")}
          />
          {currentMood === Mood.LOVE ? (
            <div className="w-10 h-10 flex items-center justify-center animate-heartbeat origin-center">
              <svg
                viewBox="0 0 32 32"
                className="w-full h-full text-red-500 fill-current drop-shadow-sm"
              >
                <path d="M16 28 C16 28 3 20.5 3 11.5 C3 7.2 6.5 4 11 4 C13.5 4 15.5 5 16 7 C16.5 5 18.5 4 21 4 C25.5 4 29 7.2 29 11.5 C29 20.5 16 28 16 28 Z" />
              </svg>
            </div>
          ) : (
            <>
              <div
                className="w-10 h-10 rounded-full transition-all duration-1000 shadow-sm"
                style={{ backgroundColor: customization.eyeColor }}
              />
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-60"></div>
            </>
          )}
        </div>
        <div className="relative">
          <div
            className="w-10 h-3 rounded-full absolute -top-6 right-1 transition-transform duration-1000 ease-in-out origin-center"
            style={getEyebrowStyle("right")}
          />
          {currentMood === Mood.LOVE ? (
            <div className="w-10 h-10 flex items-center justify-center animate-heartbeat origin-center">
              <svg
                viewBox="0 0 32 32"
                className="w-full h-full text-red-500 fill-current drop-shadow-sm"
              >
                <path d="M16 28 C16 28 3 20.5 3 11.5 C3 7.2 6.5 4 11 4 C13.5 4 15.5 5 16 7 C16.5 5 18.5 4 21 4 C25.5 4 29 7.2 29 11.5 C29 20.5 16 28 16 28 Z" />
              </svg>
            </div>
          ) : (
            <>
              <div
                className="w-10 h-10 rounded-full transition-all duration-1000 shadow-sm"
                style={{ backgroundColor: customization.eyeColor }}
              />
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-60"></div>
            </>
          )}
        </div>
      </div>

      {/* Glasses Overlay - Adjusted to top-[75px] */}
      {customization.glasses !== "none" && (
        <div className="absolute top-[75px] z-20 pointer-events-none w-full h-24 left-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 256 96"
            className="overflow-visible"
          >
            {renderGlasses()}
          </svg>
        </div>
      )}

      {/* Mouth */}
      <svg
        width="200"
        height="256"
        viewBox="0 0 200 256"
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10"
      >
        <path
          d={config.mouthPath}
          fill="transparent"
          stroke={customization.mouthColor}
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-[d] duration-1000 ease-in-out"
        />
      </svg>

      {/* Eating Animation: Hamburger */}
      {currentMood === Mood.EATING && (
        <div className="absolute top-[130px] left-1/2 -translate-x-1/2 z-50 text-5xl pointer-events-none animate-chew">
          🍔
        </div>
      )}

      {/* Blush */}
      <div
        className={`absolute top-32 left-8 w-8 h-4 bg-red-500 rounded-full blur-md transition-opacity duration-1000 ${
          currentMood === Mood.HAPPY ||
          currentMood === Mood.LOVE ||
          currentMood === Mood.EATING
            ? "opacity-20"
            : "opacity-0"
        }`}
      ></div>
      <div
        className={`absolute top-32 right-8 w-8 h-4 bg-red-500 rounded-full blur-md transition-opacity duration-1000 ${
          currentMood === Mood.HAPPY ||
          currentMood === Mood.LOVE ||
          currentMood === Mood.EATING
            ? "opacity-20"
            : "opacity-0"
        }`}
      ></div>

      <style>{`
        @keyframes chew {
            0% { transform: translate(-50%, 0) scale(1) rotate(0deg); opacity: 0; }
            20% { opacity: 1; transform: translate(-50%, -10px) scale(1.1) rotate(-10deg); }
            40% { transform: translate(-50%, 0) scale(0.9) rotate(10deg); }
            60% { transform: translate(-50%, -5px) scale(0.7) rotate(-5deg); }
            80% { opacity: 1; transform: translate(-50%, 0) scale(0.5) rotate(0deg); }
            100% { opacity: 0; transform: translate(-50%, 10px) scale(0); }
        }
        .animate-chew {
            animation: chew 2.5s ease-in-out forwards;
        }
        @keyframes heartbeat {
            0% { transform: scale(1); }
            14% { transform: scale(1.3); }
            28% { transform: scale(1); }
            42% { transform: scale(1.3); }
            70% { transform: scale(1); }
        }
        .animate-heartbeat {
            animation: heartbeat 1.5s infinite;
        }
       `}</style>
    </div>
  );
};

// --- Particles Component ---
const MoodParticles: React.FC<{ emoji: string }> = ({ emoji }) => {
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${10 + Math.random() * 10}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-4xl opacity-20 animate-float"
          style={{
            left: p.left,
            bottom: "-50px",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {emoji}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bob {
            animation: bob 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// --- Icons ---

const CheckmarkIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-white"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-white"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Main Component ---

interface AvatarItem {
  id: number;
  type: "face" | "image" | "shinchan" | "doraemon" | "egg";
  image?: string;
  locked: boolean;
  customization?: CustomizationState;
}

const initialAvatars: AvatarItem[] = [
  { id: 1, type: "face", locked: false, customization: DEFAULT_CUSTOMIZATION },
  { id: 2, type: "shinchan", locked: false },
  { id: 3, type: "doraemon", locked: false },
  { id: 4, type: "egg", locked: false },
];

const Avatar: React.FC = () => {
  const [avatars, setAvatars] = useState<AvatarItem[]>(initialAvatars);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [viewMode, setViewMode] = useState<"dashboard" | "play">("dashboard");
  const [message, setMessage] = useState<string>("");

  const [cosplayTab, setCosplayTab] = useState<"gear" | "style">("gear");

  // Mood Cycling Effect (only in dashboard mode)
  useEffect(() => {
    if (viewMode === "play") return;

    const sequence = [Mood.HAPPY, Mood.ANGRY, Mood.HAPPY, Mood.SAD];
    let sequenceIndex = 0;
    const moodInterval = setInterval(() => {
      sequenceIndex = (sequenceIndex + 1) % sequence.length;
      setMood(sequence[sequenceIndex]);
    }, MOOD_CYCLE_DURATION);
    return () => clearInterval(moodInterval);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === "play") {
      const messages = MOOD_CONFIGS[mood].messages;
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMsg);
    }
  }, [mood, viewMode]);

  const handleAvatarClick = (id: number, locked: boolean) => {
    if (!locked) {
      setSelectedAvatarId(id);
    }
  };

  const handleGiveFood = () => {
    setMood(Mood.EATING);
    setTimeout(() => {
      setMood(Mood.HAPPY);
    }, 2500);
  };

  const handleLove = () => {
    setMood(Mood.LOVE);
    setTimeout(() => {
      setMood(Mood.HAPPY);
    }, 5000);
  };

  const selectedAvatar =
    avatars.find((a) => a.id === selectedAvatarId) || avatars[0];
  const activeCustomization =
    selectedAvatar.customization || DEFAULT_CUSTOMIZATION;

  const updateCustomization = (
    key: keyof CustomizationState,
    value: string
  ) => {
    setAvatars((prev) =>
      prev.map((avatar) => {
        if (avatar.id === selectedAvatarId) {
          return {
            ...avatar,
            customization: {
              ...(avatar.customization || DEFAULT_CUSTOMIZATION),
              [key]: value,
            },
          };
        }
        return avatar;
      })
    );

    if (viewMode === "play" && (key === "hat" || key === "glasses")) {
      const compliments = [
        "Wow!",
        "It looks cool!",
        "Amazing!",
        "Looking good!",
        "Nice choice!",
        "So stylish!",
        "Awesome!",
        "Fantastic!",
      ];
      setMessage(compliments[Math.floor(Math.random() * compliments.length)]);
    }
  };

  // Helper to map global mood to Egg emotion
  const getEggEmotion = (currentMood: Mood): EggEmotion => {
    switch (currentMood) {
      case Mood.ANGRY:
        return EggEmotion.ANGRY;
      case Mood.SAD:
        return EggEmotion.SAD;
      case Mood.LOVE:
        return EggEmotion.LOVE;
      case Mood.HAPPY:
        return EggEmotion.NEUTRAL;
      case Mood.EATING:
        return EggEmotion.NEUTRAL; // Fallback
      default:
        return EggEmotion.NEUTRAL;
    }
  };

  const xpProgress = 230;
  const maxXP = 500;
  const energy = 78;

  const renderMainContent = () => {
    if (selectedAvatar.type === "face") {
      return (
        <div className="transform scale-75 sm:scale-100 transition-transform duration-500 ease-in-out group-hover:scale-90 sm:group-hover:scale-110">
          <Face mood={mood} customization={activeCustomization} />
        </div>
      );
    } else if (selectedAvatar.type === "shinchan") {
      return (
        <div className="transform scale-75 sm:scale-90 transition-transform duration-500 ease-in-out group-hover:scale-100">
          <ShinChan showControls={false} />
        </div>
      );
    } else if (selectedAvatar.type === "doraemon") {
      return (
        <div className="transform scale-50 sm:scale-75 transition-transform duration-500 ease-in-out group-hover:scale-90">
          <Doraemon showControls={false} />
        </div>
      );
    } else if (selectedAvatar.type === "egg") {
      return (
        <div className="transform scale-50 sm:scale-75 transition-transform duration-500 ease-in-out group-hover:scale-90">
          <Egg emotion={getEggEmotion(mood)} />
        </div>
      );
    }
    return (
      <img
        src={selectedAvatar.image}
        alt="Main Avatar"
        className="w-full h-full object-cover"
      />
    );
  };

  const renderAvatarGridItem = (avatar: AvatarItem) => (
    <div
      key={avatar.id}
      className={`relative w-28 h-28 sm:w-32 sm:h-32 lg:w-32 lg:h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 ease-in-out ${
        selectedAvatarId === avatar.id
          ? "border-4 border-green-500 shadow-lg"
          : "border border-gray-200 hover:border-gray-300"
      } ${
        avatar.locked
          ? "cursor-not-allowed grayscale opacity-75"
          : "cursor-pointer"
      }`}
      onClick={() => handleAvatarClick(avatar.id, avatar.locked)}
      role="button"
      aria-pressed={selectedAvatarId === avatar.id}
      aria-label={`Select avatar ${avatar.id}`}
    >
      {/* Grid Item Content */}
      {avatar.type === "face" && (
        <div className="transform scale-[0.45]">
          <Face
            mood={mood}
            customization={avatar.customization || DEFAULT_CUSTOMIZATION}
          />
        </div>
      )}
      {avatar.type === "shinchan" && (
        <div className="transform scale-[0.3]">
          <ShinChan showControls={false} />
        </div>
      )}
      {avatar.type === "doraemon" && (
        <div className="transform scale-[0.3]">
          <Doraemon showControls={false} />
        </div>
      )}
      {avatar.type === "egg" && (
        <div className="transform scale-[0.3]">
          <Egg emotion={getEggEmotion(mood)} />
        </div>
      )}
      {avatar.type === "image" && avatar.image && (
        <img
          src={avatar.image}
          alt={`Avatar ${avatar.id}`}
          className="w-full h-full object-cover"
        />
      )}

      {/* Lock Overlay */}
      {avatar.locked && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl z-20">
          <i className="fa-solid fa-lock text-white text-3xl opacity-90"></i>
        </div>
      )}
      {/* Selection Checkmark */}
      {selectedAvatarId === avatar.id && !avatar.locked && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-md z-20">
          <CheckmarkIcon />
        </div>
      )}
    </div>
  );

  // --- Play Mode ---
  if (viewMode === "play") {
    const activeConfig = MOOD_CONFIGS[mood];

    return (
      <div
        className={`fixed inset-0 z-50 w-full h-full bg-gradient-to-br ${activeConfig.bgGradient} transition-all duration-1000 ease-in-out flex items-center justify-center overflow-hidden`}
      >
        <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

        {/* Background Particles */}
        <MoodParticles emoji={activeConfig.emoji} />

        {/* Back Button */}
        <button
          onClick={() => {
            setViewMode("dashboard");
            setMood(Mood.HAPPY);
          }}
          className="absolute top-8 left-8 bg-white/60 hover:bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl font-semibold text-gray-800 shadow-sm transition-all z-50 flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <i className="fa-solid fa-arrow-left"></i> Dashboard
        </button>

        {/* Main Center Area */}
        <div
          className={`flex flex-col items-center justify-center w-full h-full pb-20 pr-0 ${
            selectedAvatar.type === "face" ? "md:pr-80" : ""
          } transition-all duration-500`}
        >
          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-800/90 tracking-tight mb-12 -mt-24 drop-shadow-sm">
            Play Time
          </h1>

          {/* Speech Bubble - Only show for face type which relies on global messages */}
          {selectedAvatar.type === "face" && (
            <div
              className="relative z-20 mb-8 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-[2rem] shadow-xl text-xl md:text-2xl font-bold text-gray-800 transform scale-100 transition-all border-2 border-white/50">
                {message}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 border-b-2 border-r-2 border-white/50 rotate-45 rounded-sm"></div>
              </div>
            </div>
          )}

          {/* Avatar */}
          <div
            className={`transform transition-all duration-500 z-10 ${
              ["shinchan", "doraemon", "egg"].includes(selectedAvatar.type)
                ? "w-full h-full flex items-center justify-center"
                : "scale-75 sm:scale-90 md:scale-100 mb-20 mt-12 animate-bob drop-shadow-2xl"
            }`}
          >
            {selectedAvatar.type === "face" ? (
              <Face mood={mood} customization={activeCustomization} />
            ) : selectedAvatar.type === "shinchan" ? (
              <ShinChan showControls={true} />
            ) : selectedAvatar.type === "doraemon" ? (
              <Doraemon showControls={true} />
            ) : (
              <Egg emotion={getEggEmotion(mood)} showControls={true} />
            )}
          </div>

          {/* Controls Dock (Bottom) - Show only for Sparky/Face, NOT Egg */}
          {selectedAvatar.type === "face" && (
            <div className="bg-white/40 backdrop-blur-2xl border border-white/50 p-3 rounded-[2rem] shadow-2xl flex gap-4 transition-all hover:bg-white/50 z-50 mx-4 mt-12">
              <button
                onClick={() => setMood(Mood.HAPPY)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
                  mood === Mood.HAPPY
                    ? "bg-yellow-400 text-white shadow-lg scale-110 ring-4 ring-yellow-200"
                    : "bg-white/70 text-yellow-600 hover:bg-yellow-100 hover:scale-105"
                }`}
                title="Happy"
              >
                <i className="fa-solid fa-face-smile"></i>
              </button>
              <button
                onClick={handleLove}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
                  mood === Mood.LOVE
                    ? "bg-pink-400 text-white shadow-lg scale-110 ring-4 ring-pink-200"
                    : "bg-white/70 text-pink-500 hover:bg-pink-100 hover:scale-105"
                }`}
                title="Love"
              >
                <i className="fa-solid fa-heart"></i>
              </button>
              <button
                onClick={() => setMood(Mood.SAD)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
                  mood === Mood.SAD
                    ? "bg-blue-400 text-white shadow-lg scale-110 ring-4 ring-blue-200"
                    : "bg-white/70 text-blue-600 hover:bg-blue-100 hover:scale-105"
                }`}
                title="Sad"
              >
                <i className="fa-solid fa-face-frown"></i>
              </button>
              <button
                onClick={() => setMood(Mood.ANGRY)}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
                  mood === Mood.ANGRY
                    ? "bg-red-500 text-white shadow-lg scale-110 ring-4 ring-red-200"
                    : "bg-white/70 text-red-600 hover:bg-red-100 hover:scale-105"
                }`}
                title="Angry"
              >
                <i className="fa-solid fa-face-angry"></i>
              </button>
              <div className="w-px h-10 bg-gray-500/20 self-center mx-1"></div>
              <button
                onClick={handleGiveFood}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
                  mood === Mood.EATING
                    ? "bg-green-500 text-white shadow-lg scale-110 ring-4 ring-green-200"
                    : "bg-white/70 text-green-600 hover:bg-green-100 hover:scale-105"
                }`}
                title="Give Food"
              >
                <i className="fa-solid fa-burger"></i>
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar: Cosplay Panel - Only show for Face */}
        {selectedAvatar.type === "face" && (
          <div className="absolute right-6 top-24 bottom-6 w-80 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-50 hidden md:flex transition-all hover:bg-white/70">
            <div className="p-6 border-b border-white/30 bg-white/30">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-sm">
                  <i className="fa-solid fa-shirt"></i>
                </span>
                Cosplay
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex p-3 gap-2 bg-black/5 mx-4 mt-4 rounded-xl">
              <button
                onClick={() => setCosplayTab("gear")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  cosplayTab === "gear"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Gear
              </button>
              <button
                onClick={() => setCosplayTab("style")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  cosplayTab === "style"
                    ? "bg-white shadow-sm text-pink-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Style
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {cosplayTab === "gear" ? (
                <>
                  {/* Hats Section */}
                  <div className="animate-fade-in">
                    <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                      Hats Collection
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          "none",
                          "tophat",
                          "beanie",
                          "crown",
                          "wizard",
                        ] as HatType[]
                      ).map((hat) => (
                        <button
                          key={hat}
                          onClick={() => updateCustomization("hat", hat)}
                          className={`aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-200 group ${
                            activeCustomization.hat === hat
                              ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md ring-2 ring-indigo-200"
                              : "border-transparent bg-white/50 text-gray-500 hover:bg-white hover:scale-105"
                          }`}
                        >
                          <span className="text-3xl transition-transform group-hover:scale-110 group-active:scale-95">
                            {hat === "none" ? (
                              <i className="fa-solid fa-ban text-gray-400"></i>
                            ) : hat === "tophat" ? (
                              <i className="fa-brands fa-redhat"></i>
                            ) : hat === "beanie" ? (
                              <i className="fa-solid fa-hat-wizard"></i>
                            ) : hat === "crown" ? (
                              <i className="fa-solid fa-crown text-yellow-500"></i>
                            ) : (
                              <i className="fa-solid fa-wand-magic-sparkles text-purple-500"></i>
                            )}
                          </span>
                          <span className="text-xs font-semibold capitalize">
                            {hat}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Glasses Section */}
                  <div className="animate-fade-in">
                    <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                      Eyewear
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          "none",
                          "round",
                          "aviator",
                          "star",
                          "pixel",
                        ] as GlassesType[]
                      ).map((gl) => (
                        <button
                          key={gl}
                          onClick={() => updateCustomization("glasses", gl)}
                          className={`aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all duration-200 group ${
                            activeCustomization.glasses === gl
                              ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md ring-2 ring-pink-200"
                              : "border-transparent bg-white/50 text-gray-500 hover:bg-white hover:scale-105"
                          }`}
                        >
                          <span className="text-3xl transition-transform group-hover:scale-110 group-active:scale-95">
                            {gl === "none" ? (
                              <i className="fa-solid fa-ban text-gray-400"></i>
                            ) : (
                              <i className="fa-solid fa-glasses"></i>
                            )}
                          </span>
                          <span className="text-xs font-semibold capitalize">
                            {gl}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-fade-in space-y-6">
                  {/* Colors Section */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                      Eyes Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateCustomization("eyeColor", color)}
                          className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${
                            activeCustomization.eyeColor === color
                              ? "border-gray-800 scale-110 shadow-md"
                              : "border-white"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                      Eyebrow Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            updateCustomization("eyebrowColor", color)
                          }
                          className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${
                            activeCustomization.eyebrowColor === color
                              ? "border-gray-800 scale-110 shadow-md"
                              : "border-white"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                      Mouth Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            updateCustomization("mouthColor", color)
                          }
                          className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${
                            activeCustomization.mouthColor === color
                              ? "border-gray-800 scale-110 shadow-md"
                              : "border-white"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Dashboard Mode ---
  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 font-sans mx-auto my-8">
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Main Display Avatar Card */}
        <div
          className={`md:col-span-2 rounded-2xl relative overflow-hidden flex items-center justify-center aspect-[16/9] group ${
            selectedAvatar.type === "shinchan"
              ? "bg-transparent shadow-none"
              : selectedAvatar.type === "doraemon"
              ? "bg-sky-50 shadow-md"
              : selectedAvatar.type === "egg"
              ? "bg-amber-50 shadow-md"
              : "bg-gray-50 shadow-md"
          }`}
        >
          {renderMainContent()}
          {/* Overlays */}
          <>
            {selectedAvatar.type === "face" && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
            )}
            <div
              className={`absolute bottom-6 left-6 space-y-1 z-10 ${
                selectedAvatar.type === "shinchan"
                  ? "text-gray-800"
                  : selectedAvatar.type === "doraemon" ||
                    selectedAvatar.type === "egg"
                  ? "text-gray-800"
                  : "text-white"
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-bold">
                {selectedAvatar.type === "shinchan" ||
                selectedAvatar.type === "doraemon" ||
                selectedAvatar.type === "egg"
                  ? "Anime"
                  : "Sparky"}
              </h1>
              <p className="text-lg sm:text-xl font-medium opacity-80">
                {selectedAvatar.type === "shinchan"
                  ? "ShinChan"
                  : selectedAvatar.type === "doraemon"
                  ? "Doraemon"
                  : selectedAvatar.type === "egg"
                  ? "Eggbert"
                  : "Level 4 Adventurer"}
              </p>
              {selectedAvatar.type === "face" && (
                <p className="text-xs sm:text-sm font-light opacity-70">
                  Mood: {MOOD_CONFIGS[mood].label}
                </p>
              )}
            </div>
            <button
              onClick={() => setViewMode("play")}
              className="absolute bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 transition-colors text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg z-10 cursor-pointer"
            >
              <EyeIcon />
              <span>
                View{" "}
                {selectedAvatar.type === "shinchan" ||
                selectedAvatar.type === "doraemon" ||
                selectedAvatar.type === "egg"
                  ? "Anime"
                  : "Sparky"}
              </span>
            </button>
          </>
        </div>

        {/* Recent Activities */}
        <div className="md:col-span-1 bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Recent Activities
          </h2>
          <ul className="space-y-4">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-gray-700 text-base"
              >
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full flex-shrink-0 mt-2"></span>
                <div>
                  <p>You completed 3 tasks today !</p>
                  <p className="text-sm text-gray-500">just now</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom section: Avatar Grid and Progress Bars */}
      <div className="space-y-8 md:space-y-10">
        {/* Standard Avatars Section */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Avatar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {avatars
              .filter((a) => !["shinchan", "doraemon", "egg"].includes(a.type))
              .map(renderAvatarGridItem)}
          </div>
        </div>

        {/* Anime Section */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Anime
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {avatars
              .filter((a) => ["shinchan", "doraemon", "egg"].includes(a.type))
              .map(renderAvatarGridItem)}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="xp-progress"
                className="text-base font-medium text-gray-700"
              >
                XP Progress
              </label>
              <span className="text-sm font-medium text-gray-600">
                {xpProgress} / {maxXP}
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2.5"
              role="progressbar"
              aria-valuenow={xpProgress}
              aria-valuemin={0}
              aria-valuemax={maxXP}
              aria-label="XP Progress"
            >
              <div
                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(xpProgress / maxXP) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="energy-progress"
                className="text-base font-medium text-gray-700"
              >
                Energy
              </label>
              <span className="text-sm font-medium text-gray-600">
                {energy}%
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2.5"
              role="progressbar"
              aria-valuenow={energy}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Energy level"
            >
              <div
                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${energy}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
