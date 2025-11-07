declare module "@/context/AuthContext" {
  export interface AuthContextType {
    user: {
      id: number;
      name: string;
      email: string;
      avatarUrl: string;
      googleId: string;
      facebookId: string | null;
      isEmailVerified: boolean;
      emailVerificationToken: string | null;
      emailVerificationExpires: string | null;
      resetPasswordToken: string | null;
      resetPasswordExpires: string | null;
      createdAt: string;
      updatedAt: string;
    } | null;
    token?: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
    login: Function;
    register: Function;
    logout: Function;
    clearError: Function;
    setAuthState: Function;
  }

  const AuthContext: any;
  export default AuthContext;
  export const useAuth: any;
}
