import { ChatInputCommandInteraction, Collection, Snowflake } from 'discord.js';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { InterferingQueueElement } from './';
import { Context } from '../base';

/**
 * The main class who manages the active cool downs for commands.
 */
export class InterferingManager {
  /**
   * The collection of the current cool downs.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Collection))
  public readonly queue: Collection<Snowflake, InterferingQueueElement[]> = new Collection();

  /**
   * The function that is called when the interfering manager authorization does not pass.
   */
  @(<InstanceValidator>Validators.FunctionValidator.Matches)
  public callback: (context: Context, interferingCommands: string[]) => Promise<void> = async (
    context: Context,
    interferingCommands: string[],
  ): Promise<void> => {
    await context.reply({
      content: `<:MarikoCross:1191675946353299456> **Error** → interfering commands are already running:\n${interferingCommands.join(
        '\n',
      )}`,
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
  public registerInterfering(userId: Snowflake, commandName: string, interaction: ChatInputCommandInteraction): void {
    const currentInterfering: InterferingQueueElement[] = this.values(userId);

    currentInterfering.push([commandName, interaction]);

    this.queue.set(userId, currentInterfering);
  }

  /**
   * Set the callback function when the interfering manager is triggered on.
   * @param callback The function to set.
   * @returns The class instance.
   */
  public on(callback: (context: Context, interferingCommands: string[]) => Promise<void>): this {
    this.callback = callback;
    return this;
  }

  /**
   * Returns all the interfering commands for a specified user.
   * @param userId The user id to search for.
   * @param commands The names of the commands to filter by.
   * @returns The full list of the user cool downs.
   */
  public values(userId: Snowflake, ...commands: string[]): InterferingQueueElement[] {
    const currentInterfering: InterferingQueueElement[] | [] = this.queue.get(userId) || [];

    if (commands.length > 0)
      return currentInterfering.filter((queueElement: InterferingQueueElement): boolean =>
        commands.some((cmd: string) => queueElement[0].startsWith(cmd)),
      );

    return currentInterfering;
  }

  /**
   * Removes an interfering commands. If a name is passed, remove all the commands with that name.
   * If an id is passed, remove the command with the same interaction id.
   * @param userId The user id to search for.
   * @param key The value to search for; either the name of the command or the interaction id.
   * @returns Nothing.
   */
  public removeInterfering(userId: Snowflake, key: string): void {
    const currentInterfering: InterferingQueueElement[] = this.values(userId);

    this.queue.set(
      userId,
      currentInterfering.filter((queueElement: InterferingQueueElement): boolean => {
        return queueElement[0] !== key;
      }),
    );
  }
}
