import React, { useContext, useEffect, useState } from "react";
import {
  Star,
  ArrowUpRight,
  Flame,
  Trophy,
  CheckCircle2,
  Clock3,
  BarChart3,
  Heart,
} from "lucide-react";
import { getStatus } from "@/api/userXpApi";
import { fetchUserStreak } from "@/api/streakApi";
import { fetchActivityStats, fetchWeeklyStats } from "@/api/activityApi";
import type { ActivityStats, WeeklyStats } from "@/api/activityApi";
import AuthContext from "@/context/AuthContext";
import { moods } from "@/utils/moods";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subLabel?: string;
  icon?: React.ReactNode;
}

function StatCard({ label, value, subLabel, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1d2942] rounded-2xl shadow-sm border border-gray-100 dark:border-transparent px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="h-7 w-7 rounded-full bg-gray-50 dark:bg-[#253548] flex items-center justify-center text-[15px]">
            {icon}
          </div>
        )}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      {subLabel && (
        <p className="text-xs text-gray-400 dark:text-gray-400">{subLabel}</p>
      )}
    </div>
  );
}

export default function AnalyticsOverviewTab() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState<{
    level: number | string;
    xp: number | string;
    nextLevelTotal: number | string;
    prevLevelXp: number | string;
    streak: number | string;
    achievements: number | string;
    loading: boolean;
  }>({
    level: "--",
    xp: "--",
    nextLevelTotal: "--",
    prevLevelXp: "--",
    streak: "--",
    achievements: "--",
    loading: true,
  });

  const [selectedMood, setSelectedMood] = useState<number | null>(() => {
    const stored = localStorage.getItem("selectedMood");
    return stored !== null ? Number(stored) : null;
  });

  const [activityStats, setActivityStats] = useState<ActivityStats | null>(
    null
  );
  const [activityLoading, setActivityLoading] = useState(true);

  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  const { user } = useContext(
    AuthContext
  ) as import("@/context/AuthContext").AuthContextType;

  const userId = user?.id;

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      if (!userId) {
        setStats((s) => ({ ...s, loading: false }));
        return;
      }
      try {
        setStats((s) => ({ ...s, loading: true }));
        const statusRes = await getStatus(userId);
        const status = statusRes.data;
        const streakRes = await fetchUserStreak(userId);
        const achievements = status.achievements ?? "Ort Dek";

        if (!mounted) return;
        setStats({
          level: status.level,
          xp: status.xp,
          nextLevelTotal: status.nextLevelTotal,
          prevLevelXp: status.prevLevelXp,
          streak: streakRes.currentStrike ?? "--",
          achievements,
          loading: false,
        });
      } catch (err) {
        if (!mounted) return;
        setStats((s) => ({ ...s, loading: false }));
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    async function loadActivityStats() {
      try {
        setActivityLoading(true);
        const data = await fetchActivityStats();
        if (!mounted) return;
        setActivityStats(data);
      } catch (err) {
        console.error("Failed to load activity stats:", err);
      } finally {
        if (mounted) setActivityLoading(false);
      }
    }
    loadActivityStats();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ NEW: Fetch weekly stats
  useEffect(() => {
    let mounted = true;
    async function loadWeeklyStats() {
      try {
        setWeeklyLoading(true);
        const data = await fetchWeeklyStats();
        if (!mounted) return;
        setWeeklyStats(data);
      } catch (err) {
        console.error("Failed to load weekly stats:", err);
      } finally {
        if (mounted) setWeeklyLoading(false);
      }
    }
    loadWeeklyStats();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("selectedMood");
      setSelectedMood(stored !== null ? Number(stored) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const stored = localStorage.getItem("selectedMood");
      const current = stored !== null ? Number(stored) : null;
      if (current !== selectedMood) {
        setSelectedMood(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedMood]);

  // Calculate XP to next level
  const xpToNextLevel =
    typeof stats.xp === "number" && typeof stats.nextLevelTotal === "number"
      ? stats.nextLevelTotal - stats.xp
      : "--";

  // Helper to format focus time
  const formatFocusTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards - Level, XP, Streak, Achievement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Level"
          value={stats.level}
          subLabel={
            typeof stats.level === "number" ? `Level ${stats.level}` : ""
          }
          icon={<Star className="w-4 h-4 text-yellow-500" />}
        />
        <StatCard
          label="XP"
          value={stats.xp}
          subLabel={
            typeof xpToNextLevel === "number"
              ? `${xpToNextLevel} to next level`
              : "—"
          }
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Streak"
          value={stats.streak}
          subLabel="Daily streak"
          icon={<Flame className="w-4 h-4 text-orange-500" />}
        />
        <StatCard
          label="Achievement"
          value={stats.achievements}
          subLabel="Unlocked"
          icon={<Trophy className="w-4 h-4 text-indigo-500" />}
        />
      </div>

      {/* Level Card */}
      <div className="bg-[#FFF5D6] rounded-3xl p-5 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-xl font-semibold text-[#FF9F1C]">
            {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
          </div>
          <div className="space-y-1">
            <p className="text-md font-bold text-gray-900">
              {user?.name || "Sparky"}
            </p>
            <p className="text-xs text-gray-700">Productivity Cat</p>
            <div className="w-full max-w-xs h-2.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF9F1C] rounded-full transition-all duration-700"
                style={{
                  width:
                    typeof stats.xp === "number" &&
                    typeof stats.prevLevelXp === "number" &&
                    typeof stats.nextLevelTotal === "number"
                      ? `${Math.max(
                          0,
                          Math.min(
                            100,
                            ((stats.xp - stats.prevLevelXp) /
                              (stats.nextLevelTotal - stats.prevLevelXp)) *
                              100
                          )
                        )}%`
                      : "0%",
                }}
              />
            </div>
            <p className="text-[11px] text-gray-800">
              {typeof stats.xp === "number" &&
              typeof stats.nextLevelTotal === "number"
                ? `${stats.xp} / ${stats.nextLevelTotal} XP to go`
                : "-- / -- XP to go"}
            </p>
          </div>
        </div>
        <div className="text-right self-stretch flex flex-col items-end justify-between">
          <p className="text-xs font-medium text-gray-800">
            Level {stats.level !== undefined ? stats.level : "--"}
          </p>
          <p className="text-xs text-gray-700">
            {typeof stats.xp === "number" ? stats.xp : "--"} XP
          </p>
        </div>
      </div>

      {/* Activity Stats - Connected to Backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Task Today"
          value={activityLoading ? "--" : activityStats?.tasksToday || 0}
          subLabel={
            activityLoading
              ? "Loading..."
              : `${activityStats?.taskPercentage || 0}% of overall`
          }
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Focus Time"
          value={
            activityLoading
              ? "--"
              : formatFocusTime(activityStats?.focusTimeToday || 0)
          }
          subLabel={
            activityLoading
              ? "Loading..."
              : `${activityStats?.avgFocusTime || 0}m avg`
          }
          icon={<Clock3 className="w-4 h-4 text-sky-500" />}
        />
        <StatCard
          label="Weekly Avg"
          value={activityLoading ? "--" : activityStats?.weeklyAvg || 0}
          subLabel="Tasks/day"
          icon={<BarChart3 className="w-4 h-4 text-indigo-500" />}
        />
        {selectedMood !== null && moods[selectedMood] ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-sm px-5 py-4 flex flex-col gap-2 ${
              darkMode
                ? "bg-[#1d2942] border-transparent text-white"
                : "bg-white border border-gray-100 text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-pink-50 flex items-center justify-center text-[15px]">
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wide">
                Mood Today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moods[selectedMood].emoji}</span>
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {moods[selectedMood].label}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-400">
              Current Mood
            </p>
          </motion.div>
        ) : (
          <StatCard
            label="Mood Today"
            value={activityLoading ? "--" : "No mood"}
            subLabel="Current Mood"
            icon={<Heart className="w-4 h-4 text-pink-500" />}
          />
        )}
      </div>

      {/* Recent Achievements and This Week sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3 dark:bg-[#1d2942] dark:border-transparent dark:text-white">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Recent Achievements
          </h3>
          <div className="space-y-3">
            <div className="bg-[#FFF5D6] rounded-2xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Day One</p>
                <p className="text-xs text-gray-600">
                  Complete your first full day!
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#FF9F1C]">
                +150 XP
              </span>
            </div>
            <div className="bg-[#FFF5D6] rounded-2xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Task Day</p>
                <p className="text-xs text-gray-600">
                  Finish your first task today!
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#FF9F1C]">
                +75 XP
              </span>
            </div>
            <div className="bg-[#FFF5D6] rounded-2xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Getting Started
                </p>
                <p className="text-xs text-gray-600">Add your first task!</p>
              </div>
              <span className="text-[11px] font-semibold text-[#FF9F1C]">
                +50 XP
              </span>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3 dark:bg-[#1d2942] dark:border-transparent">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            This Week
          </h3>
          <dl className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-300">
                Tasks Completed
              </dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {weeklyLoading ? "--" : weeklyStats?.tasksCompleted || 0}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-300">
                Focus Session
              </dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {weeklyLoading ? "--" : weeklyStats?.focusSessions || 0}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-300">Avatar Grow</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {weeklyLoading ? "--" : weeklyStats?.avatarGrow || 0}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-300">Focus Time</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {weeklyLoading
                  ? "--"
                  : formatFocusTime(weeklyStats?.focusTime || 0)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
