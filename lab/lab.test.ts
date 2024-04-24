// tslint:disable:max-classes-per-file
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

import {Client, SuperModel, SuperModelColumn, DiscordEvent, Command, Context} from '../src';
import { COMMAND_END } from '../types';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  BaseInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';

const client: Client = new Client({
  intents: 3276799,
  projectName: 'MarikoBot-Hashi',
  configChannels: {
    status: '1228631187459670046'
  },
  mongoose: {
    dbName: 'dev',
    connectionURI: 'mongodb://127.0.0.1:27017/',
    connectOptions: { dbName: 'hashi-dev', family: 4 },
  },
});
void client.connectDatabase();

@client.events.inject('ready')
class Ready extends DiscordEvent {
  callback(client: Client): void {
    void client.logger.sendTo('status', { content: '<:MarikoOnline:1186296992629014558> The bot is now **online**.' });
  }
}

@client.events.inject('interactionCreate')
class InteractionCreate extends DiscordEvent {
  async callback(client: Client, interaction: BaseInteraction): Promise<void> {
    if (interaction.isChatInputCommand()) await client.commands.detectAndLaunchSlashCommand(interaction);
  }
}

@client.commands.inject({
  id: 'ping',
  interferingCommands: [],
  coolDown: 3,
  subcommands: [
    { id: 'ping hi' }
  ],
  subcommandGroups: [
    {
      id: 'ping group',
      subcommands: [
        { id: 'ping group hello' },
        { id: 'ping group world' }
      ]
    }
  ],
  src: {
    name: 'ping',
    description: 'Replies with pong!',
    default_member_permissions: null,
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: 'hi',
        description: 'Say hi!',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'group',
        description: 'Group commands!',
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: 'hello',
            description: 'Say hello!',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'world',
            description: 'Say world!',
            type: ApplicationCommandOptionType.Subcommand,
          }
        ]
      }
    ]
  }
})
class Ping extends Command {
  async callback(client: Client, ctx: Context): Promise<COMMAND_END> {
    await ctx.reply('https://tenor.com/view/demon-slayer-tengen-uzui-kimetsu-no-yaiba-gif-24115545').catch(client.logger.clean);
    return this.end();
  }
}

@client.db.inject('user')
class User extends SuperModel {
  onLoaded() {
    return {
      discordId: new SuperModelColumn(String)
    };
  }
}


void client.db.get('user').create({
  discordId: '1146145475683164273'
});

void client.login();