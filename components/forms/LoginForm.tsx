"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/(auth)/_actions/auth.actions";
import type { LoginState } from "@/types";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";

  const [state, action, pending] = useActionState(
    loginAction.bind(null, redirectTo),
    {
      success: false,
      message: "",
    } as LoginState
  );

  useEffect(() => {
    if (!state || !state.message || state.message === "NEXT_REDIRECT") return;

    if (state.success) {
      toast.success(state.message || "Login successful!");
    } else {
      toast.error(state.message || "Login failed");
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4 w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tenant@gmail.com"
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={pending}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Register
        </a>
      </div>
    </form>
  );
}

export default LoginForm;
