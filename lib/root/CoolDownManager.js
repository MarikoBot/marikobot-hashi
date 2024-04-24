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
exports.CoolDownManager = void 0;
const discord_js_1 = require("discord.js");
const decorators_1 = require("../decorators");
/**
 * The main class who manages the active cool downs for commands.
 */
class CoolDownManager {
    /**
     * The collection of the current cool downs.
     */
    queue = new discord_js_1.Collection();
    /**
     * The function that is called when the cool down manager authorization does not pass.
     */
    callback = async (context, finishTimestamp) => {
        await context.reply({
            content: `<:MarikoCross:1191675946353299456> **Error** → cool down is running. Please wait **\`${((finishTimestamp - Date.now()) /
                1000).toFixed(1)}\`**s.`,
            ephemeral: true,
        });
        return void 0;
    };
    /**
     * Register a cool down when a command is triggered.
     * @param userId The user id of the command author.
     * @param commandName The name of the command.
     * @param coolDown The cool down amount (waiting time before executing it again).
     * @returns Nothing.
     */
    registerCoolDown(userId, commandName, coolDown) {
        const endTime = Date.now() + coolDown * 1000;
        const currentCoolDowns = this.values(userId);
        currentCoolDowns.push([commandName, endTime, coolDown]);
        this.queue.set(userId, currentCoolDowns);
    }
    /**
     * Set the callback function when the cool down manager is triggered on.
     * @param callback The function to set.
     * @returns The class instance.
     */
    on(callback) {
        this.callback = callback;
        return this;
    }
    /**
     * Returns all the cool downs for a specified user.
     * @param userId The user id to search for.
     * @param commandName The name of the command to filter by.
     * @returns The full list of the user cool downs.
     */
    values(userId, commandName) {
        let currentCoolDowns = this.queue.get(userId) || [];
        const currentTime = Date.now();
        currentCoolDowns = currentCoolDowns.filter((queueElement) => currentTime < queueElement[1]);
        this.queue.set(userId, currentCoolDowns);
        if (commandName)
            return currentCoolDowns.filter((queueElement) => queueElement[0].startsWith(commandName));
        return currentCoolDowns;
    }
}
exports.CoolDownManager = CoolDownManager;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(discord_js_1.Collection)),
    __metadata("design:type", discord_js_1.Collection)
], CoolDownManager.prototype, "queue", void 0);
__decorate([
    decorators_1.Validators.FunctionValidator.Matches,
    __metadata("design:type", Function)
], CoolDownManager.prototype, "callback", void 0);
