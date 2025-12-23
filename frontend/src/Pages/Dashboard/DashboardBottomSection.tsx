import React, { useState } from "react";
import { Trophy } from "lucide-react";
import MoodPopup from "../../components/MoodPopup";
import QuestCelebration from "../../components/QuestCelebration";
import { awardXp } from "../../api/userXpApi";
import { toast } from "react-toastify";
import { moods } from "@/utils/moods";
import { useTheme } from "@/context/ThemeContext";
import "./DashboardBottomSection.css";

interface DashboardBottomSectionProps {
  // Remove these props since we're managing mood internally
}

// Define a proper Quest type
interface Quest {
  id: string;
  name: string;
  detail: string;
  icon: string;
  xp: number;
  status?: string; // value: "Completed!" for claimable quests
  color?: string; // value: button color
  claimed?: boolean; // value: has this been claimed?
  progress?: string; // value: "1/3" for in-progress quests
}

const DashboardBottomSection: React.FC<DashboardBottomSectionProps> = () => {
  const { darkMode } = useTheme();
  const [selectedMood, setSelectedMood] = useState<number | null>(() => {
    const stored = localStorage.getItem("selectedMood");
    return stored !== null ? Number(stored) : null;
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({ emoji: "", label: "" });
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState({
    questName: "",
    xpAwarded: 0,
  });

  // Use the Quest type
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "login-reward",
      name: "Login Reward",
      detail: "Daily login bonus",
      status: "Completed!",
      color: "bg-purple-500",
      icon: "🎉",
      xp: 10,
      claimed: false,
    },
    {
      id: "task-master",
      name: "Task Master",
      detail: "Complete 5 tasks",
      status: "Completed!",
      color: "bg-emerald-500",
      icon: "🖊️",
      xp: 50,
      claimed: false,
    },
    {
      id: "focus-streak",
      name: "Focus Streak",
      detail: "Achieve 3-day focus streak",
      progress: "1/3",
      icon: "🔥",
      xp: 30,
    },
    {
      id: "mood-journal",
      name: "Mood Journal",
      detail: "Log your mood 7 times",
      progress: "3/7",
      icon: "🔑",
      xp: 20,
    },
    {
      id: "first-task",
      name: "First Task",
      detail: "Complete your first task",
      status: "Completed!",
      color: "bg-blue-500",
      icon: "✅",
      xp: 15,
      claimed: false,
    },
  ]);

  const getStoredUserId = () => {
    const direct = localStorage.getItem("userId");
    if (direct) return direct;

    const json = localStorage.getItem("user");
    if (!json) return null;

    try {
      const u = JSON.parse(json);
      return u?.id ?? u?.userId ?? null;
    } catch {
      return null;
    }
  };

  const handleClaimQuest = async (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.claimed) return;

    const userId = getStoredUserId();
    if (!userId) {
      toast.error("Please log in to claim rewards. ⛔");
      return;
    }

    try {
      // Award XP to user
      await awardXp(userId, quest.xp, `quest-${questId}`);

      // Update quest status
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
      );

      // Show celebration
      setCelebrationData({
        questName: quest.name,
        xpAwarded: quest.xp,
      });
      setCelebrationOpen(true);

      toast.success(`Quest claimed! You earned ${quest.xp} XP! 🎉`);
    } catch (error) {
      console.error("Failed to claim quest", error);
      toast.error("Failed to claim quest. Please try again. 🚨");
    }
  };

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index);
    localStorage.setItem("selectedMood", String(index));
    setPopupData({ emoji: moods[index].emoji, label: moods[index].label });
    setPopupOpen(true);
    console.log(`User selected mood: ${moods[index].label}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How do you feel */}
        <div
          className={`rounded-2xl p-6 shadow-sm ${
            darkMode ? "bg-[#1d2942]" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💗</span>
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              How do you feel?
            </h3>
          </div>
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Take a moment to check in with yourself
          </p>

          <div
            className={`grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[340px] p-2 overflow-y-auto mood-grid-scroll ${
              darkMode ? "dark" : ""
            }`}
          >
            {moods.map((mood, index) => (
              <button
                key={index}
                onClick={() => handleMoodSelect(index)}
                className={`w-23 h-23 p-3 sm:p-4 rounded-2xl border-2 transition-all ${
                  selectedMood === index
                    ? `border-purple-400 ${
                        darkMode ? "bg-purple-500/30" : "bg-purple-50"
                      } scale-105 shadow-md`
                    : `${
                        darkMode
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-200 hover:border-gray-300"
                      } hover:scale-105`
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                  {mood.emoji}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Collection Milestones */}
        <div
          className={`rounded-2xl p-6 shadow-sm ${
            darkMode ? "bg-[#1d2942]" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-orange-500" />
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Collection Milestones
            </h3>
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{quest.icon}</div>
                  <div>
                    <div
                      className={`font-semibold ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {quest.name}
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {quest.detail}
                    </div>
                  </div>
                </div>
                {quest.status && !quest.claimed && (
                  <button
                    onClick={() => handleClaimQuest(quest.id)}
                    className={`${quest.color} hover:opacity-90 text-white px-4 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-md`}
                  >
                    Claim
                  </button>
                )}
                {quest.claimed && (
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Claimed ✓
                  </span>
                )}
                {quest.progress && (
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {quest.progress}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Popup */}
      <MoodPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        emoji={popupData.emoji}
        label={popupData.label}
      />

      {/* Quest Celebration */}
      <QuestCelebration
        isOpen={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        questName={celebrationData.questName}
        xpAwarded={celebrationData.xpAwarded}
      />
    </>
  );
};

export default DashboardBottomSection;
