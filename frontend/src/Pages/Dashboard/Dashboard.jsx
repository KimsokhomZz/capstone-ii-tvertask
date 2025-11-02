import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Mail } from "lucide-react";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Questify Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to Questify!
            </h2>

            {/* User Info Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white mb-6">
              <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
              <div className="flex items-start space-x-4">
                {user?.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-white/20"
                  />
                )}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Name: {user?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email: {user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm opacity-90">
                      Member since:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  {user?.googleId && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        🔗 Connected via Google
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Tasks & Goals
                </h4>
                <p className="text-gray-600 text-sm">
                  Manage your quests and track your progress
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Pomodoro Timer
                </h4>
                <p className="text-gray-600 text-sm">
                  Stay focused with time management sessions
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Progress Tracking
                </h4>
                <p className="text-gray-600 text-sm">
                  Monitor your achievements and growth
                </p>
              </div>
            </div>

            {/* Success Message */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                🎉 Authentication is working! You have successfully logged in to
                Questify.
                {user?.googleId && (
                  <span className="block mt-1 font-medium">
                    ✅ Google OAuth login successful! Welcome, {user.name}!
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
