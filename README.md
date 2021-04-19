# Spacetraders.io Javascript/Typescript SDK

## Install

`yarn add spacetraders-sdk`

or

`npm i spacetraders-sdk`

## Usage

The SDK will keep your username + token in memory. It's important that you save the token for a new user otherwise you'll lose access to that user.

The SDK will attempt to retry 429 http status codes up to 3 (default value) times for a request before throwing an error.

```typescript
import { SpaceTraders } from 'spacetraders-sdk'

const spaceTraders = new SpaceTraders()

// Already existing user
spaceTraders.init('username', 'token')

// Claim a new user
const token = await spaceTraders.init('username')
```

### Options

```typescript
interface Options {
  /**
   * If all instances of SpaceTraders should use the same limiter. Defaults to false.
   */
  useSharedLimiter?: boolean;
  /**
   * Maximum amount of 429 (Rate-Limited) retries. Defaults to 3.
   */
  maxRetries?: number
}

interface LimiterOptions {
  /**
   * How many jobs can be running at the same time. No default.
   */
  maxConcurrent?: number;
  /**
   * How long to wait after launching a job before launching another one. No default.
   */
  minTime?: number;
}

constructor(options?: Options, limiterOptions?: LimiterOptions)

```

### Basic rate-limiting

```typescript
import { SpaceTraders } from 'spacetraders-sdk'

const spaceTraders = new SpaceTraders({ useSharedLimiter: true }, { maxConcurrent: 2, minTime: 500 })
```

## Methods

### [createFlightPlan](https://api.spacetraders.io/#api-flight_plans-NewFlightPlan)

Submit a new flight plan

```typescript
spaceTraders.createFlightPlan(shipId: string, destination: string): Promise<FlightPlanResponse>
```

### [getAccount](https://api.spacetraders.io/#api-users-GetInfo)

Get your info

```typescript
spaceTraders.getAccount(): Promise<AccountResponse>
```

### [getFlightPlan](https://api.spacetraders.io/#api-flight_plans-GetFlightPlan)

Get info on an existing flight plan

```typescript
spaceTraders.getFlightPlan(): Promise<FlightPlanResponse>
```

### [getLocation](https://api.spacetraders.io/#api-locations-location)

Get info on a location

```typescript
spaceTraders.getLocation(location: string): Promise<LocationResponse>;
```

### [getMarketplace](https://api.spacetraders.io/#api-marketplace-marketplace)

Get info on a locations marketplace

```typescript
spaceTraders.getMarketplace(location: string): Promise<MarketplaceResponse>
```

### [getStatus](https://api.spacetraders.io/#api-game-status)

Use to determine whether the server is alive

```typescript
spaceTraders.getStatus(): Promise<StatusResponse>
```

### [jettisonCargo](https://api.spacetraders.io/#api-ships-JettisonCargo)

Use to jettison goods from a ship's cargo 

```typescript
spaceTraders.jettisonGoods(shipId: string, good: string, quantity: number): Promise<JettisonResponse>
```

### [listLocations](https://api.spacetraders.io/#api-locations-locations)

Get locations in a system

```typescript
spaceTraders.listLocations(system?: string, type?: string): Promise<LocationsResponse>
```

### [listSystems](https://api.spacetraders.io/#api-systems-systems)

Get systems info

```typescript
spaceTraders.listSystems(): Promise<LocationResponse>
```

### [payBackLoan](https://api.spacetraders.io/#api-loans)

Payback your loan

```typescript
spaceTraders.payBackLoan(loanId: string): Promise<AccountResponse>
```

### [purchaseGood](https://api.spacetraders.io/#api-purchase_orders-NewPurchaseOrder)

Place a new purchase order

```typescript
spaceTraders.purchaseGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse>
```

### [purchaseShip](https://api.spacetraders.io/#api-ships-NewShip)

Buy a new ship

```typescript
spaceTraders.purchaseShip(location: string, type: string): Promise<AccountResponse>
```

### [sellGood](https://api.spacetraders.io/#api-sell_orders-NewSellOrder)

Place a new sell order

```typescript
spaceTraders.sellGood(shipId: string, good: string, quantity: number): Promise<PurchaseResponse>
```

### [takeOutLoan](https://api.spacetraders.io/#api-loans-NewLoan)

Request a new loan

```typescript
spaceTraders.takeOutLoan(type: LoanType): Promise<AccountResponse>
```

### [viewAvailableLoans](https://api.spacetraders.io/#api-loans-loans)

Get available loans

```typescript
spaceTraders.viewAvailableLoans(): Promise<AvailableLoanResponse>
```

### [viewAvailableShips](https://api.spacetraders.io/#api-ships-ships)

Get info on available ships

```typescript
spaceTraders.viewAvailableShips(): Promise<AvailableShipResponse>
```

### [getAvailableStructures](https://spacetraders.io/docs/structures)

View available structure types to build

```typescript
spaceTraders.getAvailableStructures(): Promise<AvailableStructuresResponse>
```

### [createStructure](https://api.spacetraders.io/#api-structures-NewStructure)

create a new structure

```typescript
spaceTraders.createStructure(type: string, location: string): Promise<CreateStructureResponse>
```

### [depositToStructure](https://api.spacetraders.io/#api-structures-DepositGoods)

Deposit goods from a ship to a structure

```typescript
spaceTraders.depositToStructure(structureId: string, shipId: string, good: Good, quantity: number): Promise<StructureDepositResponse>
```

### [transferFromStructure](https://api.spacetraders.io/#api-structures-TransferGoods)

Transfer goods from a structure to a ship

```typescript
spaceTraders.transferFromStructure(structureId: string, shipId: string, good: Good, quantity: number): Promise<StructureTransferResponse>
```

### [viewStructureDetails](https://api.spacetraders.io/#api-structures-GetStructure)

Get information about a particular structure

```typescript
spaceTraders.viewStructureDetails(structureId: string): Promise<CreateStructureResponse>
```

### [listStructures](https://api.spacetraders.io/#api-structures-GetStructures)

Get information about all owned structures

```typescript
spaceTraders.listStructures(): Promise<ListStructuresResponse>
```
