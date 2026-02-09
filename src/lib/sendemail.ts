import nodemailer from "nodemailer";
import { config } from "../config/config";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port) || 587,
    secure: config.smtp_secure,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Skill Bridge" <${config.smtp_from}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Email sent: %s", info.messageId);
}
