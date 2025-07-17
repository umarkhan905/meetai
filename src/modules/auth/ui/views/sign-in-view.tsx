"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { error: "Password is required" }),
});

type Loading = "email" | "google" | "github";

export function SignInView() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<Loading | null>(null);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setLoading("email");
    setGlobalLoading(true);

    // Sign in with email
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setLoading(null);
          setGlobalLoading(false);

          toast.success("Signed in successfully", { id: "sign-in-success" });
          router.push("/");
        },
        onError: ({ error }) => {
          setLoading(null);
          setGlobalLoading(false);
          setError(error.message ?? "Something went wrong");
        },
      }
    );
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError(null);
    setLoading(provider);
    setGlobalLoading(true);
    await authClient.signIn.social(
      {
        provider,
      },
      {
        onSuccess: () => {
          setLoading(null);
          setGlobalLoading(false);
          toast.success("Signed in successfully", { id: "sign-in-success" });
        },
        onError: ({ error }) => {
          setLoading(null);
          setGlobalLoading(false);
          setError(error.message ?? "Something went wrong");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Login to your account
                  </p>
                </div>

                {/* Inputs */}
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            disabled={globalLoading}
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            disabled={globalLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Error Alert */}
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="size-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                {/* Sign in button */}
                <Button
                  className="w-full"
                  type="submit"
                  disabled={globalLoading}
                >
                  {loading === "email" ? (
                    <Loader2 className="animate-spin size-5" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Separator */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                {/* Social login */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={globalLoading}
                    onClick={() => handleSocialLogin("google")}
                  >
                    {loading === "google" ? (
                      <Loader2 className="animate-spin size-5" />
                    ) : (
                      <FaGoogle />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={globalLoading}
                    onClick={() => handleSocialLogin("github")}
                  >
                    {loading === "github" ? (
                      <Loader2 className="animate-spin size-5" />
                    ) : (
                      <FaGithub />
                    )}
                  </Button>
                </div>

                {/* No account */}
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          {/* Image */}
          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
}
