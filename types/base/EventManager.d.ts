import { Collection } from 'discord.js';
import { Base } from './';
import { HashiClient, HashiEvent } from '../root/';
/**
 * Represents the event manager for the client service.
 */
export declare class EventManager extends Base {
    /**
     * The collection of the events.
     */
    readonly eventsList: Collection<string, HashiEvent>;
    /**
     * The constructor of the event manager.
     * @param client The client instance.
     */
    constructor(client: HashiClient);
    /**
     * Load the commands from the given events directory.
     * @returns Nothing.
     */
    loadEvents(): Promise<void>;
}
