import nodemailer, { Transporter } from 'nodemailer';

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;
    });
  }

  async execute(to: string, subject: string, body: string) {
    const message = await this.client.sendMail({
      from: 'NPS <noreply@nps.com.br>',
      html: body,
      subject,
      to
    });
  }
}

export default new SendMailService();
