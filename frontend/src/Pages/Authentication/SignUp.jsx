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
import Logo from "../../assets/logo1.svg";

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
  const [showExistingEmailOptions, setShowExistingEmailOptions] =
    useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

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
    } else if (emailCheckStatus !== "available" && email.trim()) {
      errors.email = "Please wait for email verification to complete";
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
    setShowExistingEmailOptions(false);

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
      // If email already exists, show helpful actions (resend verification, login, forgot)
      const msg = (error && error.message) || String(error || "");
      const lower = msg.toLowerCase();
      if (
        lower.includes("already exists") ||
        lower.includes("already in use") ||
        lower.includes("email is already in use")
      ) {
        setFormErrors((prev) => ({ ...prev, email: msg }));
        setShowExistingEmailOptions(true);
      }
      // other errors are shown by context
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setIsResendingVerification(true);
    try {
      await authService.resendVerification(email.trim().toLowerCase());
      alert("Verification email sent! Please check your inbox.");
      setShowExistingEmailOptions(false);
    } catch (err) {
      alert(err.message || "Failed to resend verification email");
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 overflow-hidden px-4 sm:px-6">
      {/* Animated Background Elements - smooth emoji icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <style>{`
          @keyframes float-fly { 0%,100%{transform:translateY(0px) rotate(5deg);} 50%{transform:translateY(-30px) rotate(-5deg);} }
          .animate-float { animation: float-fly 3.2s infinite ease-in-out; }
        `}</style>

        <div
          className="absolute top-20 left-[6rem] text-6xl animate-float"
          style={{ animationDelay: "0s" }}
        >
          🏆
        </div>
        <div
          className="absolute top-[22.5rem] left-[2rem] text-5xl animate-float"
          style={{ animationDelay: "0.4s" }}
        >
          🚀
        </div>
        <div
          className="absolute top-[10rem] right-[4rem] text-5xl animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          ⭐️
        </div>
        <div
          className="absolute bottom-32 left-1/4 text-4xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          👑
        </div>
        <div
          className="absolute top-[15rem] right-[11rem] text-5xl animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          🎖
        </div>
        <div
          className="absolute bottom-20 right-10 text-6xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          🥇
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex w-full max-w-6xl items-stretch gap-8 lg:gap-12">
        {/* Left Side - Brand Panel */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative animate-slideInLeft auth-illustration">
          <div className="illustration" aria-hidden>
            <div className="bg-blobs" />
            <span className="hex hex--1" />
            <span className="hex hex--2" />
            <span className="hex hex--3" />
            <span className="hex hex--4" />
            <span className="hex hex--5" />
            <span className="hex hex--6" />
            <span className="hex hex--7" />
            <span className="hex hex--8" />
          </div>
          {/* Decorative elements (no blur, more motion) */}
          <div className="absolute inset-0 opacity-80">
            <div className="absolute bottom-8 left-4 w-64 h-64 bg-amber-200/45 rounded-full blob-a" />
            <div className="absolute top-6 right-6 w-40 h-40 bg-amber-300/40 rounded-3xl blob-b" />
            <div className="absolute top-14 right-28 w-8 h-8 text-xl opacity-90 animate-bounce"></div>
          </div>

          {/* Tver Task Logo Card (uses shared Logo image like Login page) */}
          <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 max-w-xs w-full mx-4 text-center animate-scaleIn border border-amber-100/80">
            <div className="flex justify-center mb-3 lg:mb-4">
              <img
                src={Logo}
                alt="Tver Task logo"
                className="h-16 w-auto lg:h-20 mx-auto object-contain"
              />
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1 tracking-tight">
              Tver Task
            </h2>
            <p className="text-slate-500 text-xs lg:text-sm">
              YOUR GOALS. YOUR GAME
            </p>
          </div>
        </div>

        {/* Right Side - SignUp Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 py-10 animate-slideInRight">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-100 shadow-xl rounded-3xl px-5 sm:px-8 py-7 sm:py-9 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">
              Sign up to get started with Tver Task
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Success Message */}
              {isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-bounce"
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
                    <p className="text-green-800 font-medium text-sm sm:text-base">
                      Account created successfully!
                    </p>
                    <p className="text-green-600 text-xs sm:text-sm">
                      Redirecting you to dashboard...
                    </p>
                  </div>
                </div>
              )}

              {/* Global Error Message */}
              {error && !isSuccess && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700 text-xs sm:text-sm">
                    {error}
                  </span>
                </div>
              )}

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-slate-700 font-medium text-xs sm:text-sm mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors duration-200 peer-focus:text-indigo-500" />
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    className={`peer w-full border rounded-xl py-2.5 px-9 sm:px-10 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 text-slate-900 text-sm sm:text-base transition-all duration-200 ease-out ${
                      formErrors.username
                        ? "border-red-300 bg-red-50/80 ring-red-100"
                        : "border-slate-200 hover:border-slate-300 focus:shadow-sm"
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
                  className="block text-slate-700 font-medium text-xs sm:text-sm mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors duration-200 peer-focus:text-indigo-500" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className={`peer w-full border rounded-xl py-2.5 px-9 sm:px-10 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 text-slate-900 text-sm sm:text-base transition-all duration-200 ease-out ${
                      formErrors.email
                        ? "border-red-300 bg-red-50/80 ring-red-100"
                        : email && validateEmail(email) === null
                        ? "border-emerald-300 bg-emerald-50/80 ring-emerald-100"
                        : "border-slate-200 hover:border-slate-300 focus:shadow-sm"
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
                        setFormErrors((prev) => ({
                          ...prev,
                          email: emailError,
                        }));
                      }
                    }}
                    disabled={isLoading || isSuccess}
                  />
                  {email && validateEmail(email) === null && (
                    <div className="absolute right-3 top-3">
                      <Check className="w-5 h-5 text-emerald-500 transition-transform duration-200 scale-100" />
                    </div>
                  )}
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
                {email &&
                  validateEmail(email) === null &&
                  !formErrors.email && (
                    <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ✓ Valid email address
                    </p>
                  )}
                {showExistingEmailOptions && (
                  <div className="mt-3 p-3 border border-amber-100 rounded-lg bg-amber-50/60">
                    <p className="text-amber-700 text-xs mb-2">
                      An account with this email already exists. Choose an
                      action:
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResendingVerification}
                        className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs hover:bg-amber-600 disabled:opacity-70"
                      >
                        {isResendingVerification
                          ? "Resending..."
                          : "Resend Verification"}
                      </button>
                      <Link
                        to="/login"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Login
                      </Link>
                      <Link
                        to="/forgot-password"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Forgot Password
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-slate-700 font-medium text-xs sm:text-sm mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors duration-200 peer-focus:text-indigo-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    className={`peer w-full border rounded-xl py-2.5 px-9 sm:px-10 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 text-slate-900 text-sm sm:text-base transition-all duration-200 ease-out ${
                      formErrors.password
                        ? "border-red-300 bg-red-50/80 ring-red-100"
                        : "border-slate-200 hover:border-slate-300 focus:shadow-sm"
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
                    className="absolute right-3 top-2.5 sm:top-3 inline-flex items-center justify-center rounded-full p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur border border-slate-100 shadow-lg rounded-2xl z-50 animate-fadeIn">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
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
                              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                isValid ? "bg-emerald-100" : "bg-slate-100"
                              }`}
                            >
                              {isValid ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <X className="w-3 h-3 text-slate-400" />
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                isValid ? "text-emerald-700" : "text-slate-600"
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
                  className="block text-slate-700 font-medium text-xs sm:text-sm mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors duration-200 peer-focus:text-indigo-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="con-password"
                    placeholder="Confirm password"
                    className={`peer w-full border rounded-xl py-2.5 px-9 sm:px-10 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 text-slate-900 text-sm sm:text-base transition-all duration-200 ease-out ${
                      formErrors.confirmPassword
                        ? "border-red-300 bg-red-50/80 ring-red-100"
                        : "border-slate-200 hover:border-slate-300 focus:shadow-sm"
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
                    className="absolute right-3 top-2.5 sm:top-3 inline-flex items-center justify-center rounded-full p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur border border-slate-100 shadow-lg rounded-2xl z-50 animate-fadeIn">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
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
                          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                            password === confirmPassword &&
                            confirmPassword.length > 0
                              ? "bg-emerald-100"
                              : "bg-slate-100"
                          }`}
                        >
                          {password === confirmPassword &&
                          confirmPassword.length > 0 ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <X className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            password === confirmPassword &&
                            confirmPassword.length > 0
                              ? "text-emerald-700"
                              : "text-slate-600"
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
              <label className="flex items-center space-x-2 text-slate-700 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3 h-3 sm:w-4 sm:h-4 accent-indigo-500 cursor-pointer rounded border-slate-300"
                  disabled={isLoading || isSuccess}
                />
                <span>Remember for 30 days</span>
              </label>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full font-semibold py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white disabled:opacity-80 disabled:cursor-not-allowed ${
                  isSuccess
                    ? "bg-emerald-500 text-white cursor-default shadow-md"
                    : isLoading
                    ? "bg-slate-200 text-slate-600 cursor-wait shadow-inner"
                    : "bg-indigo-500 text-white shadow-md hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
                }`}
              >
                {isSuccess ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce"
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
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4 sm:my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-slate-400 text-xs sm:text-sm tracking-wide uppercase">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Social Login */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex-1 border border-slate-200 rounded-xl py-2 sm:py-2.5 flex items-center justify-center gap-2 bg-white/70 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm disabled:shadow-none"
                  disabled={isLoading || isSuccess}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  className="flex-1 border border-slate-200 rounded-xl py-2 sm:py-2.5 flex items-center justify-center gap-2 bg-white/70 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm disabled:shadow-none"
                  disabled={isLoading || isSuccess}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
            <p className="text-center text-slate-500 text-xs sm:text-sm mt-4 sm:mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline-offset-4 hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
