import nodemailer from "nodemailer";
import { envConfig } from "./config";

const transport = nodemailer.createTransport({
	secure: true,
	port: 465,
	host: envConfig.SMTP_HOST,
	auth: {
		user: envConfig.MAIL_USER,
		pass: envConfig.MAIL_PASS,
	},
});

/**
 * Send email
 * @param to Receiver(s)
 * @param subject Email subject
 * @param content Email content
 * @returns
 */
export const sendMail = async (
	to: string | string[],
	subject: string,
	content: string,
) => {
	const result = await transport
		.sendMail({
			from: envConfig.MAIL_USER,
			to,
			html: content,
			subject,
		})
		.catch(() => null);
	return result;
};
