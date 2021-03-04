export declare type LoanType = 'STARTUP' | 'ENTERPRISE';
export interface Loan {
    type: LoanType;
    amount: number;
    collateralRequired: boolean;
    rate: number;
    termInDays: number;
}
export interface Ship {
    class: string;
    dockingEfficiency: number;
    fuelEfficiency: number;
    maintenance: number;
    manufacturer: string;
    maxCargo: number;
    plating: number;
    purchaseLocations: [
        {
            location: string;
            price: number;
        },
        {
            location: string;
            price: number;
        }
    ];
    speed: number;
    type: string;
    weapons: number;
}
export interface YourLoan {
    due: string;
    id: string;
    repaymentAmount: boolean;
    status: number;
    type: LoanType;
}
export interface YourShip {
    cargo: Cargo[];
    class: string;
    id: string;
    location: string;
    manufacturer: string;
    maxCargo: number;
    plating: number;
    spaceAvailable: number;
    speed: number;
    type: string;
    weapons: number;
}
export interface Cargo {
    good: string;
    quantity: number;
}
export interface Location {
    name: string;
    symbol: string;
    type: string;
    x: number;
    y: number;
}
export interface FlightPlan {
    arrivesAt: string;
    destination: string;
    fuelConsumed: number;
    fuelRemaining: number;
    id: string;
    ship: string;
    terminatedAt: string;
    timeRemainingInSeconds: number;
}
export interface Planet {
    marketplace: Marketplace[];
    name: string;
    symbol: string;
    type: string;
    x: number;
    y: number;
}
export interface Marketplace {
    available: number;
    pricePerUnit: number;
    symbol: string;
}
export interface StatusResponse {
    status: string;
}
export interface TokenResponse {
    token: string;
    user: {
        id: string;
        username: string;
        picture: string;
        email: string;
        credits: number;
        createdAt: string;
        updatedAt: string;
    };
}
export interface AccountResponse {
    user: {
        username: string;
        credits: number;
        loans: YourLoan[];
        ships: YourShip[];
    };
}
export interface AvailableLoanResponse {
    loans: Loan[];
}
export interface AvailableShipResponse {
    ships: Ship[];
}
export interface PurchaseResponse {
    credits: number;
    order: {
        good: string;
        pricePerUnit: number;
        quantity: number;
        total: number;
    };
    ship: YourShip;
}
export interface LocationsResponse {
    locations: Location[];
}
export interface FlightPlanResponse {
    flightPlan: FlightPlan;
}
export interface MarketplaceResponse {
    planet: Planet;
}
