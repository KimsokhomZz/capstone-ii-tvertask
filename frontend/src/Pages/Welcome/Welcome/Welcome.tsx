import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  Zap,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Timer,
  Star,
  TrendingUp,
} from "lucide-react";
import logo from "../../../assets/logo.svg";

export default function Welcome() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Task Management",
      description:
        "Organize your tasks efficiently with our intuitive interface and never miss a deadline",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Earn Rewards",
      description:
        "Stay motivated by earning XP points and badges as you complete your daily tasks",
      color: "from-yellow-400 to-yellow-500",
    },
    {
      icon: <Timer className="w-6 h-6" />,
      title: "Focus Timer",
      description:
        "Improve concentration with our built-in Pomodoro timer and work in focused intervals",
      color: "from-gray-700 to-gray-800",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Compete & Win",
      description:
        "Join the leaderboard, compete with friends, and celebrate your achievements together",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Analytics",
      description:
        "Track your productivity with detailed charts and insights to understand your work patterns",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Daily Streaks",
      description:
        "Build momentum with daily streaks and unlock exclusive rewards for consistent effort",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "1M+", label: "Tasks Completed" },
    { value: "50,000+", label: "Goals Achieved" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{
            top: "10%",
            left: "10%",
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{
            top: "60%",
            right: "10%",
            transform: `translate(${-mousePosition.x * 0.015}px, ${
              -mousePosition.y * 0.015
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{
            bottom: "10%",
            left: "50%",
            transform: `translate(${mousePosition.x * 0.01}px, ${
              -mousePosition.y * 0.01
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Tver Task" className="h-12 md:h-16" />
        </Link>
        <div className="flex gap-4">
          <Link
            to="/signup"
            className="no-underline px-6 md:px-8 py-3 md:py-3.5 text-gray-900 font-medium hover:text-black transition-colors text-base md:text-lg"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="no-underline px-8 md:px-10 py-3 md:py-3.5 bg-[#F9C80E] hover:bg-[#e0b50d] text-white font-bold rounded-xl hover:shadow-lg transition-all text-base md:text-lg"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-100 rounded-full mb-8 animate-fadeIn hover:bg-purple-200 transition-colors duration-300 cursor-default">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-sm font-semibold text-purple-700">
              YOUR GOALS. YOUR GAME
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slideInUp text-gray-900">
            Achieve Your Goals
            <br />
            <span className="text-purple-600">One Task at a Time</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slideInUp animation-delay-200 leading-relaxed">
            Stay organized and boost productivity with our intuitive task
            management system. Track your progress, earn rewards, and achieve
            your goals effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-slideInUp animation-delay-400">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-[#F9C80E] hover:bg-[#e0b50d] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-300 hover:border-purple-500 hover:shadow-lg transition-all duration-300 text-base md:text-lg transform hover:-translate-y-1"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fadeIn animation-delay-600">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium group-hover:text-purple-600 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Powerful Features to
            <span className="text-purple-600"> Boost Your Productivity</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to stay organized and achieve your goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 animate-fadeIn transform hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 shadow-md`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of productive users who are achieving their goals
              with Tver Task. Start your journey today - it's completely free!
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 md:px-10 py-3.5 md:py-4 bg-[#F9C80E] hover:bg-[#e0b50d] text-white font-bold rounded-xl transition-all duration-300 inline-flex items-center gap-2 text-base md:text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Create Your Free Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Tver Task" className="h-10 md:h-12" />
            </Link>
            <div className="text-sm text-gray-600">
              © 2025 Tver Task. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-900">
              <Link
                to="/support"
                className="hover:text-purple-600 transition-colors font-medium"
              >
                Support
              </Link>
              <Link
                to="/privacy"
                className="hover:text-purple-600 transition-colors font-medium"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-purple-600 transition-colors font-medium"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
