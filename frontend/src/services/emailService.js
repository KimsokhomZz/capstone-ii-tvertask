// Email validation service
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class EmailService {
  /**
   * Check if email is available for registration or profile update
   * @param {string} email - Email to check
   * @param {string} [currentUserId] - Current user ID (for profile updates)
   * @returns {Promise<{available: boolean, message?: string}>}
   */
  async checkEmailAvailability(email, currentUserId = null) {
    try {
      const response = await fetch(`${API_URL}/api/users/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          currentUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          available: data.available,
          message: data.message,
        };
      } else {
        return {
          available: false,
          message: data.message || "Email is already in use",
        };
      }
    } catch (error) {
      console.error("Email availability check failed:", error);
      return {
        available: false,
        message: "Unable to verify email availability. Please try again.",
      };
    }
  }

  /**
   * Validate email format and check availability with debouncing
   * @param {string} email - Email to validate
   * @param {string} [currentUserId] - Current user ID (for profile updates)
   * @param {number} [delay=500] - Debounce delay in milliseconds
   * @returns {Promise<{valid: boolean, available: boolean, message?: string}>}
   */
  async validateEmailWithAvailability(
    email,
    currentUserId = null,
    delay = 500
  ) {
    // Basic format validation first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomainRegex =
      /^[^\s@]+@[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      return {
        valid: false,
        available: false,
        message: "Email is required",
      };
    }

    if (email.length > 254) {
      return {
        valid: false,
        available: false,
        message: "Email address is too long",
      };
    }

    if (!emailRegex.test(email)) {
      return {
        valid: false,
        available: false,
        message: "Please enter a valid email address",
      };
    }

    if (!validDomainRegex.test(email)) {
      return {
        valid: false,
        available: false,
        message: "Please enter a valid email domain",
      };
    }

    // Check for consecutive dots
    if (email.includes("..")) {
      return {
        valid: false,
        available: false,
        message: "Email address cannot contain consecutive dots",
      };
    }

    // Check for invalid characters
    if (/[<>()\[\]\\,;:\s@"]/.test(email.split("@")[0])) {
      return {
        valid: false,
        available: false,
        message: "Email contains invalid characters",
      };
    }

    // Check for common typos
    const domain = email.split("@")[1]?.toLowerCase();
    const suggestions = {
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "yahooo.com": "yahoo.com",
      "hotmial.com": "hotmail.com",
      "outlok.com": "outlook.com",
    };

    if (suggestions[domain]) {
      return {
        valid: false,
        available: false,
        message: `Did you mean ${email.split("@")[0]}@${suggestions[domain]}?`,
      };
    }

    // Email format is valid, now check availability
    const availabilityResult = await this.checkEmailAvailability(
      email,
      currentUserId
    );

    return {
      valid: true,
      available: availabilityResult.available,
      message: availabilityResult.message,
    };
  }
}

export default new EmailService();
