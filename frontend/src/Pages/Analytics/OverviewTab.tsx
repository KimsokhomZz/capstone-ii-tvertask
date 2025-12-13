import React from "react";
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

export default function AnalyticsOverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Level"
          value="5"
          subLabel="Sahdan"
          icon={<Star className="w-4 h-4 text-yellow-500" />}
        />
        <StatCard
          label="Current Level"
          value="126"
          subLabel="74 to next level"
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Streak"
          value="7"
          subLabel="Daily streak"
          icon={<Flame className="w-4 h-4 text-orange-500" />}
        />
        <StatCard
          label="Achievement"
          value="3"
          subLabel="Unlocked"
          icon={<Trophy className="w-4 h-4 text-indigo-500" />}
        />
      </div>

      <div className="bg-[#FFC94A] rounded-3xl p-5 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-xl font-semibold text-[#FF9F1C]">
            S
          </div>
          <div className="space-y-1">
            <p className="text-md font-bold text-gray-900">Sparky</p>
            <p className="text-xs text-gray-700">Productivity Cat</p>
            <div className="w-full max-w-xs h-2.5 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-[#FF9F1C] rounded-full" />
            </div>
            <p className="text-[11px] text-gray-800">130 / 200 XP to go</p>
          </div>
        </div>
        <div className="text-right self-stretch flex flex-col items-end justify-between">
          <p className="text-xs font-medium text-gray-800">Level 5</p>
          <p className="text-xs text-gray-700">1190 XP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Task Today"
          value="2"
          subLabel="15% of overall"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Focus Time"
          value="5 hours"
          subLabel="30m avg"
          icon={<Clock3 className="w-4 h-4 text-sky-500" />}
        />
        <StatCard
          label="Weekly Avg"
          value="7"
          subLabel="Tasks/day"
          icon={<BarChart3 className="w-4 h-4 text-indigo-500" />}
        />
        <StatCard
          label="Mood Today"
          value="7"
          subLabel="Logged"
          icon={<Heart className="w-4 h-4 text-pink-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">This Week</h3>
          <dl className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <dt>Tasks Completed</dt>
              <dd className="font-semibold text-gray-900">3</dd>
            </div>
            <div className="flex justify-between">
              <dt>Focus Session</dt>
              <dd className="font-semibold text-gray-900">1</dd>
            </div>
            <div className="flex justify-between">
              <dt>Avatar Grow</dt>
              <dd className="font-semibold text-gray-900">4</dd>
            </div>
            <div className="flex justify-between">
              <dt>Focus Time</dt>
              <dd className="font-semibold text-gray-900">2h 12m</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
