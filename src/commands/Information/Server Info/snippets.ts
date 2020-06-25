/* eslint-disable id-length */
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['snippet', 'snip'],
			description: 'Easily access useful bits of information about the server.',
			helpUsage: '<add|remove|list|edit|view> (snippetName) (snippetContent)',
			examples: ['snippets rule1', 'snippet add|rule1|the word of the jonathans is law', 'snip remove|rule1'],
			runIn: ['text'],
			subcommands: true,
			usage: '<add|remove|list|edit|view:default> (snippetName:snippetName) (snippetContent:snippetContent{,1900})'
		});

		this
			.createCustomResolver('snippetName', (str, possible, msg, [action]) => action !== 'list' ? str : null)
			.createCustomResolver('snippetContent', (str, possible, msg, [action]) => action === 'add' || action === 'edit' ? str : null);
	}

	public async add(msg: KlasaMessage, [snipName, snipContent]: [string, string]): Promise<Message> {
		if (!msg.member.isStaff) throw 'You do not have permission to do this!';

		const newSnip: Snippet = { name: snipName, content: snipContent };
		const snips: Snippet[] = msg.guild.settings.get(GuildSettings.Snippets);
		if (snips.filter(s => s.name === newSnip.name).length > 0) throw `There is already a snippet with the name ${snipName}!`;

		await msg.guild.settings.update(GuildSettings.Snippets, newSnip, { action: 'add' });

		return msg.channel.send(`Added snippet with name: ${newSnip.name}.`);
	}

	public async edit(msg: KlasaMessage, [snipName, snipContent]: [string, string]): Promise<Message> {
		if (!msg.member.isStaff) throw 'You do not have permission to do this!';

		const snips: Snippet[] = msg.guild.settings.get(GuildSettings.Snippets);
		const snipsClone = snips.slice();
		const index = snipsClone.map(s => s.name).indexOf(snipName);

		snipsClone[index].content = snipContent;
		await msg.guild.settings.update(GuildSettings.Snippets, snipsClone, { action: 'overwrite' });

		return msg.channel.send(`The ${snipName} snippet has been updated.`);
	}

	public async remove(msg: KlasaMessage, [snipName]: [string]): Promise<Message> {
		if (!msg.member.isStaff) throw 'You do not have permission to do this!';

		const snips: Snippet[] = msg.guild.settings.get(GuildSettings.Snippets);
		const snipsClone = snips.slice();
		const index = snipsClone.map(s => s.name).indexOf(snipName);

		snipsClone.splice(index, 1);
		await msg.guild.settings.update(GuildSettings.Snippets, snipsClone, { action: 'overwrite' });

		return msg.channel.send(`The ${snipName} snipped has been removed.`);
	}

	public async view(msg: KlasaMessage, [snipName]: [string]): Promise<Message> {
		const snips: Snippet[] = msg.guild.settings.get(GuildSettings.Snippets);
		if (snips.filter(s => s.name === snipName).length === 0) throw `There is no snippet with the name **${snipName}**`;

		return msg.channel.send(wiki[Math.floor(Math.random()*wiki.length)]);
	}

	public async list(msg: KlasaMessage): Promise<Message> {
		const snips: Snippet[] = msg.guild.settings.get(GuildSettings.Snippets);
		if (snips.length < 1) throw 'This server has no snippets to list.';

		return msg.channel.send(`${snips.map(s => s.name).join('\n')}`);
	}

}

interface Snippet {
	name: string;
	content: string;
}

const wiki = ["https://en.wikipedia.org/wiki/United_States",
"https://en.wikipedia.org/wiki/Donald_Trump",
"https://en.wikipedia.org/wiki/Barack_Obama",
"https://en.wikipedia.org/wiki/India",
"https://en.wikipedia.org/wiki/World_War_II",
"https://en.wikipedia.org/wiki/Michael_Jackson",
"https://en.wikipedia.org/wiki/United_Kingdom",
"https://en.wikipedia.org/wiki/Lady_Gaga",
"https://en.wikipedia.org/wiki/Elizabeth_II",
"https://en.wikipedia.org/wiki/Eminem",
"https://en.wikipedia.org/wiki/Game_of_Thrones",
//"https://en.wikipedia.org/wiki/Adolf_Hitler", //Comment back in if you want Hitler to be a posibility
"https://en.wikipedia.org/wiki/Sex",
"https://en.wikipedia.org/wiki/The_Beatles",
"https://en.wikipedia.org/wiki/Cristiano_Ronaldo",
"https://en.wikipedia.org/wiki/World_War_I",
"https://en.wikipedia.org/wiki/Justin_Bieber",
"https://en.wikipedia.org/wiki/Canada",
"https://en.wikipedia.org/wiki/Steve_Jobs",
"https://en.wikipedia.org/wiki/The_Big_Bang_Theory",
"https://en.wikipedia.org/wiki/Kim_Kardashian",
"https://en.wikipedia.org/wiki/Freddie_Mercury",
"https://en.wikipedia.org/wiki/Darth_Vader",
"https://en.wikipedia.org/wiki/Australia",
"https://en.wikipedia.org/wiki/Stephen_Hawking",
"https://en.wikipedia.org/wiki/Lionel_Messi",
"https://en.wikipedia.org/wiki/Lil_Wayne",
"https://en.wikipedia.org/wiki/List_of_highest-grossing_films",
"https://en.wikipedia.org/wiki/Star_Wars",
"https://en.wikipedia.org/wiki/Academy_Awards",
"https://en.wikipedia.org/wiki/Dwayne_Johnson",
"https://en.wikipedia.org/wiki/Miley_Cyrus",
"https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States",
"https://en.wikipedia.org/wiki/How_I_Met_Your_Mother",
"https://en.wikipedia.org/wiki/China",
"https://en.wikipedia.org/wiki/Taylor_Swift",
"https://en.wikipedia.org/wiki/Japan",
"https://en.wikipedia.org/wiki/Germany",
"https://en.wikipedia.org/wiki/Selena_Gomez",
"https://en.wikipedia.org/wiki/Abraham_Lincoln",
"https://en.wikipedia.org/wiki/Harry_Potter",
"https://en.wikipedia.org/wiki/Rihanna",
"https://en.wikipedia.org/wiki/The_Walking_Dead_(TV_series)",
"https://en.wikipedia.org/wiki/New_York_City",
"https://en.wikipedia.org/wiki/Russia",
"https://en.wikipedia.org/wiki/Johnny_Depp",
"https://en.wikipedia.org/wiki/Albert_Einstein",
//"https://en.wikipedia.org/wiki/September_11_attacks",//Uncomment to include
"https://en.wikipedia.org/wiki/Kanye_West",
"https://en.wikipedia.org/wiki/Tupac_Shakur",
"https://en.wikipedia.org/wiki/Michael_Jordan",
"https://en.wikipedia.org/wiki/Leonardo_DiCaprio"]