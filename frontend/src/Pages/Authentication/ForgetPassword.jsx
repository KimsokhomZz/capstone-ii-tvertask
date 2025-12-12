import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import authService from "../../services/authService";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen w-screen bg-white overflow-hidden">
        {/* Left Side - Success Message */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 md:px-20 animate-slideInLeft">
          <div className="w-full max-w-sm animate-fadeIn text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-blue-500 font-semibold break-all">{email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>Didn't receive the email?</strong>
                <br />
                • Check your spam folder
                <br />
                • The link expires in 10 minutes
                <br />• Make sure you entered the correct email
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                  setError("");
                }}
                className="w-full bg-[#F9C80E] hover:bg-[#e0b50d] text-white font-bold py-3 rounded-lg transition duration-200"
              >
                Try Different Email
              </button>

              <Link
                to="/login"
                className="block w-full text-center text-blue-500 hover:text-blue-600 font-semibold"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Purple Background with Tver Task Branding */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 relative overflow-hidden animate-slideInRight">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30 animate-float">
            <div className="absolute top-10 left-10 w-24 h-24 bg-purple-300 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-purple-200 rounded-full"></div>
          </div>

          {/* Tver Task Logo Card */}
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-xs text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <svg
                  className="w-20 h-20 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" d="M12 6v6m3-3H9" />
                </svg>
                <svg
                  className="absolute top-0 right-0 w-6 h-6 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Tver Task</h2>
            <p className="text-gray-600 text-sm">YOUR GOALS. YOUR GAME</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen bg-white overflow-hidden">
      {/* Left Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 py-8 animate-slideInLeft">
        <div className="w-full max-w-sm animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            No worries! Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-xs sm:text-sm">{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium text-xs sm:text-sm mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-9 sm:px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 text-sm sm:text-base"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-2.5 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "bg-[#F9C80E] hover:bg-[#e0b50d] text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 font-semibold transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Sign up link */}
          <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Purple Background with Tver Task Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 relative overflow-hidden animate-slideInRight">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30 animate-float">
          <div className="absolute top-10 left-10 w-16 h-16 lg:w-24 lg:h-24 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 lg:w-32 lg:h-32 bg-purple-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 lg:w-16 lg:h-16 bg-purple-200 rounded-full"></div>
        </div>

        {/* Tver Task Logo Card */}
        <div className="relative z-10 bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-8 max-w-xs w-full mx-4 text-center animate-scaleIn">
          <div className="flex justify-center mb-3 lg:mb-4">
            <div className="relative">
              <svg
                className="w-16 h-16 lg:w-20 lg:h-20 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6m3-3H9" />
              </svg>
              <svg
                className="absolute top-0 right-0 w-5 h-5 lg:w-6 lg:h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
            Tver Task
          </h2>
          <p className="text-gray-600 text-xs lg:text-sm">
            YOUR GOALS. YOUR GAME
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
