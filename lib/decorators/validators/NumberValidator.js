"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberValidator = void 0;
/**
 * All the number type validators.
 */
exports.NumberValidator = {
    /**
     * Verify if the value is a number.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    Matches: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'number')
                throw new Error(`The property ${target.constructor.name}.${key} must be a number.`);
            value = newValue;
        };
        Object.defineProperty(target, key, {
            get: () => value,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    },
};
