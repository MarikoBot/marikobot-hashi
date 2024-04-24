import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { Client } from './';

/**
 * Represents an Event on client service.
 */
export class DiscordEvent {
  /**
   * The client instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Client))
  public client: Client;

  /**
   * The event name.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public name: string;

  /**
   * The callback function.
   * @param client The client instance.
   * @param args The arguments.
   * @returns Nothing.
   */
  @Validators.FunctionValidator.Matches
  public callback(client: Client, ...args: any[]): Promise<void> | void {
    this.client.logger.debug(client, args);
    return null;
  }

  /**
   * The constructor of the event.
   * @param name The event name.
   */
  constructor(name: string) {
    this.name = name;
  }
}
