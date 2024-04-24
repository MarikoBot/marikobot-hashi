import { BaseClient } from './index';
import { Client, LoggerMode } from '../root';
import { MessageCreateOptions } from 'discord.js';
/**
 * The Logger class. Contains multiple functions to log data.
 */
export declare class Logger extends BaseClient {
    /**
     * The name of the project.
     */
    readonly projectName: string;
    /**
     * The constructor of the Logger class.
     * @param name The name of the project.
     * @param client The client instance.
     */
    constructor(name: string, client: Client);
    /**
     * Split a str to make it fit into a given size.
     * @param str The str to crop.
     * @param max The max length limit.
     * @returns The cropped (or not) string.
     */
    private static crop;
    /**
     * Returns the prefix for the logging.
     * @param mode The 'label' that describes the assets pack.
     * @param str The string to split to fit a given size.
     * @returns The prefix (str).
     */
    prefix(mode: string, str?: string): string;
    /**
     * Logs something in the console using the error assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    error(...args: any[]): void;
    /**
     * Logs something in the console using the success assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    success(...args: any[]): void;
    /**
     * Logs something in the console using the warning assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    warning(...args: any[]): void;
    /**
     * Logs something in the console using the info assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    info(...args: any[]): void;
    /**
     * Logs something in the console using the debug assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    debug(...args: any[]): void;
    /**
     * Logs something in the console using the test assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    test(...args: any[]): void;
    /**
     * Logs something in the console using the clean assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    clean(...args: any[]): void;
    /**
     * Logs something in the Discord "status" channel.
     * @param channelIdentifier The channel identifier into the config object.
     * @param messages The messages data to send.
     * @returns Nothing.
     */
    sendTo(channelIdentifier: string, ...messages: MessageCreateOptions[]): Promise<void>;
    /**
     * Logs something in the console using the chosen assets.
     * @param mode The mode (assets pack).
     * @param args The data to print.
     * @returns Nothing.
     */
    log(mode: LoggerMode | string, ...args: any[]): void;
}
