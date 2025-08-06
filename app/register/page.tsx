"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(5).max(40),
});

const RegisterPage = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { user, signUpUser } = useUser() || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    console.log("Form submitted with values:", values);
    setLoading(true);
    setError("");
    try {
      await signUpUser?.(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User registered successfully, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your details to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-11 border-gray-300 focus:border-yellow-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="h-11 border-gray-300 focus:border-yellow-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-yellow-600 hover:bg-yellow-700 text-white font-medium disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
