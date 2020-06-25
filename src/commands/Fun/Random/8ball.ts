import { CommandStore, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Ask the 8ball a question and you shall get an answer.',
			extendedHelp: 'This command requires you to put a question mark at the end of your question.',
			examples: ['8ball will the jonathans ever stop being annoying?'],
			usage: '<question:reg/^[A-Za-z0-9_ ]+\\?/>',
			helpUsage: 'question?'
		});

		this
			.customizeResponse('question', 'The 8ball only responds to questions smh');
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		return msg.channel.send("Ask again later");
	}

}
