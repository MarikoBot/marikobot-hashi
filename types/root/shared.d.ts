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
import { APIApplicationCommandOption, ChatInputApplicationCommandData, ChatInputCommandInteraction, ClientOptions as DiscordClientOptions, DiscordAPIError, DiscordjsError, LocalizationMap } from 'discord.js';
import { ConnectOptions } from 'mongoose';
import { Command, SuperModelColumn } from './';
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
    ISSUED = 2
}
/**
 * The command block that includes the command, subcommands and/or subcommand groups.
 */
export interface CommandGroup {
    /**
     * The command constructor.
     */
    command: Command;
    /**
     * The base metadata for the command.
     */
    metadata: CommandMetadata;
    /**
     * The subcommand group metadata.
     */
    subcommandGroup?: CommandMetadataSubgroup;
    /**
     * The subcommand metadata.
     */
    subcommand?: CommandMetadataBase;
}
/**
 * The interface that represents a command metadata.
 */
export interface CommandMetadataBase {
    /**
     * The name of the command.
     */
    id: string;
    /**
     * The commands that must be executed before this one.
     * If one of the interfering commands is same-time running, this command will be ignored.
     */
    interferingCommands?: ChatInputApplicationCommandData['name'][];
    /**
     * The amount of time before running the command again. Must be between 0 and 300 seconds.
     */
    coolDown?: number;
    /**
     * The external data for the command.
     */
    privileges?: CommandPrivileges;
}
/**
 * The interface that represents a command metadata.
 */
export interface CommandMetadata extends CommandMetadataBase {
    /**
     * The command data for the hashi slash command.
     */
    src: APIApplicationCommandPrefilled;
    /**
     * The subcommand groups of the command.
     */
    subcommandGroups?: CommandMetadataSubgroup[];
    /**
     * The subcommands of the command.
     */
    subcommands?: CommandMetadataBase[];
}
/**
 * The interface that represents a command metadata.
 */
export interface CommandMetadataSubgroup extends CommandMetadataBase {
    /**
     * The subcommands of the command.
     */
    subcommands: CommandMetadata['subcommands'];
}
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
     * The full name of the command (including the subcommands name).
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
 * The options for the Client. It extends the ClientOptions from discord.js and implements extra options for the Hashi module.
 */
export interface ClientOptions extends DiscordClientOptions {
    /**
     * The name of the project/process you're in.
     */
    projectName: string;
    /**
     * The Discord channels where the bot can be configured/logged.
     */
    configChannels: ClientChannelsOption;
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
 * The Discord channels where the bot can be configured/logged.
 */
export interface ClientChannelsOption {
    /**
     * The channel for the bot status.
     */
    status: string;
}
/**
 * Represents an error.
 */
export type HashiError = Error | DiscordjsError | DiscordAPIError;
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
 * A type-structure that represents a column or an object of columns.
 */
export type StructureColumnOrChild = {
    [key: string]: SuperModelColumn<any> | StructureColumnOrChild;
} | SuperModelColumn<any>;
/**
 * The bits value for each command privileges key.
 */
export declare const bitRecord: Record<CommandPrivilegesKey, string>;
/**
 * The list of mode-colors for logging assets.
 */
export declare const loggerModes: readonly ["error", "success", "warning", "info", "debug", "test", "clean"];
/**
 * The type that represent a logger mode-color.
 */
export type LoggerMode = (typeof loggerModes)[number];
