"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const VerifyEmailModal = () => {
  const { user, accessToken, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && !user.isVerified) {
      const timer = setTimeout(() => setOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `https://api.vidinfra.com/v1/auth/verify/${user?.email}/${otp}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const contentType = res.headers.get("Content-Type");

      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          throw new Error(err.message || "OTP verification failed");
        } else {
          const text = await res.text();
          throw new Error(text || "Unexpected error");
        }
      }
      setSuccess("🎉 Email verified successfully!");
      if (user) {
        setUser({
          ...user,
          isVerified: true, // or get from API if returned
        });
      }
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to <strong>{user?.email}</strong>
          </p>

          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleVerifyOtp}
            disabled={!otp}
          >
            Verify Email
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyEmailModal;
