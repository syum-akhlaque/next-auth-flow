"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  name: string;
  email: string;
  isVerified?: boolean;
};
type ApiUserResult = {
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
};

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokenData: {
    access_token: string;
    refresh_token: string;
    result: ApiUserResult;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const pathname = usePathname();

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("https://api.vidinfra.com/v1/auth/profiles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      const { first_name, last_name, email, email_verified_at } = data.result;
      const user = {
        name: `${first_name} ${last_name}`,
        email: email,
        isVerified: email_verified_at ? true : false,
      };
      setUser(user);
    } catch (error) {
      console.error("Fetch user failed:", error);
      if (pathname === "/dashboard") {
        logout();
      }
    }
  };

  const login = ({
    access_token,
    refresh_token,
    result,
  }: {
    access_token: string;
    refresh_token: string;
    result: ApiUserResult;
  }) => {
    // Store tokens
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    const user = {
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
      isVerified: result.email_verified_at ? true : false,
    };
    setUser(user);
    router.push("/dashboard");
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      fetchUser(storedAccessToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        refreshToken,
        login,
        logout,
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
