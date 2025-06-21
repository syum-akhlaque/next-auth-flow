"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RegisterFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  newsletter: boolean;
};

const RegisterPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, ...apiPayload } = data;

    try {
      const res = await fetch("https://api.vidinfra.com/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Registration failed");
      }

      const tokens = await res.json();
      login(tokens); // auto-login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">First Name</label>
          <Input
            type="text"
            {...register("first_name", {
              required: "First name is required",
              maxLength: { value: 255, message: "Max 255 characters" },
            })}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Last Name</label>
          <Input
            type="text"
            {...register("last_name", {
              required: "Last name is required",
              maxLength: { value: 255, message: "Max 255 characters" },
            })}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <Input
            type="email"
            {...register("email", {
              required: "Email is required",
              minLength: { value: 5, message: "Too short" },
              maxLength: { value: 100, message: "Too long" },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <Input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                message:
                  "Must include uppercase, lowercase, number, and symbol",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Confirm Password
          </label>
          <Input
            type="password"
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="newsletter"
            type="checkbox"
            {...register("newsletter", {
              required: "You must accept the terms",
            })}
          />
          <label htmlFor="newsletter" className="text-sm">
            Do you subscribe newsletter ?
          </label>
        </div>
        {errors.newsletter && (
          <p className="text-red-500 text-sm">{errors.newsletter.message}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
