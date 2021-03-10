export declare const asyncWrap: <T, E = Error>(promise: Promise<T>) => Promise<[E, T]>;
export declare const asyncSleep: (ms: number) => Promise<unknown>;
