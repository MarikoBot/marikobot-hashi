import { APIApplicationCommand, ChatInputCommandInteraction, Collection } from 'discord.js';
import { BaseClient, Context } from './';
import {
  CommandInjectorTarget,
  InstanceInjector,
  InstanceValidator,
  InstanceValidatorReturner,
  Validators,
} from '../decorators';
import {
  CommandMetadata,
  CoolDownManager,
  Client,
  InterferingManager,
  Command,
  COMMAND_END,
  CommandGroup,
  CommandMetadataBase,
  CommandMetadataSubgroup,
} from '../root';

/**
 * Represents the command manager of the client. This class manages the slash and message commands for the project.
 */
export class CommandManager extends BaseClient {
  /**
   * The cool downs' manager instance, to get access to the different delays of the current command.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(CoolDownManager))
  public readonly coolDowns: CoolDownManager = new CoolDownManager();

  /**
   * The interfering manager instance, to have access to the different executing commands.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(InterferingManager))
  public readonly interfering: InterferingManager = new InterferingManager();

  /**
   * The list of commands.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Collection))
  public readonly commandsList: Collection<string, [typeof Command, CommandMetadata]> = new Collection<
    string,
    [typeof Command, CommandMetadata & { src: null }]
  >();

  /**
   * The list of discord commands data.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Collection))
  public readonly discordCommandsData: APIApplicationCommand[] = [];

  /**
   * The function that is called when the cool down manager authorization does not pass.
   */
  @(<InstanceValidator>Validators.FunctionValidator.Matches)
  public authorizationCallback: (context: Context, errorCode: string) => Promise<void> = async (
    context: Context,
    errorCode: string,
  ): Promise<void> => {
    await context.reply({
      content: `<:MarikoCross:1191675946353299456> **Error** → missing privileges authorizations. (privileges error code: **\`${errorCode}\`**)`,
      ephemeral: true,
    });
    return void 0;
  };

  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the callback function when the authorizations do not pass.
   * @param callback The function to set.
   * @returns The class instance.
   */
  public on(callback: (context: Context, errorCode: string) => Promise<void>): this {
    this.authorizationCallback = callback;
    return this;
  }

  /**
   * Get a slash command from the cache with the name.
   * @param interaction The interaction.
   * @returns The found command instance, or undefined, with its metadata.
   */
  public getCommandFromInteraction(interaction: ChatInputCommandInteraction): CommandGroup {
    const base: [typeof Command, CommandMetadata] | undefined = this.client.commands.commandsList.get(
      interaction.commandName,
    );
    if (!base) return;

    const commandGroup: CommandGroup = {
      command: new base[0](base[1]),
      metadata: base[1],
      subcommand: null,
      subcommandGroup: null,
    };

    const [maybeSub, maybeGroup]: [string, string] = [
      interaction.options.getSubcommand(),
      interaction.options.getSubcommandGroup(),
    ];

    if (maybeSub) {
      if (maybeGroup)
        commandGroup.subcommandGroup = base[1].subcommandGroups.filter(
          (group: CommandMetadataSubgroup): boolean => group.id === maybeGroup,
        )[0];

      commandGroup.subcommand = (maybeGroup ? commandGroup.subcommandGroup || base[1] : base[1]).subcommands.filter(
        (sub: CommandMetadataBase): boolean =>
          sub.id === `${base[1].id} ${maybeGroup ? `${maybeGroup} ` : ''}${maybeSub}`,
      )[0];
    }

    return commandGroup;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Function that encapsulates the command detection, authorization and execution.
   * @param interaction The associated interaction.
   * @returns The issue of the command.
   */
  public async detectAndLaunchSlashCommand(interaction: ChatInputCommandInteraction): Promise<COMMAND_END> {
    const commandGroup: CommandGroup = this.getCommandFromInteraction(interaction);
    if (commandGroup.command) return commandGroup.command.launch(this.client, interaction, commandGroup);
    return COMMAND_END.SUCCESS;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * The decorator to inject metadata into the constructor of Command.
   * @param metadata The metadata of the command.
   * @returns The decorator.
   */
  public inject(metadata: CommandMetadata): InstanceInjector {
    const instance: CommandManager = this;
    return function (target: CommandInjectorTarget): void {
      instance.client.logger.info(`Bound command: ${metadata.id}`);

      if (!('src' in metadata)) throw new Error(`A slash-based command shall have a 'src' property into its metadata.`);

      const discordDataOnly: APIApplicationCommand = <APIApplicationCommand>(<unknown>metadata.src);
      instance.discordCommandsData.push(discordDataOnly);

      instance.commandsList.set(metadata.id, [<typeof Command>target, { ...metadata }]);
    };
  }
}
