const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("=========[AUTH DEBUG] API_BASE_URL set to:", API_BASE_URL);

class AuthService {
  // Google OAuth login
  loginWithGoogle() {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  // Facebook OAuth login
  loginWithFacebook() {
    // Redirect to backend Facebook OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  }

  // Handle OAuth callback token storage
  handleOAuthCallback(userData, token) {
    try {
      console.log("[AUTH DEBUG] OAuth callback: Storing authentication data");

      if (token && userData) {
        localStorage.removeItem("hasLoggedOut"); // Clear logout flag
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        console.log("[AUTH DEBUG] OAuth callback: Data stored successfully");
        return { success: true };
      } else {
        throw new Error("Missing token or user data");
      }
    } catch (error) {
      console.error("[AUTH ERROR] OAuth callback storage failed:", error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // For email verification flow, don't store token yet
      if (data.data?.requiresVerification) {
        return data;
      }

      // Store token in localStorage (for social auth, auto-verification, or if verification is bypassed)
      if (data.data?.token) {
        localStorage.removeItem("hasLoggedOut"); // Clear logout flag on successful login
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.removeItem("hasLoggedOut"); // Clear logout flag on successful login
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      // Set logout flag to prevent auto-login on page reload
      localStorage.setItem("hasLoggedOut", "true");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear data even if there's an error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.setItem("hasLoggedOut", "true");
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        console.log("[AUTH DEBUG] No token found in localStorage");
        throw new Error("No token found");
      }

      console.log("[AUTH DEBUG] Making request to validate token...");
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("[AUTH DEBUG] Token validation response:", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorMessage = data.message || "Failed to fetch user data";
        console.log("[AUTH DEBUG] Token validation failed:", errorMessage);

        // Only clear auth data if the token is actually invalid (401, 403)
        // Don't clear on network errors (500, etc.)
        if (response.status === 401 || response.status === 403) {
          console.log("[AUTH DEBUG] Token invalid, clearing auth data");
          this.clearAuthData();
        } else {
          console.log("[AUTH DEBUG] Server error, keeping token for retry");
        }

        throw new Error(errorMessage);
      }

      console.log("[AUTH DEBUG] Token validation successful");
      return data;
    } catch (error) {
      console.error("[AUTH ERROR] Get current user error:", error);

      // Only clear auth data for actual authentication errors, not network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.log(
          "[AUTH DEBUG] Network error detected, not clearing auth data"
        );
      } else if (!error.message.includes("Server error")) {
        console.log("[AUTH DEBUG] Auth error, clearing auth data");
        this.clearAuthData();
      }

      throw error;
    }
  }

  getToken() {
    try {
      const token = localStorage.getItem("token");
      console.log("[AUTH DEBUG] Getting token from localStorage:", !!token);
      return token;
    } catch (error) {
      console.error(
        "[AUTH ERROR] Failed to access localStorage for token:",
        error
      );
      return null;
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      console.log("[AUTH DEBUG] Getting user from localStorage:", !!parsedUser);
      return parsedUser;
    } catch (error) {
      console.error(
        "[AUTH ERROR] Failed to access localStorage for user:",
        error
      );
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    const hasLoggedOut = this.hasLoggedOut();

    console.log("[AUTH DEBUG] Checking authentication status:", {
      hasToken: !!token,
      hasUser: !!user,
      hasLoggedOut,
      isAuthenticated: !!(token && user && !hasLoggedOut),
    });

    return !!(token && user && !hasLoggedOut);
  }

  hasLoggedOut() {
    return localStorage.getItem("hasLoggedOut") === "true";
  }

  clearLogoutFlag() {
    localStorage.removeItem("hasLoggedOut");
  }

  clearAuthData() {
    // Clear auth data without setting logout flag (for automatic cleanup)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Check if backend is reachable
  async checkBackendHealth() {
    try {
      console.log("[AUTH DEBUG] Checking backend health...");
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const isHealthy = response.ok;
      console.log("[AUTH DEBUG] Backend health check:", {
        isHealthy,
        status: response.status,
      });
      return isHealthy;
    } catch (error) {
      console.error("[AUTH DEBUG] Backend health check failed:", error);
      return false;
    }
  }

  async verifyEmail(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed");
      }

      // Store token and user data after successful verification
      if (data.data?.token) {
        localStorage.removeItem("hasLoggedOut"); // Clear logout flag on successful login
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  async resendVerification(email) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }

      return data;
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to process password reset request"
        );
      }

      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }
}

export default new AuthService();
