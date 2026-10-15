import jwt from "jsonwebtoken";


const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        };
    } catch (error: unknown) {
        // Verification failure is normal control flow (expired / signed
        // with a rotated secret / absent). Never log here: this runs on
        // every proxied request and would spam the server logs.
        return {
            success: false,
            error: error instanceof Error ? error.message : "Invalid token"
        }
    }
}


export const jwtUtils = {
    verifyToken
}
