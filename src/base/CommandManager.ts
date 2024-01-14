import { ChatInputCommandInteraction, Collection } from 'discord.js';
import { HashiSlashBaseCommand, HashiSlashCommand } from '../root/';
import { CoolDownManager } from '../root/';
import { InterferingManager } from '../root/';
import { HashiClient } from '../root/';
import { HashiSlashSubcommand } from '../root/';
import { HashiSlashSubcommandGroup } from '../root/';
import { Base } from './Base';
import * as fs from 'fs';
import * as path from 'path';
import { FileManager } from '../root/FileManager';
import { Model } from 'mongoose';

/**
 * A triplet returned when the client transforms an interaction into a callable class group.
 */
export interface CommandBlock {
  /**
   * The subcommand group if there is one.
   */
  subcommandGroup: HashiSlashSubcommandGroup;
  /**
   * The subcommand if there is one.
   */
  subcommand: HashiSlashSubcommand;
  /**
   * The command.
   */
  command: HashiSlashCommand;
}

/**
 * The type that represents an element of CommandBlock.
 */
export type CommandBlockValue = CommandBlock[keyof CommandBlock];

/**
 * Represents the command manager of the client.
 */
export class CommandManager extends Base {
  /**
   * The cool downs' manager instance, to get access to the different delays of the current command.
   */
  readonly #coolDowns: CoolDownManager = new CoolDownManager();

  /**
   * The interfering manager instance, to have access to the different executing commands.
   */
  readonly #interfering: InterferingManager = new InterferingManager();

  /**
   * The list of commands.
   */
  readonly #commandsList: Collection<string, HashiSlashCommand> = new Collection<string, HashiSlashCommand>();

  /**
   * Get the cool downs' manager.
   * @returns The cool downs' manager.
   */
  get coolDowns(): CoolDownManager {
    return this.#coolDowns;
  }

  /**
   * Get the interfering manager.
   * @returns The interfering manager.
   */
  get interfering(): InterferingManager {
    return this.#interfering;
  }

  /**
   * Get the list of commands.
   * @returns The list of commands.
   */
  get commandsList(): Collection<string, HashiSlashCommand> {
    return this.#commandsList;
  }

  /**
   * The constructor of the command manager.
   * @param client The client instance.
   */
  constructor(client: HashiClient) {
    super(client);
  }

  /**
   * Add a command to the client (the bot) using the name, options and or the command itself.
   * If no command is passed, the function creates one based on the data passed.
   * @param commandData The options passed (name, command options, command instance).
   * @returns The command manager instance (this).
   */
  public addCommand(commandData: HashiSlashCommand): CommandManager {
    this.commandsList.set(commandData.name, commandData);
    return this;
  }

  /**
   * Get a command from the cache with the name.
   * @param interaction The interaction.
   * @returns The found command instance, or undefined.
   */
  public getCommand(interaction: ChatInputCommandInteraction): CommandBlock {
    let command: HashiSlashCommand = this.commandsList.get(interaction.commandName);

    const commandSubcommandGroupOption: string = command.hashiSubcommandsGroups.length
      ? interaction.options.getSubcommandGroup()
      : null;
    const commandSubcommandOption: string = command.hashiSubcommands.length
      ? interaction.options.getSubcommand()
      : null;

    let subcommandGroup: HashiSlashSubcommandGroup;
    let subcommand: HashiSlashSubcommand;

    if (commandSubcommandGroupOption) {
      subcommandGroup = command.hashiSubcommandsGroups
        .filter((group: HashiSlashSubcommandGroup): boolean => group.name === commandSubcommandGroupOption)
        ?.at(0);
      subcommand = subcommandGroup.hashiSubcommands
        .filter((cmd: HashiSlashSubcommand): boolean => cmd.name === interaction.options.getSubcommand())
        ?.at(0);

      subcommandGroup.setClient(this.client);
      subcommand.setClient(this.client);
    } else if (commandSubcommandOption) {
      subcommand = command.hashiSubcommands
        .filter((cmd: HashiSlashSubcommand): boolean => cmd.name === commandSubcommandOption)
        ?.at(0);

      subcommand.setClient(this.client);
    }

    command.setClient(this.client);

    return { command, subcommand, subcommandGroup };
  }

  /**
   * Load the commands from the given commands directory.
   * @returns Nothing.
   */
  public async loadCommands(): Promise<void> {
    const commandFiles: [string, HashiSlashCommand][] = this.client.fileManager.read<HashiSlashCommand>(
      `${FileManager.ABSPATH}${this.client.commandsDir}`,
      `${FileManager.RMPATH}${this.client.commandsDir}`,
      {
        absPathStrSelf: `./lib/${this.client.commandsDir}`,
        rmPathStrSelf: `../${this.client.commandsDir}`,
      },
    );

    const commands: HashiSlashCommand[] = [];
    let commandData: HashiSlashCommand;

    let i: number = -1;
    while (++i < commandFiles.length) {
      commandData = commandFiles[i][1][commandFiles[i][0]];
      commandData.setClient(this.client);

      this.client.commandManager.commandsList.set(commandData.name, commandData);

      const discordDataOnly: HashiSlashCommand = Object.assign(new HashiSlashCommand('default'), commandData);
      discordDataOnly.clearClient();
      discordDataOnly.clearContext();
      commands.push(discordDataOnly);
    }

    void (await this.client.src.application.commands.set(commands));
  }
}
