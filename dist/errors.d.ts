import { AxiosError } from 'axios';
declare enum ErrorType {
    AUTHENTICATION = "AUTHENTICATION",
    NOT_FOUND = "NOT_FOUND",
    RATE_LIMIT = "RATE_LIMIT",
    REQUEST = "REQUEST"
}
export declare class SpaceTradersError extends Error {
    code: number;
    error: Record<string, string>;
    axiosError: AxiosError;
    type: ErrorType;
    constructor(message: string, code: number, error: Record<string, string>, axiosError: AxiosError);
}
export declare class AuthenticationError extends SpaceTradersError {
    type: ErrorType;
}
export declare class NotFoundError extends SpaceTradersError {
    type: ErrorType;
}
export declare class RateLimitError extends SpaceTradersError {
    type: ErrorType;
}
export declare class RequestError extends SpaceTradersError {
    type: ErrorType;
}
export {};
