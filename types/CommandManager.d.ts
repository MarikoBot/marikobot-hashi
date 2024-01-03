import { ChatInputCommandInteraction, Collection } from 'discord.js';
import { HashiSlashCommand } from './HashiSlashCommand';
import { CoolDownManager } from './CoolDownManager';
import { InterferingManager } from './InterferingManager';
import { HashiClient } from './HashiClient';
import { HashiSlashSubcommand } from './HashiSlashSubcommand';
import { HashiSlashSubcommandGroup } from './HashiSlashSubcommandGroup';
/**
 * A triplet returned when the client transforms an interaction into a callable class group.
 */
export interface CommandBlock {
    /**
     * The command.
     */
    command: HashiSlashCommand;
    /**
     * The subcommand group if there is one.
     */
    subcommandGroup: HashiSlashSubcommandGroup;
    /**
     * The subcommand if there is one.
     */
    subcommand: HashiSlashSubcommand;
}
/**
 * The type that represents an element of CommandBlock.
 */
export type CommandBlockValue = CommandBlock[keyof CommandBlock];
/**
 * Represents the command manager of the client.
 */
export declare class CommandManager {
    /**
     * The client instance.
     */
    readonly client: HashiClient;
    /**
     * The cool down manager instance, to get access to the different delays of the current command.
     */
    readonly CoolDowns: CoolDownManager;
    /**
     * The interfering manager instance, to have access to the different executing commands.
     */
    readonly Interfering: InterferingManager;
    /**
     * The collection of the commands.
     */
    readonly commandsList: Collection<string, HashiSlashCommand>;
    /**
     * The constructor of the command manager.
     * @param client The client instance.
     */
    constructor(client: HashiClient);
    /**
     * Add a command to the client (the bot) using the name, options and or the command itself.
     * If no command is passed, the function creates one based on the data passed.
     * @param commandData The options passed (name, command options, command instance).
     * @returns The command manager instance (this).
     */
    add(commandData: HashiSlashCommand): CommandManager;
    /**
     * Get a command from the cache with the name.
     * @param interaction The interaction.
     * @returns The found command instance, or undefined.
     */
    getCommand(interaction: ChatInputCommandInteraction): CommandBlock;
    /**
     * Load the commands from the given commands directory.
     * @returns Nothing.
     */
    loadCommands(): Promise<void>;
}
