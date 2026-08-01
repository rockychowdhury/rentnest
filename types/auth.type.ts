export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type LoginState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: {
        accessToken: string;
        refreshToken?: string;
    };
};

export type RegisterState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: any;
};
