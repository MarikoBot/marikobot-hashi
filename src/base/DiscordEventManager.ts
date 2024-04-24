import { Collection } from 'discord.js';
import { BaseClient } from './';
import { DiscordEventInjectorTarget, InstanceInjector, InstanceValidatorReturner, Validators } from '../decorators';
import { DiscordEvent, Client } from '../root';

/**
 * Represents the event manager for the client service.
 */
export class DiscordEventManager extends BaseClient {
  /**
   * The collection of the events.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Collection))
  public readonly eventsList: Collection<string, typeof DiscordEvent> = new Collection();

  /**
   * The constructor of the event manager.
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The decorator to inject metadata into the constructor of DiscordEvent.
   * @param name The name of the event.
   * @returns The decorator.
   */
  public inject(name: string): InstanceInjector {
    const instance: DiscordEventManager = this;
    return function (target: DiscordEventInjectorTarget): void {
      instance.client.logger.info(`Bound event: ${name}`);
      instance.client.src[name === 'ready' ? 'once' : 'on'](name, (...args: any[]) =>
        new target().callback(instance.client, ...args),
      );
    };
  }
}
