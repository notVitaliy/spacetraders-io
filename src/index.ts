import axios, { AxiosError, AxiosResponse } from 'axios'
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
import { asyncSleep, asyncWrap } from './utils'

const BASE_URL = 'https://api.spacetraders.io'

interface Options {
  useSharedLimiter?: boolean
  maxRetries?: number
}

interface LimiterOptions {
  maxConcurrent?: number
  minTime?: number
}

export class SpaceTraders {
  private static limiter: Bottleneck = null

  private limiter: Bottleneck = null
  private maxRetries = 3
  private token: string = null
  private username: string = null
  private useSharedLimiter = false

  constructor(options?: Options, limiterOptions?: LimiterOptions) {
    this.useSharedLimiter = Boolean(options.useSharedLimiter)
    if (options.maxRetries) this.maxRetries = options.maxRetries

    this.initLimiter(limiterOptions)
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
    const url = this.makeUserPath('loans')
    const payload = { type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', payload)
  }

  payBackLoan(loanId: string) {
    const url = this.makeUserPath(`/loans/${loanId}`)

    return this.makeAuthRequest<AccountResponse>(url, 'put')
  }

  purchaseShip(location: string, type: string) {
    const url = this.makeUserPath('ships')
    const payload = { location, type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', payload)
  }

  purchaseGood(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath('purchase-orders')
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<PurchaseResponse>(url, 'post', payload)
  }

  sellGood(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath('sell-orders')
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
    const url = this.makeUserPath('flight-plans')
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

  private async makeAuthRequest<T>(url: string, method: 'get' | 'post' | 'put', payload: Record<string, any> = {}, retry = 0): Promise<T> {
    const headers = this.makeHeaders(this.token)
    const fullUrl = `${BASE_URL}${url}`

    const request = () =>
      asyncWrap<AxiosResponse<T | ErrorResponse>, AxiosError>(
        method === 'get' ? axios.get<T>(fullUrl, { headers }) : axios[method]<T>(fullUrl, payload, { headers }),
      )

    const [error, resp] = await this.sendRequest(request)

    const status = error ? error.response.status : resp.status
    const responseHeaders = error ? error.response.headers : resp.headers

    if (status === 429 && retry < this.maxRetries) {
      const retryAfter = (responseHeaders['retry-after'] ?? 1) * 1000
      await asyncSleep(retryAfter)

      return this.makeAuthRequest<T>(url, method, payload, retry++)
    }
    if (status === 429) throw new Error('Too many requests.')

    if (status === 401 || status === 403) throw new Error('Invalid token.')
    if (status === 404) throw new Error('User not found.')

    if (error) throw new Error(error.message)

    if (typeof (resp.data as ErrorResponse).error !== 'undefined') throw new Error((resp.data as ErrorResponse).error.message)

    return resp.data as T
  }

  private sendRequest<T>(request: () => Promise<[AxiosError, AxiosResponse<T | ErrorResponse>]>) {
    if (this.limiter) return this.limiter.schedule(() => request())
    if (this.useSharedLimiter) return SpaceTraders.limiter.schedule(() => request())

    return request()
  }

  private makeUserPath(fragment?: string) {
    return fragment ? `/users/${this.username}/${fragment}` : `/users/${this.username}`
  }

  private makeHeaders(token: string) {
    return { Authorization: `Bearer ${token}` }
  }

  private initLimiter(limiterOptions: LimiterOptions) {
    if (!limiterOptions) return

    const limiter = new Bottleneck(limiterOptions)

    if (!this.useSharedLimiter) this.limiter = limiter
    else if (!SpaceTraders.limiter) SpaceTraders.limiter = limiter
  }
}
