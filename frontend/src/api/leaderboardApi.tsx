import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/leaderboard";

interface Player {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
}

export interface LeaderboardData {
  weekly: Player[];
  monthly: Player[];
  global: Player[];
}

export async function fetchLeaderboard() {
    try {
        const res = await axios.post<LeaderboardData>(API_URL+`/?page=0&limit=10`);
        return res.data
    } catch (error) {
        console.error("Error fetching leaderboard: ", error)
    }
}
