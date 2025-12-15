import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/leaderboard";

interface Player {
  rank: number;
  name: string;
  xp: number;
  avatar?: string;
  level?: number;
  xpEarned?: number; // today's XP earned
}

export interface LeaderboardData {
  leaderboard: Player[];
}

export async function fetchLeaderboard(page = 0, limit = 10) {
  try {
    const res = await axios.get<LeaderboardData>(
      API_URL + `/?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    throw error;
  }
}
