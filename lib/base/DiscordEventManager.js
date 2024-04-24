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
exports.DiscordEventManager = void 0;
const discord_js_1 = require("discord.js");
const _1 = require("./");
const decorators_1 = require("../decorators");
/**
 * Represents the event manager for the client service.
 */
class DiscordEventManager extends _1.BaseClient {
    /**
     * The collection of the events.
     */
    eventsList = new discord_js_1.Collection();
    /**
     * The constructor of the event manager.
     * @param client The client instance.
     */
    constructor(client) {
        super(client);
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * The decorator to inject metadata into the constructor of DiscordEvent.
     * @param name The name of the event.
     * @returns The decorator.
     */
    inject(name) {
        const instance = this;
        return function (target) {
            instance.client.logger.info(`Bound event: ${name}`);
            instance.client.src[name === 'ready' ? 'once' : 'on'](name, (...args) => new target().callback(instance.client, ...args));
        };
    }
}
exports.DiscordEventManager = DiscordEventManager;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(discord_js_1.Collection)),
    __metadata("design:type", discord_js_1.Collection)
], DiscordEventManager.prototype, "eventsList", void 0);
