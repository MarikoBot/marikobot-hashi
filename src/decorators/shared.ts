import { Command, DiscordEvent, SuperModel } from '../root';

/**
 * The function that returns if a value is a constructor or a constructed.
 * @param value The value to check.
 * @returns If the value is a constructor.
 */
export function isConstructor(value: any): boolean {
  try {
    const proxy = new new Proxy(value, { construct: () => ({}) })();
    return !!proxy;
  } catch (err) {
    return false;
  }
}

/**
 * Represents a constructable class.
 */
export type Constructable<T extends object> = new (...args: any[]) => T;

/**
 * Represents a constructible value.
 */
export type Constructible = new (...args: any[]) => any;

/**
 * Represents a function returned for a validator decorator.
 * @param target The class instance.
 * @param key The attribute to set.
 */
export type InstanceValidator = (target: object, key: string) => void;

/**
 * Represents a function returned for an injector decorator.
 * @param target The class instance.
 */
export type InstanceInjector = (target: object) => void;

/**
 * Represents a deferred (with parameters) function returned for a decorator.
 * @param target The class instance.
 * @param key The attribute to set.
 */
export type InstanceValidatorReturner = (...args: any[]) => InstanceValidator;

/**
 * The target type for the DiscordEventInjector.
 */
export type DiscordEventInjectorTarget = new () => DiscordEvent;

/**
 * The target type for the CommandInjector.
 */
export type CommandInjectorTarget<T extends Command = Command> = new (...args: any[]) => T;

/**
 * The target type for the SuperModelInjector.
 */
export type SuperModelInjectorTarget<T extends SuperModel = SuperModel> = new (...args: any[]) => T;
