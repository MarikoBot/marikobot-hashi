import { Client as DiscordClient } from 'discord.js';
import { DatabaseManager, DiscordEventManager, CommandManager, Logger } from '../base/';
import { ClientChannelsOption, ClientOptions } from './';
/**
 * The Client class. It extends the Client class from discord.js and implements extra methods for the Hashi module.
 */
export declare class Client {
    /**
     * The Discord Client instance.
     */
    readonly src: DiscordClient;
    /**
     * The logger for the Client.
     */
    readonly logger: Logger;
    /**
     * The command manager instance.
     */
    readonly commands: CommandManager;
    /**
     * The event manager instance.
     */
    readonly events: DiscordEventManager;
    /**
     * The database manager for accessing data maps/lakes.
     */
    readonly db: DatabaseManager;
    /**
     * The name of the project/process you're in.
     */
    readonly projectName: string;
    /**
     * The Discord channels where the bot can be configured/logged.
     */
    readonly configChannels: Partial<ClientChannelsOption>;
    /**
     * @param options The options for the Client.
     */
    constructor(options: ClientOptions);
    /**
     * Connect the database.
     * @returns Nothing.
     */
    connectDatabase(): Promise<void>;
    /**
     * Login the client to Discord.
     * @param token The token of the bot.
     * @returns Nothing.
     */
    login(token?: string): Promise<string>;
}
