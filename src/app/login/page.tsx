"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import {
  FaGoogle,
  FaGithub,
  FaRegCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login, user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const loginInfo = await login(data.email, data.password);
    if (loginInfo) router.push("/dashboard");
    else setError("Invalid credentials");
  };

  useEffect(() => {
    if (user && user.name) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col justify-center flex-grow">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Login to your demo account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Password</label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Sign In
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <FaGoogle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Google</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <FaGithub className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Github</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <FaRegCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Okta</span>
          </Button>
        </div>

        <p className="text-center mt-6 text-sm">
          New to Demo?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/register")}
          >
            Create Account
          </button>
        </p>

        <p className="text-xs text-center mt-4 text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Terms of Use
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
