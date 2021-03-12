"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = exports.RateLimitError = exports.NotFoundError = exports.AuthenticationError = exports.SpaceTradersError = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["AUTHENTICATION"] = "AUTHENTICATION";
    ErrorType["NOT_FOUND"] = "NOT_FOUND";
    ErrorType["RATE_LIMIT"] = "RATE_LIMIT";
    ErrorType["REQUEST"] = "REQUEST";
})(ErrorType || (ErrorType = {}));
class SpaceTradersError extends Error {
    constructor(message, code, error, axiosError) {
        super(message);
        this.code = code;
        this.error = error;
        this.axiosError = axiosError;
    }
}
exports.SpaceTradersError = SpaceTradersError;
class AuthenticationError extends SpaceTradersError {
    constructor() {
        super(...arguments);
        this.type = ErrorType.AUTHENTICATION;
    }
}
exports.AuthenticationError = AuthenticationError;
class NotFoundError extends SpaceTradersError {
    constructor() {
        super(...arguments);
        this.type = ErrorType.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
class RateLimitError extends SpaceTradersError {
    constructor() {
        super(...arguments);
        this.type = ErrorType.RATE_LIMIT;
    }
}
exports.RateLimitError = RateLimitError;
class RequestError extends SpaceTradersError {
    constructor() {
        super(...arguments);
        this.type = ErrorType.REQUEST;
    }
}
exports.RequestError = RequestError;
//# sourceMappingURL=errors.js.map