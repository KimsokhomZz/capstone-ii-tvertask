import { useState, useEffect } from "react";
// @ts-ignore
import { useAuth } from "../../context/AuthContext.jsx";
import EditProfile from "../../Components/Profile/EditProfile";
import ChangePassword from "../../Components/Profile/ChangePassword";
import ProgressStats from "../../Components/Profile/ProgressStats";
import AvatarUploadModal from "../../Components/Profile/AvatarUploadModal";
import { User, Edit, Lock, BarChart3, Camera } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("view");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalFocusTime: 0,
  });

  // Helper function to get the correct avatar URL
  const getAvatarUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) return "/default-avatar.svg";
    if (avatarUrl.startsWith("http")) return avatarUrl;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${baseUrl}${avatarUrl}`;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats();
      // Also refresh user data to ensure we have latest bio and location
      refreshUserData().then((result: { success: any }) => {
        if (result?.success) {
          console.log("[PROFILE] Fresh user data loaded on mount");
        }
      });
    }
  }, [isAuthenticated, user]);

  // Handle floating navbar visibility based on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const scrollY = window.scrollY;
      const navbar = document.getElementById("floating-navbar");

      if (!navbar) return;

      // Show navbar when scrolling down past 200px, hide when scrolling up or at top
      if (scrollY > 200 && scrollY > lastScrollY) {
        // Scrolling down and past threshold
        navbar.style.transform = "translateY(0)";
      } else if (scrollY <= 100 || scrollY < lastScrollY) {
        // At top or scrolling up
        navbar.style.transform = "translateY(-100%)";
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats.data);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const handleProfileUpdate = async () => {
    // Refresh user data first to get updated bio and location
    console.log("[PROFILE] Refreshing user data after profile update...");
    const refreshResult = await refreshUserData();

    if (refreshResult?.success) {
      console.log("[PROFILE] User data refreshed successfully");
    } else {
      console.warn(
        "[PROFILE] Failed to refresh user data:",
        refreshResult?.error
      );
    }

    // Then refresh stats
    await fetchUserStats();
  };

  const tabs = [
    {
      id: "view",
      label: "Overview",
      icon: User,
      description: "Profile summary & stats",
    },
    {
      id: "edit",
      label: "Edit Profile",
      icon: Edit,
      description: "Update personal info",
    },
    {
      id: "stats",
      label: "Progress & Stats",
      icon: BarChart3,
      description: "Track your improvement",
    },
    {
      id: "password",
      label: "Security",
      icon: Lock,
      description: "Password & security",
    },
  ];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "view":
        return <ProfileView user={user} stats={userStats} />;
      case "edit":
        return <EditProfile user={user} onUpdate={handleProfileUpdate} />;
      case "password":
        return <ChangePassword />;
      case "stats":
        return <ProgressStats stats={userStats} />;
      default:
        return <ProfileView user={user} stats={userStats} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 sm:p-8 bg-linear-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-6">
              <div
                className="relative group cursor-pointer"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <img
                  src={getAvatarUrl(user.avatarUrl)}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-avatar.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-500 mt-1 text-lg">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Member since {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="border-t border-gray-100">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 flex items-center gap-3 px-6 py-4 text-left transition-all duration-300 border-b-2 min-w-max ${
                      isActive
                        ? "border-blue-500 text-blue-700 bg-linear-to-r from-blue-50 to-indigo-50"
                        : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50/30"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span
                        className={`block font-semibold text-base transition-colors duration-300 ${
                          isActive ? "text-blue-800" : "text-gray-600"
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span
                        className={`block text-xs mt-0.5 transition-colors duration-300 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {tab.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Floating Navigation Bar - Fixed position when scrolling */}
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg transition-transform duration-300 transform -translate-y-full"
          id="floating-navbar"
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-4">
                <img
                  src={getAvatarUrl(user.avatarUrl)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-avatar.svg";
                  }}
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.name}
                  </h2>
                </div>
              </div>
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 text-left transition-all duration-300 rounded-lg min-w-max transform ${
                        isActive
                          ? "bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-102"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium text-sm transition-all duration-300 ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

// Profile View Component
const ProfileView = ({ user, stats }: { user: any; stats: any }) => {
  console.log("[PROFILE VIEW] Current user data:", {
    name: user?.name,
    email: user?.email,
    bio: user?.bio,
    location: user?.location,
    avatarUrl: user?.avatarUrl,
  });

  return (
    <div className="p-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-500 mt-1 text-base">
          Your profile summary and activity statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {stats.level}
            </div>
            <div className="text-sm font-medium text-blue-600">Level</div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-green-700 mb-2">
              {stats.streak}
            </div>
            <div className="text-sm font-medium text-green-600">Day Streak</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {stats.completedTasks}
            </div>
            <div className="text-sm font-medium text-purple-600">
              Tasks Done
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-orange-700 mb-2">
              {Math.round(stats.totalFocusTime / 60)}
            </div>
            <div className="text-sm font-medium text-orange-600">
              Hours Focused
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {user.name || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-medium text-lg break-all">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {user.location || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Bio
                  </label>
                  <p className="text-gray-900 font-medium text-lg leading-relaxed">
                    {user.bio || "No bio added yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
