import { RegisterType } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.vidinfra.com/v1";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.ok ? res.json() : null;
};

export const registerUserApi = async (payload: RegisterType) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok ? res.json() : null;
};

export const getProfile = async (token: string) => {
  const res = await fetch(`${API}/auth/profiles`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? await res.json() : null;
};

export const refreshTokenApi = async (token: string) => {
  const raw = JSON.stringify({
    refresh_token: token,
    remember_me: true,
  });
  const res = await fetch(`${API}/auth/refresh-auth-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw,
    redirect: "follow",
  });
  return res.ok ? await res.json() : null;
};

export const verifyOtpApi = async (
  email: string,
  otp: string,
  token: string
) => {
  const res = await fetch(
    `https://api.vidinfra.com/v1/auth/verify/${email}/${otp}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "OTP verification failed");
  }

  return res.json();
};
