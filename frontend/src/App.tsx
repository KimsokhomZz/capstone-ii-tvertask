import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

// @ts-ignore
import Login from "./Pages/Authentication/Login.jsx";
// @ts-ignore
import SignUp from "./Pages/Authentication/SignUp.jsx";
// @ts-ignore
import AuthCallback from "./Pages/Authentication/AuthCallback.jsx";
// @ts-ignore
import EmailVerification from "./Pages/Authentication/EmailVerification.jsx";
// @ts-ignore
import EmailSent from "./Pages/Authentication/EmailSent.jsx";
// @ts-ignore
import ForgetPassword from "./Pages/Authentication/ForgetPassword.jsx";
// @ts-ignore
import ResetPassword from "./Pages/Authentication/ResetPassword.jsx";
// @ts-ignore
import Dashboard from "./Pages/Dashboard/Dashboardtask.jsx";
// @ts-ignore
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import TaskList from "./Pages/TaskList/TaskList.js";
import MainLayout from "./components/MainLayout.tsx";
import Pomodoro from "./Pages/Focus/Focustask.js";
import Leaderboard from "./Pages/Leaderboard/leaderboard";
import DashboardTask from "./Pages/Dashboard/Dashboardtask.js";
import Profile from "./Pages/Profile/Profile";
import { Navigate } from "react-router-dom";
import AvatarTask from "./Pages/Avatar/Avatartask.tsx"; // add or adjust path/casing if needed
import AnalyticsPage from "./Pages/Analytics/analytic.tsx";
import NotificationsPageComponent from "./Pages/Notifications/Notifications.tsx";
import Support from "./Pages/Spport/Support.tsx";

function DashboardPage() {
  return <DashboardTask />;
}

function LeaderboardPage() {
  return <Leaderboard />;
}

function AvatarPage() {
  // Render your AvatarTask component instead of the "Coming soon..." placeholder
  return <AvatarTask />;
}

function NotificationsPage() {
  return <NotificationsPageComponent />;
}
function SettingsPage() {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[28px] shadow-xl w-full max-w-4xl border border-gray-100">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500">Coming soon...</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/email-sent" element={<EmailSent />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Main app routes with layout */}
            <Route element={<MainLayout />}>
              <Route
                path="/dashboard"
                element={
                  // Render dashboard directly so /dashboard is accessible without ProtectedRoute
                  <Dashboard />
                }
              />
              <Route path="/focus" element={<TaskList />} />
              <Route path="/pomodoro/:id" element={<Pomodoro />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/avatar" element={<AvatarPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* <Route path="/support" element={<Support />} /> */}
              <Route path="/sopport" element={<Support />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Redirect /tasks to /focus */}
            <Route path="/tasks" element={<Navigate to="/focus" replace />} />
          </Routes>
        </Router>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          toastClassName="text-sm font-medium"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
