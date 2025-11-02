import React, { useState } from "react";
import { Flame, Target, Trophy,  } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  time: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [newTask, setNewTask] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTime, setTaskTime] = useState("25");

  const tabs = ["Daily", "Weekly", "Monthly", "All-time"];

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😢", label: "Calm" },
    { emoji: "😃", label: "Thankful" },
    { emoji: "😠", label: "Focused" },
    { emoji: "💪", label: "Growing" },
    { emoji: "🔥", label: "Motivation" },
    { emoji: "😤", label: "Motivation" },
    { emoji: "😫", label: "Tired" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😊", label: "Content" },
    { emoji: "😋", label: "Eat" },
    { emoji: "💡", label: "Inspired" },
  ];

  const quests = [
    {
      name: "Quest Name",
      detail: "Login reward",
      status: "Completed!",
      color: "bg-purple-500",
    },
    {
      name: "Quest Name",
      detail: "Complete 5 tasks",
      status: "Collect",
      color: "bg-emerald-500",
    },
    { name: "Quest Name", detail: "Quest hint", progress: "3/5" },
    { name: "Quest Name", detail: "Quest hint", progress: "1/5" },
    { name: "Quest Name", detail: "Use form focus sound", progress: "1/5" },
  ];

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          time: taskTime,
        },
      ]);
      setNewTask("");
      setTaskTime("25");
      setShowTaskInput(false);
    }
  };
//   const toggleTask = (id) => {
const toggleTask = (id: number) => {
  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  );
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto" style={{ maxWidth: "1117px" }}>
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-yellow-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />
              )}
            </button>
          ))}
        </div>

        {/* KPI Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Key Performance Indicator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Daily Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Daily Progress</span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">Today's Progress</div>
              <div className="text-4xl font-bold text-yellow-500">50%</div>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Add more task for completed the today 📝
            </p>
          </div>

          {/* Focus */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Focus</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              10 Hours
            </div>
            <p className="text-xs text-gray-400">Active Last night</p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Streak</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">7 🔥</div>
            <p className="text-xs text-gray-400">Active Last night</p>
          </div>

          {/* XP Gain */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">XP Gain</span>
            </div>
            <div className="text-2xl font-bold mb-4">100/200 XP</div>
            <div>
              <div className="text-sm mb-2">Level 5</div>
              <div className="w-full bg-purple-300/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <p className="text-xs mt-2 opacity-90">50 XP to next level</p>
            </div>
          </div>
        </div>

        {/* Today's Task */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <h3 className="text-xl font-bold">Today's Task</h3>
            </div>
            <button
              onClick={() => setShowTaskInput(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-medium transition-colors"
            >
              + Add task
            </button>
          </div>

          {showTaskInput && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                placeholder="Enter task description..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoFocus
              />
              <button
                onClick={addTask}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowTaskInput(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No task yet today
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Add your task to grow your avatar 🌱
              </p>
              <button
                onClick={() => setShowTaskInput(true)}
                className="text-yellow-500 hover:text-yellow-600 text-sm font-medium"
              >
                + Add your task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-4 bg-yellow-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <button className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{task.time}m</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How do you feel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💗</span>
              <h3 className="text-xl font-bold">How do you feel?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Take a moment to check in with yourself
            </p>

            <div className="grid grid-cols-4 gap-3">
              {moods.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMood(index)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedMood === index
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-xs text-gray-600">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Collection Milestones */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl font-bold">Collection Milestones</h3>
            </div>

            <div className="space-y-4">
              {quests.map((quest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 && "🎉"}
                      {index === 1 && "🖊️"}
                      {index === 2 && "🖊️"}
                      {index === 3 && "🔑"}
                      {index === 4 && "🍎"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {quest.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {quest.detail}
                      </div>
                    </div>
                  </div>
                  {quest.status && (
                    <button
                      className={`${quest.color} text-white px-4 py-1 rounded-full text-sm font-medium`}
                    >
                      {quest.status}
                    </button>
                  )}
                  {quest.progress && (
                    <span className="text-sm text-gray-400 font-medium">
                      {quest.progress}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
