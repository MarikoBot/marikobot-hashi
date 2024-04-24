import {
  BaseGuildTextChannel,
  BaseGuildVoiceChannel,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ThreadChannel,
  User,
} from 'discord.js';
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
export enum DATAMAP_INTENTS {
  /**
   * If the data map is used for store the most important data (as process data).
   */
  CORE = 0,
}

/**
 * The type that includes all the data maps of the database.
 */
export type DataMapsObject = { [dmName: string]: DataMap<any> };

/**
 * A type that can be stored into a datamap.
 */
export type TypedDataMapStored =
  | number
  | string
  | boolean
  | TypedDataMapStored[]
  | { [key: string]: TypedDataMapStored }
  | undefined
  | Types.ObjectId;
