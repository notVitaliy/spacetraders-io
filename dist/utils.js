"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncSleep = exports.asyncWrap = void 0;
const asyncWrap = (promise) => new Promise((resolve) => promise.then((data) => resolve([null, data])).catch((err) => resolve([err, null])));
exports.asyncWrap = asyncWrap;
const asyncSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.asyncSleep = asyncSleep;
//# sourceMappingURL=utils.js.map