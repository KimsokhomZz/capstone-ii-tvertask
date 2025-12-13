import React, { useState } from "react";
import {
  BarChart3,
  Heart,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
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

type RangeKey = "overview" | "week" | "month";

export default function AnalyticTab() {
  const [range, setRange] = useState<RangeKey>("overview");

  const statsByRange: Record<
    RangeKey,
    {
      mood: string;
      taskPerDay: string;
      focusTime: string;
      streak: string;
      subtitle: string;
    }
  > = {
    overview: {
      mood: "5.0/5",
      taskPerDay: "1.0",
      focusTime: "0",
      streak: "1",
      subtitle: "Last 30 days",
    },
    week: {
      mood: "4.6/5",
      taskPerDay: "1.3",
      focusTime: "18",
      streak: "4",
      subtitle: "This week",
    },
    month: {
      mood: "4.2/5",
      taskPerDay: "1.1",
      focusTime: "22",
      streak: "9",
      subtitle: "This month",
    },
  };

  const current = statsByRange[range];

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
          <button
            className={`px-3 py-1 rounded-full ${
              range === "overview"
                ? "bg-[#FFC94A] text-white shadow-sm"
                : "text-gray-600"
            }`}
            onClick={() => setRange("overview")}
          >
            Overview
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg Mood"
          value={current.mood}
          subLabel={current.subtitle}
          icon={<Heart className="w-4 h-4 text-pink-500" />}
        />
        <StatCard
          label="Task/Day"
          value={current.taskPerDay}
          subLabel="Average completed"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Focus Time"
          value={current.focusTime}
          subLabel="Minutes/session"
          icon={<Clock3 className="w-4 h-4 text-sky-500" />}
        />
        <StatCard
          label="Streak"
          value={current.streak}
          subLabel="Current streak"
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
        />
      </div>
    </div>
  );
}
