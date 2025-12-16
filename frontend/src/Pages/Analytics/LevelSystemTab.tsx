import React, { useContext, useEffect, useState } from "react";
import { getStatus } from "@/api/userXpApi";
import AuthContext from "@/context/AuthContext";

// Level data mapping
const levelData: Record<
  number,
  { emoji: string; title: string; subtitle: string; description: string }
> = {
  1: {
    emoji: "🌱",
    title: "Seedling",
    subtitle: "New Gardener",
    description:
      "Welcome to Focus Garden! You're just starting your productivity journey.",
  },
  2: {
    emoji: "🌿",
    title: "Sprout",
    subtitle: "Growing Gardener",
    description:
      "Keeps developing good habits and consistency in your daily routine.",
  },
  3: {
    emoji: "🪴",
    title: "Young Plant",
    subtitle: "Committed Gardener",
    description: "Building strong productivity habits and maintaining focus.",
  },
  4: {
    emoji: "🌳",
    title: "Tree",
    subtitle: "Experienced Gardener",
    description: "Mastering productivity with consistent effort and growth.",
  },
  5: {
    emoji: "🌲",
    title: "Forest",
    subtitle: "Expert Gardener",
    description: "Leading by example with exceptional productivity habits.",
  },
  6: {
    emoji: "🏆",
    title: "Master",
    subtitle: "Legendary Gardener",
    description: "Achieved mastery in productivity and personal growth.",
  },
  7: {
    emoji: "⏳",
    title: "Next Level",
    subtitle: "Coming Soon...",
    description:
      "Stay tuned for more levels and benefits as you continue your journey!",
  },
};

export default function LevelSystemTab() {
  const { user } = useContext(AuthContext) as any;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        if (!user?.id) return;
        setLoading(true);
        const data = await getStatus(user.id);
        // console.log("🥶 data", data);
        // console.log("🥶 mounted", mounted);
        if (!mounted) return;
        setStats(data.data);
      } catch (err) {
        console.error("Failed to load level stats:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Calculate progress percentage
  const getProgressPercent = () => {
    if (!stats) return 0;
    const { xp, prevLevelXp, nextLevelTotal } = stats;
    const currentLevelXp = xp - prevLevelXp;
    const xpNeeded = nextLevelTotal - prevLevelXp;
    return Math.max(0, Math.min(100, (currentLevelXp / xpNeeded) * 100));
  };

  // Get current level data
  const currentLevel = stats?.level || 1;
  const currentLevelInfo = levelData[currentLevel] || levelData[1];
  const nextLevel = currentLevel + 1;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Level System</h2>
      <p className="text-sm text-gray-600 max-w-xl">
        See your current growth stage, benefits, and upcoming levels in your
        productivity journey.
      </p>

      {/* Current Level Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {loading ? (
          <div className="flex items-center justify-center w-full py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-[#FFF5D6] flex items-center justify-center text-xl">
                {currentLevelInfo.emoji}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  {currentLevelInfo.title}
                </p>
                <p className="text-xs text-gray-600">
                  {currentLevelInfo.subtitle}
                </p>
                <p className="text-xs text-gray-500">
                  {currentLevelInfo.description}
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-700">
                    Progress to Level {nextLevel}
                  </p>
                  <div className="w-full max-w-md h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercent()}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {stats?.xp - stats?.prevLevelXp || 0} /{" "}
                    {stats?.nextLevelTotal - stats?.prevLevelXp || 0} XP
                    {getProgressPercent() < 100
                      ? " (more needed)"
                      : " (Ready to level up!)"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right self-stretch flex flex-col items-end justify-between">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                level {currentLevel}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {stats?.xp || 0} XP
              </p>
            </div>
          </>
        )}
      </div>

      {/* Your Current Benefits */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Your Current Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Level Perks
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✅ Streak tracking</li>
              <li>✅ Basic mood tracking</li>
              <li>✅ Avatar growth unlock</li>
              {currentLevel >= 3 && <li>✅ Advanced analytics</li>}
              {currentLevel >= 5 && <li>✅ Custom themes</li>}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Active Bonuses
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>
                +{Math.min(currentLevel * 5, 25)}% extra XP on completed tasks
              </li>
              <li>+{Math.min(currentLevel, 5)} daily streak protection</li>
              {currentLevel >= 4 && <li>Priority support</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Level Progression Path */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Level Progression Path
        </h3>
        <div className="space-y-3">
          {Object.keys(levelData).map((level) => {
            const lvl = Number(level);
            const info = levelData[lvl];
            const isCurrentLevel = lvl === currentLevel;
            const isCompleted = lvl < currentLevel;

            return (
              <div
                key={level}
                className={`bg-white rounded-3xl shadow-sm border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                  isCurrentLevel
                    ? "border-[#4ADE80] ring-2 ring-[#4ADE80]/20"
                    : isCompleted
                    ? "border-gray-200 opacity-60"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-[#FFF5D6] flex items-center justify-center text-lg">
                    {info.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Level {lvl}: {info.title}
                      {isCurrentLevel && (
                        <span className="text-xs bg-[#4ADE80] text-white px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">{info.subtitle}</p>
                    <p className="mt-1 text-xs text-gray-500 max-w-md">
                      {info.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
