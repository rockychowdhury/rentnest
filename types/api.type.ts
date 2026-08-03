export type ApiResponse<T = any> = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    meta?: any;
    name?: string;
    error?: any;
};
