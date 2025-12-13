import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Flame, Target, Trophy } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  time: string;
  createdAt: Date;
}

const Dashboard: React.FC = () => {
  // const [activeTab, setActiveTab] = useState<
  //   "Daily" | "Weekly" | "Monthly" | "All-time"
  // >("Monthly");
  const [activeTab, setActiveTab] = useState<"All-time">("All-time");
  const [allTasks, setAllTasks] = useState<Task[]>([]); // Stores all tasks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Tasks visible based on activeTab
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [newTask, setNewTask] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [taskTime, setTaskTime] = useState("15"); // Default task time in minutes
  const [showCompleted, setShowCompleted] = useState(true);

  // const tabs = ["Daily", "Weekly", "Monthly", "All-time"] as const;
  const tabs = ["All-time"] as const;

  // Simulate initial task loading (replace with backend fetch)
  useEffect(() => {
    // TODO: Backend Integration: Fetch tasks from the backend on component mount
    // Example placeholder tasks:
    const initialTasks: Task[] = [
      {
        id: 1,
        text: "Finish React project",
        completed: false,
        time: "60",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      }, // 2 days ago
      {
        id: 2,
        text: "Read a book for 30 min",
        completed: true,
        time: "30",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      }, // yesterday
      {
        id: 3,
        text: "Prepare for meeting",
        completed: false,
        time: "45",
        createdAt: new Date(),
      }, // today
      {
        id: 4,
        text: "Workout for 1 hour",
        completed: false,
        time: "60",
        createdAt: new Date(),
      }, // today
      {
        id: 5,
        text: "Plan next week's goals",
        completed: true,
        time: "90",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
      }, // 10 days ago
      {
        id: 6,
        text: "Review project documentation",
        completed: false,
        time: "120",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 35)),
      }, // 35 days ago
    ];
    setAllTasks(initialTasks);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter tasks based on the active tab and update KPIs
  // useEffect(() => {
  //   const now = new Date();
  //   const todayStart = new Date(
  //     now.getFullYear(),
  //     now.getMonth(),
  //     now.getDate()
  //   );

  //   const sevenDaysAgo = new Date(todayStart);
  //   sevenDaysAgo.setDate(todayStart.getDate() - 6); // Current day + past 6 days = 7 days

  //   const thirtyDaysAgo = new Date(todayStart);
  //   thirtyDaysAgo.setDate(todayStart.getDate() - 29); // Current day + past 29 days = 30 days

  //   let tasksToShow: Task[] = [];
  //   switch (activeTab) {
  //     case "Daily":
  //       tasksToShow = allTasks.filter(
  //         (task) => new Date(task.createdAt) >= todayStart
  //       );
  //       break;
  //     case "Weekly":
  //       tasksToShow = allTasks.filter(
  //         (task) => new Date(task.createdAt) >= sevenDaysAgo
  //       );
  //       break;
  //     case "Monthly":
  //       tasksToShow = allTasks.filter(
  //         (task) => new Date(task.createdAt) >= thirtyDaysAgo
  //       );
  //       break;
  //     case "All-time":
  //     default:
  //       tasksToShow = allTasks;
  //       break;
  //   }
  //   setFilteredTasks(tasksToShow);
  // }, [activeTab, allTasks]);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      // TODO: Backend Integration: Send new task data to the backend
      setAllTasks((prevTasks) => [
        ...prevTasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          time: taskTime,
          createdAt: new Date(),
        },
      ]);
      setNewTask("");
      setTaskTime("15");
      setShowTaskInput(false);
    }
  }, [newTask, taskTime]);

  const toggleTask = useCallback((id: number) => {
    // TODO: Backend Integration: Update task completion status in the backend
    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));

  // KPI Calculations based on filteredTasks
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((task) => task.completed).length;
  const dailyProgressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusHours =
    filteredTasks.reduce((sum, task) => {
      return task.completed ? sum + (parseInt(task.time) || 0) : sum;
    }, 0) / 60; // Convert minutes to hours

  const sortedTasks = useMemo(
    () =>
      [...filteredTasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1; // incomplete first
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // newest first
      }),
    [filteredTasks]
  );

  const visibleTasks = useMemo(
    () =>
      showCompleted ? sortedTasks : sortedTasks.filter((t) => !t.completed),
    [showCompleted, sortedTasks]
  );

  // Quests (Milestones) - mostly static for now, would be dynamic with backend
  const quests = [
    {
      name: "Login Reward",
      detail: "Daily login bonus",
      status: "Completed!",
      color: "bg-purple-500",
      icon: "🎉",
    },
    {
      name: "Task Master",
      detail: "Complete 5 tasks",
      status: "Collect", // or "3/5" if not completed
      color: "bg-emerald-500",
      icon: "🖊️",
    },
    {
      name: "Focus Streak",
      detail: "Achieve 3-day focus streak",
      progress: "1/3",
      icon: "🔥",
    },
    {
      name: "Mood Journal",
      detail: "Log your mood 7 times",
      progress: "3/7",
      icon: "🔑",
    },
    {
      name: "First Task",
      detail: "Complete your first task",
      status: "Completed!",
      color: "bg-blue-500",
      icon: "✅",
    },
  ];

  // TODO: Backend Integration:
  // - Implement logic to update streak (requires tracking daily completed tasks over time).
  // - Implement XP gain logic (requires a points system for task completion/focus).
  // - Implement logic for quest progress and collection (requires tracking user achievements).
  // - Send mood selection to the backend.

  // helper to check if time is between 15 and 90 (inclusive)
  const isTimeBlack = (time: string | number) => {
    const t = parseInt(String(time), 10) || 0;
    return t >= 15 && t <= 90;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          🚀 Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 border-b border-gray-200">
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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Key Performance Indicator ({activeTab})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Daily Progress (Dynamic based on activeTab) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {activeTab} Progress
              </span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">Completion Rate</div>
              <div className="text-3xl sm:text-4xl font-bold text-yellow-500">
                {dailyProgressPercentage}%
              </div>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${dailyProgressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {dailyProgressPercentage === 100
                ? "Great job, all tasks completed!"
                : "Keep going, add more tasks or complete existing ones."}
            </p>
          </div>

          {/* Focus (Dynamic based on activeTab) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Focus Time</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {totalFocusHours.toFixed(1)} Hours
            </div>
            <p className="text-xs text-gray-400">
              Time spent on completed tasks.
            </p>
          </div>

          {/* Streak (Placeholder) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Streak</span>
            </div>
            {/* TODO: Backend Integration: Dynamically calculate and display streak */}
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              7 🔥
            </div>
            <p className="text-xs text-gray-400">
              Consecutive days of activity.
            </p>
          </div>

          {/* XP Gain (Placeholder) */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 shadow-sm text-white">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">XP Gain</span>
            </div>
            {/* TODO: Backend Integration: Dynamically calculate and display XP */}
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

        {/* Today's Task (now based on activeTab) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <h3 className="text-xl font-bold text-black">
                {activeTab} Tasks
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-gray-500">
                {completedTasks}/{totalTasks} completed
              </div>
              <button
                onClick={() => setShowCompleted((v) => !v)}
                className="border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {showCompleted ? "Hide" : "Show"} completed
              </button>
              <button
                onClick={() => {
                  setTaskTime("15");
                  setShowTaskInput(true);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-medium transition-colors"
              >
                + Add task
              </button>
            </div>
          </div>

          {showTaskInput && (
            <div className="mb-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                placeholder="Enter task description..."
                className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  newTask.trim() ? "text-black" : "text-gray-700"
                }`}
                autoFocus
              />
              <select
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  isTimeBlack(taskTime) ? "text-black" : "text-gray-700"
                }`}
              >
                <option value="15" className="text-black">
                  15 min
                </option>
                <option value="25" className="text-black">
                  25 min
                </option>
                <option value="30" className="text-black">
                  30 min
                </option>
                <option value="45" className="text-black">
                  45 min
                </option>
                <option value="60" className="text-black">
                  60 min
                </option>
                <option value="90" className="text-black">
                  90 min
                </option>
              </select>
              <button
                onClick={addTask}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setTaskTime("15");
                  setShowTaskInput(false);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {visibleTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No tasks for this period
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Add your tasks to grow your avatar 🌱
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
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-yellow-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <div className="flex flex-col gap-1">
                      <span
                        className={`${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {task.text}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
                          {task.completed ? "Completed" : "Open"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
                          Created {formatDate(task.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`bg-yellow-400 ${
                      isTimeBlack(task.time) ? "text-black" : "text-gray-900"
                    } px-4 py-1.5 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors flex items-center gap-1 mt-2 sm:mt-0`}
                  >
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
              <h3 className="text-xl font-bold text-black">How do you feel?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Take a moment to check in with yourself
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                { emoji: "😊", label: "Happy" },
                { emoji: "😌", label: "Calm" },
                { emoji: "🙏", label: "Thankful" },
                { emoji: "💡", label: "Focused" },
                { emoji: "💪", label: "Growing" },
                { emoji: "🔥", label: "Motivated" },
                { emoji: "😤", label: "Determined" },
                { emoji: "😴", label: "Tired" },
                { emoji: "😥", label: "Anxious" },
                { emoji: "😇", label: "Content" },
                { emoji: "😋", label: "Hungry" },
                { emoji: "🌟", label: "Inspired" },
              ].map((mood, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedMood(index);
                    // TODO: Backend Integration: Send selected mood to backend
                    console.log(`User selected mood: ${mood.label}`);
                  }}
                  className={`p-3 sm:p-4 rounded-2xl border-2 transition-all ${
                    selectedMood === index
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                    {mood.emoji}
                  </div>
                  <div className="text-xs text-gray-600">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Collection Milestones */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl font-bold text-black">
                Collection Milestones
              </h3>
            </div>

            <div className="space-y-4">
              {quests.map((quest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{quest.icon}</div>
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
