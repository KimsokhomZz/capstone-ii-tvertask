import React, { useState, useEffect } from "react";
import ShinChan from "./ShinChan";
import Doraemon from "./Doraemon";
import Egg, { Emotion as EggEmotion } from "./Egg";

// --- Types & Data Structures (Ready for Backend) ---
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

interface CustomizationState {
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

const COLORS = [
  "#000000",
  "#374151",
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#FFFFFF",
];
const HATS: { id: HatType; icon: any }[] = [
  { id: "none", icon: <i className="fa-solid fa-ban text-gray-400"></i> },
  { id: "tophat", icon: <i className="fa-brands fa-redhat"></i> },
  { id: "beanie", icon: <i className="fa-solid fa-hat-wizard"></i> },
  { id: "crown", icon: <i className="fa-solid fa-crown text-yellow-500"></i> },
  {
    id: "wizard",
    icon: <i className="fa-solid fa-wand-magic-sparkles text-purple-500"></i>,
  },
];
const GLASSES: { id: GlassesType; icon: any }[] = [
  { id: "none", icon: <i className="fa-solid fa-ban text-gray-400"></i> },
  { id: "round", icon: <i className="fa-solid fa-glasses"></i> },
  { id: "aviator", icon: <i className="fa-solid fa-glasses"></i> },
  { id: "star", icon: <i className="fa-solid fa-glasses"></i> },
  { id: "pixel", icon: <i className="fa-solid fa-glasses"></i> },
];

const MOODS = {
  [Mood.HAPPY]: {
    cls: "bg-yellow-400",
    shadow: "rgba(250,204,21,0.6)",
    path: "M 60 150 Q 100 190 140 150",
    label: "Happy",
    grad: "from-yellow-100 via-orange-50 to-yellow-50",
    emoji: "✨",
    msgs: ["I'm feeling great!", "Best day ever!"],
  },
  [Mood.ANGRY]: {
    cls: "bg-red-500",
    shadow: "rgba(239,68,68,0.6)",
    path: "M 70 160 Q 100 120 130 160",
    label: "Angry",
    grad: "from-red-100 via-red-50 to-orange-50",
    emoji: "💢",
    msgs: ["Grrr!", "Don't touch me!"],
  },
  [Mood.SAD]: {
    cls: "bg-blue-400",
    shadow: "rgba(96,165,250,0.6)",
    path: "M 70 160 Q 100 130 130 160",
    label: "Sad",
    grad: "from-blue-100 via-indigo-50 to-slate-50",
    emoji: "💧",
    msgs: ["I feel blue...", "*Sniff*"],
  },
  [Mood.EATING]: {
    cls: "bg-yellow-400",
    shadow: "rgba(250,204,21,0.6)",
    path: "M 75 150 Q 100 200 125 150 Q 100 100 75 150",
    label: "Eating",
    grad: "from-green-100 via-emerald-50 to-teal-50",
    emoji: "🍔",
    msgs: ["Yum yum!", "Delicious!"],
  },
  [Mood.LOVE]: {
    cls: "bg-pink-400",
    shadow: "rgba(236,72,153,0.6)",
    path: "M 70 150 Q 100 180 130 150",
    label: "Love",
    grad: "from-pink-100 via-rose-50 to-red-50",
    emoji: "💖",
    msgs: ["I love you!", "You're amazing!"],
  },
};

// --- Face Component ---
const Face: React.FC<{ mood: Mood; custom?: CustomizationState }> = ({
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
      {mood === Mood.EATING && (
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

// --- Main Avatar Component ---
interface AvatarItem {
  id: number;
  type: "face" | "shinchan" | "doraemon" | "egg";
  image?: string;
  locked: boolean;
  customization?: CustomizationState;
}

const INIT_AVATARS: AvatarItem[] = [
  { id: 1, type: "face", locked: false, customization: DEFAULT_CUSTOM },
  { id: 2, type: "shinchan", locked: false },
  { id: 3, type: "doraemon", locked: false },
  { id: 4, type: "egg", locked: false },
];

const Avatar: React.FC = () => {
  const [avatars, setAvatars] = useState<AvatarItem[]>(INIT_AVATARS);
  const [selId, setSelId] = useState<number>(1);
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [mode, setMode] = useState<"dashboard" | "play">("dashboard");
  const [msg, setMsg] = useState<string>("");
  const [tab, setTab] = useState<"gear" | "style">("gear");

  useEffect(() => {
    if (mode === "play") return;
    const seq = [Mood.HAPPY, Mood.ANGRY, Mood.HAPPY, Mood.SAD];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setMood(seq[i]);
    }, 5000);
    return () => clearInterval(t);
  }, [mode]);

  useEffect(() => {
    if (mode === "play") {
      const msgs = MOODS[mood].msgs;
      setMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }, [mood, mode]);

  const sel = avatars.find((a) => a.id === selId) || avatars[0];
  const custom = sel.customization || DEFAULT_CUSTOM;

  const updateCustom = (k: keyof CustomizationState, v: string) => {
    setAvatars((p) =>
      p.map((a) =>
        a.id === selId
          ? {
              ...a,
              customization: { ...(a.customization || DEFAULT_CUSTOM), [k]: v },
            }
          : a
      )
    );
    if (mode === "play" && (k === "hat" || k === "glasses"))
      setMsg(["Wow!", "Cool!", "Stylish!"].sort(() => 0.5 - Math.random())[0]);
  };

  const getEggEm = (m: Mood) =>
    m === Mood.ANGRY
      ? EggEmotion.ANGRY
      : m === Mood.SAD
      ? EggEmotion.SAD
      : m === Mood.LOVE
      ? EggEmotion.LOVE
      : EggEmotion.NEUTRAL;
  const moodAct = (m: Mood) => {
    setMood(m);
    if (m === Mood.EATING || m === Mood.LOVE)
      setTimeout(() => setMood(Mood.HAPPY), m === Mood.LOVE ? 5000 : 2500);
  };

  const RenderContent = ({ scale = 1, controls = false }) => {
    const s = `transform scale-[${scale}] transition-transform duration-500`;
    if (sel.type === "face")
      return (
        <div className={s}>
          <Face mood={mood} custom={custom} />
        </div>
      );
    if (sel.type === "shinchan")
      return (
        <div className={s}>
          <ShinChan showControls={controls} />
        </div>
      );
    if (sel.type === "doraemon")
      return (
        <div className={s}>
          <Doraemon showControls={controls} />
        </div>
      );
    if (sel.type === "egg")
      return (
        <div className={s}>
          <Egg emotion={getEggEm(mood)} showControls={controls} />
        </div>
      );
    return <img src={sel.image} className="w-full h-full object-cover" />;
  };

  if (mode === "play") {
    const cfg = MOODS[mood];
    return (
      <div
        className={`fixed inset-0 z-50 w-full h-full bg-gradient-to-br ${cfg.grad} flex items-center justify-center overflow-hidden transition-all duration-1000`}
      >
        <style>{`.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}@keyframes float{0%{transform:translateY(0) rotate(0);opacity:0}10%,90%{opacity:0.3}100%{transform:translateY(-110vh) rotate(360deg);opacity:0}}.anim-float{animation:float linear infinite}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}.anim-bob{animation:bob 3s ease-in-out infinite}`}</style>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-20 anim-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            >
              {cfg.emoji}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setMode("dashboard");
            setMood(Mood.HAPPY);
          }}
          className="absolute top-8 left-8 bg-white/60 hover:bg-white/90 px-5 py-2.5 rounded-2xl font-bold shadow-sm z-50 flex gap-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Dashboard
        </button>

        <div
          className={`flex flex-col items-center justify-center w-full h-full pb-20 ${
            sel.type === "face" ? "md:pr-80" : ""
          }`}
        >
          <h1 className="text-5xl font-black text-gray-800/90 mb-12 -mt-24">
            Play Time
          </h1>
          {sel.type === "face" && (
            <div className="relative z-20 mb-8 animate-bounce">
              <div className="bg-white/95 px-8 py-4 rounded-[2rem] shadow-xl text-2xl font-bold">
                {msg}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 border-b-2 border-r-2 rotate-45"></div>
              </div>
            </div>
          )}

          <div
            className={`z-10 ${
              ["shinchan", "doraemon", "egg"].includes(sel.type)
                ? "w-full h-full flex items-center justify-center"
                : "scale-100 mb-20 mt-12 anim-bob drop-shadow-2xl"
            }`}
          >
            <RenderContent scale={1} controls={true} />
          </div>

          {sel.type === "face" && (
            <div className="bg-white/40 border border-white/50 p-3 rounded-[2rem] shadow-2xl flex gap-4 z-50 mx-4 mt-12">
              {[Mood.HAPPY, Mood.LOVE, Mood.SAD, Mood.ANGRY, Mood.EATING].map(
                (m, i) => {
                  const btn = MOODS[m];
                  return (
                    <button
                      key={m}
                      onClick={() => moodAct(m)}
                      className={`w-16 h-16 rounded-2xl text-3xl transition-all hover:-translate-y-1 ${
                        mood === m
                          ? btn.cls + " text-white scale-110 shadow-lg"
                          : "bg-white/70 hover:scale-105"
                      }`}
                    >
                      {btn.emoji}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        {sel.type === "face" && (
          <div className="absolute right-6 top-24 bottom-6 w-80 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-50 hidden md:flex">
            <div className="p-6 border-b border-white/30">
              <h2 className="text-2xl font-black flex gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-sm">
                  <i className="fa-solid fa-shirt"></i>
                </span>
                Cosplay
              </h2>
            </div>
            <div className="flex p-3 gap-2 bg-black/5 mx-4 mt-4 rounded-xl">
              {["gear", "style"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize ${
                    tab === t
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-sb">
              {tab === "gear"
                ? ["hat", "glasses"].map((type) => (
                    <div key={type}>
                      <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase">
                        {type}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {(type === "hat" ? HATS : GLASSES).map((it) => (
                          <button
                            key={it.id}
                            onClick={() => updateCustom(type as any, it.id)}
                            className={`aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 ${
                              custom[type as keyof CustomizationState] === it.id
                                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                : "border-transparent bg-white/50"
                            }`}
                          >
                            <span className="text-3xl">{it.icon}</span>
                            <span className="text-xs font-semibold capitalize">
                              {it.id}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                : ["eyeColor", "eyebrowColor", "mouthColor"].map((k) => (
                    <div key={k}>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase">
                        {k.replace("Color", "")} Color
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateCustom(k as any, c)}
                            className={`w-10 h-10 rounded-full border-4 hover:scale-110 ${
                              custom[k as keyof CustomizationState] === c
                                ? "border-gray-800 scale-110"
                                : "border-white"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 font-sans mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div
          className={`md:col-span-2 rounded-2xl relative overflow-hidden flex items-center justify-center aspect-[16/9] bg-gray-50 shadow-md group`}
        >
          <div className="transform scale-90">
            <RenderContent scale={0.9} />
          </div>
          {sel.type === "face" && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
          )}
          <div className="absolute bottom-6 left-6 text-gray-800 z-10">
            <h1 className="text-4xl font-bold">
              {["shinchan", "doraemon", "egg"].includes(sel.type)
                ? "Anime"
                : "Sparky"}
            </h1>
            <p className="text-xl font-medium opacity-80">
              {sel.type === "shinchan"
                ? "ShinChan"
                : sel.type === "doraemon"
                ? "Doraemon"
                : sel.type === "egg"
                ? "Eggbert"
                : "Adventurer"}
            </p>
            {sel.type === "face" && (
              <p className="text-sm font-light text-white opacity-90">
                Mood: {MOODS[mood].label}
              </p>
            )}
          </div>
          <button
            onClick={() => setMode("play")}
            className="absolute bottom-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg z-20 hover:bg-yellow-600"
          >
            <i className="fa-solid fa-eye"></i> View
          </button>
        </div>
        <div className="md:col-span-1 bg-gray-50 rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Recent</h2>
          <ul className="space-y-4">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex gap-3">
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full mt-2"></span>
                <div>
                  <p>Task completed!</p>
                  <p className="text-sm text-gray-500">just now</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {["Avatar", "Anime"].map((sec) => (
        <div key={sec} className="bg-gray-50 rounded-2xl p-8 shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-6">{sec}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {avatars
              .filter((a) =>
                sec === "Avatar"
                  ? !["shinchan", "doraemon", "egg"].includes(a.type)
                  : ["shinchan", "doraemon", "egg"].includes(a.type)
              )
              .map((a) => (
                <div
                  key={a.id}
                  onClick={() => !a.locked && setSelId(a.id)}
                  className={`relative w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden border-4 cursor-pointer hover:scale-105 transition-all ${
                    selId === a.id
                      ? "border-green-500 shadow-lg"
                      : "border-transparent"
                  } ${a.locked ? "opacity-75 grayscale" : ""}`}
                >
                  <div className="transform scale-[0.4] pointer-events-none">
                    {a.type === "face" ? (
                      <Face mood={mood} custom={a.customization} />
                    ) : a.type === "shinchan" ? (
                      <ShinChan showControls={false} />
                    ) : a.type === "doraemon" ? (
                      <Doraemon showControls={false} />
                    ) : (
                      <Egg emotion={getEggEm(mood)} />
                    )}
                  </div>
                  {a.locked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-white text-3xl"></i>
                    </div>
                  )}
                  {selId === a.id && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      <div className="bg-gray-50 rounded-2xl p-8 shadow-md space-y-6">
        {[
          { l: "XP", v: 230, m: 500 },
          { l: "Energy", v: 78, m: 100 },
        ].map((p) => (
          <div key={p.l}>
            <div className="flex justify-between mb-2 font-medium">
              <label>{p.l}</label>
              <span>
                {p.v} / {p.m}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `${(p.v / p.m) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Avatar;
