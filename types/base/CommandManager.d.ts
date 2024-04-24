import { APIApplicationCommand, ChatInputCommandInteraction, Collection } from 'discord.js';
import { BaseClient, Context } from './';
import { InstanceInjector } from '../decorators';
import { CommandMetadata, CoolDownManager, Client, InterferingManager, Command, COMMAND_END, CommandGroup } from '../root';
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
    readonly commandsList: Collection<string, [typeof Command, CommandMetadata]>;
    /**
     * The list of discord commands data.
     */
    readonly discordCommandsData: APIApplicationCommand[];
    /**
     * The function that is called when the cool down manager authorization does not pass.
     */
    authorizationCallback: (context: Context, errorCode: string) => Promise<void>;
    /**
     * @param client The client instance.
     */
    constructor(client: Client);
    /**
     * Set the callback function when the authorizations do not pass.
     * @param callback The function to set.
     * @returns The class instance.
     */
    on(callback: (context: Context, errorCode: string) => Promise<void>): this;
    /**
     * Get a slash command from the cache with the name.
     * @param interaction The interaction.
     * @returns The found command instance, or undefined, with its metadata.
     */
    getCommandFromInteraction(interaction: ChatInputCommandInteraction): CommandGroup;
    /**
     * Function that encapsulates the command detection, authorization and execution.
     * @param interaction The associated interaction.
     * @returns The issue of the command.
     */
    detectAndLaunchSlashCommand(interaction: ChatInputCommandInteraction): Promise<COMMAND_END>;
    /**
     * The decorator to inject metadata into the constructor of Command.
     * @param metadata The metadata of the command.
     * @returns The decorator.
     */
    inject(metadata: CommandMetadata): InstanceInjector;
}
