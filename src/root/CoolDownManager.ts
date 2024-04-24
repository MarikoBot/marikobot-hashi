import { Collection, Snowflake } from 'discord.js';
import { InstanceValidator, InstanceValidatorReturner, Validators } from '../decorators';
import { CoolDownsQueueElement } from './';
import { Context } from '../base';

/**
 * The main class who manages the active cool downs for commands.
 */
export class CoolDownManager {
  /**
   * The collection of the current cool downs.
   */
  @((<InstanceValidatorReturner>Validators.ObjectValidator.IsInstanceOf)(Collection))
  private readonly queue: Collection<Snowflake, CoolDownsQueueElement[]> = new Collection();

  /**
   * The function that is called when the cool down manager authorization does not pass.
   */
  @(<InstanceValidator>Validators.FunctionValidator.Matches)
  public callback: (context: Context, finishTimestamp: number) => Promise<void> = async (
    context: Context,
    finishTimestamp: number,
  ): Promise<void> => {
    await context.reply({
      content: `<:MarikoCross:1191675946353299456> **Error** → cool down is running. Please wait **\`${(
        (finishTimestamp - Date.now()) /
        1000
      ).toFixed(1)}\`**s.`,
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
  public registerCoolDown(userId: Snowflake, commandName: string, coolDown: number): void {
    const endTime: number = Date.now() + coolDown * 1000;
    const currentCoolDowns: CoolDownsQueueElement[] = this.values(userId);

    currentCoolDowns.push([commandName, endTime, coolDown]);

    this.queue.set(userId, currentCoolDowns);
  }

  /**
   * Set the callback function when the cool down manager is triggered on.
   * @param callback The function to set.
   * @returns The class instance.
   */
  public on(callback: (context: Context, finishTimestamp: number) => Promise<void>): this {
    this.callback = callback;
    return this;
  }

  /**
   * Returns all the cool downs for a specified user.
   * @param userId The user id to search for.
   * @param commandName The name of the command to filter by.
   * @returns The full list of the user cool downs.
   */
  public values(userId: Snowflake, commandName?: string): CoolDownsQueueElement[] {
    let currentCoolDowns: CoolDownsQueueElement[] | [] = this.queue.get(userId) || [];

    const currentTime: number = Date.now();
    currentCoolDowns = currentCoolDowns.filter(
      (queueElement: CoolDownsQueueElement): boolean => currentTime < queueElement[1],
    );

    this.queue.set(userId, currentCoolDowns);

    if (commandName)
      return currentCoolDowns.filter((queueElement: CoolDownsQueueElement): boolean =>
        queueElement[0].startsWith(commandName),
      );

    return currentCoolDowns;
  }
}
