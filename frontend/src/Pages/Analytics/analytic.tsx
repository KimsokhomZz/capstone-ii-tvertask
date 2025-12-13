import { useState } from "react";
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
  const base =
    "flex-1 text-center py-3 text-sm font-semibold rounded-full transition-colors cursor-pointer";

  return (
    <div className="flex gap-2 bg-[#F5F2FF] p-1 rounded-full w-full max-w-md">
      <button
        className={`${base} ${
          active === "overview"
            ? "bg-[#FFC94A] text-white shadow-sm"
            : "text-gray-500"
        }`}
        onClick={() => onChange("overview")}
      >
        Overview
      </button>
      <button
        className={`${base} ${
          active === "level"
            ? "bg-[#FFC94A] text-white shadow-sm"
            : "text-gray-500"
        }`}
        onClick={() => onChange("level")}
      >
        Level System
      </button>
      <button
        className={`${base} ${
          active === "analytic"
            ? "bg-[#FFC94A] text-white shadow-sm"
            : "text-gray-500"
        }`}
        onClick={() => onChange("analytic")}
      >
        Analytic
      </button>
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            📉 My Progress
          </h1>
          <p className="text-sm text-gray-400">
            Track your goals, level progression, and productivity.
          </p>
        </div>
        <AnalyticsTabs active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Content */}
      {activeTab === "overview" && <AnalyticsOverviewTab />}
      {activeTab === "level" && <LevelSystemTab />}
      {activeTab === "analytic" && <AnalyticTab />}
    </div>
  );
}
