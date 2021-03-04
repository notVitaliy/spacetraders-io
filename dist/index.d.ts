import { AccountResponse, AvailableLoanResponse, AvailableShipResponse, FlightPlanResponse, LoanType, LocationsResponse, MarketplaceResponse, PurchaseResponse, StatusResponse, TokenResponse } from './types';
export declare class SpaceTraders {
    getStatus(): Promise<StatusResponse>;
    createUser(newUsername: string): Promise<TokenResponse>;
    getAccount(username: string, token: string): Promise<AccountResponse>;
    viewAvailableLoans(token: string): Promise<AvailableLoanResponse>;
    viewAvailableShips(token: string): Promise<AvailableShipResponse>;
    takeOutLoan(username: string, token: string, type: LoanType): Promise<unknown>;
    purchaseShip(username: string, token: string, location: string, type: string): Promise<unknown>;
    purchaseGood(username: string, token: string, shipId: string, good: string, quantity: number): Promise<PurchaseResponse>;
    sellGood(username: string, token: string, shipId: string, good: string, quantity: number): Promise<PurchaseResponse>;
    listAsteroids(token: string, system?: string, type?: string): Promise<LocationsResponse>;
    getMarketplace(token: string, location: string): Promise<MarketplaceResponse>;
    getFlightPlan(token: string): Promise<FlightPlanResponse>;
    createFlightPlan(username: string, token: string, shipId: string, destination: number): Promise<FlightPlanResponse>;
    private makeAuthRequest;
    private makeHeaders;
}
