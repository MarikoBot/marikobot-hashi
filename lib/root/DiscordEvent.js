"use strict";
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   DiscordEvent.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ehosta <ehosta@student.42lyon.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/27 20:08:04 by ehosta            #+#    #+#             */
/*   Updated: 2024/07/28 15:07:25 by ehosta           ###   ########.fr       */
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
exports.DiscordEvent = void 0;
const decorators_1 = require("../decorators");
const _1 = require("./");
const base_1 = require("../base");
/**
 * Represents an Event on client service.
 */
class DiscordEvent {
    /**
     * The client instance.
     */
    client;
    /**
     * The event name.
     */
    name;
    /**
     * The callback function.
     * @param client The client instance.
     * @param args The arguments.
     * @returns Nothing.
     */
    callback(client, ...args) {
        new base_1.Logger().log('debug', client, args);
        return null;
    }
    /**
     * The constructor of the event.
     * @param name The event name.
     */
    constructor(name) {
        this.name = name;
    }
}
exports.DiscordEvent = DiscordEvent;
__decorate([
    decorators_1.ObjectDeepValidator.IsInstanceOf(_1.Client),
    __metadata("design:type", _1.Client)
], DiscordEvent.prototype, "client", void 0);
__decorate([
    decorators_1.StringValidator.ValidId,
    __metadata("design:type", String)
], DiscordEvent.prototype, "name", void 0);
__decorate([
    decorators_1.FunctionValidator.Matches,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_1.Client, Object]),
    __metadata("design:returntype", Object)
], DiscordEvent.prototype, "callback", null);
