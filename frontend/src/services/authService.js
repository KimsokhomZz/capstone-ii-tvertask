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
      if (token && userData) {
        localStorage.removeItem("hasLoggedOut"); // Clear logout flag
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true };
      } else {
        throw new Error("Missing token or user data");
      }
    } catch (error) {
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
        throw new Error("No token found");
      }
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Failed to fetch user data";

        // Only clear auth data if the token is actually invalid (401, 403)
        // Don't clear on network errors (500, etc.)
        if (response.status === 401 || response.status === 403) {
          this.clearAuthData();
        }

        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Only clear auth data for actual authentication errors, not network errors
      if (
        !(error.name === "TypeError" && error.message.includes("fetch")) &&
        !error.message.includes("Server error")
      ) {
        this.clearAuthData();
      }

      throw error;
    }
  }

  getToken() {
    try {
      const token = localStorage.getItem("token");
      return token;
    } catch (error) {
      return null;
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : null;
      return parsedUser;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    const hasLoggedOut = this.hasLoggedOut();

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
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const isHealthy = response.ok;
      return isHealthy;
    } catch (error) {
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
      throw error;
    }
  }
}

export default new AuthService();
