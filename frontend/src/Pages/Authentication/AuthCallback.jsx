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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google sign in...</p>
      </div>
    </div>
  );
}
