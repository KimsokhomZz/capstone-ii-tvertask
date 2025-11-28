import axios from "axios";

const API = "/api/user/"; // backend routes are mounted under /api/user

export interface AwardXpResult {
  success: boolean;
  data?: any;
}

export async function awardXp(
  userId: string | number,
  amount: number,
  source = "pomodoro"
): Promise<AwardXpResult> {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API}xp`,
      { userId, xpAmount: amount, source },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("awardXp error", err);
    throw err;
  }
}

// optional extras
export async function getXp(userId: string | number) {
  return axios.get(`${API}xp`, { params: { userId } }).then((r) => r.data);
}
export async function getStatus(userId: string | number) {
  return axios.get(`${API}status`, { params: { userId } }).then((r) => r.data);
}
