import { AccountResponse, AvailableLoanResponse, AvailableShipResponse, ErrorResponse, FlightPlanResponse, LoanType, LocationsResponse, MarketplaceResponse, PurchaseResponse, StatusResponse } from './types';
interface LimiterOptions {
    maxConcurrent?: number;
    minTime?: number;
}
export declare class SpaceTraders {
    private username;
    private token;
    private limiter;
    constructor(options?: LimiterOptions);
    init(username: string, token?: string): Promise<string>;
    getStatus(): Promise<StatusResponse>;
    getAccount(): Promise<AccountResponse | ErrorResponse>;
    viewAvailableLoans(): Promise<AvailableLoanResponse | ErrorResponse>;
    viewAvailableShips(): Promise<AvailableShipResponse | ErrorResponse>;
    takeOutLoan(type: LoanType): Promise<AccountResponse | ErrorResponse>;
    payBackLoan(loanId: string): Promise<AccountResponse | ErrorResponse>;
    purchaseShip(location: string, type: string): Promise<AccountResponse | ErrorResponse>;
    purchaseGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse | ErrorResponse>;
    sellGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse | ErrorResponse>;
    listLocations(system?: string, type?: string): Promise<LocationsResponse | ErrorResponse>;
    getMarketplace(location: string): Promise<MarketplaceResponse | ErrorResponse>;
    getFlightPlan(flightId: string): Promise<FlightPlanResponse | ErrorResponse>;
    createFlightPlan(shipId: string, destination: number): Promise<FlightPlanResponse | ErrorResponse>;
    private createUser;
    private makeAuthRequest;
    private sendRequest;
    private makeUserPath;
    private makeHeaders;
}
export {};
