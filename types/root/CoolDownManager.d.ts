import { Snowflake } from 'discord.js';
import { CoolDownsQueueElement } from './';
import { Context } from '../base';
/**
 * The main class who manages the active cool downs for commands.
 */
export declare class CoolDownManager {
    /**
     * The collection of the current cool downs.
     */
    private readonly queue;
    /**
     * The function that is called when the cool down manager authorization does not pass.
     */
    callback: (context: Context, finishTimestamp: number) => Promise<void>;
    /**
     * Register a cool down when a command is triggered.
     * @param userId The user id of the command author.
     * @param commandName The name of the command.
     * @param coolDown The cool down amount (waiting time before executing it again).
     * @returns Nothing.
     */
    registerCoolDown(userId: Snowflake, commandName: string, coolDown: number): void;
    /**
     * Set the callback function when the cool down manager is triggered on.
     * @param callback The function to set.
     * @returns The class instance.
     */
    on(callback: (context: Context, finishTimestamp: number) => Promise<void>): this;
    /**
     * Returns all the cool downs for a specified user.
     * @param userId The user id to search for.
     * @param commandName The name of the command to filter by.
     * @returns The full list of the user cool downs.
     */
    values(userId: Snowflake, commandName?: string): CoolDownsQueueElement[];
}
