"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectValidator = void 0;
const discord_js_1 = require("discord.js");
/**
 * All the object type validators.
 */
exports.ObjectValidator = {
    /**
     * Verify if a value is an ContextChannel initial type instance.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    ContextChannelInitial: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                (!(newValue instanceof discord_js_1.BaseGuildTextChannel) &&
                    !(newValue instanceof discord_js_1.BaseGuildVoiceChannel) &&
                    !(newValue instanceof discord_js_1.ThreadChannel)))
                throw new Error(`The property ${target.constructor.name}.${key} must be an instance of one of the ContextChannel initial type classes.`);
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
     * Verify if the value is a dataMapDefinition object.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    IsDataMapDefinition: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                !('name' in newValue) ||
                !('entry' in newValue) ||
                !('schema' in newValue) ||
                !('defaultValues' in newValue))
                throw new Error(`The property ${target.constructor.name}.${key} must be a dataMapDefinition object.`);
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
     * Verify if the value is a class instance.
     * @param constructable The class the value shall inherit.
     */
    IsInstanceOf: (constructable) => {
        return function (target, key) {
            let value;
            const setter = (newValue) => {
                if (typeof newValue !== 'object' || !(newValue instanceof constructable))
                    throw new Error(`The property ${target.constructor.name}.${key} must be an instance of ${constructable.prototype.name}.`);
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
     * Verify if the value is an object string-dataMap.
     * @param dataMap The dataMap constructor.
     */
    KeyDataMapPair: (dataMap) => {
        return function (target, key) {
            let value;
            const setter = (newValue) => {
                if (typeof newValue !== 'object' ||
                    !Object.entries(newValue).every(([_key, _value]) => typeof _key === 'string' && _value instanceof dataMap))
                    throw new Error(`The property ${target.constructor.name}.${key} must be an object string-dataMap.`);
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
     * Verify if the value is an object string-functions[].
     * @param target The class instance.
     * @param key The attribute to set.
     */
    KeyFunctionPair: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                !Object.entries(newValue).every(([_key, _value]) => typeof _key === 'string' && typeof _value === 'function'))
                throw new Error(`The property ${target.constructor.name}.${key} must be an object string-functions[].`);
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
     * Verify if the value is an object string-object.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    KeyObjectPair: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                !Object.entries(newValue).every(([_key, _value]) => typeof _key === 'string' && typeof _value === 'object'))
                throw new Error(`The property ${target.constructor.name}.${key} must be an object string-object.`);
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
     * Verify if the value is an object string-string.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    KeyStringPair: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' || typeof newValue !== 'string')
                throw new Error(`The property ${target.constructor.name}.${key} must be an object string-string.`);
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
     * Verify if the value is an object string-string[].
     * @param target The class instance.
     * @param key The attribute to set.
     */
    KeyStringArrayPair: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object' ||
                !Object.entries(newValue).every(([_key, _value]) => typeof _key === 'string' &&
                    typeof _value === 'object' &&
                    _value.every((v) => typeof v === 'string')))
                throw new Error(`The property ${target.constructor.name}.${key} must be an object string-string[].`);
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
     * Verify if the value is an object string-superModelColumn.
     * @param superModelColumn The superModelColumn constructor.
     */
    KeySuperModelColumnPair: (superModelColumn) => {
        return function (target, key) {
            let value;
            const setter = (newValue) => {
                if (typeof newValue !== 'object' ||
                    !Object.entries(newValue).every(([_key, _value]) => typeof _key === 'string' && _value instanceof superModelColumn))
                    throw new Error(`The property ${target.constructor.name}.${key} must be an object string-superModelColumn.`);
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
     * Verify if the value is a class instance of a placeholder value.
     * @param arg The class constructor.
     * @param placeholder The placeholder constructor.
     */
    KindOfInstance: (arg, placeholder) => {
        return function (target, key) {
            let value;
            const setter = (newValue) => {
                if (typeof newValue !== 'object' ||
                    !Object.entries(newValue).every(([_key, _value]) => typeof _key === 'string' && (_value instanceof arg || _value instanceof placeholder)))
                    throw new Error(`The property ${target.constructor.name}.${key} must be an instance of ${arg.prototype.name} or a default placeholder.`);
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
     * Verify if the value is an object.
     * @param target The class instance.
     * @param key The attribute to set.
     */
    Matches: (target, key) => {
        let value;
        const setter = (newValue) => {
            if (typeof newValue !== 'object')
                throw new Error(`The property ${target.constructor.name}.${key} must be an object.`);
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
