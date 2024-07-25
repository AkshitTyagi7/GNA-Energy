export interface ApiResponse {
    status: boolean;
    message?: string;
    [key: string]: any;
}