import axios, { AxiosResponse } from 'axios'
import Bottleneck from 'bottleneck'

import {
  AccountResponse,
  AvailableLoanResponse,
  AvailableShipResponse,
  ErrorResponse,
  FlightPlanResponse,
  LoanType,
  LocationsResponse,
  MarketplaceResponse,
  PurchaseResponse,
  StatusResponse,
  TokenResponse,
} from './types'
import { asyncWrap } from './utils'

const BASE_URL = 'https://api.spacetraders.io'

interface LimiterOptions {
  maxConcurrent?: number
  minTime?: number
}

export class SpaceTraders {
  private username: string = null
  private token: string = null
  private limiter: Bottleneck = null

  constructor(options?: LimiterOptions) {
    if (options) this.limiter = new Bottleneck(options)
  }

  async init(username: string, token?: string) {
    if (!username) throw new Error('Username is required.')
    if (!token) return await this.createUser(username)

    this.username = username
    this.token = token

    return token
  }

  async getStatus() {
    const url = `${BASE_URL}/game/status`
    const resp = await axios.get<StatusResponse>(url)

    return resp.data
  }

  getAccount() {
    const url = this.makeUserPath()

    return this.makeAuthRequest<AccountResponse>(url, 'get')
  }

  viewAvailableLoans() {
    const url = '/game/loans'

    return this.makeAuthRequest<AvailableLoanResponse>(url, 'get')
  }

  viewAvailableShips() {
    const url = '/game/ships'

    return this.makeAuthRequest<AvailableShipResponse>(url, 'get')
  }

  takeOutLoan(type: LoanType) {
    const url = this.makeUserPath('/loans')
    const payload = { type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', payload)
  }

  payBackLoan(loanId: string) {
    const url = this.makeUserPath(`/loans/${loanId}`)

    return this.makeAuthRequest<AccountResponse>(url, 'put')
  }

  purchaseShip(location: string, type: string) {
    const url = this.makeUserPath('/ships')
    const payload = { location, type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', payload)
  }

  purchaseGood(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath('/purchase-orders')
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<PurchaseResponse>(url, 'post', payload)
  }

  sellGood(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath('/sell-orders')
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<PurchaseResponse>(url, 'post', payload)
  }

  listLocations(system: string = 'OE', type?: string) {
    const url = !type ? `/game/systems/${system}/locations` : `/game/systems/${system}/locations?type=${type}`

    return this.makeAuthRequest<LocationsResponse>(url, 'get')
  }

  getMarketplace(location: string) {
    const url = `/game/locations/${location}/marketplace`

    return this.makeAuthRequest<MarketplaceResponse>(url, 'get')
  }

  getFlightPlan(flightId: string) {
    const url = this.makeUserPath(`/flight-plans/${flightId}`)

    return this.makeAuthRequest<FlightPlanResponse>(url, 'get')
  }

  createFlightPlan(shipId: string, destination: number) {
    const url = this.makeUserPath('/flight-plans')
    const payload = { shipId, destination }

    return this.makeAuthRequest<FlightPlanResponse>(url, 'post', payload)
  }

  private async createUser(newUsername: string) {
    const path = this.makeUserPath(`${newUsername}/token`)
    const url = `${BASE_URL}/users/${path}`

    const resp = await axios.post<TokenResponse>(url)

    if (resp.status >= 300) throw new Error('Username is taken')

    return resp.data.token
  }

  private async makeAuthRequest<T>(url: string, method: 'get' | 'post' | 'put', payload: Record<string, any> = {}) {
    const headers = this.makeHeaders(this.token)
    const fullUrl = `${BASE_URL}${url}`

    const request = () =>
      asyncWrap<AxiosResponse<T | ErrorResponse>>(
        method === 'get' ? axios.get<T>(fullUrl, { headers }) : axios[method]<T>(fullUrl, payload, { headers }),
      )

    const [error, resp] = await this.sendRequest(request)

    if (error) throw new Error(error.message)
    if (resp.status === 401 || resp.status >= 403) throw new Error('Invalid token.')
    if (resp.status >= 404) throw new Error('User not found.')
    if (typeof (resp.data as ErrorResponse).error !== 'undefined') throw new Error((resp.data as ErrorResponse).error.message)

    return resp.data
  }

  private sendRequest<T>(request: () => Promise<[Error, AxiosResponse<T | ErrorResponse>]>) {
    if (this.limiter) return this.limiter.schedule(() => request())

    return request()
  }

  private makeUserPath(fragment?: string) {
    return fragment ? `/users/${this.username}/${fragment}` : `/users/${this.username}`
  }

  private makeHeaders(token: string) {
    return { Authorization: `Bearer ${token}` }
  }
}
