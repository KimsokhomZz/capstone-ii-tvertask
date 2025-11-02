import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

// @ts-ignore
import Login from "./Pages/Authentication/Login.jsx";
// @ts-ignore
import SignUp from "./Pages/Authentication/SignUp.jsx";
import TaskList from "./Pages/TaskList/TaskList.js";
import MainLayout from "./components/MainLayout";
import Pomodoro from "./Pages/Focus/Focustask.js";
import Leaderboard from "./Pages/Leaderboard/leaderboard";
import DashboardTask from "./Pages/Dashboard/Dashboardtask.js";

interface Task {
  id: number;
  title: string;
}

function DashboardPage() {
  return <DashboardTask />;
}

function LeaderboardPage() {
  return <Leaderboard />;
}

function AvatarPage() {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-xl w-full max-w-4xl border border-gray-100">
      <h1 className="text-2xl font-bold mb-2">Avatar</h1>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-xl w-full max-w-4xl border border-gray-100">
      <h1 className="text-2xl font-bold mb-2">Analytics</h1>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <div>
      <h1>Questify Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <h1 className="text-3xl font-bold underline text-pink-500">
        Hello world!
      </h1>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 mt-4"
      >
        Go to Login
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/focus" element={<TaskList />} />
          <Route path="/pomodoro/:id" element={<Pomodoro />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="/tasks" element={<Navigate to="/focus" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
