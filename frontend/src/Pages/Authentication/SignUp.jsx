import React, { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import emailService from "../../services/emailService";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const emailCheckTimeoutRef = useRef(null);

  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    {
      label: "Contains uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
    },
    { label: "Contains number", test: (pwd) => /\d/.test(pwd) },
    {
      label: "Contains special character",
      test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const isPasswordValid = () => {
    return passwordRequirements.every((req) => req.test(password));
  };

  const isConfirmPasswordValid = () => {
    return passwordRequirements.every((req) => req.test(confirmPassword));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (formErrors.confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Enhanced email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomainRegex =
      /^[^\s@]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      return "Email is required";
    }

    if (email.length > 254) {
      return "Email address is too long";
    }

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (!validDomainRegex.test(email)) {
      return "Please enter a valid email domain";
    }

    // Check for consecutive dots
    if (email.includes("..")) {
      return "Email address cannot contain consecutive dots";
    }

    // Check for invalid characters
    if (/[<>()\[\]\\,;:\s@"]/.test(email.split("@")[0])) {
      return "Email contains invalid characters";
    }

    // Check for common typos
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "icloud.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    const suggestions = {
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "yahooo.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "outlok.com": "outlook.com",
    };

    if (suggestions[domain]) {
      return `Did you mean ${email.split("@")[0]}@${suggestions[domain]}?`;
    }

    return null;
  };

  // Debounced email availability check
  const checkEmailAvailability = useCallback(async (emailValue) => {
    if (!emailValue || validateEmail(emailValue)) {
      setEmailCheckStatus(null);
      return;
    }

    setEmailCheckStatus("checking");

    try {
      const result = await emailService.validateEmailWithAvailability(
        emailValue
      );

      if (result.valid && result.available) {
        setEmailCheckStatus("available");
        // Clear any existing email error
        setFormErrors((prev) => ({ ...prev, email: "" }));
      } else if (result.valid && !result.available) {
        setEmailCheckStatus("taken");
        setFormErrors((prev) => ({
          ...prev,
          email: result.message || "This email is already in use",
        }));
      } else {
        setEmailCheckStatus(null);
        setFormErrors((prev) => ({
          ...prev,
          email: result.message || "Invalid email address",
        }));
      }
    } catch (error) {
      setEmailCheckStatus(null);
      console.error("Email check failed:", error);
    }
  }, []);

  // Handle email change with debouncing
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Clear previous timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Clear existing errors immediately for better UX
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: "" }));
    }

    // Set new timeout for email checking
    if (emailValue.trim()) {
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailAvailability(emailValue.trim().toLowerCase());
      }, 800); // 800ms debounce
    } else {
      setEmailCheckStatus(null);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (username.length > 50) {
      errors.username = "Username must be less than 50 characters";
    }

    const emailError = validateEmail(email);
    if (emailError) {
      errors.email = emailError;
    } else if (emailCheckStatus === "taken") {
      errors.email = "This email is already in use";
    } else if (emailCheckStatus === "checking") {
      errors.email = "Please wait while we verify email availability";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (!isPasswordValid()) {
      errors.password = "Password does not meet security requirements";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    authService.loginWithFacebook();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    clearError();
    setFormErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (result?.data?.requiresVerification) {
        // Redirect to email sent page instead of showing message on signup page
        navigate("/email-sent", {
          state: { email: email.trim().toLowerCase() },
        });
      } else {
        // Show success state (for social auth, auto-verification, or if verification is bypassed)
        setIsSuccess(true);

        // Wait a moment to show success animation before redirecting
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Left Side - Purple Background with Tver Task Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 relative overflow-hidden animate-slideInLeft">
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

      {/* Right Side - SignUp Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 md:px-20 animate-slideInRight">
        <div className="w-full max-w-sm animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 mb-8">
            Sign up to get started with Tver Task
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-500 animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-green-800 font-medium">
                    Account created successfully!
                  </p>
                  <p className="text-green-600 text-sm">
                    Redirecting you to dashboard...
                  </p>
                </div>
              </div>
            )}

            {/* Global Error Message */}
            {error && !isSuccess && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium text-sm mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className={`w-full border rounded-lg py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 ${
                    formErrors.username
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (formErrors.username) {
                      setFormErrors((prev) => ({ ...prev, username: "" }));
                    }
                  }}
                  disabled={isLoading || isSuccess}
                />
              </div>
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium text-sm mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className={`w-full border rounded-lg py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 ${
                    formErrors.email
                      ? "border-red-300 bg-red-50"
                      : email && validateEmail(email) === null
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300"
                  }`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  onBlur={(e) => {
                    const emailError = validateEmail(e.target.value);
                    if (emailError) {
                      setFormErrors((prev) => ({ ...prev, email: emailError }));
                    }
                  }}
                  disabled={isLoading || isSuccess}
                />
                {email && validateEmail(email) === null && (
                  <div className="absolute right-3 top-3">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
              {email && validateEmail(email) === null && !formErrors.email && (
                <p className="text-green-600 text-xs mt-1">
                  ✓ Valid email address
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium text-sm mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className={`w-full border rounded-lg py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 ${
                    formErrors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}

              {/* Password Requirements - Floating */}
              {password && isPasswordFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-lg z-50 animate-fadeIn">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">
                    Password Requirements:
                  </h4>
                  <div className="space-y-2">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.test(password);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                              isValid ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {isValid ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <X className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isValid ? "text-green-700" : "text-gray-600"
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="con-password"
                className="block text-gray-700 font-medium text-sm mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="con-password"
                  placeholder="Confirm password"
                  className={`w-full border rounded-lg py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900 ${
                    formErrors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}

              {/* Confirm Password Requirements - Floating */}
              {confirmPassword && isConfirmPasswordFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-lg z-50 animate-fadeIn">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">
                    Password Requirements:
                  </h4>
                  <div className="space-y-2">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.test(confirmPassword);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                              isValid ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {isValid ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <X className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isValid ? "text-green-700" : "text-gray-600"
                            }`}
                          >
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Password Match Indicator */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          password === confirmPassword &&
                          confirmPassword.length > 0
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {password === confirmPassword &&
                        confirmPassword.length > 0 ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <X className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          password === confirmPassword &&
                          confirmPassword.length > 0
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center space-x-2 text-gray-700 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-yellow-400 cursor-pointer"
                disabled={isLoading || isSuccess}
              />
              <span>Remember for 30 days</span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full font-bold py-3 rounded-lg transition duration-200 text-base ${
                isSuccess
                  ? "bg-green-500 text-white cursor-default"
                  : isLoading
                  ? "bg-gray-400 cursor-not-allowed text-gray-600"
                  : "bg-[#F9C80E] hover:bg-[#e0b50d] text-white"
              }`}
            >
              {isSuccess ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Account Created!
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex-1 border border-gray-300 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                disabled={isLoading || isSuccess}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="flex-1 border border-gray-300 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                disabled={isLoading || isSuccess}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
