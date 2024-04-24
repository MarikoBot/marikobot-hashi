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
import { BaseGuildTextChannel, BaseGuildVoiceChannel, ButtonInteraction, ChatInputCommandInteraction, ThreadChannel, User } from 'discord.js';
import { DataMap } from './DataMap';
import { Types } from 'mongoose';
import { Command } from '../root';
/**
 * The options for the context constructor.
 */
export interface ContextOptions {
    /**
     * The command associated with the context.
     */
    command: Command;
    /**
     * The users implicated in the context/action.
     */
    users: User[];
    /**
     * The channel where the action occurs.
     */
    channel: ContextChannel;
    /**
     * The interaction, if there is one.
     */
    interaction: ChatInputCommandInteraction;
    /**
     * The interaction button, if there is one.
     */
    buttonInteraction?: ButtonInteraction;
}
/**
 * Represents the type for a context possible channel type among Discord.js library.
 */
export type ContextChannel = BaseGuildTextChannel | BaseGuildVoiceChannel | ThreadChannel;
/**
 * The list of flags for the data map intents.
 */
export declare enum DATAMAP_INTENTS {
    /**
     * If the data map is used for store the most important data (as process data).
     */
    CORE = 0
}
/**
 * The type that includes all the data maps of the database.
 */
export type DataMapsObject = {
    [dmName: string]: DataMap<any>;
};
/**
 * A type that can be stored into a datamap.
 */
export type TypedDataMapStored = number | string | boolean | TypedDataMapStored[] | {
    [key: string]: TypedDataMapStored;
} | undefined | Types.ObjectId;
