import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, RefreshCw } from "lucide-react";
import authService from "../../services/authService";

export default function EmailSent() {
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Get email from location state or default
  const email = location.state?.email || "your email";

  const handleResendVerification = async () => {
    if (!email || email === "your email") {
      alert("Email address not found. Please try signing up again.");
      return;
    }

    setIsResending(true);
    setResendSuccess(false);

    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error) {
      alert(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-md w-full">
        {/* Questify Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <svg
                className="w-16 h-16 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6m3-3H9" />
              </svg>
              <svg
                className="absolute top-0 right-0 w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Questify</h1>
          <p className="text-purple-100 text-sm">YOUR GOALS. YOUR GAME</p>
        </div>

        {/* Email Sent Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600">We've sent a verification link to</p>
            <p className="text-blue-600 font-semibold break-all">{email}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-blue-800 font-medium text-sm mb-2">
              What's next?
            </h3>
            <ol className="text-blue-700 text-sm text-left space-y-1">
              <li>1. Check your email inbox (and spam folder)</li>
              <li>2. Click the verification link in the email</li>
              <li>3. You'll be redirected to your dashboard</li>
            </ol>
          </div>

          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-700 text-sm">
                ✅ Verification email sent successfully!
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={isResending || email === "your email"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
              />
              {isResending ? "Sending..." : "Resend Verification Email"}
            </button>

            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm">
                Already verified your email?
              </p>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Sign in to your account
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/signup"
                className="text-gray-500 hover:text-gray-700 underline text-sm"
              >
                Use a different email address
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-purple-100 text-sm">
            Need help?{" "}
            <a
              href="mailto:support@questify.com"
              className="text-yellow-400 hover:text-yellow-300 underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
