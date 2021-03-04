'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

const BASE_URL = 'https://api.spacetraders.io';
class SpaceTraders {
    async getStatus() {
        const url = '/game/status';
        const resp = await axios__default['default'].get(url);
        return resp.data;
    }
    async createUser(newUsername) {
        const url = `/users/${newUsername}/token`;
        const resp = await axios__default['default'].post(url);
        if (resp.status >= 300)
            throw new Error('Username is taken');
        return resp.data;
    }
    async getAccount(username, token) {
        const url = `/users/${username}`;
        return this.makeAuthRequest(url, 'get', token);
    }
    async viewAvailableLoans(token) {
        const url = '/game/loans';
        return this.makeAuthRequest(url, 'get', token);
    }
    async viewAvailableShips(token) {
        const url = '/game/ships';
        return this.makeAuthRequest(url, 'get', token);
    }
    async takeOutLoan(username, token, type) {
        const url = `/users/${username}/loans`;
        const payload = { type };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    async purchaseShip(username, token, location, type) {
        const url = `/users/${username}/ships`;
        const payload = { location, type };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    async purchaseGood(username, token, shipId, good, quantity) {
        const url = `/users/${username}/purchase-orders`;
        const payload = { shipId, good, quantity };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    async sellGood(username, token, shipId, good, quantity) {
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
    async createFlightPlan(username, token, shipId, destination) {
        const url = `/users/${username}/flight-plans`;
        const payload = { shipId, destination };
        return this.makeAuthRequest(url, 'post', token, payload);
    }
    async makeAuthRequest(url, method, token, payload = {}) {
        const headers = this.makeHeaders(token);
        const resp = method === 'get'
            ? await axios__default['default'].get(`${BASE_URL}/${url}`, { headers })
            : await axios__default['default'].post(`${BASE_URL}/${url}`, payload, { headers });
        if (resp.status >= 300)
            throw new Error('Invalid token');
        return resp.data;
    }
    makeHeaders(token) {
        return { Authorization: `Bearer ${token}` };
    }
}

exports.SpaceTraders = SpaceTraders;
