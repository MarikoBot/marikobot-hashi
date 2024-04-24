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
exports.Command = void 0;
const base_1 = require("../base");
const decorators_1 = require("../decorators");
const _1 = require("./");
/**
 * The class that includes many useful functions shared between HashiMessageCommand and SlashCommand.
 */
class Command {
    /**
     * The client instance.
     */
    client = null;
    /**
     * The name of the command.
     */
    id;
    /**
     * The description of the command.
     */
    description = 'No description provided.';
    /**
     * The list of errors for the command occurrence.
     */
    errors = [];
    /**
     * The commands that must be executed before this one.
     * If one of the interfering commands is same-time running, this command will be ignored.
     */
    interferingCommands = [];
    /**
     * The amount of time before running the command again. Must be between 0 and 300 seconds.
     */
    coolDown = 0;
    /**
     * The context of the command.
     */
    context = null;
    /**
     * The external data for the command.
     */
    privileges = {};
    /**
     * @param metadata The metadata of the command.
     */
    constructor(metadata) {
        this.id = metadata.id;
        this.description = metadata.src.description || 'Nothing.';
        this.interferingCommands = metadata.interferingCommands || [];
        this.coolDown = metadata.coolDown || 0;
        this.privileges = metadata.privileges || {};
    }
    /**
     * The callback function called.
     * @param client The client instance.
     * @param ctx The associated context.
     * @returns If the command ran successfully or not.
     */
    async callback(client, ctx) {
        this.client.logger.info(client, ctx);
        return _1.COMMAND_END.SUCCESS;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * The function who MUST be called at the end of your program in the call back function. IT IS REALLY IMPORTANT!
     *
     * @returns The exit code of the command.
     */
    end() {
        this.client.commands.interfering.removeInterfering(this.context.interaction.user.id, this.id);
        return this.errors.length === 0 ? _1.COMMAND_END.SUCCESS : _1.COMMAND_END.ISSUED;
    }
    /**
     * Returns a boolean value. If the user is authorized to run the command.
     *
     * @param interaction The interaction of the command.
     * @param metadata The metadata to check the command with.
     * @returns If the user can execute the command.
     */
    async isAuthorized(interaction, metadata) {
        const privilegesData = {
            forbiddenUsers: [],
            uniqueUsers: [],
            forbiddenGuilds: [],
            uniqueGuilds: [],
            forbiddenRoles: [],
            uniqueRoles: [],
            forbiddenChannels: [],
            uniqueChannels: [],
            ...metadata.privileges,
        };
        const missing = [];
        let privileges = '0b0';
        const authBooleans = {
            forbiddenUser: !privilegesData.forbiddenUsers.includes(interaction.user.id),
            uniqueUser: !privilegesData.uniqueUsers.length || privilegesData.uniqueUsers.includes(interaction.user.id),
            forbiddenGuild: !privilegesData.forbiddenGuilds.includes(interaction.guildId),
            uniqueGuild: !privilegesData.uniqueGuilds.length || privilegesData.uniqueGuilds.includes(interaction.guildId),
            forbiddenRole: !privilegesData.forbiddenRoles.some((role) => (interaction.member?.roles).cache.has(role)),
            uniqueRole: !privilegesData.uniqueRoles.length ||
                privilegesData.uniqueRoles.every((role) => (interaction.member?.roles).cache.has(role)),
            forbiddenChannel: !privilegesData.forbiddenChannels.includes(interaction.channel.id),
            uniqueChannel: !privilegesData.uniqueChannels.length || privilegesData.uniqueChannels.includes(interaction.channel.id),
        };
        for (const [authKey, value] of Object.entries(authBooleans)) {
            if (value) {
                privileges = Number(privileges) > Number(_1.bitRecord[`${authKey}s`]) ? privileges : _1.bitRecord[`${authKey}s`];
                continue;
            }
            missing.push(`${authKey}s`);
        }
        const highestMissing = missing.sort((a, b) => Number(_1.bitRecord[b]) - Number(_1.bitRecord[a]))[0];
        const isAuth = missing.length > 0 ? Number(highestMissing) < Number(privileges) : true;
        if (!isAuth) {
            const errorCode = `${missing.length}${missing
                .map((e) => Number(_1.bitRecord[e]))
                .reduce((acc, val) => acc + val, 0)}`;
            this.client.logger.debug(missing);
            void this.client.commands.authorizationCallback(this.context, errorCode);
        }
        return isAuth;
    }
    /**
     * Verify if the cool downs, and the interfering commands of the command are ready to call the command again.
     *
     * @param client The client that instanced the event.
     * @param interaction The associated interaction.
     * @param ctx The context within the call.
     * @param metadata The command metadata.
     * @returns If the wall is passed or not.
     */
    async flowControlWall(client, interaction, ctx, metadata) {
        const activeCoolDowns = client.commands.coolDowns.values(interaction.user.id, metadata.id);
        const activeInterfering = client.commands.interfering.values(interaction.user.id, ...(metadata.interferingCommands || []));
        if (activeCoolDowns.length > 0) {
            void this.client.commands.coolDowns.callback(ctx, activeCoolDowns[0][1]);
            return false;
        }
        if (activeInterfering.length > 0) {
            const interferingList = activeInterfering.map((i) => `</${i[0]}:${i[1].commandId}>`);
            void this.client.commands.interfering.callback(ctx, interferingList);
            return false;
        }
        return true;
    }
    /**
     * Registers the cool down and the interfering commands.
     * @param client The client that instanced the event.
     * @param interaction The associated interaction.
     * @param commandGroup The Command [subclass] instance.
     * @returns Nothing.
     */
    async flowControlRegister(client, interaction, commandGroup) {
        client.commands.interfering.registerInterfering(interaction.user.id, commandGroup.subcommand?.id || commandGroup.metadata.id, interaction);
        client.commands.coolDowns.registerCoolDown(interaction.user.id, commandGroup.subcommand?.id || commandGroup.metadata?.id, commandGroup.subcommand?.coolDown ||
            commandGroup.subcommandGroup?.coolDown ||
            commandGroup.command?.coolDown ||
            0);
    }
    /**
     * Launch the basic and starting verifications.
     * @param client The client that instanced the event.
     * @param interaction The associated interaction.
     * @param commandGroup The command group.
     * @returns If the command executed successfully.
     */
    async launch(client, interaction, commandGroup) {
        if (commandGroup.subcommandGroup && !commandGroup.subcommand)
            return;
        let metadata = commandGroup.metadata;
        if (commandGroup.subcommand)
            metadata = {
                ...metadata,
                ...(commandGroup.subcommandGroup ? commandGroup.subcommandGroup : {}),
                ...commandGroup.subcommand,
            };
        commandGroup.command.client = client;
        const ctx = new base_1.Context(client, {
            channel: interaction.channel,
            command: this,
            interaction,
            users: [interaction.user],
        });
        this.refreshContext(ctx);
        const authorized = await this.isAuthorized(interaction, metadata);
        if (!authorized)
            return _1.COMMAND_END.ERROR;
        const flowWall = await this.flowControlWall(client, interaction, ctx, metadata);
        if (!flowWall)
            return _1.COMMAND_END.ERROR;
        await this.flowControlRegister(client, interaction, commandGroup);
        const commandWall = commandGroup.command.callback(client, ctx);
        return await commandWall;
    }
    /**
     * Refreshes the context.
     * @param context The context to refresh with.
     * @returns The class instance.
     */
    refreshContext(context) {
        context.command = this;
        this.context = context;
        return this;
    }
}
exports.Command = Command;
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(_1.Client)),
    __metadata("design:type", _1.Client)
], Command.prototype, "client", void 0);
__decorate([
    decorators_1.Validators.StringValidator.ValidId,
    __metadata("design:type", String)
], Command.prototype, "id", void 0);
__decorate([
    decorators_1.Validators.StringValidator.ValidNonFormatted,
    __metadata("design:type", String)
], Command.prototype, "description", void 0);
__decorate([
    decorators_1.Validators.ArrayValidator.OnlyHashiErrors,
    __metadata("design:type", Array)
], Command.prototype, "errors", void 0);
__decorate([
    decorators_1.Validators.ArrayValidator.OnlyObjects,
    __metadata("design:type", Array)
], Command.prototype, "interferingCommands", void 0);
__decorate([
    decorators_1.Validators.NumberValidator.Matches,
    __metadata("design:type", Number)
], Command.prototype, "coolDown", void 0);
__decorate([
    (decorators_1.Validators.ObjectValidator.IsInstanceOf(base_1.Context)),
    __metadata("design:type", base_1.Context)
], Command.prototype, "context", void 0);
__decorate([
    decorators_1.Validators.ObjectValidator.KeyStringArrayPair,
    __metadata("design:type", Object)
], Command.prototype, "privileges", void 0);
