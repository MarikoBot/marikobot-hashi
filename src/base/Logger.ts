import * as chalk from 'chalk';
import { BaseClient } from './index';
import { InstanceValidator, Validators } from '../decorators';
import { Client, LoggerMode, loggerModes } from '../root';
import { Channel, MessageCreateOptions, TextChannel } from 'discord.js';

/**
 * The Logger class. Contains multiple functions to log data.
 */
export class Logger extends BaseClient {
  /**
   * The name of the project.
   */
  @(<InstanceValidator>Validators.StringValidator.NotEmpty)
  public readonly projectName: string;
  /**
   * The constructor of the Logger class.
   * @param name The name of the project.
   * @param client The client instance.
   */
  constructor(name: string, client: Client) {
    super(client);
    this.projectName = name;
  }

  /**
   * Split a str to make it fit into a given size.
   * @param str The str to crop.
   * @param max The max length limit.
   * @returns The cropped (or not) string.
   */
  private static crop(str: string, max: number | 'flex'): string {
    if (max === 'flex') return str;
    return str.length > max ? str.slice(0, max - 3) + '...' : str + '.'.repeat(max - str.length);
  }

  /**
   * Returns the prefix for the logging.
   * @param mode The 'label' that describes the assets pack.
   * @param str The string to split to fit a given size.
   * @returns The prefix (str).
   */
  public prefix(mode: string, str: string = this.projectName.toLowerCase()): string {
    return `(${Logger.crop(mode, 'flex')}) ${Logger.crop(str, 'flex')}`;
  }

  /**
   * Logs something in the console using the error assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public error(...args: any[]): void {
    this.log('error', args);
  }

  /**
   * Logs something in the console using the success assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public success(...args: any[]): void {
    this.log('success', args);
  }

  /**
   * Logs something in the console using the warning assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public warning(...args: any[]): void {
    this.log('warning', args);
  }

  /**
   * Logs something in the console using the info assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public info(...args: any[]): void {
    this.log('info', args);
  }

  /**
   * Logs something in the console using the debug assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public debug(...args: any[]): void {
    this.log('debug', args);
  }

  /**
   * Logs something in the console using the test assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public test(...args: any[]): void {
    this.log('test', args);
  }

  /**
   * Logs something in the console using the clean assets.
   * @param args The data to print.
   * @returns Nothing.
   */
  public clean(...args: any[]): void {
    this.log('clean', args);
  }

  /**
   * Logs something in the Discord "status" channel.
   * @param channelIdentifier The channel identifier into the config object.
   * @param messages The messages data to send.
   * @returns Nothing.
   */
  public async sendTo(channelIdentifier: string, ...messages: MessageCreateOptions[]): Promise<void> {
    const channel: Channel = await this.client.src.channels.fetch(this.client.configChannels[channelIdentifier]);

    if (channel instanceof TextChannel) {
      for (const msg of messages) await channel.send(msg).catch(this.clean);
    }
  }

  /**
   * Logs something in the console using the chosen assets.
   * @param mode The mode (assets pack).
   * @param args The data to print.
   * @returns Nothing.
   */
  public log(mode: LoggerMode | string, ...args: any[]): void {
    const color: string = loggerModes.includes(<LoggerMode>mode)
      ? {
          error: 'red',
          success: 'green',
          warning: 'yellow',
          info: 'blue',
          debug: 'magenta',
          test: 'cyan',
          clean: 'gray',
        }[mode]
      : 'white';
    const background: string = 'DEFAULT';

    const assets: chalk.Chalk = background === 'DEFAULT' ? chalk[color] : chalk[background][color];

    console.log(
      assets(`${this.prefix(mode, this.projectName.toLowerCase())} →`),
      assets(args.map((arg: any): string[] => arg.map((argShard: string): string => argShard).join('')).join('')),
    );
  }
}
