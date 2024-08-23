import Mailgun, { Interfaces, MailgunMessageData } from 'mailgun.js';
import * as FormData from 'form-data';

const MAILGUN_DOMAIN =
  process.env.MAILGUN_DOMAIN ||
  'sandbox8f0bdc9d136c4be18a172d75b5dee3eb.mailgun.org';

export class MailgunClient {
  mailgunClient: Interfaces.IMailgunClient;
  constructor() {
    const mailgun = new Mailgun(FormData);
    this.mailgunClient = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere',
    });
  }

  async sendEmail(options: MailgunMessageData) {
    await this.mailgunClient.messages.create(MAILGUN_DOMAIN, {
      ...options,
    });
  }
}
