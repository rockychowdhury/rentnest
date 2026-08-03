import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getNewAccessToken } from "./service/refreshToken";
import { jwtUtils } from "@/lib/utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/properties"]

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const cookieStore = await cookies();

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;

    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null;

    if(!decodedAccessToken?.success && decodedRefreshToken?.success){
        //access token has expired but refresh token is valid, get new access token from backend
        const result = await getNewAccessToken();

        if(result.success){
            const newAccessToken = result.data.accessToken;

            cookieStore.set("accessToken", newAccessToken , {
                httpOnly : true,
                maxAge : 60 * 60 * 24,
                sameSite : "lax",
            });

            accessToken = newAccessToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);


        }
    }


    let userRole = null;

    if(!decodedAccessToken?.success){
        //token has expired or is invalid, clear the cookies
        cookieStore.delete("accessToken");
        // return NextResponse.redirect(new URL('/login', request.url));
    }

    if(decodedAccessToken?.success && decodedAccessToken.data){
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    // User is logged in with valid token and trying to access login or register page -> redirect to dashboard
    if (decodedAccessToken?.success && userRole && isAuthRoute) {
        if (userRole === "TENANT") {
            return NextResponse.redirect(new URL('/tenant-dashboard', request.url));
        } else if (userRole === "LANDLORD") {
            return NextResponse.redirect(new URL('/landlord-dashboard', request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    // Authenticated Pages Protection
    if ((!accessToken || !decodedAccessToken?.success) && !isPublicRoute && !isAuthRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authorization: Role based access control
    if (pathname.includes("tenant") && userRole !== "TENANT") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    } else if (pathname.includes("admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    } else if (pathname.includes("landlord") && userRole !== "LANDLORD") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)'
    ],
};


