
import formData from "form-data"
import Mailgun from "mailgun.js"
import {mockSendEmail} from "../../../features/auth2/utils/emails/mock-send-email.js"

import {ConfigEmailMailgun} from "../types/config-email-mailgun.js"

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
