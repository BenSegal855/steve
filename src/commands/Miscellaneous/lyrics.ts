import * as Genius from 'genius-lyrics';
import { CommandOptions, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message, MessageEmbed } from 'discord.js';
import { TOKENS } from '@root/config';
import { ApplyOptions } from '@skyra/decorators';

@ApplyOptions<CommandOptions>({
	aliases: ['genius'],
	description: lang => lang.tget('commandLyricsDescription'),
	extendedHelp: lang => lang.tget('commandLyricsExtended'),
	usage: '<song:string>'
})
export default class extends SteveCommand {

	public async init(): Promise<void> {
		if (!TOKENS.GENIUS) this.disable();
	}

	public async run(msg: KlasaMessage, [song]: [string]): Promise<Message> {
		const Client = new Genius.Client(TOKENS.GENIUS);
		const songs = await Client.songs.search(song);

		if (songs.length < 1) throw msg.language.tget('commandLyricsNoLyrics');

		const embedData = msg.language.tget('commandLyricsEmbed');

		const embed = new MessageEmbed()
			.setTitle(embedData.title);

		for (let i = 0; i < 5; i++) {
			if (!songs[i]) break;
			embed
				.addFields([
					{ name: songs[i].fullTitle, value: songs[i].url }
				]);
		}

		return msg.channel.send(embed);
	}

}
