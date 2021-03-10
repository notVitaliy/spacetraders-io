import { AccountResponse, AvailableLoanResponse, AvailableShipResponse, FlightPlanResponse, LoanType, LocationsResponse, MarketplaceResponse, PurchaseResponse, StatusResponse } from './types';
interface Options {
    useSharedLimiter?: boolean;
    maxRetries?: number;
}
interface LimiterOptions {
    maxConcurrent?: number;
    minTime?: number;
}
export declare class SpaceTraders {
    private static limiter;
    private limiter;
    private maxRetries;
    private token;
    private username;
    private useSharedLimiter;
    constructor(options?: Options, limiterOptions?: LimiterOptions);
    init(username: string, token?: string): Promise<string>;
    getStatus(): Promise<StatusResponse>;
    getAccount(): Promise<AccountResponse>;
    viewAvailableLoans(): Promise<AvailableLoanResponse>;
    viewAvailableShips(): Promise<AvailableShipResponse>;
    takeOutLoan(type: LoanType): Promise<AccountResponse>;
    payBackLoan(loanId: string): Promise<AccountResponse>;
    purchaseShip(location: string, type: string): Promise<AccountResponse>;
    purchaseGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse>;
    sellGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse>;
    listLocations(system?: string, type?: string): Promise<LocationsResponse>;
    getMarketplace(location: string): Promise<MarketplaceResponse>;
    getFlightPlan(flightId: string): Promise<FlightPlanResponse>;
    createFlightPlan(shipId: string, destination: number): Promise<FlightPlanResponse>;
    private createUser;
    private makeAuthRequest;
    private sendRequest;
    private makeUserPath;
    private makeHeaders;
    private initLimiter;
}
export {};
