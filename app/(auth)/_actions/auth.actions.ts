"use server"

import jwt, { JwtPayload } from "jsonwebtoken"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { API_BASE_URL } from "@/lib/api"
import { loginPayloadSchema, registerPayloadSchema } from "@/lib/validators/auth.validator"
import { validateInput } from "@/lib/validators/validateInput"
import { setAuthCookies, redirectUserByRole } from "@/lib/utils/authUtils"
import type { LoginState, RegisterState } from "@/types"

const handleActionError = (error: any, fallbackMessage: string) => {
    if (isRedirectError(error) || error?.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
    }
    return {
        success: false,
        message: error.message || fallbackMessage,
    };
};

const performLogin = async (email: string, password: string, redirectTo?: string): Promise<LoginState> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (result.success && result.data?.accessToken) {
        await setAuthCookies(result.data.accessToken, result.data.refreshToken);
        const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload;
        const role = decodedToken?.role || result.data.user?.role;
        redirectUserByRole(role, redirectTo);
    }

    return result;
};

export const loginAction = async (redirectTo: string, prevState: LoginState, formData: FormData): Promise<LoginState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = await validateInput(loginPayloadSchema, { email, password });
    if (!validation.success) {
        return { success: false, message: validation.message };
    }

    try {
        return await performLogin(validation.data.email, validation.data.password, redirectTo);
    } catch (error: any) {
        return handleActionError(error, "An unexpected error occurred during login");
    }
};

export const registerAction = async (prevState: RegisterState, formData: FormData): Promise<RegisterState> => {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    const validation = await validateInput(registerPayloadSchema, {
        fullName,
        email,
        phone,
        password,
        role,
    });

    if (!validation.success) {
        return { success: false, message: validation.message };
    }

    try {
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validation.data),
        });

        const result = await res.json();

        if (result.success) {
            return await performLogin(validation.data.email, validation.data.password);
        }

        return result;
    } catch (error: any) {
        return handleActionError(error, "An unexpected error occurred during registration");
    }
};
