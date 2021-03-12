// tslint:disable: max-classes-per-file
import { AxiosError } from 'axios'

enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  REQUEST = 'REQUEST',
}

export class SpaceTradersError extends Error {
  type: ErrorType

  constructor(message: string, public code: number, public error: Record<string, string>, public axiosError: AxiosError) {
    super(message)
  }
}

export class AuthenticationError extends SpaceTradersError {
  type = ErrorType.AUTHENTICATION
}

export class NotFoundError extends SpaceTradersError {
  type = ErrorType.NOT_FOUND
}

export class RateLimitError extends SpaceTradersError {
  type = ErrorType.RATE_LIMIT
}

export class RequestError extends SpaceTradersError {
  type = ErrorType.REQUEST
}
