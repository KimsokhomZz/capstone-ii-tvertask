import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface ActivityStats {
  tasksToday: number;
  taskPercentage: number;
  focusTimeToday: number;
  avgFocusTime: number;
  weeklyAvg: number;
  moodsToday: number;
}

export interface WeeklyStats {
  tasksCompleted: number;
  focusSessions: number;
  avatarGrow: number;
  focusTime: number;
}

export interface AnalyticsStats {
  mood: string;
  taskPerDay: string;
  focusTime: number;
  streak: number;
  subtitle: string;
}

export async function fetchActivityStats(): Promise<ActivityStats> {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/api/users/activity-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    throw error;
  }
}

export async function fetchWeeklyStats(): Promise<WeeklyStats> {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/api/users/weekly-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    throw error;
  }
}

export async function fetchAnalyticsStats(
  range: "overview" | "day" | "week" | "month"
): Promise<AnalyticsStats> {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API_BASE_URL}/api/users/analytics-stats?range=${range}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    throw error;
  }
}
