
import mailgun from "mailgun-js"
import {ConfigEmailMailgun} from "../types/config-email-mailgun.js"
import {sendEmail as mockSendEmail} from "../../../features/auth/tools/emails/mock-send-email.js"

export function configureMailgun({mailgun: {apiKey, from, sendingDomain}}: ConfigEmailMailgun) {
	const mg = mailgun({apiKey, domain: sendingDomain})
	return {
		sendEmail: async({to, body, subject}) => {
			await mockSendEmail({to, body, subject})
			await mg.messages().send({
				from,
				to,
				subject,
				text: body,
			})
			console.log("sent via mailgun")
		},
	}
}
