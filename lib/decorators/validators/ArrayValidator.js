"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayValidator = void 0;
const discord_js_1 = require("discord.js");
const shared_1 = require("../shared");
/**
 * All the array type validators.
 */
exports.ArrayValidator = {
    /**
     * Verify if an array is composed only of a constructible class object.
     * @param constructible The class the value shall inherit.
     */
    OnlyConstructorOf: (constructible) => {
        return function (target, key) {
            let value;
            const setter = (newValue) => {
                if (typeof newValue !== 'object' ||
                    !(0, shared_1.isConstructor)(value) ||
                    ((0, shared_1.isConstructor)(value) && newValue.prototype.name !== constructible.prototype.name))
                    throw new Error(`The property ${target.constructor.name}.${key} must be a constructor of ${constructible.prototype.name}.`);
                value = newValue;
            };
            Object.defineProperty(target, key, {
                get: () => value,
                set: setter,
                enumerable: true,
                configurable: true,
            });
        };
    },
    /**
     * Verify if an array is composed only of objects.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    OnlyObjects: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' || !newValue?.every((v) => typeof v === 'object'))
                throw new Error(`The property ${target.constructor.name}.${key} must be an object-only array.`);
            value = newValue;
        };
        Object.defineProperty(target, key, {
            get: () => value,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    },
    /**
     * Verify if an array is composed only of enumeration values.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    OnlyEnumValues: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                !newValue?.every((v) => typeof v === 'string' || typeof v === 'number'))
                throw new Error(`The property ${target.constructor.name}.${key} must be an enumeration-values-only array.`);
            value = newValue;
        };
        Object.defineProperty(target, key, {
            get: () => value,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    },
    /**
     * Verify if an array is composed only of HashiErrors initials classes instances.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    OnlyHashiErrors: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                !newValue?.every((v) => !(v instanceof Error) && !(v instanceof discord_js_1.DiscordjsError) && !(v instanceof discord_js_1.DiscordAPIError)))
                throw new Error(`The property ${target.constructor.name}.${key} must be an HashiErrors-initials-classes-instances array.`);
            value = newValue;
        };
        Object.defineProperty(target, key, {
            get: () => value,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    },
    /**
     * Verify if an array is composed only of users.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    OnlyUsers: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' || !newValue?.every((v) => v instanceof discord_js_1.User))
                throw new Error(`The property ${target.constructor.name}.${key} must be an User-only array.`);
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
