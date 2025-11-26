import React, { useState } from "react";
import { Crown } from "lucide-react";

const FocusSessionLeaderboard = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  // Sample data - in a real app, this would come from your backend
  const avatarUrl =
    "https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg";

  const leaderboardData = {
    weekly: [
      {
        rank: 1,
        name: "Lina",
        xp: 2450,
        avatar: avatarUrl,
      },
      {
        rank: 2,
        name: "Maya",
        xp: 2100,
        avatar: avatarUrl,
      },
      {
        rank: 3,
        name: "Noah",
        xp: 1850,
        avatar: avatarUrl,
      },
      {
        rank: 4,
        name: "Evan",
        xp: 1350,
        avatar: avatarUrl,
      },
      {
        rank: 5,
        name: "Sam",
        xp: 1250,
        avatar: avatarUrl,
      },
      {
        rank: 6,
        name: "Ava",
        xp: 1150,
        avatar: avatarUrl,
      },
      {
        rank: 7,
        name: "Oli",
        xp: 1050,
        avatar: avatarUrl,
      },
      {
        rank: 8,
        name: "Rae",
        xp: 950,
        avatar: avatarUrl,
      },
      {
        rank: 9,
        name: "Kai",
        xp: 850,
        avatar: avatarUrl,
      },
    ],
    monthly: [
      // fallback sample for monthly (uses same image)
      { rank: 1, name: "Lina", xp: 9800, avatar: avatarUrl },
      { rank: 2, name: "Maya", xp: 9200, avatar: avatarUrl },
      { rank: 3, name: "Noah", xp: 8700, avatar: avatarUrl },
    ],
    global: [
      // fallback sample for global
      { rank: 1, name: "Lina", xp: 45200, avatar: avatarUrl },
      { rank: 2, name: "Maya", xp: 43000, avatar: avatarUrl },
      { rank: 3, name: "Noah", xp: 41000, avatar: avatarUrl },
    ],
  };

  const currentData = leaderboardData[activeTab] ?? leaderboardData.weekly;
  const topThree = currentData.slice(0, 3);
  const restOfList = currentData.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Focus Session
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTab === "weekly"
                ? "bg-yellow-400 text-gray-800 shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTab === "monthly"
                ? "bg-yellow-400 text-gray-800 shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              activeTab === "global"
                ? "bg-yellow-400 text-gray-800 shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Global
          </button>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-12 px-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden border-4 border-gray-400 shadow-lg">
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
