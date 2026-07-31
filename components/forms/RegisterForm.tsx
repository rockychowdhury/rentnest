"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/app/(auth)/_actions/auth.actions";
import type { RegisterState } from "@/types";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {
    success: false,
    message: "",
  } as RegisterState);

  useEffect(() => {
    if (!state || !state.message || state.message === "NEXT_REDIRECT") return;

    if (state.success) {
      toast.success(state.message || "Registration successful!");
    } else {
      toast.error(state.message || "Registration failed");
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4 w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Rocky Chowdhury"
            required
            disabled={pending}
          />
        </div>

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
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="01633066719"
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a</Label>
          <select
            id="role"
            name="role"
            required
            disabled={pending}
            defaultValue="TENANT"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-card dark:text-foreground"
          >
            <option value="TENANT">Tenant (Looking for a property)</option>
            <option value="LANDLORD">Landlord (Renting out property)</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full mt-2" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Register"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign In
        </a>
      </div>
    </form>
  );
}

export default RegisterForm;
