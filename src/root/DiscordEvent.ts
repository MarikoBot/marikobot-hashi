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

import { StringValidator, ObjectDeepValidator, FunctionValidator } from '../decorators';
import { Client } from './';
import { Logger } from '../base';

/**
 * Represents an Event on client service.
 */
export class DiscordEvent {
	/**
	 * The client instance.
	 */
	@ObjectDeepValidator.IsInstanceOf(Client)
	public client: Client;

	/**
	 * The event name.
	 */
	@StringValidator.ValidId
	public name: string;

	/**
	 * The callback function.
	 * @param client The client instance.
	 * @param args The arguments.
	 * @returns Nothing.
	 */
	@FunctionValidator.Matches
	public callback(client: Client, ...args: unknown[]): Promise<void> | void {
		new Logger().log('debug', client, args);
		return null;
	}

	/**
	 * The constructor of the event.
	 * @param name The event name.
	 */
	constructor(name: string) {
		this.name = name;
	}
}
