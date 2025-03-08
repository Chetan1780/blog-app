import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RouteLogin } from "@/Helper/RouteName";
import { getEnv } from "@/Helper/getEnv";
import { showToast } from "@/Helper/ShowToast";
import GoogleLogin from "@/components/GoogleLogin";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const formSchema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters long!"),
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters long!"),
      confirm_password: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirm_password) {
        ctx.addIssue({
          path: ["confirm_password"],
          message: "Passwords do not match!",
        });
      }
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const resp = await fetch(`${getEnv("VITE_API_BACKEND_URL")}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await resp.json();
      if (!resp.ok) {
        showToast("error", resData.message);
        return;
      }

      showToast("success", resData.message);
      navigate(RouteLogin);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Create Your Account
        </h2>

        <GoogleLogin />

        <div className="flex items-center">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-3 text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg dark:border-gray-600 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg dark:border-gray-600 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg dark:border-gray-600 dark:text-white"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm password"
                      type="password"
                      className="w-full bg-transparent outline-none p-3 border rounded-lg dark:border-gray-600 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </Form>

        <div className="text-gray-500 dark:text-gray-400 text-center">
          <span>Already have an account? </span>
          <Link to={RouteLogin} className="text-blue-500 hover:underline dark:text-blue-400">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
