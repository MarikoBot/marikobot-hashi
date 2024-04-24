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
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const dotenv = require("dotenv");
const base_1 = require("../base/");
const decorators_1 = require("../decorators");
dotenv.config();
/**
 * The Client class. It extends the Client class from discord.js and implements extra methods for the Hashi module.
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
     * The name of the project/process you're in.
     */
    projectName;
    /**
     * The Discord channels where the bot can be configured/logged.
     */
    configChannels;
    /**
     * @param options The options for the Client.
     */
    constructor(options) {
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
        this.projectName = options.projectName || '`unknown`';
        this.logger = new base_1.Logger(this.projectName, this);
        this.logger.info(`Process initialization.`);
        this.db.dbName = options.mongoose.dbName || 'main';
        this.db.connectOptions = options.mongoose.connectOptions || { dbName: this.db.dbName };
        if (options.mongoose.connectionURI)
            this.db.connectionURI = options.mongoose.connectionURI;
        this.configChannels = options.configChannels || {};
        process.on('unhandledRejection', (reason) => this.logger.error(reason?.stack || reason));
        process.on('uncaughtException', (err, origin) => {
            this.logger.error(err);
            this.logger.error(origin);
        });
    }
    /**
     * Connect the database.
     * @returns Nothing.
     */
    async connectDatabase() {
        this.logger.info('Database is connecting...');
        await this.db.connect();
        this.logger.success('Database is connected.');
    }
    /**
     * Login the client to Discord.
     * @param token The token of the bot.
     * @returns Nothing.
     */
    async login(token = process.env.TOKEN || process.env.token || process.env.Token) {
        this.logger.info('Bot is connecting...');
        await this.src.login(token);
        this.logger.success('Bot is connected.');
        void (await this.src.application.commands.set(this.commands.discordCommandsData));
        this.logger.success('Commands loaded.');
        let i = -1;
        let dataMap;
        while (++i < Object.keys(this.db.dataMaps).length) {
            dataMap = Object.values(this.db.dataMaps)[i];
            if (dataMap.intents.includes(base_1.DATAMAP_INTENTS.CORE))
                await dataMap.refreshCore();
        }
        this.logger.info(`The client is successfully launched on Discord as ${this.src.user.tag}.`);
        return '0';
    }
}
exports.Client = Client;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(discord_js_1.Client)),
    __metadata("design:type", discord_js_1.Client)
], Client.prototype, "src", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(base_1.Logger)),
    __metadata("design:type", base_1.Logger)
], Client.prototype, "logger", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(base_1.CommandManager)),
    __metadata("design:type", base_1.CommandManager)
], Client.prototype, "commands", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(base_1.DiscordEventManager)),
    __metadata("design:type", base_1.DiscordEventManager)
], Client.prototype, "events", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(base_1.DatabaseManager)),
    __metadata("design:type", base_1.DatabaseManager)
], Client.prototype, "db", void 0);
__decorate([
    decorators_1.Validators.StringValidator.ValidId,
    __metadata("design:type", String)
], Client.prototype, "projectName", void 0);
__decorate([
    decorators_1.Validators.ObjectValidator.KeyStringPair,
    __metadata("design:type", Object)
], Client.prototype, "configChannels", void 0);
