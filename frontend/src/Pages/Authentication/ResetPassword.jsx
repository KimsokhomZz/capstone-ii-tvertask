import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import authService from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    const { newPassword, confirmPassword } = formData;

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen w-screen bg-white overflow-hidden">
        {/* Left Side - Success Message */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 py-8 animate-slideInLeft">
          <div className="w-full max-w-sm animate-fadeIn text-center">
            <div className="mb-4 sm:mb-6">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Your password has been successfully changed. You can now log in
                with your new password.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-green-800">
                <strong>🎉 All set!</strong>
                <br />
                Redirecting you to login page...
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full bg-[#F9C80E] hover:bg-[#e0b50d] text-white font-bold py-2.5 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              Go to Login
            </Link>
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
  }

  return (
    <div className="flex min-h-screen w-screen bg-white overflow-hidden">
      {/* Left Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 py-8 animate-slideInLeft">
        <div className="w-full max-w-sm animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-red-700 text-xs sm:text-sm">{error}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium text-xs sm:text-sm mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-9 sm:px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 text-sm sm:text-base"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium text-xs sm:text-sm mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-9 sm:px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 text-sm sm:text-base"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600">Password strength:</div>
                <div className="space-y-1">
                  <div
                    className={`text-xs flex items-center space-x-2 ${
                      formData.newPassword.length >= 6
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        formData.newPassword.length >= 6
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>At least 6 characters</span>
                  </div>
                  <div
                    className={`text-xs flex items-center space-x-2 ${
                      formData.newPassword === formData.confirmPassword &&
                      formData.confirmPassword
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        formData.newPassword === formData.confirmPassword &&
                        formData.confirmPassword
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !token}
              className={`w-full font-bold py-2.5 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base ${
                isLoading || !token
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "bg-[#F9C80E] hover:bg-[#e0b50d] text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors text-sm sm:text-base"
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

export default ResetPassword;
