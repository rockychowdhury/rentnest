import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const setAuthCookies = async (accessToken: string, refreshToken?: string) => {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        path: "/",
    });

    if (refreshToken) {
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
            path: "/",
        });
    }
};


export const redirectUserByRole = (role?: string, redirectTo?: string) => {
    if (redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
        redirect(redirectTo);
    }

    if (role === "TENANT") {
        redirect("/tenant-dashboard");
    } else if (role === "LANDLORD") {
        redirect("/landlord-dashboard");
    } else if (role === "ADMIN") {
        redirect("/admin-dashboard");
    } else {
        redirect("/dashboard");
    }
};
