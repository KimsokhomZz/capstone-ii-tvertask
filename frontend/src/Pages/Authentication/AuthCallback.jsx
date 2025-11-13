import React, { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get("token");
    const userString = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      // Handle authentication error
      window.location.replace("/login?error=Google authentication failed");
      return;
    }

    if (token && userString) {
      try {
        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userString));

        // Store token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to dashboard using window.location.replace to avoid history issues
        window.location.replace("/dashboard");
      } catch (error) {
        window.location.replace(
          "/login?error=Authentication processing failed"
        );
      }
    } else {
      // No token received, redirect to login
      window.location.replace("/login?error=No authentication token received");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Almost there!
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Completing Google sign in...
          </p>
          <div className="mt-6 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
