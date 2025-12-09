import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import authService from "../services/authService";

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [authRetryCount, setAuthRetryCount] = useState(0);
  const maxRetries = 2;

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getUser();
        const hasLoggedOut = authService.hasLoggedOut();

        console.log("[AUTH DEBUG] Initializing auth state:", {
          hasToken: !!token,
          hasUser: !!user,
          hasLoggedOut,
        });

        // If user has explicitly logged out, don't auto-login
        if (hasLoggedOut) {
          console.log(
            "[AUTH DEBUG] User has logged out flag, clearing and not auto-logging in"
          );
          authService.clearLogoutFlag();
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          return;
        }

        if (token && user) {
          console.log(
            "[AUTH DEBUG] Token and user found, fetching fresh user data..."
          );

          // Always fetch fresh user data from server to get latest bio and location
          try {
            const freshUserResponse = await authService.getCurrentUser();
            console.log("[AUTH DEBUG] Fresh user data fetched successfully");

            // Update localStorage with fresh data
            localStorage.setItem(
              "user",
              JSON.stringify(freshUserResponse.data)
            );

            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: freshUserResponse.data, token },
            });
          } catch (error) {
            console.error(
              "[AUTH DEBUG] Failed to fetch fresh user data:",
              error.message
            );

            // Check if it's a network error or server error
            if (
              error.message.includes("fetch") ||
              error.message.includes("Server error")
            ) {
              console.log(
                "[AUTH DEBUG] Network/server error, using cached user data for now."
              );
              // Keep user logged in with cached data
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { user, token },
              });
            } else {
              console.log(
                "[AUTH DEBUG] Authentication error, clearing auth data"
              );
              authService.clearAuthData();
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
          }
        } else {
          console.log(
            "[AUTH DEBUG] No token or user found, user is not authenticated"
          );
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error("[AUTH ERROR] Error initializing auth:", error);
        // Don't clear auth data on initialization errors unless it's clearly an auth issue
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.login(credentials);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authService.register(userData);

      // Check if email verification is required
      if (response.data?.requiresVerification) {
        // Don't set auth state yet, just return the response
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return response;
      }

      // For immediate login (social auth or if verification is bypassed)
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      // Silent error handling - Even if logout fails, clear local state
      authService.logout(); // Ensure cleanup
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Set auth state directly (for Google OAuth callback)
  const setAuthState = (userData, token) => {
    // Save to localStorage for persistence
    if (token && userData) {
      console.log(
        "[AUTH DEBUG] OAuth setAuthState: Saving token and user to localStorage"
      );
      localStorage.removeItem("hasLoggedOut"); // Clear logout flag
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: {
        user: userData,
        token: token,
      },
    });
  };

  // Refresh user data from server and update both localStorage and context state
  const refreshUserData = async () => {
    try {
      console.log("[AUTH DEBUG] Refreshing user data from server...");

      const response = await authService.getCurrentUser();
      if (response && response.data) {
        const updatedUser = response.data;

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update AuthContext state
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: updatedUser,
            token: state.token, // Keep existing token
          },
        });

        console.log("[AUTH DEBUG] User data refreshed successfully");
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error("[AUTH ERROR] Failed to refresh user data:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    setAuthState,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
