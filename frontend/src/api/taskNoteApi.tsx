import axios from "axios";

const API_HOST = import.meta.env.VITE_API_BASE || "";
const API_BASE = `${API_HOST}/api/taskNotes`
  .replace(/\/\/+/g, "/")
  .replace(":/", "://");

export async function getNotesByTask(taskId: number) {
  const res = await axios.get(`${API_BASE}/${taskId}`);
  return res.data;
}

export async function createNote(payload: {
  task_id: number;
  user_id?: number;
  text: string;
}) {
  try {
    console.log("[taskNoteApi] createNote payload:", payload);
    const res = await axios.post(`${API_BASE}`, payload);
    console.log("[taskNoteApi] createNote response:", res.status, res.data);
    return res.data;
  } catch (err: any) {
    console.error("[taskNoteApi] createNote error:", err?.response ?? err);
    throw err;
  }
}

export async function updateNote(
  id: number,
  updates: Partial<{ text: string }>
) {
  const res = await axios.put(`${API_BASE}/${id}`, updates);
  return res.data;
}

export async function deleteNote(id: number) {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
}
