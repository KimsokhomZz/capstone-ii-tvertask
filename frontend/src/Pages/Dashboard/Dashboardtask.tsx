import React, { useState, useEffect, useMemo, useContext } from "react";
import { Flame, Target, Trophy, FileDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createTask,
  fetchTask,
  updateTask,
  deleteTask,
} from "../../api/taskApi";
import type { Task } from "../../api/taskApi";
import CreateTaskModal from "../TaskList/components/CreateTaskModal";
import EditTaskModal from "../TaskList/components/EditTaskModal";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";
import DashboardBottomSection from "./DashboardBottomSection";
import DashboardTasksSection from "./DashboardTasksSection";
import { fetchUserStreak } from "../../api/streakApi";
import { getStatus } from "../../api/userXpApi";
import { exportToPDF } from "./exportPDF";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"All-time">("All-time");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [deletingTaskName, setDeletingTaskName] = useState("");
  const { user } = useContext(
    AuthContext
  ) as import("@/context/AuthContext").AuthContextType;

  // const tabs = ["Daily", "Weekly", "Monthly", "All-time"] as const;
  const tabs = ["All-time"] as const;

  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Add at the top of your Dashboard component
  const [activeMinutes, setActiveMinutes] = useState(() => {
    const stored = localStorage.getItem("activeMinutes");
    return stored ? parseInt(stored, 10) : 0;
  });

  const [streak, setStreak] = useState<number | null>(null);

  const [xpStatus, setXpStatus] = useState<{
    xp: number;
    level: number;
    nextLevelXp: number;
    prevLevelXp: number;
    nextLevelTotal: number;
    progressPercent: number;
  } | null>(null);

  useEffect(() => {
    // Increment active time every minute
    const interval = setInterval(() => {
      setActiveMinutes((prev) => {
        const updated = prev + 1;
        localStorage.setItem("activeMinutes", updated.toString());
        return updated;
      });
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  // Sync state with localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("activeMinutes");
    if (stored) setActiveMinutes(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    async function loadTasks() {
      setLoadingTasks(true);
      const tasks = await fetchTask();
      setUserTasks(tasks || []);
      setLoadingTasks(false);
    }
    loadTasks();
  }, []);

  useEffect(() => {
    async function loadStreak() {
      if (!user?.id) {
        console.log("No user ID found");
        return;
      }

      console.log("Fetching streak for user:", user.id);

      try {
        const data = await fetchUserStreak(user.id);
        console.log("Streak data received:", data);
        setStreak(data.currentStrike);
      } catch (err) {
        console.error("Error loading streak:", err);
        setStreak(null);
      }
    }
    loadStreak();
  }, [user?.id]);

  useEffect(() => {
    async function loadXpStatus() {
      if (!user?.id) return;
      try {
        const res = await getStatus(user.id);
        if (res.success) setXpStatus(res.data);
      } catch (err) {
        setXpStatus(null);
      }
    }
    loadXpStatus();
  }, [user?.id]);

  // const formatDate = (date: Date) =>
  //   new Intl.DateTimeFormat("en", {
  //     month: "short",
  //     day: "numeric",
  //   }).format(date);

  const sortedTasks = useMemo(
    () =>
      [...userTasks].sort((a, b) => {
        if (a.status !== b.status) return a.status === "completed" ? 1 : -1; // incomplete first
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // newest first
      }),
    [userTasks]
  );

  const visibleTasks = useMemo(
    () =>
      showCompleted
        ? sortedTasks
        : sortedTasks.filter((t) => t.status !== "completed"),
    [showCompleted, sortedTasks]
  );

  // Calculate total focus hours (sum of focus_time for completed tasks)
  // const totalFocusHours = useMemo(() => {
  //   const totalMinutes = userTasks
  //     .filter((task) => task.status === "completed")
  //     .reduce((sum, task) => sum + (Number(task.focus_time) || 0), 0);
  //   return totalMinutes / 60;
  // }, [userTasks]);

  // Calculate completed and total tasks
  const completedTasks = userTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = userTasks.length;

  // Calculate task complete progress percentage
  const dailyProgressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

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

  const handleCreateTask = async (formData: {
    title: string;
    description?: string | null;
    duration?: string | number;
    short_break?: number | string;
    long_break?: number | string;
  }) => {
    if (!user) {
      toast.error("User not found. Please log in. ⛔");
      return;
    }

    const newTaskObj = {
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      focus_time: Number(formData.duration ?? "25"),
      short_break: Number(formData.short_break ?? 5),
      long_break: Number(formData.long_break ?? 15),
      status: "todo",
    };

    try {
      const created = await createTask(newTaskObj);

      if (created) {
        setUserTasks((prev) => [created, ...prev]);
        setShowCreateModal(false);
        toast.success("Task created successfully! 🚀");
      } else {
        toast.error(
          "Failed to create task. Please check the console for errors. 🚨"
        );
      }
    } catch (error) {
      toast.error(
        "Error creating task: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = async (formData: {
    title: string;
    description: string;
    duration: string;
  }) => {
    if (!editingTask) return;

    try {
      const updated = await updateTask(editingTask.id, {
        title: formData.title,
        focus_time: Number(formData.duration),
        description: formData.description,
      });

      if (updated) {
        setUserTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? updated : t))
        );
        setEditingTask(null);
        toast.success("Task updated successfully! ✏️");
      } else {
        toast.error("Failed to update task. 🚫");
      }
    } catch (error) {
      toast.error(
        "Error updating task: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleDeleteTask = (id: number, name: string) => {
    setDeletingTaskId(id);
    setDeletingTaskName(name);
  };

  const confirmDeleteTask = async () => {
    if (!deletingTaskId) return;

    try {
      const success = await deleteTask(deletingTaskId);
      if (success) {
        setUserTasks((prev) => prev.filter((t) => t.id !== deletingTaskId));
        setDeletingTaskId(null);
        setDeletingTaskName("");
        toast.success("Task deleted successfully! 🗑️");
      } else {
        toast.error("Failed to delete task. 🚫");
      }
    } catch (error) {
      toast.error(
        "Error deleting task: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  // Helper function to format minutes
  const formatMinutesToHourMinute = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  // PDF Export Handler
  const handleExportPDF = () => {
    exportToPDF({
      user,
      dailyProgressPercentage,
      activeMinutes,
      streak,
      xpStatus,
      totalTasks,
      completedTasks,
      visibleTasks,
      formatMinutesToHourMinute,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 md:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          variants={itemVariants}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            🚀 Dashboard
          </h2>

          {/* Export PDF Button */}
          <motion.button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-yellow-300/30 text-yellow-500 rounded-xl shadow-lg hover:bg-yellow-500/20 hover:border-yellow-400/50 hover:text-yellow-700 transition-all duration-100 font-semibold text-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="p-1 bg-yellow-500/20 rounded-lg">
              <FileDown className="w-4 h-4" />
            </div>
            <span>Export Report</span>
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap gap-x-4 gap-y-2 mb-8 border-b border-gray-200"
          variants={itemVariants}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-yellow-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* KPI Section */}
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-6"
          variants={itemVariants}
        >
          Key Performance Indicator ({activeTab})
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {/* Daily Progress Card */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border hover:border-yellow-300 hover:shadow-md"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {activeTab} Progress
              </span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">
                Task Completion Rate
              </div>
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-yellow-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {dailyProgressPercentage}%
              </motion.div>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgressPercentage}%` }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              ></motion.div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {dailyProgressPercentage === 100
                ? "Great job, all tasks completed!"
                : "Keep going, add more tasks or complete existing ones."}
            </p>
          </motion.div>

          {/* Active Time Card */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border hover:border-yellow-300 hover:shadow-md"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Active Time</span>
            </div>
            <motion.div
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {formatMinutesToHourMinute(activeMinutes)}
            </motion.div>
            <p className="text-xs text-gray-400">
              Total time you have been active on the system.
            </p>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border hover:border-yellow-300 hover:shadow-md"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Streak</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {streak !== null ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <span>{streak}</span>
                  <motion.span
                    role="img"
                    aria-label="fire"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                    🔥
                  </motion.span>
                </motion.div>
              ) : (
                <span className="text-gray-400">--</span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Consecutive days of activity.
            </p>
          </motion.div>

          {/* XP Gain Card */}
          <motion.div
            className="bg-linear-to-br from-purple-400 to-purple-600 rounded-2xl p-6 shadow-sm text-white border hover:border-purple-600 hover:shadow-md"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">XP Gain</span>
            </div>
            <motion.div
              className="text-2xl font-bold mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {xpStatus
                ? `${xpStatus.xp - xpStatus.prevLevelXp}/${
                    xpStatus.nextLevelTotal - xpStatus.prevLevelXp
                  } XP`
                : "--/-- XP"}
            </motion.div>
            <div>
              <div className="text-sm mb-2">
                Level {xpStatus ? xpStatus.level : "--"}
              </div>
              <div className="w-full bg-purple-300/30 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: xpStatus ? `${xpStatus.progressPercent}%` : "0%",
                  }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                ></motion.div>
              </div>
              <p className="text-xs mt-2 opacity-90">
                {xpStatus
                  ? `${xpStatus.nextLevelTotal - xpStatus.xp} XP to next level`
                  : "-- XP to next level"}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Today's Task */}
        <motion.div variants={itemVariants}>
          <DashboardTasksSection
            activeTab={activeTab}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            setShowCreateModal={setShowCreateModal}
            loadingTasks={loadingTasks}
            userTasks={userTasks}
            visibleTasks={visibleTasks}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
          />
        </motion.div>

        {/* Bottom Section */}
        <motion.div variants={itemVariants}>
          <DashboardBottomSection />
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTaskModal
            show={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTask}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTask && (
          <EditTaskModal
            editingTask={editingTask}
            onClose={() => setEditingTask(null)}
            onSubmit={handleSaveEdit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingTaskId !== null && (
          <DeleteConfirmation
            isOpen={deletingTaskId !== null}
            taskName={deletingTaskName}
            onConfirm={confirmDeleteTask}
            onClose={() => {
              setDeletingTaskId(null);
              setDeletingTaskName("");
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
