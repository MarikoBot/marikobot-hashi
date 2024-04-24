import { ChatInputApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';
import { Context } from '../base';
import { COMMAND_END, CommandGroup, CommandPrivileges, Client, HashiError, CommandMetadata } from './';
/**
 * The class that includes many useful functions shared between HashiMessageCommand and SlashCommand.
 */
export declare class Command {
    /**
     * The client instance.
     */
    client: Client;
    /**
     * The name of the command.
     */
    id: string;
    /**
     * The description of the command.
     */
    description: string;
    /**
     * The list of errors for the command occurrence.
     */
    errors: HashiError[];
    /**
     * The commands that must be executed before this one.
     * If one of the interfering commands is same-time running, this command will be ignored.
     */
    interferingCommands: ChatInputApplicationCommandData['name'][];
    /**
     * The amount of time before running the command again. Must be between 0 and 300 seconds.
     */
    coolDown: number;
    /**
     * The context of the command.
     */
    context: Context;
    /**
     * The external data for the command.
     */
    privileges: CommandPrivileges;
    /**
     * @param metadata The metadata of the command.
     */
    constructor(metadata: CommandMetadata);
    /**
     * The callback function called.
     * @param client The client instance.
     * @param ctx The associated context.
     * @returns If the command ran successfully or not.
     */
    callback(client: Client, ctx: Context): Promise<COMMAND_END>;
    /**
     * The function who MUST be called at the end of your program in the call back function. IT IS REALLY IMPORTANT!
     *
     * @returns The exit code of the command.
     */
    end(): COMMAND_END;
    /**
     * Returns a boolean value. If the user is authorized to run the command.
     *
     * @param interaction The interaction of the command.
     * @param metadata The metadata to check the command with.
     * @returns If the user can execute the command.
     */
    isAuthorized(interaction: ChatInputCommandInteraction, metadata: CommandMetadata): Promise<boolean>;
    /**
     * Verify if the cool downs, and the interfering commands of the command are ready to call the command again.
     *
     * @param client The client that instanced the event.
     * @param interaction The associated interaction.
     * @param ctx The context within the call.
     * @param metadata The command metadata.
     * @returns If the wall is passed or not.
     */
    flowControlWall(client: Client, interaction: ChatInputCommandInteraction, ctx: Context, metadata: CommandMetadata): Promise<boolean>;
    /**
     * Registers the cool down and the interfering commands.
     * @param client The client that instanced the event.
     * @param interaction The associated interaction.
     * @param commandGroup The Command [subclass] instance.
     * @returns Nothing.
     */
    flowControlRegister(client: Client, interaction: ChatInputCommandInteraction, commandGroup: CommandGroup): Promise<void>;
    /**
     * Launch the basic and starting verifications.
     * @param client The client that instanced the event.
     * @param interaction The associated interaction.
     * @param commandGroup The command group.
     * @returns If the command executed successfully.
     */
    launch(client: Client, interaction: ChatInputCommandInteraction, commandGroup: CommandGroup): Promise<COMMAND_END>;
    /**
     * Refreshes the context.
     * @param context The context to refresh with.
     * @returns The class instance.
     */
    private refreshContext;
}
