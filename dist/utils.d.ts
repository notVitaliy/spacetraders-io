import { AxiosError } from 'axios';
export declare const asyncWrap: <T, E = AxiosError<any>>(promise: Promise<T>) => Promise<[E, T]>;
export declare const asyncSleep: (ms: number) => Promise<unknown>;
