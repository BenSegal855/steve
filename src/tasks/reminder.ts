import { Task } from 'klasa';
import { Message, TextChannel, DMChannel } from 'discord.js';
const delay = require('delay');

export default class extends Task {

	public async run({ user, content, channel }): Promise<Message> {
		await delay((Math.random()*6+2)*60000)
		
		const _channel = this.client.channels.cache.get(channel);
		const _user = this.client.users.cache.get(user);

		// eslint-disable-next-line
		return (_channel as TextChannel | DMChannel).send(`${_user}, here's the reminder you asked for: **${content}**`);
	}

}
