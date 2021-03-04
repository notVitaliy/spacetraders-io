import axios from 'axios'

import {
  AccountResponse,
  AvailableLoanResponse,
  AvailableShipResponse,
  FlightPlanResponse,
  LoanType,
  LocationsResponse,
  MarketplaceResponse,
  PurchaseResponse,
  StatusResponse,
  TokenResponse,
} from './types'

const BASE_URL = 'https://api.spacetraders.io'

export class SpaceTraders {
  async getStatus() {
    const url = '/game/status'
    const resp = await axios.get<StatusResponse>(url)

    return resp.data
  }

  async createUser(newUsername: string) {
    const url = `/users/${newUsername}/token`
    const resp = await axios.post<TokenResponse>(url)

    if (resp.status >= 300) throw new Error('Username is taken')

    return resp.data
  }

  async getAccount(username: string, token: string) {
    const url = `/users/${username}`

    return this.makeAuthRequest<AccountResponse>(url, 'get', token)
  }

  async viewAvailableLoans(token: string) {
    const url = '/game/loans'

    return this.makeAuthRequest<AvailableLoanResponse>(url, 'get', token)
  }

  async viewAvailableShips(token: string) {
    const url = '/game/ships'

    return this.makeAuthRequest<AvailableShipResponse>(url, 'get', token)
  }

  async takeOutLoan(username: string, token: string, type: LoanType) {
    const url = `/users/${username}/loans`
    const payload = { type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', token, payload)
  }

  async purchaseShip(username: string, token: string, location: string, type: string) {
    const url = `/users/${username}/ships`
    const payload = { location, type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', token, payload)
  }

  async purchaseGood(username: string, token: string, shipId: string, good: string, quantity: number) {
    const url = `/users/${username}/purchase-orders`
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<PurchaseResponse>(url, 'post', token, payload)
  }

  async sellGood(username: string, token: string, shipId: string, good: string, quantity: number) {
    const url = `/users/${username}/sell-orders`
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<PurchaseResponse>(url, 'post', token, payload)
  }

  listAsteroids(token: string, system: string = 'OE', type: string = 'ASTEROID') {
    const url = `/game/systems/${system}/locations?type=${type}`

    return this.makeAuthRequest<LocationsResponse>(url, 'get', token)
  }

  getMarketplace(token: string, location: string) {
    const url = `/game/locations/${location}/marketplace`

    return this.makeAuthRequest<MarketplaceResponse>(url, 'get', token)
  }

  getFlightPlan(token: string) {
    const url = '/game/systems/OE/locations?type=ASTEROID'

    return this.makeAuthRequest<FlightPlanResponse>(url, 'get', token)
  }

  async createFlightPlan(username: string, token: string, shipId: string, destination: number) {
    const url = `/users/${username}/flight-plans`
    const payload = { shipId, destination }

    return this.makeAuthRequest<FlightPlanResponse>(url, 'post', token, payload)
  }

  private async makeAuthRequest<T>(
    url: string,
    method: 'get' | 'post',
    token: string,
    payload: Record<string, any> = {},
  ) {
    const headers = this.makeHeaders(token)
    const resp =
      method === 'get'
        ? await axios.get<T>(`${BASE_URL}/${url}`, { headers })
        : await axios.post<T>(`${BASE_URL}/${url}`, payload, { headers })

    if (resp.status >= 300) throw new Error('Invalid token')

    return resp.data
  }

  private makeHeaders(token: string) {
    return { Authorization: `Bearer ${token}` }
  }
}
