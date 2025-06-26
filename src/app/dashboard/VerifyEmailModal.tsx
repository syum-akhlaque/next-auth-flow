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
  const { user, verifyOtp } = useAuth();
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
    const res = await verifyOtp(otp);
    if (res) {
      setSuccess("Email verified successfully!");
      setOpen(false);
    } else setError("OTP verification failed");
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
