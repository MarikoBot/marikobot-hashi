// noinspection JSUnusedGlobalSymbols

import { HashiClient } from '../root/HashiClient';
import { Base } from './Base';

/**
 * The model of a callback function for an event.
 * @param args The command args.
 */
export type HashiEventCallbackFunction = (...args: any[]) => void;

/**
 * A default callback function used when nothing is set.
 * @returns Nothing.
 */
export async function defaultEventCallback(): Promise<void> {
  return void setTimeout((): null => null);
}

/**
 * Represents an Event on client service.
 */
export class HashiEvent extends Base {
  /**
   * The event name.
   */
  #name: string;

  /**
   * The callback function.
   */
  #callback: HashiEventCallbackFunction = defaultEventCallback;

  /**
   * Get the name.
   * @returns The name.
   */
  get name(): string {
    return this.#name;
  }

  /**
   * The callback function.
   * @returns The callback function.
   */
  get callback(): HashiEventCallbackFunction {
    return this.#callback;
  }

  /**
   * The constructor of the event.
   * @param client The client instance.
   * @param name The event name.
   */
  constructor(client: HashiClient, name: string) {
    super(client);
    this.#name = name;
  }

  /**
   * Set the name.
   * @param name The name to set.
   * @returns The class instance.
   */
  public setName(name: string): HashiEvent {
    if (typeof name === 'string') this.#name = name;
    return this;
  }

  /**
   * The callback function executed when the event is triggered.
   * @param callback The function to set.
   * @returns The class instance.
   */
  public setCallbackFunction(callback: HashiEventCallbackFunction): HashiEvent {
    if (typeof callback === 'function') this.#callback = callback;
    return this;
  }
}