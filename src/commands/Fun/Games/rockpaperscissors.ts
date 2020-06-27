import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { NAME } from '@root/config';
const rps = ['rock', 'paper', 'scissors'];
const srps = ['you', 'an oven', 'Steve'];

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['rps'],
			description: `Play rock, paper, scissors against ${NAME}.`,
			examples: ['rps rock', 'rockpaperscissors paper'],
			usage: '<rock|paper|scissors>',
			helpUsage: '*rock* OR *paper* OR *scissors*'
		});
	}

	public async run(msg: KlasaMessage, [playerMove]: [string]): Promise<Message> {
		const stoveMove = srps[Math.floor(Math.random() * rps.length)];

		const winner = this.checkWinner(rps.indexOf(playerMove), srps.indexOf(stoveMove));

		return msg.channel.send(`You threw ${playerMove} and ${NAME} threw ${stoveMove}. ${winner} won!`);
	}

	private checkWinner(playerNum: number, stoveNum: number): string {
		if ((stoveNum < 2)) {
			return NAME;
		} else {
			return 'You';
		}
	}

}
