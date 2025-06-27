"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProfile,
  loginUser,
  refreshTokenApi,
  registerUserApi,
  verifyOtpApi,
} from "../services/api";

type User = {
  name: string;
  email: string;
  isVerified?: boolean;
};

export type RegisterType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  newsletter: boolean;
};

export type updateUserType = {
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: boolean;
};

export type AuthContextType = {
  user: User | null;
  registerUser: (payload: RegisterType) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  verifyOtp: (opt: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const setRefreshCookie = (token: string) => {
  // store for 7 days
  document.cookie = `refresh_token=${token}; path=/; max-age=${
    60 * 60 * 24 * 7
  }; secure; samesite=strict`;
};

const getRefreshCookie = (): string | null => {
  const cookies = document.cookie.split("; ");
  const token = cookies.find((c) => c.startsWith("refresh_token="));
  return token ? token.split("=")[1] : null;
};

const clearRefreshCookie = () => {
  document.cookie =
    "refresh_token=; path=/; max-age=0; secure; samesite=strict";
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const storeAuthTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    setRefreshCookie(refresh);
    setAccessToken(access);
  };

  const handleUpdateUser = ({
    first_name,
    last_name,
    email,
    email_verified_at,
  }: updateUserType) => {
    const user = {
      name: `${first_name} ${last_name}`,
      email: email,
      isVerified: email_verified_at ? true : false,
    };
    setUser(user);
  };

  const checkAuth = async (access_token: string, refresh_token: string) => {
    if (!access_token) return false;
    let profile = await getProfile(access_token);
    if (!profile) {
      const refreshed = await refreshTokenApi(refresh_token);
      if (refreshed) {
        storeAuthTokens(refreshed.access_token, refreshed.refresh_token);
        profile = await getProfile(refreshed.access_token);
      }
    }

    if (profile) {
      handleUpdateUser(profile.result);
      return true;
    }
    logout();
    return false;
  };

  const registerUser = async (payload: RegisterType): Promise<boolean> => {
    const { email, password } = payload;
    try {
      const res = await registerUserApi(payload);
      if (res.success) {
        const loginResult = await login(email, password);
        return !!loginResult;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res) {
      storeAuthTokens(res.access_token, res.refresh_token);
      handleUpdateUser(res.result);
      return true;
    }
    return false;
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    clearRefreshCookie();
    router.push("/login");
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (user && accessToken) {
      try {
        const res = await verifyOtpApi(user.email, otp, accessToken);
        if (res.success) {
          setUser((prev) => (prev ? { ...prev, isVerified: true } : prev));
          return true;
        }
        return false;
      } catch (err) {
        console.error("OTP verification error:", err);
        return false;
      }
    } else return false;
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = getRefreshCookie();
    setAccessToken(storedAccessToken);

    if (storedAccessToken && storedRefreshToken) {
      checkAuth(storedAccessToken, storedRefreshToken).then(() => {
        setLoading(false);
      });
    } else {
      logout();
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerUser,
        logout,
        verifyOtp,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
