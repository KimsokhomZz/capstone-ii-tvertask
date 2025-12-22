import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

import LocationInput from "../ui/LocationInput";
// @ts-ignore
import emailService from "../../services/emailService";

interface EditProfileProps {
  user: any;
  onUpdate: () => void;
}

const EditProfile = ({ user, onUpdate }: EditProfileProps) => {
  const { refreshUserData } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);
  const emailCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Track if form has been initialized to prevent unnecessary resets
  const isInitializedRef = useRef(false);

  // Enhanced email validation function
  const validateEmail = (email: string) => {
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
    const domain = email.split("@")[1]?.toLowerCase();
    const suggestions: Record<string, string> = {
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "yahooo.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "outlok.com": "outlook.com",
    };

    const localPart = email.split("@")[0];
    const suggestion = domain ? suggestions[domain] : undefined;

    if (suggestion) {
      return `Did you mean ${localPart}@${suggestion}?`;
    }

    return null;
  };

  // Debounced email availability check
  const checkEmailAvailability = useCallback(
    async (emailValue: string) => {
      if (
        !emailValue ||
        validateEmail(emailValue) ||
        emailValue.toLowerCase() === user?.email?.toLowerCase()
      ) {
        setEmailCheckStatus(null);
        return;
      }

      setEmailCheckStatus("checking");

      try {
        const result = await emailService.checkEmailAvailability(
          emailValue,
          user?.id
        );

        if (result.available) {
          setEmailCheckStatus("available");
          setEmailError("");
        } else {
          setEmailCheckStatus("taken");
          setEmailError(result.message || "This email is already in use");
        }
      } catch (error) {
        setEmailCheckStatus(null);
        console.error("Email check failed:", error);
      }
    },
    [user?.email, user?.id]
  );

  // Handle email change with debouncing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;

    // Update form data directly without calling handleInputChange
    setFormData((prev) => ({
      ...prev,
      email: emailValue,
    }));

    // Clear previous timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Clear existing errors immediately for better UX
    if (emailError) {
      setEmailError("");
    }

    // Set new timeout for email checking
    if (
      emailValue.trim() &&
      emailValue.toLowerCase() !== user?.email?.toLowerCase()
    ) {
      emailCheckTimeoutRef.current = setTimeout(() => {
        checkEmailAvailability(emailValue.trim().toLowerCase());
      }, 800);
    } else {
      setEmailCheckStatus(null);
    }
  };

  // Update form data when user prop changes ONLY on initial mount or after successful save
  useEffect(() => {
    // Only update if not initialized OR if message indicates successful save
    if (!isInitializedRef.current || message.includes("successfully")) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        location: user?.location || "",
      });
      isInitializedRef.current = true;
    }
  }, [user, message]); // Added message dependency to reset after successful save

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setEmailError("");

    // Validate email before submission
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setIsLoading(false);
      return;
    }

    // Check if email is being changed and if it's still being verified
    if (formData.email.toLowerCase() !== user?.email?.toLowerCase()) {
      if (emailCheckStatus === "checking") {
        setEmailError("Please wait while we verify email availability");
        setIsLoading(false);
        return;
      }

      if (emailCheckStatus === "taken") {
        setEmailError("This email is already in use");
        setIsLoading(false);
        return;
      }

      if (emailCheckStatus !== "available") {
        setEmailError("Please wait for email verification to complete");
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");

        console.log(
          "[EDIT PROFILE DEBUG] Profile updated successfully, refreshing data..."
        );
        console.log("[EDIT PROFILE DEBUG] Updated form data:", formData);

        // Update user data in AuthContext to keep state synced
        const refreshResult = await refreshUserData();
        if (!refreshResult.success) {
          console.warn(
            "Failed to refresh user data in AuthContext:",
            refreshResult.error
          );
          // Fallback: update localStorage directly
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = { ...currentUser, ...formData };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          console.log(
            "[EDIT PROFILE DEBUG] Updated localStorage as fallback:",
            updatedUser
          );
        } else {
          console.log(
            "[EDIT PROFILE DEBUG] AuthContext refresh successful:",
            refreshResult.user
          );
        }

        // Call parent onUpdate to refresh Profile component
        onUpdate();

        // Reset initialization flag to allow form reset with new data
        isInitializedRef.current = false;
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Edit Profile
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-md ${
            message.includes("successfully")
              ? "bg-green-50 text-green-800 border-2 border-green-300"
              : "bg-red-50 text-red-800 border-2 border-red-300"
          }`}
        >
          <p className="font-medium text-base">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700 dark:text-white mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-[#1d2942] dark:text-white dark:border-[#2a3f5f] dark:placeholder:text-gray-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 dark:text-white mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  emailError || emailCheckStatus === "taken"
                    ? "border-red-300 bg-red-50 dark:bg-[#1d2942]"
                    : emailCheckStatus === "available"
                    ? "border-green-300 bg-green-50 dark:bg-[#1d2942]"
                    : "border-gray-300 dark:bg-[#1d2942]"
                } dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300`}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {emailCheckStatus === "checking" && (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
                {emailCheckStatus === "available" && (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {(emailCheckStatus === "taken" || emailError) && (
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            {emailError && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {emailError}
              </p>
            )}
            {emailCheckStatus === "available" && !emailError && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                ✓ Email is available
              </p>
            )}
            {emailCheckStatus === "checking" && (
              <p className="mt-2 text-sm text-blue-600 font-medium">
                Checking availability...
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-bold text-gray-700 dark:text-white mb-2"
            >
              Location
            </label>
            <LocationInput
              id="location"
              name="location"
              value={formData.location}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  location: value,
                }))
              }
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-[#1d2942] dark:text-white dark:border-[#2a3f5f] dark:placeholder:text-gray-300"
              placeholder="City, Country"
            />
          </div>

          <div></div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-bold text-gray-700 dark:text-white mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none dark:bg-[#1d2942] dark:text-white dark:border-[#2a3f5f] dark:placeholder:text-gray-300"
            placeholder="Tell us about yourself..."
            maxLength={500}
          />
          <p className="mt-2 text-sm text-gray-500 font-medium text-right dark:text-gray-300">
            {formData.bio.length}/500 characters
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: user?.name || "",
                email: user?.email || "",
                bio: user?.bio || "",
                location: user?.location || "",
              });
              setMessage("");
            }}
            className="px-6 py-2.5 text-base font-bold text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-200 transition-all"
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 text-base font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
