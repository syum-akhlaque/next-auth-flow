"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.name && user.email) {
      console.log("inside dashboard page");
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="mb-2">
        <strong>Name:</strong> {user?.name}
      </p>
      <p className="mb-4">
        <strong>Email:</strong> {user?.email}
      </p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default DashboardPage;
