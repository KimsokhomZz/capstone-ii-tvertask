import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { fetchLeaderboard } from "@/api/leaderboardApi";
import { useTheme } from "@/context/ThemeContext";
import type { LeaderboardData } from "@/api/leaderboardApi";
import AvatarPreview from "@/components/AvatarPreview";

const FocusSessionLeaderboard = () => {
  const { darkMode } = useTheme();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeaderboardData = async () => {
      setLoading(true);
      try {
        const data = await fetchLeaderboard();
        if (data) {
          setLeaderboardData(data);
        }
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    getLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#101828]" : "bg-white"
        }`}
      >
        <div
          className={`text-2xl ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          Loading leaderboard... 🏆
        </div>
      </div>
    );
  }

  const currentData = leaderboardData?.leaderboard || [];

  if (currentData.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#101828]" : "bg-white"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No data yet! 📊
          </h2>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Complete tasks to earn XP and appear on the leaderboard.
          </p>
        </div>
      </div>
    );
  }

  const topThree = currentData.slice(0, 3);
  const restOfList = currentData.slice(3);

  return (
    <div
      className={`min-h-screen py-8 px-4 relative overflow-hidden ${
        darkMode ? "bg-[#101828]" : "bg-white"
      }`}
    >
      {/* Persistent draggable avatar preview (shared) */}
      <AvatarPreview />
      <style>{`
        @keyframes float-fly { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-30px) rotate(-5deg);} }
        .animate-float { animation: float-fly 2s infinite ease-in-out; }
      `}</style>

      {/* Animated Background Elements */}
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${
          darkMode ? "opacity-20" : "opacity-30"
        }`}
      >
        <div className="absolute top-20 left-30 text-6xl animate-float">🏆</div>
        <div className="absolute top-90 left-10 text-5xl animate-float">🚀</div>
        <div
          className="absolute top-40 right-20 text-5xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          ⭐
        </div>
        <div
          className="absolute bottom-32 left-1/4 text-4xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          👑
        </div>
        <div
          className="absolute top-60 right-1/3 text-5xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          🎖️
        </div>
        <div
          className="absolute bottom-20 right-10 text-6xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          🥇
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <h1
          className={`text-4xl font-bold text-center mb-8 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          🏆 Leaderboard
        </h1>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-12 px-4">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden border-4 border-gray-400 shadow-lg">
                  <img
                    src={topThree[1]?.avatar || "/default-avatar.png"}
                    alt={topThree[1]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                  2
                </div>
              </div>
              <div
                className={`rounded-t-2xl w-36 h-48 p-2 flex flex-col items-center justify-center shadow-lg ${
                  darkMode
                    ? "bg-[#1d2942] border border-[#2a3f5f]"
                    : "bg-gray-300"
                }`}
              >
                <p
                  className={`font-medium mt-2 truncate w-full text-center ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                >
                  {topThree[1]?.name}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {topThree[1]?.xp} XP
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Level {topThree[1]?.level}
                </p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="flex flex-col items-center -mt-4">
              <Crown className="w-10 h-10 text-yellow-400 mb-2" />
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center overflow-hidden border-4 border-yellow-400 shadow-xl">
                  <img
                    src={topThree[0]?.avatar || "/default-avatar.png"}
                    alt={topThree[0]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">
                  1
                </div>
              </div>
              <div
                className={`rounded-t-2xl w-40 h-64 p-2 flex flex-col items-center justify-center shadow-xl ${
                  darkMode
                    ? "bg-gradient-to-br from-yellow-600/40 to-yellow-700/40 border border-yellow-500/50"
                    : "bg-yellow-100"
                }`}
              >
                <p
                  className={`font-bold mt-2 truncate w-full text-center ${
                    darkMode ? "text-yellow-300" : "text-gray-800"
                  }`}
                >
                  {topThree[0]?.name}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-yellow-200" : "text-gray-700"
                  }`}
                >
                  {topThree[0]?.xp} XP
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Level {topThree[0]?.level}
                </p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center overflow-hidden border-4 border-orange-400 shadow-lg">
                  <img
                    src={topThree[2]?.avatar || "/default-avatar.png"}
                    alt={topThree[2]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                  3
                </div>
              </div>
              <div
                className={`rounded-t-2xl w-36 h-40 p-2 flex flex-col items-center justify-center shadow-lg ${
                  darkMode
                    ? "bg-[#1d2942] border border-[#2a3f5f]"
                    : "bg-orange-200"
                }`}
              >
                <p
                  className={`font-medium mt-2 truncate w-full text-center ${
                    darkMode ? "text-white" : "text-gray-700"
                  }`}
                  title={topThree[2]?.name}
                >
                  {topThree[2]?.name}
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {topThree[2]?.xp} XP
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Level {topThree[2]?.level ?? "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        <div
          className={`rounded-2xl shadow-lg overflow-hidden ${
            darkMode ? "bg-[#1d2942] border border-[#2a3f5f]" : "bg-white/5"
          }`}
        >
          <div
            className={`py-4 px-6 grid grid-cols-4 font-bold uppercase text-sm ${
              darkMode
                ? "bg-[#253548] text-gray-200"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <div>Rank</div>
            <div>User</div>
            <div className="text-right">XP Earned (today)</div>
            <div className="text-right">Total XP</div>
          </div>
          <div
            className={`divide-y ${
              darkMode ? "divide-[#2a3f5f]" : "divide-gray-200"
            }`}
          >
            {currentData.map((user, index) => (
              <div
                key={user.rank ?? index}
                className={`py-4 px-6 grid grid-cols-4 items-center transition-colors ${
                  darkMode ? "hover:bg-[#253548]" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {user.rank}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user.name}
                    <span
                      className={`ml-2 text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Lv. {user.level ?? "-"}
                    </span>
                  </div>
                </div>

                {/* xp_earned (today) */}
                <div
                  className={`text-right ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {typeof user.xpEarned === "number" ? user.xpEarned : "-"}
                </div>

                {/* Total XP */}
                <div
                  className={`text-right font-semibold ${
                    darkMode ? "text-yellow-300" : "text-gray-800"
                  }`}
                >
                  {user.xp ?? 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSessionLeaderboard;
