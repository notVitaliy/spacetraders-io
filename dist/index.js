"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceTraders = void 0;
const axios_1 = __importDefault(require("axios"));
const bottleneck_1 = __importDefault(require("bottleneck"));
const utils_1 = require("./utils");
const BASE_URL = 'https://api.spacetraders.io';
class SpaceTraders {
    constructor(options, limiterOptions) {
        this.limiter = null;
        this.maxRetries = 3;
        this.token = null;
        this.username = null;
        this.useSharedLimiter = false;
        if (options)
            this.useSharedLimiter = Boolean(options.useSharedLimiter);
        if (options && options.maxRetries)
            this.maxRetries = options.maxRetries;
        this.initLimiter(limiterOptions);
    }
    init(username, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username)
                throw new Error('Username is required.');
            if (!token)
                return yield this.createUser(username);
            this.username = username;
            this.token = token;
            return token;
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/game/status`;
            const resp = yield axios_1.default.get(url);
            return resp.data;
        });
    }
    getAccount() {
        const url = this.makeUserPath();
        return this.makeAuthRequest(url, 'get');
    }
    viewAvailableLoans() {
        const url = '/game/loans';
        return this.makeAuthRequest(url, 'get');
    }
    viewAvailableShips() {
        const url = '/game/ships';
        return this.makeAuthRequest(url, 'get');
    }
    takeOutLoan(type) {
        const url = this.makeUserPath('loans');
        const payload = { type };
        return this.makeAuthRequest(url, 'post', payload);
    }
    payBackLoan(loanId) {
        const url = this.makeUserPath(`/loans/${loanId}`);
        return this.makeAuthRequest(url, 'put');
    }
    purchaseShip(location, type) {
        const url = this.makeUserPath('ships');
        const payload = { location, type };
        return this.makeAuthRequest(url, 'post', payload);
    }
    purchaseGood(shipId, good, quantity) {
        const url = this.makeUserPath('purchase-orders');
        const payload = { shipId, good, quantity };
        return this.makeAuthRequest(url, 'post', payload);
    }
    sellGood(shipId, good, quantity) {
        const url = this.makeUserPath('sell-orders');
        const payload = { shipId, good, quantity };
        return this.makeAuthRequest(url, 'post', payload);
    }
    listSystems() {
        const url = '/game/systems';
        return this.makeAuthRequest(url, 'get');
    }
    listLocations(system = 'OE', type) {
        const url = !type ? `/game/systems/${system}/locations` : `/game/systems/${system}/locations?type=${type}`;
        return this.makeAuthRequest(url, 'get');
    }
    getLocation(location) {
        const url = `/game/locations/${location}`;
        return this.makeAuthRequest(url, 'get');
    }
    getMarketplace(location) {
        const url = `/game/locations/${location}/marketplace`;
        return this.makeAuthRequest(url, 'get');
    }
    getFlightPlan(flightId) {
        const url = this.makeUserPath(`/flight-plans/${flightId}`);
        return this.makeAuthRequest(url, 'get');
    }
    createFlightPlan(shipId, destination) {
        const url = this.makeUserPath('flight-plans');
        const payload = { shipId, destination };
        return this.makeAuthRequest(url, 'post', payload);
    }
    createUser(newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.makeUserPath(`${newUsername}/token`);
            const url = `${BASE_URL}/users/${path}`;
            const resp = yield axios_1.default.post(url);
            if (resp.status >= 300)
                throw new Error('Username is taken');
            return resp.data.token;
        });
    }
    makeAuthRequest(url, method, payload = {}, retry = 0) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.makeHeaders(this.token);
            const fullUrl = `${BASE_URL}${url}`;
            const request = () => utils_1.asyncWrap(method === 'get' ? axios_1.default.get(fullUrl, { headers }) : axios_1.default[method](fullUrl, payload, { headers }));
            const [error, resp] = yield this.sendRequest(request);
            const status = error ? error.response.status : resp.status;
            const responseHeaders = error ? error.response.headers : resp.headers;
            if (status === 429 && retry < this.maxRetries) {
                const retryAfter = ((_a = responseHeaders['retry-after']) !== null && _a !== void 0 ? _a : 1) * 1000;
                yield utils_1.asyncSleep(retryAfter);
                return this.makeAuthRequest(url, method, payload, retry++);
            }
            if (status === 429)
                throw new Error('Too many requests.');
            if (status === 401 || status === 403)
                throw new Error('Invalid token.');
            if (status === 404)
                throw new Error('User not found.');
            if (error)
                throw new Error(error.message);
            if (typeof resp.data.error !== 'undefined')
                throw new Error(resp.data.error.message);
            return resp.data;
        });
    }
    sendRequest(request) {
        if (this.limiter)
            return this.limiter.schedule(() => request());
        if (this.useSharedLimiter)
            return SpaceTraders.limiter.schedule(() => request());
        return request();
    }
    makeUserPath(fragment) {
        return fragment ? `/users/${this.username}/${fragment}` : `/users/${this.username}`;
    }
    makeHeaders(token) {
        return { Authorization: `Bearer ${token}` };
    }
    initLimiter(limiterOptions) {
        if (!limiterOptions)
            return;
        const limiter = new bottleneck_1.default(limiterOptions);
        if (!this.useSharedLimiter)
            this.limiter = limiter;
        else if (!SpaceTraders.limiter)
            SpaceTraders.limiter = limiter;
    }
}
exports.SpaceTraders = SpaceTraders;
SpaceTraders.limiter = null;
//# sourceMappingURL=index.js.map