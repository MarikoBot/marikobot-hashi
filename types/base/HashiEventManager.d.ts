import { Collection } from 'discord.js';
import { BaseClient } from './';
import { InstanceInjector } from '../decorators';
import { HashiClient, HashiEvent } from '../root';
/**
 * Represents the event manager for the client service.
 */
export declare class HashiEventManager extends BaseClient {
    /**
     * The collection of the events.
     */
    readonly eventsList: Collection<string, typeof HashiEvent>;
    /**
     * The constructor of the event manager.
     * @param client The client instance.
     */
    constructor(client: HashiClient);
    /**
     * The decorator to inject metadata into the constructor of HashiEvent.
     * @param name The name of the event.
     * @returns The decorator.
     */
    HashiEventInjector(name: string): InstanceInjector;
}