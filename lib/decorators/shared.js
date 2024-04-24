"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstructor = void 0;
/**
 * The function that returns if a value is a constructor or a constructed.
 * @param value The value to check.
 * @returns If the value is a constructor.
 */
function isConstructor(value) {
    try {
        const proxy = new new Proxy(value, { construct: () => ({}) })();
        return !!proxy;
    }
    catch (err) {
        return false;
    }
}
exports.isConstructor = isConstructor;
