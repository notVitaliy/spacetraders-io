import { AccountResponse, AvailableLoanResponse, AvailableShipResponse, FlightPlanResponse, FlightPlansResponse, LoanType, LocationResponse, LocationsResponse, MarketplaceResponse, PurchaseResponse, SellResponse, ShipResponse, ShipsResponse, ShipSellResponse, StatusResponse } from './types';
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
    getShip(shipId: string): Promise<ShipResponse>;
    sellShip(shipId: string): Promise<ShipSellResponse>;
    getShips(): Promise<ShipsResponse>;
    purchaseGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse>;
    sellGood(shipId: string, good: string, quantity: number): Promise<SellResponse>;
    listSystems(): Promise<LocationResponse>;
    listLocations(system?: string, type?: string): Promise<LocationsResponse>;
    getLocation(location: string): Promise<LocationResponse>;
    getMarketplace(location: string): Promise<MarketplaceResponse>;
    getFlightPlan(flightId: string): Promise<FlightPlanResponse>;
    getFlightPlans(system?: string): Promise<FlightPlansResponse>;
    createFlightPlan(shipId: string, destination: string): Promise<FlightPlanResponse>;
    private createUser;
    private makeAuthRequest;
    private sendRequest;
    private makeUserPath;
    private makeHeaders;
    private initLimiter;
}
export {};
