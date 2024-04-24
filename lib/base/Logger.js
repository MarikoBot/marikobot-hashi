"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk = require("chalk");
const index_1 = require("./index");
const decorators_1 = require("../decorators");
const root_1 = require("../root");
const discord_js_1 = require("discord.js");
/**
 * The Logger class. Contains multiple functions to log data.
 */
class Logger extends index_1.BaseClient {
    /**
     * The name of the project.
     */
    projectName;
    /**
     * The constructor of the Logger class.
     * @param name The name of the project.
     * @param client The client instance.
     */
    constructor(name, client) {
        super(client);
        this.projectName = name;
    }
    /**
     * Split a str to make it fit into a given size.
     * @param str The str to crop.
     * @param max The max length limit.
     * @returns The cropped (or not) string.
     */
    static crop(str, max) {
        if (max === 'flex')
            return str;
        return str.length > max ? str.slice(0, max - 3) + '...' : str + '.'.repeat(max - str.length);
    }
    /**
     * Returns the prefix for the logging.
     * @param mode The 'label' that describes the assets pack.
     * @param str The string to split to fit a given size.
     * @returns The prefix (str).
     */
    prefix(mode, str = this.projectName.toLowerCase()) {
        return `(${Logger.crop(mode, 'flex')}) ${Logger.crop(str, 'flex')}`;
    }
    /**
     * Logs something in the console using the error assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    error(...args) {
        this.log('error', args);
    }
    /**
     * Logs something in the console using the success assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    success(...args) {
        this.log('success', args);
    }
    /**
     * Logs something in the console using the warning assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    warning(...args) {
        this.log('warning', args);
    }
    /**
     * Logs something in the console using the info assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    info(...args) {
        this.log('info', args);
    }
    /**
     * Logs something in the console using the debug assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    debug(...args) {
        this.log('debug', args);
    }
    /**
     * Logs something in the console using the test assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    test(...args) {
        this.log('test', args);
    }
    /**
     * Logs something in the console using the clean assets.
     * @param args The data to print.
     * @returns Nothing.
     */
    clean(...args) {
        this.log('clean', args);
    }
    /**
     * Logs something in the Discord "status" channel.
     * @param channelIdentifier The channel identifier into the config object.
     * @param messages The messages data to send.
     * @returns Nothing.
     */
    async sendTo(channelIdentifier, ...messages) {
        const channel = await this.client.src.channels.fetch(this.client.configChannels[channelIdentifier]);
        if (channel instanceof discord_js_1.TextChannel) {
            for (const msg of messages)
                await channel.send(msg).catch(this.clean);
        }
    }
    /**
     * Logs something in the console using the chosen assets.
     * @param mode The mode (assets pack).
     * @param args The data to print.
     * @returns Nothing.
     */
    log(mode, ...args) {
        const color = root_1.loggerModes.includes(mode)
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
        const background = 'DEFAULT';
        const assets = background === 'DEFAULT' ? chalk[color] : chalk[background][color];
        console.log(assets(`${this.prefix(mode, this.projectName.toLowerCase())} →`), assets(args.map((arg) => arg.map((argShard) => argShard).join('')).join('')));
    }
}
exports.Logger = Logger;
__decorate([
    decorators_1.Validators.StringValidator.NotEmpty,
    __metadata("design:type", String)
], Logger.prototype, "projectName", void 0);
