import { ChatInputCommandInteraction, Collection } from 'discord.js';
import { BaseClient } from './';
import { AnyCommandConstructorType, CommandGroup, CoolDownManager, HashiClient, InterferingManager } from '../root';
/**
 * Represents the command manager of the client. This class manages the slash and message commands for the project.
 */
export declare class CommandManager extends BaseClient {
    /**
     * The cool downs' manager instance, to get access to the different delays of the current command.
     */
    readonly coolDowns: CoolDownManager;
    /**
     * The interfering manager instance, to have access to the different executing commands.
     */
    readonly interfering: InterferingManager;
    /**
     * The list of commands.
     */
    readonly commandsList: Collection<string, AnyCommandConstructorType>;
    /**
     * @param client The client instance.
     */
    constructor(client: HashiClient);
    /**
     * Get a slash command from the cache with the name.
     * @param interaction The interaction.
     * @returns The found command instance, or undefined.
     */
    getCommandFromInteraction(interaction: ChatInputCommandInteraction): CommandGroup;
    /**
     * Load the commands from the given commands directory.
     * @param dirName The directory to load on.
     * @returns Nothing.
     */
    private commandsScraper;
    /**
     * Load the commands from the given commands directory.
     * @returns Nothing.
     */
    loadCommands(): Promise<void>;
}
