import axios from "axios";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  focus_time: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch tasks from the API
export async function fetchTask(): Promise<Task[] | undefined> {
  try {
    console.log("Starting to fetch task data...");
    const response = await axios.get<Task[]>(
      "http://localhost:3000/api/tasks/"
    );
    console.log("Fetched task data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
  }
}
