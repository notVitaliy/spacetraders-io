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
const BASE_URL = 'https://api.spacetraders.io';
class SpaceTraders {
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/game/status`;
            const resp = yield axios_1.default.get(url);
            return resp.data;
        });
    }
    createUser(newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${BASE_URL}/users/${newUsername}/token`;
            const resp = yield axios_1.default.post(url);
            if (resp.status >= 300)
                throw new Error('Username is taken');
            return resp.data;
        });
    }
    getAccount(username, token) {
        const url = `/users/${username}`;
        return this.makeAuthRequest(url, 'get', token);
    }
    viewAvailableLoans(token) {
        const url = '/game/loans';
        return this.makeAuthRequest(url, 'get', token);
    }
    viewAvailableShips(token) {
        const url = '/game/ships';
        return this.makeAuthRequest(url, 'get', token);
    }
    takeOutLoan(username, token, type) {
        const url = `/users/${username}/loans`;
        const payload = { type };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    payBackLoan(username, token, loanId) {
        const url = `/users/${username}/loans/${loanId}`;
        return this.makeAuthRequest(url, 'put', token);
    }
    purchaseShip(username, token, location, type) {
        const url = `/users/${username}/ships`;
        const payload = { location, type };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    purchaseGood(username, token, shipId, good, quantity) {
        const url = `/users/${username}/purchase-orders`;
        const payload = { shipId, good, quantity };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    sellGood(username, token, shipId, good, quantity) {
        const url = `/users/${username}/sell-orders`;
        const payload = { shipId, good, quantity };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    listAsteroids(token, system = 'OE', type = 'ASTEROID') {
        const url = `/game/systems/${system}/locations?type=${type}`;
        return this.makeAuthRequest(url, 'get', token);
    }
    getMarketplace(token, location) {
        const url = `/game/locations/${location}/marketplace`;
        return this.makeAuthRequest(url, 'get', token);
    }
    getFlightPlan(token) {
        const url = '/game/systems/OE/locations?type=ASTEROID';
        return this.makeAuthRequest(url, 'get', token);
    }
    createFlightPlan(username, token, shipId, destination) {
        const url = `/users/${username}/flight-plans`;
        const payload = { shipId, destination };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    makeAuthRequest(url, method, token, payload = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.makeHeaders(token);
            const resp = method === 'get'
                ? yield axios_1.default.get(`${BASE_URL}/${url}`, { headers })
                : yield axios_1.default[method](`${BASE_URL}/${url}`, payload, { headers });
            if (resp.status >= 300)
                throw new Error('Invalid token');
            return resp.data;
        });
    }
    makeHeaders(token) {
        return { Authorization: `Bearer ${token}` };
    }
}
exports.SpaceTraders = SpaceTraders;
