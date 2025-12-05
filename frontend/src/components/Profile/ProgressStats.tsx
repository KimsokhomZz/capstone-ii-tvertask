import { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Clock,
  Trophy,
  Star,
  CheckCircle,
  Flame,
  Calendar,
  Award,
  Zap,
} from "lucide-react";

interface StatsData {
  level: number;
  xp: number;
  streak: number;
  totalTasks: number;
  completedTasks: number;
  totalFocusTime: number;
  weeklyStats?: {
    day: string;
    tasks: number;
    focusTime: number;
  }[];
  achievements?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }[];
}

interface ProgressStatsProps {
  stats: StatsData;
}

const ProgressStats = ({ stats }: ProgressStatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [detailedStats, setDetailedStats] = useState<any>(null);

  useEffect(() => {
    fetchDetailedStats();
  }, [selectedPeriod]);

  const fetchDetailedStats = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/detailed-stats?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDetailedStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch detailed stats:", error);
    }
  };

  const getNextLevelXP = (currentLevel: number) => {
    return currentLevel * 1000;
  };

  const getLevelProgress = () => {
    const nextLevelXP = getNextLevelXP(stats.level);
    const currentLevelXP =
      stats.level > 1 ? getNextLevelXP(stats.level - 1) : 0;
    const progressXP = stats.xp - currentLevelXP;
    const levelRangeXP = nextLevelXP - currentLevelXP;
    return Math.min((progressXP / levelRangeXP) * 100, 100);
  };

  const getCompletionRate = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Progress & Statistics
          </h2>
          <p className="text-gray-500 mt-1">
            Track your productivity journey and celebrate your achievements
          </p>
        </div>
        <div className="flex items-center bg-gray-200/50 rounded-lg p-1">
          {["week", "month", "year", "all"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium text-sm sm:text-base">
                Current Level
              </p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.level}</p>
              <div className="mt-2 flex items-center text-blue-100 text-xs sm:text-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {stats.xp.toLocaleString()} XP
              </div>
            </div>
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 font-medium text-sm sm:text-base">
                Current Streak
              </p>
              <p className="text-2xl sm:text-3xl font-bold">{stats.streak}</p>
              <div className="mt-2 flex items-center text-orange-100 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Days in a row
              </div>
            </div>
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 font-medium text-sm sm:text-base">
                Tasks Completed
              </p>
              <p className="text-2xl sm:text-3xl font-bold">
                {stats.completedTasks}
              </p>
              <div className="mt-2 flex items-center text-green-100 text-xs sm:text-sm">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {getCompletionRate()}% completion rate
              </div>
            </div>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 font-medium text-sm sm:text-base">
                Focus Time
              </p>
              <p className="text-2xl sm:text-3xl font-bold">
                {Math.round(stats.totalFocusTime / 60)}h
              </p>
              <div className="mt-2 flex items-center text-purple-100 text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {formatTime(stats.totalFocusTime)} total
              </div>
            </div>
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Level Progress Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Level Progress
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-600">Level {stats.level}</span>
            <span className="text-gray-600">
              {stats.xp.toLocaleString()} /{" "}
              {getNextLevelXP(stats.level).toLocaleString()} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${getLevelProgress()}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            {Math.round(getLevelProgress())}% to Level {stats.level + 1}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.xp}</div>
              <div className="text-xs text-gray-500 font-medium">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getNextLevelXP(stats.level) - stats.xp}
              </div>
              <div className="text-xs text-gray-500 font-medium">XP Needed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.level + 1}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Next Level
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Activity Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Activity Trends
          </h3>
          <div className="text-sm text-gray-500">
            Track your progress over time
          </div>
        </div>

        {detailedStats?.weeklyStats ? (
          <div className="space-y-6">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 bg-gray-50 p-4 rounded-xl">
              {detailedStats.weeklyStats.map((day: any, index: number) => {
                const maxVal = Math.max(
                  ...detailedStats.weeklyStats.map((d: any) => d.tasks),
                  1
                );
                const height = (day.tasks / maxVal) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group"
                  >
                    <div className="relative w-full flex justify-center items-end h-full">
                      <div
                        className="w-full max-w-[2.5rem] bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500 relative shadow-sm"
                        style={{ height: `${Math.max(height, 8)}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                          <p className="font-bold text-center">
                            {day.tasks} tasks
                          </p>
                          <p className="text-center">
                            {formatTime(day.focusTime)} focused
                          </p>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-bold text-gray-600 uppercase tracking-wide">
                      {day.day}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {detailedStats.weeklyStats.reduce(
                    (acc: number, day: any) => acc + day.tasks,
                    0
                  )}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Tasks This Week
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {formatTime(
                    detailedStats.weeklyStats.reduce(
                      (acc: number, day: any) => acc + day.focusTime,
                      0
                    )
                  )}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Focus Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {Math.round(
                    (detailedStats.weeklyStats.reduce(
                      (acc: number, day: any) => acc + day.tasks,
                      0
                    ) /
                      7) *
                      10
                  ) / 10}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Daily Average
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Loading activity data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>

        <div className="space-y-4">
          {stats.achievements?.slice(0, 4).map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                achievement.unlocked
                  ? "bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-sm"
                  : "bg-gray-50 border border-gray-200 opacity-70"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md shrink-0 ${
                  achievement.unlocked
                    ? "bg-linear-to-br from-yellow-400 to-orange-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {achievement.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  className={`text-sm font-bold truncate ${
                    achievement.unlocked ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {achievement.name}
                </h4>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-yellow-600 mt-1 font-medium">
                    Unlocked{" "}
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {achievement.unlocked && (
                <CheckCircle className="w-6 h-6 text-yellow-500 shrink-0" />
              )}
            </div>
          ))}

          {(!stats.achievements || stats.achievements.length === 0) && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No achievements yet. Keep going!</p>
              <p className="text-xs mt-1">
                Complete tasks and maintain streaks to unlock rewards
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Insights */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-purple-500" />
          Progress Insights
        </h3>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {/* Streak Progress */}
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  Current Streak
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-orange-600">
                {stats.streak}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {stats.streak > 0 ? (
                <p>
                  🔥 You're on fire! Keep it up to reach your next milestone.
                </p>
              ) : (
                <p>Start a new streak by completing a task today!</p>
              )}
            </div>
          </div>

          {/* Task Completion Rate */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  Completion Rate
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                {getCompletionRate()}%
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRate()}%` }}
              ></div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {getCompletionRate() >= 80 ? (
                <p>🎯 Excellent! You're very productive.</p>
              ) : getCompletionRate() >= 60 ? (
                <p>👍 Good progress! Keep pushing forward.</p>
              ) : (
                <p>💪 Room for improvement. You've got this!</p>
              )}
            </div>
          </div>

          {/* Focus Time Progress - spans full width on second row */}
          <div className="col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  Focus Progress
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-600">
                {Math.round(stats.totalFocusTime / 60)}h
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              <p>Total focus time: {formatTime(stats.totalFocusTime)}</p>
              <p className="mt-1">
                Average per completed task:{" "}
                {stats.completedTasks > 0
                  ? formatTime(
                      Math.round(stats.totalFocusTime / stats.completedTasks)
                    )
                  : "0m"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-linear-to-r from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Your Journey So Far
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.level}
            </div>
            <div className="text-sm text-gray-500">Level Achieved</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-gray-500">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.streak}
            </div>
            <div className="text-sm text-gray-500">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.achievements?.filter((a) => a.unlocked).length || 0}
            </div>
            <div className="text-sm text-gray-500">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;
