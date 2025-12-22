import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import ShinChan from "./ShinChan";
import Doraemon from "./Doraemon";
import Egg, { Emotion as EggEmotion } from "./Egg";
import FaceComponent from "./FaceComponent";
import { getStatus, getXp } from "../../api/userXpApi";
import { fetchUserStreak } from "../../api/streakApi";
import AuthContext from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext"; // Make sure this import exists

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
    textCls: "text-black",
  },
  [Mood.ANGRY]: {
    cls: "bg-red-500",
    shadow: "rgba(239,68,68,0.6)",
    path: "M 70 160 Q 100 120 130 160",
    label: "Angry",
    grad: "from-red-100 via-red-50 to-orange-50",
    emoji: "💢",
    msgs: ["Grrr!", "Don't touch me!"],
    textCls: "text-black",
  },
  [Mood.SAD]: {
    cls: "bg-blue-400",
    shadow: "rgba(96,165,250,0.6)",
    path: "M 70 160 Q 100 130 130 160",
    label: "Sad",
    grad: "from-blue-100 via-indigo-50 to-slate-50",
    emoji: "💧",
    msgs: ["I feel blue...", "*Sniff*"],
    textCls: "text-black",
  },
  [Mood.EATING]: {
    cls: "bg-yellow-400",
    shadow: "rgba(250,204,21,0.6)",
    path: "M 75 150 Q 100 200 125 150 Q 100 100 75 150",
    label: "Eating",
    grad: "from-green-100 via-emerald-50 to-teal-50",
    emoji: "🍔",
    msgs: ["Yum yum!", "Delicious!"],
    textCls: "text-black",
  },
  [Mood.LOVE]: {
    cls: "bg-pink-400",
    shadow: "rgba(236,72,153,0.6)",
    path: "M 70 150 Q 100 180 130 150",
    label: "Love",
    grad: "from-pink-100 via-rose-50 to-red-50",
    emoji: "💖",
    msgs: ["I love you!", "You're amazing!"],
    textCls: "text-black",
  },
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

  const [remoteStats, setRemoteStats] = useState<{
    level: number | string;
    achievements: number;
    streak: number | string;
    loading: boolean;
    error?: string;
  }>({ level: "--", achievements: 0, streak: "--", loading: true });

  const { user } = useContext(
    AuthContext
  ) as import("@/context/AuthContext").AuthContextType;

  const { darkMode } = useTheme();

  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      if (!mounted) return;
      setIsLoading(true);
      setRemoteStats((s) => ({ ...s, loading: true }));
      try {
        const userId = user?.id ?? localStorage.getItem("userId");
        if (!userId) {
          if (!mounted) return;
          setRemoteStats((s) => ({
            ...s,
            loading: false,
            error: "User ID not found",
          }));
          setIsLoading(false);
          return;
        }

        const statusRes = await getStatus(userId);
        const xpRes = await getXp(userId);
        const streakRes = await fetchUserStreak(userId);

        const status = statusRes?.data ?? statusRes;
        const xpPayload = xpRes?.data ?? xpRes;

        const level =
          status?.level ??
          xpPayload?.level ??
          Math.floor((xpPayload?.total_xp || xpPayload?.totalXp || 0) / 100) +
            1;
        const achievements = Array.isArray(xpPayload?.badges)
          ? xpPayload.badges.length
          : 0;
        const streak =
          streakRes?.currentStrike ?? streakRes?.data?.currentStrike ?? "--";

        if (!mounted) return;
        setRemoteStats({ level, achievements, streak, loading: false });
        setIsLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        setRemoteStats((s) => ({ ...s, loading: false, error: err.message }));
        setIsLoading(false);
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: easeOut },
    },
  };

  const RenderContent = ({ scale = 1, controls = false }) => {
    const s = `transform scale-[${scale}] transition-transform duration-500`;
    if (sel.type === "face")
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={s}
        >
          <FaceComponent mood={mood} custom={custom} />
        </motion.div>
      );
    if (sel.type === "shinchan")
      return (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={s}
        >
          <ShinChan showControls={controls} />
        </motion.div>
      );
    if (sel.type === "doraemon")
      return (
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className={s}
        >
          <Doraemon showControls={controls} />
        </motion.div>
      );
    if (sel.type === "egg")
      return (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className={s}
        >
          <Egg emotion={getEggEm(mood)} showControls={controls} />
        </motion.div>
      );
    return <img src={sel.image} className="w-full h-full object-cover" />;
  };

  if (mode === "play") {
    const cfg = MOODS[mood];
    return (
      <motion.div
        key={`mode-play-${mood}`} // force remount when entering/exiting play
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-50 w-full h-full bg-gradient-to-br ${cfg.grad} flex items-center justify-center overflow-hidden transition-all duration-1000`}
      >
        <style>{`.no-sb::-webkit-scrollbar{display:none}.no-sb{-ms-overflow-style:none;scrollbar-width:none}@keyframes float{0%{transform:translateY(0) rotate(0);opacity:0}10%,90%{opacity:0.3}100%{transform:translateY(-110vh) rotate(360deg);opacity:0}}.anim-float{animation:float linear infinite}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}.anim-bob{animation:bob 3s ease-in-out infinite}`}</style>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl sm:text-3xl md:text-4xl opacity-20 anim-float"
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

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // ensure dashboard UI state is restored immediately
            setMode("dashboard");
            setMood(Mood.HAPPY);
            setTab("gear"); // reset sidebar tab (optional)
            setSelId(1); // reset selection (optional)
            window.scrollTo(0, 0); // restore scroll if overlay changed it
          }}
          className={`absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl font-bold shadow-sm z-50 flex justify-center items-center gap-2 text-sm md:text-base ${
            darkMode
              ? "bg-white/60 hover:bg-white/90 text-black"
              : "bg-white/60 hover:bg-white/90 text-black"
          }`}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span className="hidden sm:inline">Dashboard</span>
        </motion.button>

        {/* Main Content Area */}
        <div
          className={`flex flex-col items-center justify-center w-full h-full px-4 pb-16 sm:pb-20 ${
            sel.type === "face" ? "md:pr-80 lg:pr-96" : ""
          }`}
        >
          {/* Speech Bubble (Face only) */}
          <AnimatePresence mode="wait">
            {sel.type === "face" && (
              <motion.div
                key={msg}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 mb-2 sm:mb-4"
              >
                <div className="bg-white/95 px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-[1.5rem] md:rounded-[2rem] shadow-xl text-lg sm:text-xl md:text-2xl font-bold max-w-xs sm:max-w-sm text-center text-black">
                  {msg}
                  <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white/95 border-b-2 border-r-2 rotate-45"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`z-10 ${
              ["shinchan", "doraemon", "egg"].includes(sel.type)
                ? "w-full h-full flex items-center justify-center scale-75 sm:scale-90 md:scale-100"
                : "scale-75 sm:scale-90 md:scale-100 mt-8 sm:mt-10 md:mt-12 anim-bob drop-shadow-2xl"
            }`}
          >
            <RenderContent scale={1} controls={true} />
          </motion.div>

          {/* Mood Buttons (Face only) */}
          {sel.type === "face" && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/40 border border-white/50 p-2 sm:p-3 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex gap-2 sm:gap-3 md:gap-4 z-50 mx-4 mt-8 sm:mt-10 md:mt-12 flex-wrap justify-center"
            >
              {[Mood.HAPPY, Mood.LOVE, Mood.SAD, Mood.ANGRY, Mood.EATING].map(
                (m) => {
                  const btn = MOODS[m];
                  return (
                    <motion.button
                      key={m}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => moodAct(m)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl text-2xl sm:text-3xl transition-all hover:-translate-y-1 active:scale-95 ${
                        mood === m
                          ? btn.cls + " text-white scale-110 shadow-lg"
                          : "bg-white/70 hover:scale-105"
                      }`}
                    >
                      {btn.emoji}
                    </motion.button>
                  );
                }
              )}
            </motion.div>
          )}
        </div>

        {/* Customization Sidebar (Face only, Desktop) */}
        {sel.type === "face" && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`absolute right-4 top-20 bottom-4 w-72 sm:w-80 md:w-80 lg:w-96 bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-50 hidden md:flex ${
              darkMode ? "text-black" : "text-gray-900"
            }`}
          >
            <div className="p-4 md:p-6 border-b border-white/30">
              <h2 className="text-xl md:text-2xl font-black flex gap-2 md:gap-3 items-center text-black">
                <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs md:text-sm">
                  <i className="fa-solid fa-shirt"></i>
                </span>
                Cosplay
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="flex p-2 md:p-3 gap-2 bg-black/5 mx-3 md:mx-4 mt-3 md:mt-4 rounded-xl">
              {["gear", "style"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`flex-1 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold capitalize ${
                    tab === t
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Customization Options */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 no-sb">
              {tab === "gear"
                ? ["hat", "glasses"].map((type) => (
                    <div key={type}>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 md:mb-4 uppercase">
                        {type}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {(type === "hat" ? HATS : GLASSES).map((it) => (
                          <button
                            key={it.id}
                            onClick={() => updateCustom(type as any, it.id)}
                            className={`aspect-[4/3] rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2 border-2 transition-all ${
                              custom[type as keyof CustomizationState] === it.id
                                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                : "border-transparent bg-white/50 hover:bg-white/70"
                            }`}
                          >
                            <span className="text-2xl md:text-3xl">
                              {it.icon}
                            </span>
                            <span className="text-xs font-semibold capitalize">
                              {it.id}
                            </span>
                          </button>
                        ))}

                        {/* Hidden input to force grid layout */}
                        <div className="hidden md:block md:col-span-2">
                          <div className="h-0 pb-[100%]"></div>
                        </div>
                      </div>
                    </div>
                  ))
                : ["eyeColor", "eyebrowColor", "mouthColor"].map((k) => (
                    <div key={k}>
                      <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase">
                        {k.replace("Color", "")} Color
                      </h3>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => updateCustom(k as any, c)}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-4 hover:scale-110 active:scale-95 transition-transform ${
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
          </motion.div>
        )}
      </motion.div>
    );
  }

  // --- Dashboard Mode ---
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full min-h-screen p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-black mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Avatar Hub
          </h1>
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Customize and interact with your avatars
          </p>
        </motion.div>

        {/* Main Hero Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Avatar Preview - Large */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className={`lg:col-span-2 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-2xl ${
              darkMode
                ? "bg-[#1d2942] border-[#2a3f5f]"
                : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
            }`}
          >
            <div className="relative aspect-video sm:aspect-[16/9] flex items-center justify-center group">
              {/* Avatar Display */}
              <div className="transform scale-75 sm:scale-85 md:scale-90 transition-transform duration-500 group-hover:scale-95">
                <RenderContent scale={0.9} />
              </div>

              {/* Gradient Overlay for Face Type */}
              {sel.type === "face" && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              )}

              {/* Info Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      sel.locked ? "bg-red-500" : "bg-green-500"
                    } animate-pulse`}
                  ></div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {sel.locked ? "Locked" : "Active"}
                  </span>
                </div>
              </div>

              {/* Avatar Info */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white z-10 space-y-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow-lg">
                  {["shinchan", "doraemon", "egg"].includes(sel.type)
                    ? "Anime"
                    : "Sparky"}
                </h2>
                <p className="text-base sm:text-lg md:text-xl font-semibold opacity-90 drop-shadow">
                  {sel.type === "shinchan"
                    ? "ShinChan"
                    : sel.type === "doraemon"
                    ? "Doraemon"
                    : sel.type === "egg"
                    ? "Eggbert"
                    : "Adventurer"}
                </p>
                {sel.type === "face" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl">{MOODS[mood].emoji}</span>
                    <p
                      className={`text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full ${MOODS[mood].textCls}`}
                    >
                      {MOODS[mood].label}
                    </p>
                  </div>
                )}
              </div>

              {/* View Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode("play")}
                className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full sm:rounded-2xl font-bold flex items-center gap-2 shadow-2xl z-20 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
              >
                <i className="fa-solid fa-play text-sm sm:text-base"></i>
                <span className="hidden sm:inline">View</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Avatar Stats */}
          <motion.div
            variants={cardVariants}
            className={`lg:col-span-1 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md border transition-all duration-300 ${
              darkMode
                ? "bg-[#1d2942] border-[#2a3f5f]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2
                className={`text-xl sm:text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Stats
              </h2>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-chart-bar text-indigo-600 text-sm"></i>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {remoteStats.loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                    />
                    <p className="text-sm text-gray-500 mt-4">
                      Loading stats...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Level */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-star text-yellow-500 text-xl"></i>
                        <span className="font-semibold text-gray-700">
                          Level
                        </span>
                      </div>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="text-2xl font-black text-gray-900"
                      >
                        {remoteStats.level}
                      </motion.span>
                    </motion.div>

                    {/* Achievements */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-trophy text-green-500 text-xl"></i>
                        <span className="font-semibold text-gray-700">
                          Achievements
                        </span>
                      </div>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="text-2xl font-black text-gray-900"
                      >
                        {remoteStats.achievements}
                      </motion.span>
                    </motion.div>

                    {/* Streak */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-fire text-orange-500 text-xl"></i>
                        <span className="font-semibold text-gray-700">
                          Streak
                        </span>
                      </div>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.4 }}
                        className="text-2xl font-black text-gray-900"
                      >
                        {`${remoteStats.streak} ${
                          typeof remoteStats.streak === "number" ? "days" : ""
                        }`}
                      </motion.span>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              {remoteStats.error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 mt-2"
                >
                  Failed to load stats
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Avatar & Anime Collections */}
        {["Avatar", "Anime"].map((sec, secIdx) => (
          <motion.div
            key={sec}
            variants={itemVariants}
            custom={secIdx}
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-md mb-6 sm:mb-8 border transition-all duration-300 ${
              darkMode
                ? "bg-[#1d2942] border-[#2a3f5f]"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${
                    sec === "Avatar" ? "bg-indigo-100" : "bg-pink-100"
                  } rounded-xl flex items-center justify-center`}
                >
                  <i
                    className={`fa-solid ${
                      sec === "Avatar" ? "fa-user" : "fa-film"
                    } ${
                      sec === "Avatar" ? "text-indigo-600" : "text-pink-600"
                    }`}
                  ></i>
                </div>
                <h2
                  className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {sec}
                </h2>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {
                  avatars.filter((a) =>
                    sec === "Avatar"
                      ? !["shinchan", "doraemon", "egg"].includes(a.type)
                      : ["shinchan", "doraemon", "egg"].includes(a.type)
                  ).length
                }{" "}
                items
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            >
              {avatars
                .filter((a) =>
                  sec === "Avatar"
                    ? !["shinchan", "doraemon", "egg"].includes(a.type)
                    : ["shinchan", "doraemon", "egg"].includes(a.type)
                )
                .map((a, idx) => (
                  <motion.div
                    key={a.id}
                    variants={cardVariants}
                    custom={idx}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !a.locked && setSelId(a.id)}
                    className={`relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden border-4 cursor-pointer transition-all duration-300 ${
                      selId === a.id
                        ? "border-green-500 shadow-2xl scale-105 ring-4 ring-green-200"
                        : "border-transparent hover:border-gray-300 hover:shadow-lg"
                    } ${
                      a.locked
                        ? "opacity-50 grayscale cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                  >
                    <div className="transform scale-[0.35] sm:scale-[0.4] pointer-events-none">
                      {a.type === "face" ? (
                        <FaceComponent mood={mood} custom={a.customization} />
                      ) : a.type === "shinchan" ? (
                        <ShinChan showControls={false} />
                      ) : a.type === "doraemon" ? (
                        <Doraemon showControls={false} />
                      ) : (
                        <Egg emotion={getEggEm(mood)} />
                      )}
                    </div>

                    {/* Lock Overlay */}
                    {a.locked && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                        <i className="fa-solid fa-lock text-white text-2xl sm:text-3xl drop-shadow-lg"></i>
                        <span className="text-xs text-white font-semibold">
                          Locked
                        </span>
                      </div>
                    )}

                    {/* Selected Badge */}
                    {selId === a.id && !a.locked && (
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1.5 shadow-lg animate-bounce">
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      </div>
                    )}
                  </motion.div>
                ))}

              {/* Hidden items for even grid spacing (when less than full row) */}
              {Array.from({ length: 6 - (avatars.length % 6) }).map((_, i) => (
                <div key={i} className="invisible md:visible aspect-square" />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Avatar;
