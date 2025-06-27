"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import VerifyEmailModal from "./VerifyEmailModal";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-6 -mt-md-20">
      <h1 className="text-2xl font-semibold mb-4">Welcome to Dashboard</h1>
      <p className="mb-2">
        <strong>Name:</strong> {user?.name}
      </p>
      <p className="mb-4">
        <strong>Email:</strong> {user?.email}
      </p>
      <Button onClick={logout} className="bg-purple-600 hover:bg-purple-700">
        Logout
      </Button>
      <VerifyEmailModal />
    </div>
  );
};

export default DashboardPage;
