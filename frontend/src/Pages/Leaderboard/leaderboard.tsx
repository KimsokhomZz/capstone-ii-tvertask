import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { fetchLeaderboard } from "@/api/leaderboardApi";
import type { LeaderboardData } from "@/api/leaderboardApi";

const FocusSessionLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "global">(
    "weekly"
  );
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);

  useEffect(() => {
    const getLeaderboardData = async () => {
      const data = await fetchLeaderboard();
      if (data) {
        setLeaderboardData(data);
      }
    };

    getLeaderboardData();
  }, []);

  const currentData = leaderboardData
    ? leaderboardData[activeTab] ?? leaderboardData.weekly
    : [];
  const topThree = currentData.slice(0, 3);
  const restOfList = currentData.slice(3);

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <style>{`
        @keyframes float-fly { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-30px) rotate(-5deg);} }
        @keyframes blade-spin { 0%{transform:scaleX(1);} 50%{transform:scaleX(0.1);} 100%{transform:scaleX(1);} }
        @keyframes blink { 0%,96%,100%{transform:scaleY(1);} 98%{transform:scaleY(0.1);} }
        @keyframes chew { 0%,100%{transform:scaleY(1);} 50%{transform:scaleY(0.8);} }
        @keyframes bell-ring { 0%,100%{transform:rotate(0);} 25%{transform:rotate(15deg);} 75%{transform:rotate(-15deg);} }
        @keyframes snot-bubble { 0%{transform:scale(0);opacity:0;} 50%{transform:scale(1.2);opacity:0.8;} 100%{transform:scale(1);opacity:0.6;} }
        @keyframes steam-rise { 0%{transform:translateY(0) scale(1);opacity:0.8;} 100%{transform:translateY(-30px) scale(2);opacity:0;} }
        .animate-float { animation: float-fly 2s infinite ease-in-out; }
        .animate-blade { animation: blade-spin 0.08s infinite linear; transform-box: fill-box; transform-origin: center; }
        .animate-blink { animation: blink 4s infinite; transform-box: fill-box; transform-origin: center; }
        .animate-chew { animation: chew 0.4s infinite; transform-box: fill-box; transform-origin: center; }
        .animate-bell { animation: bell-ring 1s infinite; transform-origin: 150px 255px; }
        .animate-snot { animation: snot-bubble 2s infinite ease-in-out; transform-origin: 150px 155px; }
        .animate-steam { animation: steam-rise 1s infinite linear; }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {/* Floating trophies */}
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
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🏆 Leaderboard
        </h1>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-12 px-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden border-4 border-gray-400 shadow-lg">
                <img
                  src={topThree[1]?.avatar}
                  alt={topThree[1]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                2
              </div>
            </div>
            <div className="bg-gray-300 rounded-t-2xl w-36 h-48 flex flex-col items-center justify-center shadow-lg">
              <p className="text-gray-700 font-medium mt-2">
                {topThree[1]?.name}
              </p>
              <p className="text-gray-600 text-sm">{topThree[1]?.xp} XP</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-8">
            <Crown className="w-10 h-10 text-yellow-400 mb-2" />
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center overflow-hidden border-4 border-yellow-400 shadow-xl">
                <img
                  src={topThree[0]?.avatar}
                  alt={topThree[0]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">
                1
              </div>
            </div>
            <div className="bg-yellow-100 rounded-t-2xl w-40 h-64 flex flex-col items-center justify-center shadow-xl">
              <p className="text-gray-800 font-bold mt-2">
                {topThree[0]?.name}
              </p>
              <p className="text-gray-700 text-sm">{topThree[0]?.xp} XP</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center overflow-hidden border-4 border-orange-400 shadow-lg">
                <img
                  src={topThree[2]?.avatar}
                  alt={topThree[2]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                3
              </div>
            </div>
            <div className="bg-orange-200 rounded-t-2xl w-36 h-40 flex flex-col items-center justify-center shadow-lg">
              <p className="text-gray-700 font-medium mt-2">
                {topThree[2]?.name}
              </p>
              <p className="text-gray-600 text-sm">{topThree[2]?.xp} XP</p>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-200 py-4 px-6 grid grid-cols-3 font-bold text-gray-700 uppercase text-sm">
            <div>Rank</div>
            <div>User</div>
            <div className="text-right">XP</div>
          </div>
          <div className="divide-y divide-gray-200">
            {restOfList.map((user, index) => (
              <div
                key={index}
                className="py-4 px-6 grid grid-cols-3 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-600 font-medium">{user.rank}</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-800 font-medium">{user.name}</span>
                </div>
                <div className="text-right text-gray-800 font-semibold">
                  {user.xp}
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
