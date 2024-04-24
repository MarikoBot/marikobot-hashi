import { ActivityType, ApplicationCommandDataResolvable, Client as DiscordClient, PresenceData } from 'discord.js';
import * as dotenv from 'dotenv';
import {
  DatabaseManager,
  DataMap,
  DATAMAP_INTENTS,
  DiscordEventManager,
  CommandManager,
  Logger,
  TypedDataMapStored,
} from '../base/';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { ClientChannelsOption, ClientOptions } from './';

dotenv.config();

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
   * The name of the project/process you're in.
   */
  @(<InstanceValidator>Validators.StringValidator.ValidId)
  public readonly projectName: string;

  /**
   * The Discord channels where the bot can be configured/logged.
   */
  @(<InstanceValidator>Validators.ObjectValidator.KeyStringPair)
  public readonly configChannels: Partial<ClientChannelsOption>;

  /**
   * @param options The options for the Client.
   */
  constructor(options: ClientOptions) {
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

    this.projectName = options.projectName || '`unknown`';
    this.logger = new Logger(this.projectName, this);

    this.logger.info(`Process initialization.`);

    this.db.dbName = options.mongoose.dbName || 'main';
    this.db.connectOptions = options.mongoose.connectOptions || { dbName: this.db.dbName };
    if (options.mongoose.connectionURI) this.db.connectionURI = options.mongoose.connectionURI;

    this.configChannels = options.configChannels || {};

    process.on('unhandledRejection', (reason: object & { stack: any }) => this.logger.error(reason?.stack || reason));
    process.on('uncaughtException', (err: Error, origin: NodeJS.UncaughtExceptionOrigin): void => {
      this.logger.error(err);
      this.logger.error(origin);
    });
  }

  /**
   * Connect the database.
   * @returns Nothing.
   */
  public async connectDatabase(): Promise<void> {
    this.logger.info('Database is connecting...');
    await this.db.connect();
    this.logger.success('Database is connected.');
  }

  /**
   * Login the client to Discord.
   * @param token The token of the bot.
   * @returns Nothing.
   */
  public async login(token: string = process.env.TOKEN || process.env.token || process.env.Token): Promise<string> {
    this.logger.info('Bot is connecting...');
    await this.src.login(token);
    this.logger.success('Bot is connected.');

    void (await this.src.application.commands.set(
      <readonly ApplicationCommandDataResolvable[]>this.commands.discordCommandsData,
    ));
    this.logger.success('Commands loaded.');

    let i: number = -1;
    let dataMap: DataMap<TypedDataMapStored>;
    while (++i < Object.keys(this.db.dataMaps).length) {
      dataMap = Object.values(this.db.dataMaps)[i];
      if (dataMap.intents.includes(DATAMAP_INTENTS.CORE)) await dataMap.refreshCore();
    }

    this.logger.info(`The client is successfully launched on Discord as ${this.src.user.tag}.`);

    return '0';
  }
}
