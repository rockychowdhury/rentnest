'use server'

import { cookies } from "next/headers"

export const getMe = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
        return {
            success: false,
            message: "You are not logged in!"
        };
    }

}