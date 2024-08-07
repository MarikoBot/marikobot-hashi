"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Context.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ehosta <ehosta@student.42lyon.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/27 20:04:46 by ehosta            #+#    #+#             */
/*   Updated: 2024/07/28 15:17:41 by ehosta           ###   ########.fr       */
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
exports.Context = void 0;
const discord_js_1 = require("discord.js");
const _1 = require("./");
const decorators_1 = require("../decorators");
const public_1 = require("../public");
const root_1 = require("../root");
/**
 * The class who manages the front part of an interaction with Discord and the user.
 */
class Context extends _1.BaseClient {
    /**
     * The command associated with the context.
     */
    command = null;
    /**
     * The users implicated in the context/action.
     */
    users = [];
    /**
     * The channel where the action occurs.
     */
    channel = null;
    /**
     * The interaction, if there is one.
     */
    interaction = null;
    /**
     * The interaction button, if there is one.
     */
    buttonInteraction = null;
    /**
     * The interaction dropdown, if there is one.
     */
    dropdownInteraction = null;
    /**
     * The reply message data.
     */
    replyData = void null;
    /**
     * The list of standalone components (future update).
     */
    standaloneComponents = [];
    /**
     * @param client The client instance.
     * @param options The context options.
     */
    constructor(client, options) {
        super(client);
        if (options.command)
            this.command = options.command;
        this.users = options.users;
        this.channel = options.channel;
        if (options.interaction)
            this.interaction = options.interaction;
        if (options.buttonInteraction)
            this.buttonInteraction = options.buttonInteraction;
    }
    /**
     * Reply to an interaction.
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param interaction The interaction to reply to.
     * @returns The message instance, or null if not sent.
     */
    async reply(messageData, interaction = this.interaction) {
        if (!this.channel.isTextBased())
            return null;
        let message;
        try {
            message =
                (await interaction.reply(messageData).catch(new _1.Logger().clean)) ||
                    (await interaction.followUp(messageData).catch(new _1.Logger().clean)) ||
                    null;
            if (!message)
                return null;
            this.replyData = message;
        }
        catch (error) {
            new _1.Logger().log('error', error);
            return null;
        }
        return message;
    }
    /**
     * Edit the reply to an interaction.
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param interaction The interaction to reply to.
     * @returns The message instance, or null if not sent.
     */
    async editReply(messageData, interaction = this.interaction) {
        if (!this.channel.isTextBased())
            return null;
        let message;
        try {
            message = (await interaction.editReply(messageData).catch(new _1.Logger().clean)) || null;
            if (!message)
                return null;
            this.replyData = message;
        }
        catch (error) {
            new _1.Logger().log('clean', error);
            return null;
        }
        return message;
    }
}
exports.Context = Context;
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(root_1.Command),
    __metadata("design:type", root_1.Command)
], Context.prototype, "command", void 0);
__decorate([
    decorators_1.ArrayValidator.OnlyUsers,
    __metadata("design:type", Array)
], Context.prototype, "users", void 0);
__decorate([
    decorators_1.ObjectValidator.ContextChannelInitial,
    __metadata("design:type", Object)
], Context.prototype, "channel", void 0);
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(public_1.PublicChatInputCommandInteraction),
    __metadata("design:type", discord_js_1.ChatInputCommandInteraction)
], Context.prototype, "interaction", void 0);
__decorate([
    decorators_1.ObjectValidator.Matches,
    __metadata("design:type", discord_js_1.ButtonInteraction)
], Context.prototype, "buttonInteraction", void 0);
__decorate([
    decorators_1.ObjectValidator.Matches,
    __metadata("design:type", discord_js_1.StringSelectMenuInteraction)
], Context.prototype, "dropdownInteraction", void 0);
__decorate([
    decorators_1.ObjectValidator.Matches,
    __metadata("design:type", Object)
], Context.prototype, "replyData", void 0);
