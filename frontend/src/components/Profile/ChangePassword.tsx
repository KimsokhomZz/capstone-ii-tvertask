import { useState } from "react";
import { Eye, EyeOff, Lock, Check, X, Shield } from "lucide-react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    {
      label: "Contains uppercase letter",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    { label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
    {
      label: "Contains special character",
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage("");
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const isNewPasswordValid = () => {
    return passwordRequirements.every((req) => req.test(formData.newPassword));
  };

  const doPasswordsMatch = () => {
    return (
      formData.newPassword === formData.confirmPassword &&
      formData.confirmPassword !== ""
    );
  };

  const canSubmit = () => {
    return (
      formData.currentPassword !== "" &&
      isNewPasswordValid() &&
      doPasswordsMatch() &&
      !isLoading
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.message || "Failed to change password");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Change Password</h2>

      {message && (
        <div
          className={`mb-6 p-5 rounded-xl shadow-md ${
            message.includes("successfully")
              ? "bg-green-50 text-green-800 border-2 border-green-300"
              : "bg-red-50 text-red-800 border-2 border-red-300"
          }`}
        >
          <p className="font-medium text-base">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Current Password */}
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-base font-semibold text-gray-700 mb-3"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 pr-12 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="relative">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              onFocus={() => setIsNewPasswordFocused(true)}
              onBlur={() => setIsNewPasswordFocused(false)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Password Requirements - Floating */}
          {formData.newPassword && isNewPasswordFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-lg z-50 animate-fadeIn">
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                Password Requirements:
              </h4>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => {
                  const isValid = req.test(formData.newPassword);
                  return (
                    <div key={index} className="flex items-center space-x-2">
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
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.confirmPassword && !doPasswordsMatch()
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Confirm Password Requirements - Floating */}
          {formData.confirmPassword && isConfirmPasswordFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-lg z-50 animate-fadeIn">
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                Password Requirements:
              </h4>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => {
                  const isValid = req.test(formData.confirmPassword);
                  return (
                    <div key={index} className="flex items-center space-x-2">
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
                      doPasswordsMatch() ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {doPasswordsMatch() ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      doPasswordsMatch() ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Passwords match
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 pt-6">
          <button
            type="submit"
            disabled={!canSubmit()}
            className="flex items-center space-x-3 px-8 py-3.5 text-base font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            <Lock className="w-5 h-5" />
            <span>{isLoading ? "Changing..." : "Change Password"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setMessage("");
            }}
            className="px-6 py-3.5 text-base font-semibold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-10 p-7 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 shadow-md">
        <h4 className="font-bold text-blue-900 mb-5 text-lg flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Tips:
        </h4>
        <ul className="text-base text-blue-800 space-y-3">
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 font-bold">•</span>
            <span>Use a unique password that you don't use elsewhere</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 font-bold">•</span>
            <span>Consider using a password manager</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 font-bold">•</span>
            <span>Never share your password with anyone</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-3 font-bold">•</span>
            <span>Change your password regularly</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;
