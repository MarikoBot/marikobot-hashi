import { InstanceValidator } from '../shared';

/**
 * All the string type validators.
 */
export const StringValidator: {
  readonly [validatorName: string]: InstanceValidator | ((...args: any[]) => InstanceValidator);
} = {
  /**
   * Verify if a string is not empty.
   * @param target The class instance.
   * @param key The attribute to set.
   */
  NotEmpty: (target: object, key: string): void => {
    let value: any;

    const setter = (newValue: any): void => {
      if (typeof newValue !== 'string' || newValue.trim() === '')
        throw new Error(`The property ${target.constructor.name}.${key} must be a non-empty string.`);
      value = newValue;
    };

    Object.defineProperty(target, key, {
      get: (): typeof value => value,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  },
  /**
   * Verify if a string respects the syntax for an id.
   * @param target The class instance.
   * @param key The attribute to set.
   */
  ValidId: (target: object, key: string): void => {
    let value: any;

    const setter = (newValue: any): void => {
      if (typeof newValue !== 'string' || newValue.match(StringValidatorRegExp.validIdRegExp).join('') !== newValue)
        throw new Error(
          `The property ${target.constructor.name}.${key} must be a valid id string ` +
            `(${StringValidatorRegExp.validIdRegExp.toString()}).`,
        );
      value = newValue;
    };

    Object.defineProperty(target, key, {
      get: (): typeof value => value,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  },
  /**
   * Verify if a string respects the syntax for a non-formatted string.
   * @param target The class instance.
   * @param key The attribute to set.
   */
  ValidNonFormatted: (target: object, key: string): void => {
    let value: any;

    const setter = (newValue: any): void => {
      if (
        typeof newValue !== 'string' ||
        newValue.match(StringValidatorRegExp.validNonFormattedRegExp).join('') !== newValue
      )
        throw new Error(
          `The property ${target.constructor.name}.${key} must be a valid id string ` +
            `(${StringValidator.validNonFormattedRegExp.toString()}).`,
        );
      value = newValue;
    };

    Object.defineProperty(target, key, {
      get: (): typeof value => value,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  },
  /**
   * Verify if a string respects the syntax for a set of primary keys.
   * @param target The class instance.
   * @param key The attribute to set.
   */
  ValidPrimaryKeys: (target: object, key: string): void => {
    let value: any;

    const setter = (newValue: any): void => {
      if (
        typeof newValue !== 'string' ||
        newValue.match(StringValidatorRegExp.validPrimaryKeysRegExp).join('') !== newValue
      )
        throw new Error(
          `The property ${target.constructor.name}.${key} must be a valid primary keys string ` +
            `(${StringValidator.validPrimaryKeysRegExp.toString()}).`,
        );
      value = newValue;
    };

    Object.defineProperty(target, key, {
      get: (): typeof value => value,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  },
  /**
   * Verify if a string respects the syntax for a version.
   * @param target The class instance.
   * @param key The attribute to set.
   */
  ValidVersion: (target: object, key: string): void => {
    let value: any;

    const setter = (newValue: any): void => {
      if (
        typeof newValue !== 'string' ||
        newValue.match(StringValidatorRegExp.validVersionRegExp).join('') !== newValue
      )
        throw new Error(
          `The property ${target.constructor.name}.${key} must be a valid version string ` +
            `(${StringValidator.validVersionRegExp.toString()}).`,
        );
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

/**
 * All the regular expressions for the string validator.
 */
export const StringValidatorRegExp: { readonly [validatorName: string]: RegExp } = {
  /**
   * The valid regular expression for an id.
   */
  validIdRegExp: /^[a-zA-Z_0-9][a-zA-Z0-9_ ]{2,62}[a-zA-Z_0-9]$/g,
  /**
   * The valid regular expression for a non-formatted text.
   */
  validNonFormattedRegExp: /^.{4,}$/g,
  /**
   * The valid regular expression for a primary keys set.
   */
  validPrimaryKeysRegExp: /^[a-zA-Z0-9][a-zA-Z0-9+_ ]{2,62}[a-zA-Z0-9]$/g,
  /**
   * The valid regular expression for a version.
   */
  validVersionRegExp: /^([0-9]+.){2}([0-9]+)(-_[a-z]{2,})?$/g,
} as const;
