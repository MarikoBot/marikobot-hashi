// noinspection JSUnusedGlobalSymbols

import {
  BaseGuildTextChannel,
  BaseGuildVoiceChannel,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  ThreadChannel,
  User,
} from 'discord.js';
import { Language, LanguageContentKey } from './LanguageManager';
import { CommandBlockValue } from './CommandManager';
import { Base } from './Base';
import { HashiClient } from '../root/HashiClient';

/**
 * The data extracted structure.
 */
export interface ExtractedDataFromString {
  data: {
    [varName: string]: string;
  };
  origin: string;
}

/**
 * Represents the type for a context possible channel type among Discord package.
 */
export type ContextChannel = BaseGuildTextChannel | BaseGuildVoiceChannel | ThreadChannel;

/**
 * The options for the context constructor.
 */
export interface ContextOptions {
  /**
   * The language id of the main user.
   */
  languageId?: Language;
  /**
   * The command associated with the context.
   */
  command: CommandBlockValue;
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
 * The class who manages the front part of an interaction with Discord and the user.
 */
export class Context extends Base {
  /**
   * The language id of the main user.
   */
  #languageId: Language = 'fr';

  /**
   * The command associated with the context.
   */
  #command: CommandBlockValue;

  /**
   * The users implicated in the context/action.
   */
  #users: User[];

  /**
   * The channel where the action occurs.
   */
  #channel: ContextChannel;

  /**
   * The interaction, if there is one.
   */
  #interaction: ChatInputCommandInteraction;

  /**
   * The interaction button, if there is one.
   */
  #buttonInteraction: ButtonInteraction;

  /**
   * Get the language id.
   * @returns The language id.
   */
  get languageId(): Language {
    return this.#languageId;
  }

  /**
   * Get the command.
   * @returns The command.
   */
  get command(): CommandBlockValue {
    return this.#command;
  }

  /**
   * Get the users.
   * @returns The users.
   */
  get users(): User[] {
    return this.#users;
  }

  /**
   * Get the channel.
   * @returns The channel.
   */
  get channel(): ContextChannel {
    return this.#channel;
  }

  /**
   * Get the interaction.
   * @returns The interaction.
   */
  get interaction(): ChatInputCommandInteraction {
    return this.#interaction;
  }

  /**
   * Get the button interaction.
   * @returns The button interaction.
   */
  get buttonInter(): ButtonInteraction {
    return this.#buttonInteraction;
  }

  /**
   * The constructor of the context.
   * @param client The client instance.
   * @param options The context options.
   */
  constructor(client: HashiClient, options: ContextOptions) {
    super(client);

    if (options.languageId) this.setLanguageId(options.languageId);
    if (options.command) this.setCommand(options.command);
    this.setUsers(options.users);
    this.setChannel(options.channel);
    if (this.interaction) this.setInteraction(options.interaction);
    if (this.buttonInter) this.setButtonInteraction(options.buttonInteraction);
  }

  /**
   * Set the language id.
   * @param languageId The language id to set.
   * @returns The class instance.
   */
  public setLanguageId(languageId: Language): Context {
    if (typeof languageId === 'string') this.#languageId = languageId;
    return this;
  }

  /**
   * Set the command.
   * @param commandBlock The command block to set.
   * @returns The class instance.
   */
  public setCommand(commandBlock: CommandBlockValue): Context {
    if (typeof commandBlock === 'object') this.#command = commandBlock;
    return this;
  }

  /**
   * Add a user.
   * @param user The user to add.
   * @returns The class instance.
   */
  public addUser(user: User): Context {
    if (user instanceof User) this.#users.push(user);
    return this;
  }

  /**
   * Remove a user.
   * @param user The user to remove.
   * @returns The class instance.
   */
  public removeUser(user: User): Context {
    if (user instanceof User)
      this.#users = this.#users.filter((presentUser: User): boolean => presentUser.id !== user.id);
    return this;
  }

  /**
   * Set the users.
   * @param users The users to set.
   * @returns The class instance.
   */
  public setUsers(users: User[]): Context {
    if (users.every((user: User): boolean => user instanceof User)) this.#users = users;
    return this;
  }

  /**
   * Set the channel.
   * @param channel The channel to set.
   * @returns The class instance.
   */
  public setChannel(channel: ContextChannel): Context {
    if (typeof channel === 'object') this.#channel = channel;
    return this;
  }

  /**
   * Set the interaction.
   * @param interaction The interaction to set.
   * @returns The class instance.
   */
  public setInteraction(interaction: ChatInputCommandInteraction): Context {
    if (interaction instanceof ChatInputCommandInteraction) this.#interaction = interaction;
    return this;
  }

  /**
   * Set the button interaction.
   * @param buttonInter The button interaction to set.
   * @returns The class instance.
   */
  public setButtonInteraction(buttonInter: ButtonInteraction): Context {
    if (buttonInter instanceof ButtonInteraction) this.#buttonInteraction = buttonInter;
    return this;
  }

  /**
   * Reply to an interaction.
   * @param messageData The message data to send (Discord.<BaseMessageOptions>).
   * @param interaction The interaction to reply to.
   * @returns The message instance, or null if not sent.
   */
  public async reply(
    messageData: InteractionReplyOptions | string,
    interaction: Context['interaction'] = this.interaction,
  ): Promise<Message | InteractionResponse | null> {
    if (!this.channel.isTextBased()) return null;
    let message: void | InteractionResponse | Message;

    try {
      if (!interaction.deferred) message = await interaction.reply(messageData).catch(this.command.client.logger.clean);
      else message = await interaction.followUp(messageData).catch(this.command.client.logger.clean);

      if (!message) return null;
    } catch (error: unknown) {
      this.command.client.logger.clean(error);
      return null;
    }

    return message;
  }

  /**
   * Use a string from a translation with some variables on it.
   * @param key The string to get the translation from.
   * @param vars The variables to replace on.
   * @returns The translated string.
   */
  public translate(key: LanguageContentKey, ...vars: any[]): string {
    const str: string[] = (<string>this.command.client.languageManager.getStr(this.languageId, key)).split('[[]]');
    let finalStr: string = str[0];

    if (vars.length > 0) {
      let i: number = -1;
      while (++i < str.length - 1) finalStr += vars[i] + str[i + 1];
      return finalStr;
    } else return str.join('??');
  }

  /**
   * Extract data from a string. Extract especially tags to apply properties.
   * @param str The string to extract from.
   * @param brackets The brackets to remove the content from.
   * @returns An object with the data extracted and the string without the tags.
   */
  public static extractDataFromStr(str: string, brackets: [string, string] = ['{{', '}}']): ExtractedDataFromString {
    const data: { [index: string]: string } = {};
    let finalStr: string = str;
    let KV: string;
    let key: string;
    let value: string;

    let i: number = -1;
    while (++i < str.split(brackets[0]).length - 1) {
      if (finalStr.split(brackets[0]).length <= 1) break;
      KV = finalStr.split(brackets[0])[1].split(brackets[1])[0];
      key = KV.split('::')[0];
      value = KV.split('::')[1];

      if (finalStr.includes(brackets[0]))
        finalStr =
          finalStr.split(brackets[0])[0] + (finalStr.includes(brackets[1]) ? finalStr.split(brackets[1])[1] : '');

      data[key] = value;
    }

    return { data, origin: finalStr };
  }
}