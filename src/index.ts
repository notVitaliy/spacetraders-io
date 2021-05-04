import axios, { AxiosError, AxiosResponse } from 'axios'
import Bottleneck from 'bottleneck'
import { AuthenticationError, NotFoundError, RateLimitError, RequestError } from './errors'

import {
  AccountResponse,
  AvailableLoanResponse,
  AvailableShipResponse,
  AvailableStructureResponse,
  CreateStructureResponse,
  ErrorResponse,
  FlightPlanResponse,
  FlightPlansResponse,
  Good,
  JettisonResponse,
  ListStructuresResponse,
  LoanType,
  LocationResponse,
  LocationShipsResponse,
  LocationsResponse,
  MarketplaceResponse,
  PurchaseResponse,
  SellResponse,
  ShipResponse,
  ShipSellResponse,
  ShipsResponse,
  StatusResponse,
  StructureDepositResponse,
  StructureTransferResponse,
  SystemsResponse,
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
    if (options) this.useSharedLimiter = Boolean(options.useSharedLimiter)
    if (options && options.maxRetries) this.maxRetries = options.maxRetries

    this.initLimiter(limiterOptions)
  }

  async init(username: string, token?: string) {
    if (!username) throw new Error('Username is required.')
    this.username = username
    if (!token) return await this.createUser()
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
    const url = this.makeUserPath(`loans/${loanId}`)

    return this.makeAuthRequest<AccountResponse>(url, 'put')
  }

  purchaseShip(location: string, type: string) {
    const url = this.makeUserPath('ships')
    const payload = { location, type }

    return this.makeAuthRequest<AccountResponse>(url, 'post', payload)
  }

  getShip(shipId: string) {
    const url = this.makeUserPath(`ships/${shipId}`)

    return this.makeAuthRequest<ShipResponse>(url, 'get')
  }

  sellShip(shipId: string) {
    const url = this.makeUserPath(`ships/${shipId}`)

    return this.makeAuthRequest<ShipSellResponse>(url, 'delete')
  }

  getShips() {
    const url = this.makeUserPath('ships')

    return this.makeAuthRequest<ShipsResponse>(url, 'get')
  }

  purchaseGood(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath('purchase-orders')
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<PurchaseResponse>(url, 'post', payload)
  }

  sellGood(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath('sell-orders')
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<SellResponse>(url, 'post', payload)
  }

  listSystems() {
    const url = '/game/systems'

    return this.makeAuthRequest<SystemsResponse>(url, 'get')
  }

  listLocations(system: string = 'OE', type?: string, allowsConstruction?: boolean) {
    const url = !type
      ? `/game/systems/${system}/locations`
      : `/game/systems/${system}/locations?type=${type}&allowsConstruction=${allowsConstruction}`

    return this.makeAuthRequest<LocationsResponse>(url, 'get')
  }

  getLocation(location: string) {
    const url = `/game/locations/${location}`

    return this.makeAuthRequest<LocationResponse>(url, 'get')
  }

  getMarketplace(location: string) {
    const url = `/game/locations/${location}/marketplace`

    return this.makeAuthRequest<MarketplaceResponse>(url, 'get')
  }

  getFlightPlan(flightId: string) {
    const url = this.makeUserPath(`flight-plans/${flightId}`)

    return this.makeAuthRequest<FlightPlanResponse>(url, 'get')
  }

  getFlightPlans(system: string = 'OE') {
    const url = `/game/systems/${system}/flight-plans`

    return this.makeAuthRequest<FlightPlansResponse>(url, 'get')
  }

  createFlightPlan(shipId: string, destination: string) {
    const url = this.makeUserPath('flight-plans')
    const payload = { shipId, destination }

    return this.makeAuthRequest<FlightPlanResponse>(url, 'post', payload)
  }

  jettisonGoods(shipId: string, good: string, quantity: number) {
    const url = this.makeUserPath(`ships/${shipId}/jettison`)
    const payload = { good, quantity }

    return this.makeAuthRequest<JettisonResponse>(url, 'put', payload)
  }

  getAvailableStructures() {
    const url = `/game/structures`

    return this.makeAuthRequest<AvailableStructureResponse>(url, 'get')
  }

  createStructure(type: string, location: string) {
    const url = this.makeUserPath(`structures`)
    const payload = { type, location }

    return this.makeAuthRequest<CreateStructureResponse>(url, 'post', payload)
  }

  depositToStructure(structureId: string, shipId: string, good: Good, quantity: number) {
    const url = this.makeUserPath(`structures/${structureId}/deposit`)
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<StructureDepositResponse>(url, 'post', payload)
  }

  transferFromStructure(structureId: string, shipId: string, good: Good, quantity: number) {
    const url = this.makeUserPath(`structures/${structureId}/transfer`)
    const payload = { shipId, good, quantity }

    return this.makeAuthRequest<StructureTransferResponse>(url, 'post', payload)
  }

  viewStructureDetails(structureId: string) {
    const url = this.makeUserPath(`structures/${structureId}`)

    return this.makeAuthRequest<CreateStructureResponse>(url, 'get')
  }

  listStructures() {
    const url = this.makeUserPath(`structures`)

    return this.makeAuthRequest<ListStructuresResponse>(url, 'get')
  }

  getLocationShips(location: string) {
    const url = `/game/locations/${location}/ships`

    return this.makeAuthRequest<LocationShipsResponse>(url, 'get')
  }

  private async createUser() {
    const path = this.makeUserPath(`token`)
    const url = `${BASE_URL}${path}`

    const resp = await axios.post<TokenResponse>(url)

    if (resp.status >= 300) throw new Error('Username is taken')

    return resp.data.token
  }

  private async makeAuthRequest<T>(url: string, method: 'get' | 'post' | 'put' | 'delete', payload: Record<string, any> = {}, retry = 0): Promise<T> {
    const headers = this.makeHeaders(this.token)
    const fullUrl = `${BASE_URL}${url}`

    const request = () =>
      asyncWrap<AxiosResponse<T | ErrorResponse>, AxiosError>(
        method === 'get' || method === 'delete' ? axios.get<T>(fullUrl, { headers }) : axios[method]<T>(fullUrl, payload, { headers }),
      )

    const [error, resp] = await this.sendRequest(request)

    const status = error ? error.response.status : resp.status
    const data = error ? error.response.data : resp.data
    const responseHeaders = error ? error.response.headers : resp.headers

    if (status === 429 && retry < this.maxRetries) {
      const retryAfter = (responseHeaders['retry-after'] ?? 1) * 1000
      await asyncSleep(retryAfter)

      return this.makeAuthRequest<T>(url, method, payload, retry++)
    }
    if (status === 429) throw new RateLimitError('Too many requests.', 429, data, error)

    if (status === 401 || status === 403) throw new AuthenticationError('Invalid token.', status, data, error)
    if (status === 404) throw new NotFoundError('User not found.', 404, data, error)
    if (status === 400) throw new RequestError('Request error.', 400, data, error)

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
