import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchUserStreak(userId: string | number) {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/user/streak?userId=${userId}`
    );
    return res.data;
    // Response: { currentStrike: number, lastUpdated: string }
  } catch (error) {
    console.error("Error fetching streak:", error);
    throw error;
  }
}
