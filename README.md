# Spacetrades.io Javascript/Typescript SDK

## Install

`yarn add spacetraders-sdk`

or

`npm i spacetraders-sdk`

## Usage

```typescript
import { SpaceTraders } from 'spacetraders-sdk'

const spaceTraders = new SpaceTraders()
```

## Methods

```typescript
createFlightPlan(username: string, token: string, shipId: string, destination: number): Promise<FlightPlanResponse>

createUser(newUsername: string): Promise<TokenResponse>

getAccount(username: string, token: string): Promise<AccountResponse>

getFlightPlan(token: string): Promise<FlightPlanResponse>

getMarketplace(token: string, location: string): Promise<MarketplaceResponse>

getStatus(): Promise<StatusResponse>

listAsteroids(token: string, system?: string, type?: string): Promise<LocationsResponse>

listLocations(token: string, system?: string): Promise<LocationsResponse>

payBackLoan(username: string, token: string, loanId: string): Promise<AccountResponse>

purchaseGood(username: string, token: string, shipId: string, good: string, quantity: number): Promise<PurchaseResponse>

purchaseShip(username: string, token: string, location: string, type: string): Promise<AccountResponse>

sellGood(username: string, token: string, shipId: string, good: string, quantity: number): Promise<PurchaseResponse>

takeOutLoan(username: string, token: string, type: LoanType): Promise<AccountResponse>

viewAvailableLoans(token: string): Promise<AvailableLoanResponse>

viewAvailableShips(token: string): Promise<AvailableShipResponse>
```
