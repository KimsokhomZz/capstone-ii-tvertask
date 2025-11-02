import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link. No token provided.");
      setIsLoading(false);
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      setIsLoading(true);
      const response = await authService.verifyEmail(token);

      if (response.success) {
        setVerificationStatus("success");
        setMessage(response.message || "Email verified successfully!");

        // Set auth state with user and token
        if (response.data?.token && response.data?.user) {
          setAuthState(response.data.user, response.data.token);
        }

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      setVerificationStatus("error");
      setMessage(error.message || "Failed to verify email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "success":
        return (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
        );
      case "error":
        return <XCircle className="w-16 h-16 text-red-500 mx-auto" />;
      default:
        return (
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
        );
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTextColor = () => {
    switch (verificationStatus) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      default:
        return "text-blue-800";
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

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">{getStatusIcon()}</div>

          <div className={`rounded-lg p-4 mb-6 ${getStatusColor()}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className={`w-5 h-5 ${getTextColor()}`} />
              <h2 className={`text-lg font-semibold ${getTextColor()}`}>
                Email Verification
              </h2>
            </div>
            <p className={`text-sm ${getTextColor()}`}>
              {isLoading ? "Verifying your email address..." : message}
            </p>
          </div>

          {verificationStatus === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm">
                  🎉 Welcome to Questify! You'll be redirected to your dashboard
                  in a few seconds.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-[#F9C80E] hover:bg-[#e0b50d] text-black font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-600 text-sm">
                  Don't worry, you can try these options:
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                  >
                    Request a new verification email
                  </Link>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                  >
                    Try logging in if already verified
                  </Link>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === "verifying" && (
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
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
