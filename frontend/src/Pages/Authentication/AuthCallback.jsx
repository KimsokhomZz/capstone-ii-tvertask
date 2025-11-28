import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../../context/AuthContext.jsx";
import authService from "../../services/authService";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
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
      navigate("/login?error=OAuth authentication failed", { replace: true });
      return;
    }

    if (token && userString) {
      try {
        console.log(
          "[AUTH DEBUG] OAuth callback: Processing authentication data",
          {
            hasToken: !!token,
            userDataLength: userString?.length,
          }
        );

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userString));

        console.log(
          "[AUTH DEBUG] OAuth callback: User data parsed successfully"
        );

        // Store authentication data using authService
        authService.handleOAuthCallback(userData, token);

        // Use AuthContext to set authentication state
        setAuthState(userData, token);

        console.log(
          "[AUTH DEBUG] OAuth callback: Authentication state set, redirecting to dashboard"
        );

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("[AUTH ERROR] OAuth callback processing failed:", error);
        navigate("/login?error=Authentication processing failed", {
          replace: true,
        });
      }
    } else {
      // No token received, redirect to login
      navigate("/login?error=No authentication token received", {
        replace: true,
      });
    }
  }, [searchParams, navigate, setAuthState]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
