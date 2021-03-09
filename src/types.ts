export type LoanType = 'STARTUP'

export type Good =
  | 'CHEMICALS'
  | 'CONSTRUCTION_MATERIALS'
  | 'CONSUMER_GOODS'
  | 'ELECTROINICS'
  | 'FOOD'
  | 'FUEL'
  | 'MACHINERY'
  | 'METALS'
  | 'RESEARCH'
  | 'SHIP_PARTS'
  | 'TEXTILES'
  | 'WORKERS'

export interface User {
  username: string
  credits: number
  loans: YourLoan[]
  ships: YourShip[]
}

export interface Loan {
  type: LoanType
  amount: number
  collateralRequired: boolean
  rate: number
  termInDays: number
}

export interface Ship {
  class: string
  dockingEfficiency: number
  fuelEfficiency: number
  maintenance: number
  manufacturer: string
  maxCargo: number
  plating: number
  purchaseLocations: [
    {
      location: string
      price: number
    },
    {
      location: string
      price: number
    },
  ]
  speed: number
  type: string
  weapons: number
}

export interface YourLoan {
  due: string
  id: string
  repaymentAmount: boolean
  status: number
  type: LoanType
}

export interface YourShip {
  cargo: Cargo[]
  class: string
  id: string
  location: string
  manufacturer: string
  maxCargo: number
  plating: number
  spaceAvailable: number
  speed: number
  type: string
  weapons: number
}

export interface Cargo {
  good: Good
  quantity: number
}

export interface Location extends Coordinates {
  name: string
  symbol: string
  type: string
}

export interface FlightPlan {
  arrivesAt: string
  destination: string
  fuelConsumed: number
  fuelRemaining: number
  id: string
  ship: string
  terminatedAt: string
  timeRemainingInSeconds: number
}

export interface Coordinates {
  x: number
  y: number
}

export interface Planet extends Coordinates {
  marketplace: Marketplace[]
  name: string
  symbol: string
  type: string
}

export interface Marketplace {
  available: number
  pricePerUnit: number
  volumePerUnit: number
  symbol: Good
}

export interface StatusResponse {
  status: string
}

export interface TokenResponse {
  token: string
  user: {
    id: string
    username: string
    picture: string
    email: string
    credits: number
    createdAt: string
    updatedAt: string
  }
}

export interface AccountResponse {
  user: User
}

export interface AvailableLoanResponse {
  loans: Loan[]
}

export interface AvailableShipResponse {
  ships: Ship[]
}

export interface PurchaseResponse {
  credits: number
  order: {
    good: string
    pricePerUnit: number
    quantity: number
    total: number
  }
  ship: YourShip
}

export interface LocationsResponse {
  locations: Location[]
}

export interface FlightPlanResponse {
  flightPlan: FlightPlan
}

export interface MarketplaceResponse {
  planet: Planet
}

export interface ErrorResponse {
  error: {
    code: number
    message: string
  }
}
