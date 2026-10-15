import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { jwtUtils } from "@/lib/utils/jwt";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/verify-otp", "/reset-password"];

const PUBLIC_ROUTES = [
    "/",
    "/properties",
    "/about",
    "/contact",
    "/faq",
    "/for-landlords",
    "/how-it-works",
    "/privacy",
    "/terms",
    "/maintenance",
];

function isRouteMatch(pathname: string, routes: string[]) {
    return routes.some((route) => {
        if (route === "/") return pathname === "/";
        return pathname === route || pathname.startsWith(route + "/");
    });
}

function isDashboardPath(pathname: string, base: string) {
    return pathname === base || pathname.startsWith(base + "/");
}

function dashboardForRole(role: string | null) {
    if (role === "TENANT") return "/tenant-dashboard";
    if (role === "LANDLORD") return "/landlord-dashboard";
    if (role === "ADMIN") return "/admin-dashboard";
    return "/";
}

function requiredRoleForPath(pathname: string): string | null {
    if (isDashboardPath(pathname, "/tenant-dashboard")) return "TENANT";
    if (isDashboardPath(pathname, "/landlord-dashboard")) return "LANDLORD";
    if (isDashboardPath(pathname, "/admin-dashboard")) return "ADMIN";
    return null;
}

async function tryRefreshAccessToken(refreshToken: string | undefined) {
    if (!refreshToken) return null;
    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                Cookie: `refreshToken=${refreshToken}`,
            },
            cache: "no-store",
        });
        if (!res.ok) return null;
        const result = await res.json();
        if (result?.success && result?.data?.accessToken) {
            return result.data.accessToken as string;
        }
        return null;
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    let refreshedToken: string | null = null;

    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        // Access token expired but refresh token valid -> try refresh via backend
        refreshedToken = await tryRefreshAccessToken(refreshToken);
        if (refreshedToken) {
            accessToken = refreshedToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string);
        }
    }

    const persistAuthCookies = (response: NextResponse) => {
        if (refreshedToken) {
            response.cookies.set("accessToken", refreshedToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
                path: "/",
            });
        }
        if (!decodedAccessToken?.success && !decodedRefreshToken?.success) {
            // Both tokens invalid -> clear stale access token
            response.cookies.delete("accessToken");
        }
        return response;
    };

    const isAuthenticated = !!decodedAccessToken?.success;

    let userRole: string | null = null;
    if (decodedAccessToken?.success && decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role ?? null;
    }

    const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);
    const isPublicRoute = isRouteMatch(pathname, PUBLIC_ROUTES);

    // Logged-in user visiting auth pages -> send to dashboard (preserve redirectTo when safe)
    if (isAuthenticated && userRole && isAuthRoute) {
        const redirectTo = request.nextUrl.searchParams.get("redirectTo");
        const target =
            redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
                ? redirectTo
                : dashboardForRole(userRole);
        // Only honor redirectTo when role is allowed to visit it
        const needed = requiredRoleForPath(target);
        const finalTarget = needed && needed !== userRole ? dashboardForRole(userRole) : target;
        const res = NextResponse.redirect(new URL(finalTarget, request.url));
        return persistAuthCookies(res);
    }

    // Unauthenticated users can visit public + auth routes freely
    if (!isAuthenticated && (isPublicRoute || isAuthRoute)) {
        return persistAuthCookies(NextResponse.next());
    }

    // Unauthenticated users visiting protected pages -> login with redirectTo
    if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        const res = NextResponse.redirect(loginUrl);
        return persistAuthCookies(res);
    }

    // Authenticated role guard — exact dashboard-segment match only (no substring matching)
    const neededRole = requiredRoleForPath(pathname);
    if (neededRole && userRole !== neededRole) {
        // Never redirect to a non-existent /not-found page.
        // Send the user to their own dashboard instead of a 400/500 dead-end.
        const res = NextResponse.redirect(new URL(dashboardForRole(userRole), request.url));
        return persistAuthCookies(res);
    }

    return persistAuthCookies(NextResponse.next());
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)'
    ],
};


