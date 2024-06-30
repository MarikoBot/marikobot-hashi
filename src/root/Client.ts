import {
  ActivityType,
  ApplicationCommandDataResolvable,
  Client as DiscordClient,
  ClientOptions as DiscordClientOptions,
  PresenceData,
} from 'discord.js';
import {
  CommandManager,
  Context,
  DatabaseManager,
  DataMap,
  DATAMAP_INTENTS,
  DiscordEventManager,
  Logger,
  TypedDataMapStored,
} from '../base/';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import * as Features from '../features';
import { ClientOptions, Command, JSONHashiConfigStructure } from './';
import { CommandDefaultFeature, EventDefaultFeature } from '../features/shared';

/**
 * The Client class. It extends the Client class from discord.js and implements extra methods for the Hashi module.
 */
export class Client {
  /**
   * The Discord Client instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(DiscordClient))
  public readonly src: DiscordClient;

  /**
   * The logger for the Client.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Logger))
  public readonly logger: Logger;

  /**
   * The command manager instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(CommandManager))
  public readonly commands: CommandManager = new CommandManager(this);

  /**
   * The event manager instance.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(DiscordEventManager))
  public readonly events: DiscordEventManager = new DiscordEventManager(this);

  /**
   * The database manager for accessing data maps/lakes.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(DatabaseManager))
  public readonly db: DatabaseManager = new DatabaseManager(this);

  /**
   * Configuration JSON content.
   */
  @(<InstanceValidator>Validators.ObjectValidator.Matches)
  public readonly config: JSONHashiConfigStructure;

  /**
   * @param options The options for the Client.
   */
  constructor(options: ClientOptions | (JSONHashiConfigStructure & DiscordClientOptions)) {
    options = Client.formatOptions(options);

    this.src = new DiscordClient({
      intents: options.intents || 3276799,
      failIfNotExists: options.failIfNotExists || false,
      presence:
        options.presence ||
        <PresenceData>{
          status: 'online',
          activities: [
            {
              name: `with version ${require('../../package.json').version}`,
              type: ActivityType.Playing,
            },
          ],
        },
    });
    this.config = options.config;

    Logger.info(`Process initialization.`);

    void this.loadDefaultFeatures(this.config.defaultFeatures);

    this.db.dbName = options.config.database.databaseName || 'main';
    this.db.connectionURI = options.config.database.connectionURI;
    this.db.connectOptions = {
      dbName: options.config.database.databaseName,
      family: Number(options.config.database.addressFamily.replace('IPv', '')),
    };

    process.on('unhandledRejection', (reason: Error) => {
      Logger.log('error', reason);
      Logger.log('error', reason.stack);
    });
    process.on('uncaughtException', (err: Error, origin: NodeJS.UncaughtExceptionOrigin): void => {
      Logger.log('error', err);
      Logger.log('error', origin);
      console.log(err, origin);
    });
  }

  /**
   * Converts the constructor argument into a valid format if it is not.
   * @param options The options for the Client.
   * @returns The formatted object.
   */
  public static formatOptions(
    options: ClientOptions | (JSONHashiConfigStructure & DiscordClientOptions),
  ): ClientOptions {
    if ('config' in options) return <ClientOptions>options;
    else return <ClientOptions>{ config: options, ...options };
  }

  /**
   * Tries something and returns null if it does not exist.
   * @param func The function to call.
   * @param args The args associated to the function.
   * @returns The func callback or null.
   */
  public static tryTo(func: Function, ...args: any[]): any | null {
    try {
      return func(...args);
    } catch {
      return null;
    }
  }

  /**
   * Load the default features if there are one specified into the package.
   * @param defaultFeatures The list of default features to load.
   * @returns Nothing.
   */
  public loadDefaultFeatures(defaultFeatures: JSONHashiConfigStructure['defaultFeatures']): void {
    for (let feature of defaultFeatures) {
      if (feature.startsWith('Command:')) {
        let featureName: string = feature.replace('Command:', '');
        let data: CommandDefaultFeature;

        if (featureName === 'help') data = Features.Commands.HelpDefault.default(Command, Client, Context);
        if (featureName === 'ping') data = Features.Commands.PingDefault.default(Command, Client, Context);

        this.commands.inject(data.metadata)(data.default);
      } else if (feature.startsWith('Event:')) {
        let featureName: string = feature.replace('Event:', '');
        let data: EventDefaultFeature;

        if (featureName === 'commands') data = Features.Events.CommandsDefault.default(Client);

        this.events.inject(data.eventName, data.default);
      }
    }
  }

  /**
   * Connect the database.
   * @returns Nothing.
   */
  public async connectDatabase(): Promise<void> {
    Logger.info('Database is connecting...');
    await this.db.connect();
    Logger.success('Database is connected.');
  }

  /**
   * Login the client to Discord.
   * @param token The token of the bot.
   * @returns Nothing.
   */
  public async login(token: string = process.env.TOKEN || process.env.token || process.env.Token): Promise<string> {
    Logger.info('Bot is connecting...');
    await this.src.login(token);
    Logger.success('Bot is connected.');

    void (await this.src.application.commands.set(
      <readonly ApplicationCommandDataResolvable[]>this.commands.discordCommandsData,
    ));
    Logger.success('Commands loaded.');

    let i: number = -1;
    let dataMap: DataMap<TypedDataMapStored>;
    while (++i < Object.keys(this.db.dataMaps).length) {
      dataMap = Object.values(this.db.dataMaps)[i];
      if (dataMap.intents.includes(DATAMAP_INTENTS.CORE)) await dataMap.refreshCore();
    }

    Logger.info(`The client is successfully launched on Discord as ${this.src.user.tag}.`);

    return '0';
  }
}
