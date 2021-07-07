
import formData from "form-data"
import Mailgun from "mailgun.js"

import {ConfigEmailMailgun} from "../types/config-email-mailgun.js"
import {sendEmail as mockSendEmail} from "../../../features/auth/tools/emails/mock-send-email.js"

export function configureMailgun({mailgun: {apiKey, publicKey, from, domain}}: ConfigEmailMailgun) {
	const mailgun = new Mailgun(formData)
	const mg = mailgun.client({
		username: "api",
		key: apiKey,
		public_key: publicKey,
	})
	return {
		sendEmail: async({to, body, subject}) => {
			await mockSendEmail({to, body, subject})
			await mg.messages.create(domain, {
				from,
				to,
				subject,
				text: body,
			})
		},
	}
}
