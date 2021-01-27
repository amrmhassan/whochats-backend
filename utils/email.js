import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import path from 'path';

const __dirname = path.resolve();

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `WhoChats <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host:
        process.env.NODE_ENV === 'production'
          ? process.env.EMAIL_HOST_PROD
          : process.env.EMAIL_HOST,
      port:
        process.env.NODE_ENV === 'production'
          ? process.env.EMAIL_PORT_PROD
          : process.env.EMAIL_PORT,
      auth: {
        user:
          process.env.NODE_ENV === 'production'
            ? process.env.EMAIL_USERNAME_PROD
            : process.env.EMAIL_USERNAME,
        pass:
          process.env.NODE_ENV === 'production'
            ? process.env.EMAIL_PASSWORD_PROD
            : process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async verifyEmail() {
    await this.send('verifyEmail', 'Verifying Email for WhoChats');
  }

  async sendPasswordReset() {
    await this.send(
      'forgetPassword',
      'Your password reset link (valid for only 10 minutes)'
    );
  }
}
