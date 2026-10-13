"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const fillCredentials = (role: "admin" | "landlord" | "tenant") => {
    setEmail(`${role}@gmail.com`);
    setPassword("password");
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-1">
          Quick Login As
        </span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => fillCredentials("tenant")}
            className="text-xs h-8"
          >
            Tenant
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => fillCredentials("landlord")}
            className="text-xs h-8"
          >
            Landlord
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => fillCredentials("admin")}
            className="text-xs h-8"
          >
            Admin
          </Button>
        </div>
      </div>

      <form action={action} className="space-y-4 w-full">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            className="font-medium text-primary hover:underline"
          >
            Register
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
