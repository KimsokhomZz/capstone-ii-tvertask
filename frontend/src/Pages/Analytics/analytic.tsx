import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsOverviewTab from "./OverviewTab";
import LevelSystemTab from "./LevelSystemTab";
import AnalyticTab from "./AnalyticTab";

type AnalyticsTab = "overview" | "level" | "analytic";

function AnalyticsTabs({
  active,
  onChange,
}: {
  active: AnalyticsTab;
  onChange: (tab: AnalyticsTab) => void;
}) {
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "📊" },
    { id: "level" as const, label: "Level System", icon: "🎯" },
    { id: "analytic" as const, label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="flex gap-2 text-sm bg-gradient-to-r from-purple-100/50 via-indigo-100/50 to-purple-100/50 p-1.5 rounded-full w-full max-w-md shadow-sm backdrop-blur-sm border border-white/60">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`flex-1 text-center py-3 px-6 font-semibold rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden ${
            active === tab.id
              ? "text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-white/40"
          }`}
          onClick={() => onChange(tab.id)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {active === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-[#FFC94A] to-[#FFB020] rounded-full shadow-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap">
            <span className="text-base">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
  };

  const tabContentVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
    exit: {
      opacity: 0,
      x: 30,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        variants={headerVariants}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            📉 My Progress
          </motion.h1>
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Track your goals, level progression, and productivity.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnalyticsTabs active={activeTab} onChange={setActiveTab} />
        </motion.div>
      </motion.div>

      {/* Animated Content with improved styling */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-8 overflow-hidden"
          >
            <AnalyticsOverviewTab />
          </motion.div>
        )}
        {activeTab === "level" && (
          <motion.div
            key="level"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl shadow-md border border-purple-100 p-6 md:p-8 overflow-hidden"
          >
            <LevelSystemTab />
          </motion.div>
        )}
        {activeTab === "analytic" && (
          <motion.div
            key="analytic"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl shadow-md border border-blue-100 p-6 md:p-8 overflow-hidden"
          >
            <AnalyticTab />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
