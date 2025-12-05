import React from "react";
import { Navigate, useLocation } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../context/AuthContext.js";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const location = useLocation();

  console.log("[PROTECTED ROUTE DEBUG]", {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    hasToken: !!token,
    path: location.pathname,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  // Additional check: if we have token and user but isAuthenticated is false,
  // there might be a temporary issue, so show loading a bit longer
  if (!isAuthenticated && token && user) {
    console.log(
      "[PROTECTED ROUTE DEBUG] Has token and user but not authenticated, giving more time..."
    );
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="ml-4 text-gray-600">Validating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "[PROTECTED ROUTE DEBUG] Not authenticated, redirecting to login"
    );
    // Redirect to login page with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  console.log(
    "[PROTECTED ROUTE DEBUG] Authenticated, rendering protected content"
  );
  return <>{children}</>;
};

export default ProtectedRoute;
