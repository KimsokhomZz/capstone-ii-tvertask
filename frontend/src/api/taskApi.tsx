import axios from "axios";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  focus_time: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const API = "http://localhost:3000/api/tasks/";

// Fetch tasks from the API
export async function fetchTask(): Promise<Task[] | undefined> {
  try {
    console.log("Starting to fetch task data...");
    const response = await axios.get<Task[]>(API);
    console.log("Fetched task data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
  }
}

// Create a new task
export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<Task | undefined> {
  try {
    const response = await axios.post<Task>(API, task);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

// Update a task
export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<Task | undefined> {
  try {
    const response = await axios.put<Task>(`${API}${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

// Update onlyn
export async function updateTaskStatus(
  id: number,
  status: string
): Promise<Task | undefined> {
  try {
    const response = await axios.patch<{ message: string; task: Task }>(
      `${API}${id}`,
      { status }
    );
    return response.data.task;
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

// Delete a task
export async function deleteTask(id: number): Promise<boolean> {
  try {
    await axios.delete(`${API}${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
}
