import { InstanceValidator } from '../shared';

/**
 * All the number type validators.
 */
export const NumberValidator: { readonly [validatorName: string]: InstanceValidator } = {
  /**
   * Verify if the value is a number.
   * @param target The class instance.
   * @param key The attribute to set.
   */
  Matches: (target: object, key: string): void => {
    let value: any;

    const setter = (newValue: any): void => {
      if (typeof newValue !== 'number')
        throw new Error(`The property ${target.constructor.name}.${key} must be a number.`);
      value = newValue;
    };

    Object.defineProperty(target, key, {
      get: (): typeof value => value,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  },
} as const;
