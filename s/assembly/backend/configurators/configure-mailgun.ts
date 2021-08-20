
import formData from "form-data"
import Mailgun from "mailgun.js"
import {SendEmail} from "../../../features/auth/types/emails/send-email.js"
import {mockSendEmail} from "../../../features/auth/utils/emails/mock-send-email.js"

import {ConfigEmailMailgun} from "../types/config-email-mailgun.js"

export function configureMailgun({
		mailgun: {apiKey, publicKey, fromAddress, domain}
	}: ConfigEmailMailgun) {

	const mailgun = new Mailgun(formData)
	const mg = mailgun.client({
		username: "api",
		key: apiKey,
		public_key: publicKey,
	})

	return {
		sendEmail: <SendEmail>(async({to, fromLabel, text, html, subject}) => {
			await mockSendEmail({fromLabel, to, subject, text, html})
			await mg.messages.create(domain, {
				from: `${fromLabel} <${fromAddress}>`,
				to: [to],
				subject,
				text,
				html,
			})
		}),
	}
}
