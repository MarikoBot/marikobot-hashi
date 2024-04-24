import { InstanceValidator, Validators } from '../decorators';

/**
 * The placeholder class when data is missing.
 */
export class Placeholder {
  /**
   * The value.
   */
  @(<InstanceValidator>Validators.StringValidator.NotEmpty)
  public readonly value: string = 'placeholder';
}
