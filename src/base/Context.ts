import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  InteractionResponse,
  Message,
  User,
} from 'discord.js';
import { BaseClient, ContextChannel, ContextOptions } from './';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { PublicChatInputCommandInteraction } from '../public';
import { Client, Command } from '../root';

/**
 * The class who manages the front part of an interaction with Discord and the user.
 */
export class Context extends BaseClient {
  /**
   * The command associated with the context.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Command))
  public command: Command = null;

  /**
   * The users implicated in the context/action.
   */
  @Validators.ArrayValidator.OnlyUsers
  public users: User[] = [];

  /**
   * The channel where the action occurs.
   */
  @(<InstanceValidator>Validators.ObjectValidator.ContextChannelInitial)
  public channel: ContextChannel = null;

  /**
   * The interaction, if there is one.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(PublicChatInputCommandInteraction))
  public interaction: ChatInputCommandInteraction = null;

  /**
   * The interaction button, if there is one.
   */
  @(<InstanceValidator>Validators.ObjectValidator.Matches)
  public buttonInteraction: ButtonInteraction = null;

  /**
   * @param client The client instance.
   * @param options The context options.
   */
  constructor(client: Client, options: ContextOptions) {
    super(client);

    if (options.command) this.command = options.command;
    this.users = options.users;
    this.channel = options.channel;
    if (options.interaction) this.interaction = options.interaction;
    if (options.buttonInteraction) this.buttonInteraction = options.buttonInteraction;
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
      message =
        (await interaction.reply(messageData).catch(this.command.client.logger.clean)) ||
        (await interaction.followUp(messageData).catch(this.command.client.logger.clean));
      if (!message) return null;
    } catch (error: unknown) {
      this.command.client.logger.clean(error);
      return null;
    }

    return message;
  }
}
