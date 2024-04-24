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
exports.InterferingManager = void 0;
const discord_js_1 = require("discord.js");
const decorators_1 = require("../decorators");
/**
 * The main class who manages the active cool downs for commands.
 */
class InterferingManager {
    /**
     * The collection of the current cool downs.
     */
    queue = new discord_js_1.Collection();
    /**
     * The function that is called when the interfering manager authorization does not pass.
     */
    callback = async (context, interferingCommands) => {
        await context.reply({
            content: `<:MarikoCross:1191675946353299456> **Error** → interfering commands are already running:\n${interferingCommands.join('\n')}`,
            ephemeral: true,
        });
        return void 0;
    };
    /**
     * Register an interfering command when this command is triggered.
     * @param userId The user id of the command author.
     * @param commandName The name of the command.
     * @param interaction The interaction id.
     * @returns Nothing.
     */
    registerInterfering(userId, commandName, interaction) {
        const currentInterfering = this.values(userId);
        currentInterfering.push([commandName, interaction]);
        this.queue.set(userId, currentInterfering);
    }
    /**
     * Set the callback function when the interfering manager is triggered on.
     * @param callback The function to set.
     * @returns The class instance.
     */
    on(callback) {
        this.callback = callback;
        return this;
    }
    /**
     * Returns all the interfering commands for a specified user.
     * @param userId The user id to search for.
     * @param commands The names of the commands to filter by.
     * @returns The full list of the user cool downs.
     */
    values(userId, ...commands) {
        const currentInterfering = this.queue.get(userId) || [];
        if (commands.length > 0)
            return currentInterfering.filter((queueElement) => commands.some((cmd) => queueElement[0].startsWith(cmd)));
        return currentInterfering;
    }
    /**
     * Removes an interfering commands. If a name is passed, remove all the commands with that name.
     * If an id is passed, remove the command with the same interaction id.
     * @param userId The user id to search for.
     * @param key The value to search for; either the name of the command or the interaction id.
     * @returns Nothing.
     */
    removeInterfering(userId, key) {
        const currentInterfering = this.values(userId);
        this.queue.set(userId, currentInterfering.filter((queueElement) => {
            return queueElement[0] !== key;
        }));
    }
}
exports.InterferingManager = InterferingManager;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(discord_js_1.Collection)),
    __metadata("design:type", discord_js_1.Collection)
], InterferingManager.prototype, "queue", void 0);
__decorate([
    decorators_1.Validators.FunctionValidator.Matches,
    __metadata("design:type", Function)
], InterferingManager.prototype, "callback", void 0);
