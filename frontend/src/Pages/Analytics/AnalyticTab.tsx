import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Heart,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";
import { fetchAnalyticsStats } from "@/api/activityApi";
import type { AnalyticsStats } from "@/api/activityApi";
import { moods } from "@/utils/moods";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: React.ReactNode;
}

function StatCard({ label, value, subLabel, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="h-7 w-7 rounded-full bg-gray-50 flex items-center justify-center text-[15px]">
            {icon}
          </div>
        )}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
    </div>
  );
}

type RangeKey = "overview" | "day" | "week" | "month";

export default function AnalyticTab() {
  const [range, setRange] = useState<RangeKey>("overview");
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current mood from localStorage
  const [selectedMood, setSelectedMood] = useState<number | null>(() => {
    const stored = localStorage.getItem("selectedMood");
    return stored !== null ? Number(stored) : null;
  });

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        setLoading(true);
        const data = await fetchAnalyticsStats(range);
        if (!mounted) return;
        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics stats:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
  }, [range]);

  // Listen to mood changes
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

  // Display mood emoji + label or fallback
  const moodDisplay =
    selectedMood !== null && moods[selectedMood]
      ? `${moods[selectedMood].emoji} ${moods[selectedMood].label}`
      : "No mood";

  // Helper function to format minutes into "Xh Ym" format
  const formatFocusTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Analytics Dashboard
          </h2>
        </div>
        <p className="text-sm text-gray-600 max-w-xl">
          Track your mood, productivity, and growth patterns.
        </p>
      </div>

      <div className="flex justify-end">
        <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-1 py-1 text-[11px] font-medium">
          {/* <button
            className={`px-3 py-1 rounded-full ${
              range === "overview"
                ? "bg-[#FFC94A] text-white shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setRange("overview")}
          >
            Overview
          </button> */}
          <button
            className={`px-3 py-1 rounded-full ${
              range === "day"
                ? "bg-[#FFC94A] text-white shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setRange("day")}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 rounded-full ${
              range === "week"
                ? "bg-[#FFC94A] text-white shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setRange("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-full ${
              range === "month"
                ? "bg-[#FFC94A] text-white shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setRange("month")}
          >
            Month
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Current Mood"
            value={moodDisplay}
            subLabel={stats?.subtitle || ""}
            icon={<Heart className="w-4 h-4 text-pink-500" />}
          />
          <StatCard
            label="Task/Day"
            value={stats?.taskPerDay || "0"}
            subLabel="Average completed"
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          />
          <StatCard
            label="Focus Time"
            value={formatFocusTime(stats?.focusTime || 0)}
            subLabel="Total time"
            icon={<Clock3 className="w-4 h-4 text-sky-500" />}
          />
          <StatCard
            label="Streak"
            value={stats?.streak || 0}
            subLabel="Current streak"
            icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
          />
        </div>
      )}
    </div>
  );
}
