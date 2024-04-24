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
exports.CommandManager = void 0;
const discord_js_1 = require("discord.js");
const _1 = require("./");
const decorators_1 = require("../decorators");
const root_1 = require("../root");
/**
 * Represents the command manager of the client. This class manages the slash and message commands for the project.
 */
class CommandManager extends _1.BaseClient {
    /**
     * The cool downs' manager instance, to get access to the different delays of the current command.
     */
    coolDowns = new root_1.CoolDownManager();
    /**
     * The interfering manager instance, to have access to the different executing commands.
     */
    interfering = new root_1.InterferingManager();
    /**
     * The list of commands.
     */
    commandsList = new discord_js_1.Collection();
    /**
     * The list of discord commands data.
     */
    discordCommandsData = [];
    /**
     * The function that is called when the cool down manager authorization does not pass.
     */
    authorizationCallback = async (context, errorCode) => {
        await context.reply({
            content: `<:MarikoCross:1191675946353299456> **Error** → missing privileges authorizations. (privileges error code: **\`${errorCode}\`**)`,
            ephemeral: true,
        });
        return void 0;
    };
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client);
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Set the callback function when the authorizations do not pass.
     * @param callback The function to set.
     * @returns The class instance.
     */
    on(callback) {
        this.authorizationCallback = callback;
        return this;
    }
    /**
     * Get a slash command from the cache with the name.
     * @param interaction The interaction.
     * @returns The found command instance, or undefined, with its metadata.
     */
    getCommandFromInteraction(interaction) {
        const base = this.client.commands.commandsList.get(interaction.commandName);
        if (!base)
            return;
        const commandGroup = {
            command: new base[0](base[1]),
            metadata: base[1],
            subcommand: null,
            subcommandGroup: null,
        };
        const [maybeSub, maybeGroup] = [
            interaction.options.getSubcommand(),
            interaction.options.getSubcommandGroup(),
        ];
        if (maybeSub) {
            if (maybeGroup)
                commandGroup.subcommandGroup = base[1].subcommandGroups.filter((group) => group.id === maybeGroup)[0];
            commandGroup.subcommand = (maybeGroup ? commandGroup.subcommandGroup || base[1] : base[1]).subcommands.filter((sub) => sub.id === `${base[1].id} ${maybeGroup ? `${maybeGroup} ` : ''}${maybeSub}`)[0];
        }
        return commandGroup;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Function that encapsulates the command detection, authorization and execution.
     * @param interaction The associated interaction.
     * @returns The issue of the command.
     */
    async detectAndLaunchSlashCommand(interaction) {
        const commandGroup = this.getCommandFromInteraction(interaction);
        if (commandGroup.command)
            return commandGroup.command.launch(this.client, interaction, commandGroup);
        return root_1.COMMAND_END.SUCCESS;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * The decorator to inject metadata into the constructor of Command.
     * @param metadata The metadata of the command.
     * @returns The decorator.
     */
    inject(metadata) {
        const instance = this;
        return function (target) {
            instance.client.logger.info(`Bound command: ${metadata.id}`);
            if (!('src' in metadata))
                throw new Error(`A slash-based command shall have a 'src' property into its metadata.`);
            const discordDataOnly = metadata.src;
            instance.discordCommandsData.push(discordDataOnly);
            instance.commandsList.set(metadata.id, [target, { ...metadata }]);
        };
    }
}
exports.CommandManager = CommandManager;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(root_1.CoolDownManager)),
    __metadata("design:type", root_1.CoolDownManager)
], CommandManager.prototype, "coolDowns", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(root_1.InterferingManager)),
    __metadata("design:type", root_1.InterferingManager)
], CommandManager.prototype, "interfering", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(discord_js_1.Collection)),
    __metadata("design:type", discord_js_1.Collection)
], CommandManager.prototype, "commandsList", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(discord_js_1.Collection)),
    __metadata("design:type", Array)
], CommandManager.prototype, "discordCommandsData", void 0);
__decorate([
    decorators_1.Validators.FunctionValidator.Matches,
    __metadata("design:type", Function)
], CommandManager.prototype, "authorizationCallback", void 0);
