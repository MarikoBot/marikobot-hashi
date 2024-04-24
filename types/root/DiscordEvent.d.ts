import { Client } from './';
/**
 * Represents an Event on client service.
 */
export declare class DiscordEvent {
    /**
     * The client instance.
     */
    client: Client;
    /**
     * The event name.
     */
    name: string;
    /**
     * The callback function.
     * @param client The client instance.
     * @param args The arguments.
     * @returns Nothing.
     */
    callback(client: Client, ...args: any[]): Promise<void> | void;
    /**
     * The constructor of the event.
     * @param name The event name.
     */
    constructor(name: string);
}
