import { ChatInputApplicationCommandData, ChatInputCommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { Context } from '../base';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import {
  COMMAND_END,
  CommandGroup,
  CommandPrivileges,
  CommandPrivilegesKey,
  CoolDownsQueueElement,
  Client,
  HashiError,
  InterferingQueueElement,
  CommandMetadata,
  bitRecord,
} from './';

/**
 * The class that includes many useful functions shared between HashiMessageCommand and SlashCommand.
 */
export class Command {
  /**
   * The client instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Client))
  public client: Client = null;

  /**
   * The name of the command.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public id: string;

  /**
   * The description of the command.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidNonFormatted)
  public description: string = 'No description provided.';

  /**
   * The list of errors for the command occurrence.
   */
  @Validators.ArrayValidator.OnlyHashiErrors
  public errors: HashiError[] = [];

  /**
   * The commands that must be executed before this one.
   * If one of the interfering commands is same-time running, this command will be ignored.
   */
  @Validators.ArrayValidator.OnlyObjects
  public interferingCommands: ChatInputApplicationCommandData['name'][] = [];

  /**
   * The amount of time before running the command again. Must be between 0 and 300 seconds.
   */
  @Validators.NumberValidator.Matches
  public coolDown: number = 0;

  /**
   * The context of the command.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Context))
  public context: Context = null;

  /**
   * The external data for the command.
   */
  @(<InstanceValidator>Validators.ObjectValidator.KeyStringArrayPair)
  public privileges: CommandPrivileges = {};

  /**
   * @param metadata The metadata of the command.
   */
  constructor(metadata: CommandMetadata) {
    this.id = metadata.id;
    this.description = metadata.src.description || 'Nothing.';
    this.interferingCommands = metadata.interferingCommands || [];
    this.coolDown = metadata.coolDown || 0;
    this.privileges = metadata.privileges || {};
  }

  /**
   * The callback function called.
   * @param client The client instance.
   * @param ctx The associated context.
   * @returns If the command ran successfully or not.
   */
  public async callback(client: Client, ctx: Context): Promise<COMMAND_END> {
    this.client.logger.info(client, ctx);
    return COMMAND_END.SUCCESS;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The function who MUST be called at the end of your program in the call back function. IT IS REALLY IMPORTANT!
   *
   * @returns The exit code of the command.
   */
  public end(): COMMAND_END {
    this.client.commands.interfering.removeInterfering(this.context.interaction.user.id, this.id);
    return this.errors.length === 0 ? COMMAND_END.SUCCESS : COMMAND_END.ISSUED;
  }

  /**
   * Returns a boolean value. If the user is authorized to run the command.
   *
   * @param interaction The interaction of the command.
   * @param metadata The metadata to check the command with.
   * @returns If the user can execute the command.
   */
  public async isAuthorized(interaction: ChatInputCommandInteraction, metadata: CommandMetadata): Promise<boolean> {
    const privilegesData: CommandPrivileges = {
      forbiddenUsers: [],
      uniqueUsers: [],
      forbiddenGuilds: [],
      uniqueGuilds: [],
      forbiddenRoles: [],
      uniqueRoles: [],
      forbiddenChannels: [],
      uniqueChannels: [],
      ...metadata.privileges,
    };
    const missing: string[] = [];
    let privileges: string = '0b0';

    const authBooleans: { [authKey: string]: boolean } = {
      forbiddenUser: !privilegesData.forbiddenUsers.includes(interaction.user.id),
      uniqueUser: !privilegesData.uniqueUsers.length || privilegesData.uniqueUsers.includes(interaction.user.id),
      forbiddenGuild: !privilegesData.forbiddenGuilds.includes(interaction.guildId),
      uniqueGuild: !privilegesData.uniqueGuilds.length || privilegesData.uniqueGuilds.includes(interaction.guildId),
      forbiddenRole: !privilegesData.forbiddenRoles.some((role: string) =>
        (<GuildMemberRoleManager>interaction.member?.roles).cache.has(role),
      ),
      uniqueRole:
        !privilegesData.uniqueRoles.length ||
        privilegesData.uniqueRoles.every((role: string) =>
          (<GuildMemberRoleManager>interaction.member?.roles).cache.has(role),
        ),
      forbiddenChannel: !privilegesData.forbiddenChannels.includes(interaction.channel.id),
      uniqueChannel:
        !privilegesData.uniqueChannels.length || privilegesData.uniqueChannels.includes(interaction.channel.id),
    };

    for (const [authKey, value] of Object.entries(authBooleans)) {
      if (value) {
        privileges = Number(privileges) > Number(bitRecord[`${authKey}s`]) ? privileges : bitRecord[`${authKey}s`];
        continue;
      }
      missing.push(`${authKey}s`);
    }

    const highestMissing: string = missing.sort(
      (a: CommandPrivilegesKey, b: CommandPrivilegesKey) => Number(bitRecord[b]) - Number(bitRecord[a]),
    )[0];
    const isAuth: boolean = missing.length > 0 ? Number(highestMissing) < Number(privileges) : true;
    if (!isAuth) {
      const errorCode: string = `${missing.length}${missing
        .map((e: CommandPrivilegesKey) => Number(bitRecord[e]))
        .reduce((acc: number, val: number) => acc + val, 0)}`;
      this.client.logger.debug(missing);
      void this.client.commands.authorizationCallback(this.context, errorCode);
    }

    return isAuth;
  }

  /**
   * Verify if the cool downs, and the interfering commands of the command are ready to call the command again.
   *
   * @param client The client that instanced the event.
   * @param interaction The associated interaction.
   * @param ctx The context within the call.
   * @param metadata The command metadata.
   * @returns If the wall is passed or not.
   */
  public async flowControlWall(
    client: Client,
    interaction: ChatInputCommandInteraction,
    ctx: Context,
    metadata: CommandMetadata,
  ): Promise<boolean> {
    const activeCoolDowns: CoolDownsQueueElement[] = client.commands.coolDowns.values(interaction.user.id, metadata.id);
    const activeInterfering: InterferingQueueElement[] = client.commands.interfering.values(
      interaction.user.id,
      ...(metadata.interferingCommands || []),
    );

    if (activeCoolDowns.length > 0) {
      void this.client.commands.coolDowns.callback(ctx, activeCoolDowns[0][1]);
      return false;
    }
    if (activeInterfering.length > 0) {
      const interferingList: string[] = activeInterfering.map(
        (i: InterferingQueueElement): string => `</${i[0]}:${i[1].commandId}>`,
      );

      void this.client.commands.interfering.callback(ctx, interferingList);
      return false;
    }

    return true;
  }

  /**
   * Registers the cool down and the interfering commands.
   * @param client The client that instanced the event.
   * @param interaction The associated interaction.
   * @param commandGroup The Command [subclass] instance.
   * @returns Nothing.
   */
  public async flowControlRegister(
    client: Client,
    interaction: ChatInputCommandInteraction,
    commandGroup: CommandGroup,
  ): Promise<void> {
    client.commands.interfering.registerInterfering(
      interaction.user.id,
      commandGroup.subcommand?.id || commandGroup.metadata.id,
      interaction,
    );
    client.commands.coolDowns.registerCoolDown(
      interaction.user.id,
      commandGroup.subcommand?.id || commandGroup.metadata?.id,
      commandGroup.subcommand?.coolDown ||
        commandGroup.subcommandGroup?.coolDown ||
        commandGroup.command?.coolDown ||
        0,
    );
  }

  /**
   * Launch the basic and starting verifications.
   * @param client The client that instanced the event.
   * @param interaction The associated interaction.
   * @param commandGroup The command group.
   * @returns If the command executed successfully.
   */
  public async launch(
    client: Client,
    interaction: ChatInputCommandInteraction,
    commandGroup: CommandGroup,
  ): Promise<COMMAND_END> {
    if (commandGroup.subcommandGroup && !commandGroup.subcommand) return;

    let metadata: CommandMetadata = commandGroup.metadata;
    if (commandGroup.subcommand)
      metadata = {
        ...metadata,
        ...(commandGroup.subcommandGroup ? commandGroup.subcommandGroup : {}),
        ...commandGroup.subcommand,
      };

    commandGroup.command.client = client;

    const ctx: Context = new Context(client, {
      channel: interaction.channel,
      command: this,
      interaction,
      users: [interaction.user],
    });
    this.refreshContext(ctx);

    const authorized: boolean = await this.isAuthorized(interaction, metadata);
    if (!authorized) return COMMAND_END.ERROR;

    const flowWall: boolean = await this.flowControlWall(client, interaction, ctx, metadata);
    if (!flowWall) return COMMAND_END.ERROR;

    await this.flowControlRegister(client, interaction, commandGroup);

    const commandWall: Promise<COMMAND_END> = commandGroup.command.callback(client, ctx);
    return await commandWall;
  }

  /**
   * Refreshes the context.
   * @param context The context to refresh with.
   * @returns The class instance.
   */
  private refreshContext(context: Context): this {
    context.command = this;
    this.context = context;
    return this;
  }
}
