/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { APIApplicationCommandOption, ChatInputApplicationCommandData, ChatInputCommandInteraction, ClientOptions, DiscordAPIError, DiscordjsError, LocalizationMap } from 'discord.js';
import { ConnectOptions } from 'mongoose';
import { Context } from '../base';
import { HashiClient, HashiMessageCommand, HashiSlashCommand, HashiSlashSubcommand, HashiSlashSubcommandGroup, SuperModelColumn } from './';
/**
 * Represents any command constructor.
 */
export type AnyCommandConstructorType = typeof HashiMessageCommand | typeof HashiSlashCommand | typeof HashiSlashSubcommand | typeof HashiSlashSubcommandGroup;
/**
 * Represents any command constructor.
 */
export type AnyCommandConstructor = HashiMessageCommand | HashiSlashCommand | HashiSlashSubcommand | HashiSlashSubcommandGroup;
/**
 * Prefilled version of the Discord.<APIApplicationCommand>
 * @link https://discord.com/developers/docs/interactions/application-commands#application-command-object
 */
export interface APIApplicationCommandPrefilled {
    /**
     * Type of the command
     */
    type: 1;
    /**
     * 1-32 character name; `CHAT_INPUT` command names must be all lowercase matching `^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$`
     */
    name: string;
    /**
     * Localization dictionary for the name field. Values follow the same restrictions as name
     */
    name_localizations?: LocalizationMap | null;
    /**
     * 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands
     */
    description: string;
    /**
     * Localization dictionary for the description field. Values follow the same restrictions as description
     */
    description_localizations?: LocalizationMap | null;
    /**
     * The parameters for the `CHAT_INPUT` command, max 25
     */
    options?: APIApplicationCommandOption[];
    /**
     * Set of permissions represented as a bitset
     */
    default_member_permissions: Permissions | null;
    /**
     * Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible
     */
    dm_permission?: boolean;
    /**
     * Whether the command is enabled by default when the app is added to a guild
     *
     * If missing, this property should be assumed as `true`
     *
     * @deprecated Use `dm_permission` and/or `default_member_permissions` instead
     */
    default_permission?: boolean;
    /**
     * Indicates whether the command is age-restricted, defaults to `false`
     */
    nsfw?: boolean;
}
/**
 * The value that is returned when the command is finished.
 */
export declare enum COMMAND_END {
    /**
     * When the command terminates goodly.
     */
    SUCCESS = 0,
    /**
     * When the command did not terminate.
     */
    ERROR = 1,
    /**
     * When the command terminates but with some problems that occurred in the process.
     */
    ISSUED = 1
}
/**
 * The command block that includes the command, subcommands and/or subcommand groups.
 */
export interface CommandGroup {
    /**
     * The command constructor.
     */
    command: HashiSlashCommand | HashiMessageCommand;
    /**
     * The subcommand group constructor.
     */
    subcommandGroup?: HashiSlashSubcommandGroup;
    /**
     * The subcommand constructor.
     */
    subcommand?: HashiSlashSubcommand;
}
/**
 * The type that represents an element of CommandGroup.
 */
export type CommandGroupValue = CommandGroup[keyof CommandGroup];
/**
 * The interface that represents a command metadata.
 */
export interface CommandMetadata {
    /**
     * The type of the command.
     */
    type: HashiCommandType;
    /**
     * The name of the command.
     */
    id: string;
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
     * The external data for the command.
     */
    privileges?: CommandPrivileges;
    /**
     * The command data for the hashi slash command.
     */
    src?: APIApplicationCommandPrefilled;
    /**
     * The subcommand groups of the command.
     */
    subcommandGroups?: (typeof HashiSlashSubcommandGroup)[];
    /**
     * The subcommands of the command.
     */
    subcommands?: (typeof HashiSlashSubcommand)[];
}
/**
 * The keys of the command metadata.
 */
export type CommandMetadataKeys = keyof CommandMetadata;
/**
 * The privileges for a command (restrictions and prohibition).
 */
export interface CommandPrivileges {
    /**
     * If the command is forbidden in some specific channels.
     */
    forbiddenChannels?: string[];
    /**
     * If the command is forbidden for some specific users.
     */
    forbiddenUsers?: string[];
    /**
     * If the command is forbidden for some specific roles.
     */
    forbiddenRoles?: string[];
    /**
     * If the command is forbidden for some specific guilds.
     */
    forbiddenGuilds?: string[];
    /**
     * If the command is only allowed in some specific channels only.
     */
    uniqueChannels?: string[];
    /**
     * If the command is only allowed by some specific users only.
     */
    uniqueUsers?: string[];
    /**
     * If the command is only allowed by some specific roles only.
     */
    uniqueRoles?: string[];
    /**
     * If the command is only allowed in some specific guilds only.
     */
    uniqueGuilds?: string[];
}
/**
 * The type that represents a key included in CommandPrivileges.
 */
export type CommandPrivilegesKey = keyof CommandPrivileges;
/**
 * Represents an element in the cool downs queue.
 */
export type CoolDownsQueueElement = [
    /**
     The full name of the command (including the subcommands name).
     */
    string,
    /**
     * The end time of the cool down.
     */
    number,
    /**
     * The cool down amount.
     */
    number
];
/**
 * A default callback function used when nothing is set.
 * @returns Nothing.
 */
export declare function defaultEventCallback(): Promise<void>;
/**
 * The pair of paths based on the environment.
 */
export type EnvPath = Record<'lab' | 'prod', string>;
/**
 * The type used for defining abstractly the content of a file.
 */
export type FileContentType = {
    [dataKey: string]: any;
};
/**
 * The options for the HashiClient. It extends the ClientOptions from discord.js and implements extra options for the Hashi module.
 */
export interface HashiClientOptions extends ClientOptions {
    /**
     * The name of the project/process you're in.
     */
    processName: string;
    /**
     * The commands folder directory.
     */
    commandsDir?: string;
    /**
     * The events folder directory.
     */
    eventsDir?: string;
    /**
     * The data maps folder directory.
     */
    dataMapsDir?: string;
    /**
     * The mongoose connection information.
     */
    mongoose: {
        /**
         * The database name. Not useful to change it (only for MongoDB). Default: main.
         */
        dbName?: string;
        /**
         * The connection URI.
         */
        connectionURI: string;
        /**
         * The options for the connection.
         */
        connectOptions: ConnectOptions;
    };
}
/**
 * The different values of for the HashiCommandType type.
 */
export declare const HashiCommandValues: string[];
/**
 * The different types of command.
 */
export type HashiCommandType = (typeof HashiCommandValues)[number];
/**
 * Represents an error.
 */
export type HashiError = Error | DiscordjsError | DiscordAPIError;
/**
 * The model of a callback function for an event.
 * @param client The client instance.
 * @param args The command args.
 */
export type HashiEventCallbackFunction = (client: HashiClient, ...args: any[]) => void;
/**
 * Represents the function called back when the command is triggered.
 *
 * @param client The client that instanced the process.
 * @param interaction The associated interaction.
 * @param context The front-end class to manage interactions.
 * @returns COMMAND_END The exit command code.
 */
export type HashiSlashCommandCallbackFunction = (client: HashiClient, interaction: ChatInputCommandInteraction, context: Context) => Promise<COMMAND_END>;
/**
 * Represents an element in the interfering commands queue.
 * Interfering commands that are same-time executed.
 */
export type InterferingQueueElement = [
    /**
     * The full name of the command (including the subcommands name).
     */
    string,
    /**
     * The interaction id.
     */
    ChatInputCommandInteraction
];
/**
 * The interface including parameters for self-research program.
 */
export interface SelfResearchOptions {
    /**
     * The absolute self-path to look.
     */
    absPathStrSelf: string;
    /**
     * The recursive self-path to look.
     */
    rmPathStrSelf: string;
}
/**
 * A type-structure that represents a column or an object of columns.
 */
export type StructureColumnOrChild = {
    [key: string]: SuperModelColumn | StructureColumnOrChild;
};