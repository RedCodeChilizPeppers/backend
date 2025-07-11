import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailersService {
	constructor(
		private readonly mailerService: MailerService,
	) {}

	async sendMail(
		to: string,
		subject: string,
		template: string,
		context: any,
		fromName: string = "Lootin.gg"
	): Promise<void> {
		return await this.mailerService.sendMail({
			to: to,
			subject: subject,
			// template: __dirname + "/mails" + template + ".hbs",
			template: __dirname + '../../../templatesView' + template + '.hbs',
			context: context,
			from: `${fromName} <no-reply@lootin.gg>`,
		});
	}
}
