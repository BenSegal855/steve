import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandOptions, KlasaMessage } from 'klasa';
import { ColorResolvable, Message, MessageEmbed, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { friendlyDuration } from '@utils/util';
import { Reminder } from '@root/src/extendables/Schedule';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { ApplyOptions } from '@skyra/decorators';

@ApplyOptions<CommandOptions>({
	aliases: ['remindme', 'reminders', 'myreminders'],
	description: lang => lang.tget('commandRemindDescription'),
	extendedHelp: lang => lang.tget('commandRemindExtended'),
	subcommands: true,
	usage: '<view|cancel|create:default> (reminder:reminder) (duration:timespan)'
})
export default class extends SteveCommand {

	public async init() {
		this
			.createCustomResolver('reminder', (str, possible, msg, [action]) => {
				if (action === 'view') return null;
				if (action === 'create') {
					if (str.length <= 140) return str;
					throw msg.language.tget('resolverReminderLength');
				}

				const reminders = this.client.schedule.getUserReminders(msg.author.id);
				const reminderNum = parseInt(str, 10);
				if (isNaN(reminderNum) || reminders.length < reminderNum) throw msg.language.tget('resolverReminderInvalid', str);
				return reminderNum;
			})
			.createCustomResolver('timespan', (str, possible, msg, [action]) => {
				if (action === 'view' || action === 'cancel') return null;
				return this.client.arguments.get('timespan').run(str, possible, msg);
			});
	}

	public async create(msg: KlasaMessage, [reminder, duration]: [string, number]): Promise<Message> {
		const reminderChannel = msg.guild ? msg.guild.settings.get(GuildSettings.Channels.ReminderChannel) : null;

		await this.client.schedule.createReminder(duration, msg.author.id, reminder, msg.channel instanceof TextChannel && reminderChannel ? reminderChannel : msg.channel.id);

		return msg.channel.send(msg.language.tget('commandRemindCreated', friendlyDuration(duration)));
	}

	public async view(msg: KlasaMessage): Promise<Message> {
		let output = '';
		const reminders = this.client.schedule.getUserReminders(msg.author.id);
		if (reminders.length < 1) throw msg.language.tget('commandRemindNoreminders');

		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];
			const display = await this.getReminderDisplayContent(msg, reminder);
			output += `**${i + 1}**: ${display} (${friendlyDuration(reminder.time.getTime() - Date.now())} left!)\n\n`;
		}

		const embedData = msg.language.tget('commandRemindViewEmbed');

		const embed = new MessageEmbed()
			.attachFiles(['./assets/images/alarmclock.png'])
			.setColor(msg.author.settings.get(UserSettings.EmbedColor) as ColorResolvable || 0xadcb27)
			.setDescription(output)
			.setTitle(embedData.title)
			.setThumbnail('attachment://alarmclock.png');

		return msg.channel.send(embed);
	}

	public async cancel(msg: KlasaMessage, [reminderNum]: [number]): Promise<Message> {
		const reminders = this.client.schedule.getUserReminders(msg.author.id);
		const reminder = reminders[reminderNum - 1];

		await reminder.delete();

		return msg.channel.send(msg.language.tget('commandRemindCanceled', await this.getReminderDisplayContent(msg, reminder)));
	}

	private async getReminderDisplayContent(msg: KlasaMessage, reminder: Reminder): Promise<string> {
		const reminderUser = await this.client.users.fetch(msg.author.id);
		if (!reminderUser.dmChannel) return reminder.data.content;


		// @ts-expect-error 2339
		const channelID = reminder.data.channelID ?? reminder.data.channel;

		return channelID === reminderUser.dmChannel.id && msg.channel.id !== reminderUser.dmChannel.id
			? msg.language.tget('commandReminderDisplayHidden')
			: reminder.data.content;
	}

}
