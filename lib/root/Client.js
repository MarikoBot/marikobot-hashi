"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Client.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ehosta <ehosta@student.42lyon.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/27 20:07:52 by ehosta            #+#    #+#             */
/*   Updated: 2024/07/28 16:15:02 by ehosta           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
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
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const base_1 = require("../base/");
const decorators_1 = require("../decorators");
/**
 * The Client class. It extends the Client class from discord.js and implements extra methods
 * for the Hashi module.
 */
class Client {
    /**
     * The Discord Client instance.
     */
    src;
    /**
     * The logger for the Client.
     */
    logger;
    /**
     * The command manager instance.
     */
    commands = new base_1.CommandManager(this);
    /**
     * The event manager instance.
     */
    events = new base_1.DiscordEventManager(this);
    /**
     * The database manager for accessing data maps/lakes.
     */
    db = new base_1.DatabaseManager(this);
    /**
     * Configuration JSON content.
     */
    config;
    /**
     * @param options The options for the Client.
     */
    constructor(options) {
        options = Client.formatOptions(options);
        this.src = new discord_js_1.Client({
            intents: options.intents || 3276799,
            failIfNotExists: options.failIfNotExists || false,
            presence: options.presence ||
                {
                    status: 'online',
                    activities: [
                        {
                            name: `with version ${require('../../package.json').version}`,
                            type: discord_js_1.ActivityType.Playing,
                        },
                    ],
                },
        });
        this.config = options.config;
        new base_1.Logger().log('info', `Process initialization.`);
        this.db.dbName = options.config.database.databaseName || 'main';
        this.db.connectionURI = options.config.database.connectionURI;
        this.db.connectOptions = {
            dbName: options.config.database.databaseName,
            family: Number(options.config.database.addressFamily.replace('IPv', '')),
        };
        process.on('unhandledRejection', (reason) => {
            new base_1.Logger().log('error', reason);
            new base_1.Logger().log('error', reason.stack);
            console.log(reason, reason.stack);
        });
        process.on('uncaughtException', (err, origin) => {
            new base_1.Logger().log('error', err);
            new base_1.Logger().log('error', origin);
            console.log(err, origin);
        });
    }
    /**
     * Converts the constructor argument into a valid format if it is not.
     * @param options The options for the Client.
     * @returns The formatted object.
     */
    static formatOptions(options) {
        if ('config' in options)
            return options;
        else
            return { config: options, ...options };
    }
    /**
     * Tries something and returns null if it does not exist.
     * @param func The function to call.
     * @param args The args associated to the function.
     * @returns The func callback or null.
     */
    static tryTo(func, ...args) {
        try {
            return func(...args);
        }
        catch {
            return null;
        }
    }
    /**
     * Connect the database.
     * @returns Nothing.
     */
    async connectDatabase() {
        new base_1.Logger().log('info', 'Database is connecting...');
        await this.db.connect();
        new base_1.Logger().log('success', 'Database is connected.');
    }
    /**
     * Login the client to Discord.
     * @param token The token of the bot.
     * @returns Nothing.
     */
    async login(token = process.env.TOKEN || process.env.token || process.env.Token) {
        new base_1.Logger().log('info', 'Bot is connecting...');
        await this.src.login(token);
        new base_1.Logger().log('success', 'Bot is connected.');
        void (await this.src.application.commands.set(this.commands.discordCommandsData));
        new base_1.Logger().log('success', 'Commands loaded.');
        let i;
        i = -1;
        let dataMap;
        while (++i < Object.keys(this.db.dataMaps).length) {
            dataMap = Object.values(this.db.dataMaps)[i];
            if (dataMap.intents.includes(base_1.DATAMAP_INTENTS.CORE))
                await dataMap.refreshCore();
        }
        new base_1.Logger().log('info', `The client is successfully launched on Discord as ${this.src.user.tag}.`);
        return '0';
    }
}
exports.Client = Client;
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(discord_js_1.Client),
    __metadata("design:type", discord_js_1.Client)
], Client.prototype, "src", void 0);
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(base_1.Logger),
    __metadata("design:type", base_1.Logger)
], Client.prototype, "logger", void 0);
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(base_1.CommandManager),
    __metadata("design:type", base_1.CommandManager)
], Client.prototype, "commands", void 0);
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(base_1.DiscordEventManager),
    __metadata("design:type", base_1.DiscordEventManager)
], Client.prototype, "events", void 0);
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(base_1.DatabaseManager),
    __metadata("design:type", base_1.DatabaseManager)
], Client.prototype, "db", void 0);
__decorate([
    decorators_1.ObjectValidator.Matches,
    __metadata("design:type", Object)
], Client.prototype, "config", void 0);
