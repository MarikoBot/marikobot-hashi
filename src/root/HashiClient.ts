import { ActivityType, ChatInputCommandInteraction, Client, PresenceData } from 'discord.js';
import * as dotenv from 'dotenv';
import {
  CommandManager,
  DatabaseManager,
  DataMap,
  DATAMAP_INTENTS,
  EventManager,
  LanguageManager,
  TypedDataMapStored,
} from '../base/';
import { Validators, InstanceValidator, InstanceValidatorReturner } from '../decorators';
import { CommandGroup, HashiClientOptions, COMMAND_END, FileManager, HashiSlashCommand, Logger } from './';

dotenv.config();

/**
 * The HashiClient class. It extends the Client class from discord.js and implements extra methods for the Hashi module.
 */
export class HashiClient {
  /**
   * The Discord Client instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Client))
  public readonly src: Client;

  /**
   * The logger for the HashiClient.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Logger))
  public readonly logger: Logger;

  /**
   * The command manager instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(CommandManager))
  public readonly commandManager: CommandManager = new CommandManager(this);

  /**
   * The event manager instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(EventManager))
  public readonly eventManager: EventManager = new EventManager(this);

  /**
   * The language manager for accessing strings.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(LanguageManager))
  public readonly languageManager: LanguageManager = new LanguageManager(this);

  /**
   * The database manager for accessing data maps/lakes.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(DatabaseManager))
  public readonly databaseManager: DatabaseManager = new DatabaseManager(this);

  /**
   * The files manager for accessing different files (for handling especially).
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(FileManager))
  public readonly fileManager: FileManager = new FileManager(this);

  /**
   * The name of the project/process you're in.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public readonly processName: string;

  /**
   * The commands folder directory.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public readonly commandsDir: string = 'commands';

  /**
   * The events folder directory.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public readonly eventsDir: string = 'events';

  /**
   * The data maps folder directory.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public readonly dataMapsDir: string = 'data';

  /**
   * @param options The options for the HashiClient.
   */
  constructor(options: HashiClientOptions) {
    this.src = new Client({
      intents: options.intents || 3276799,
      failIfNotExists: options.failIfNotExists || false,
      presence:
        options.presence ||
        <PresenceData>{
          status: 'online',
          activities: [
            {
              name: `with version ${require('../../package.json').version}`,
              type: ActivityType['Playing'],
            },
          ],
        },
    });

    this.processName = options.processName || '`unknown`';
    this.logger = new Logger(this.processName);
    this.commandsDir = options.commandsDir || 'commands';
    this.eventsDir = options.eventsDir || 'events';
    this.dataMapsDir = options.dataMapsDir || 'data/definitions';

    this.databaseManager.dbName = options.mongoose.dbName || 'main';
    this.databaseManager.connectOptions = options.mongoose.connectOptions || { dbName: this.databaseManager.dbName };
    if (options.mongoose.connectionURI) this.databaseManager.connectionURI = options.mongoose.connectionURI;
  }

  /**
   * Login the client to Discord.
   * @param token The token of the bot.
   * @returns Nothing.
   */
  public async login(token: string = process.env.TOKEN || process.env.token || process.env.Token): Promise<string> {
    await this.databaseManager.connect();
    this.databaseManager.loadDataMaps();

    await this.eventManager.loadEvents();

    await this.src.login(token);

    await this.commandManager.loadCommands();

    let i: number = -1;
    let dataMap: DataMap<TypedDataMapStored>;
    while (++i < Object.keys(this.databaseManager.dataMaps).length) {
      dataMap = Object.values(this.databaseManager.dataMaps)[i];
      if (dataMap.intents.includes(DATAMAP_INTENTS.CORE)) await dataMap.refreshCore();
    }

    this.logger.info(`The client is successfully launched on Discord as ${this.src.user.tag}`);

    return '0';
  }

  /**
   * Function that encapsulates the command detection, authorization and execution.
   * @param interaction The associated interaction.
   * @returns The issue of the command.
   */
  public async detectAndLaunchSlashCommand(interaction: ChatInputCommandInteraction): Promise<COMMAND_END> {
    const CommandGroup: CommandGroup = this.commandManager.getCommandFromInteraction(interaction);
    if (CommandGroup.command) return HashiSlashCommand.launch(this, interaction, CommandGroup);
    return COMMAND_END.SUCCESS;
  }
}
