
import mailgun from "mailgun-js"
import {ConfigEmailMailgun} from "../types/config-email-mailgun.js"

export function configureMailgun({mailgun: {apiKey, from, sendingDomain}}: ConfigEmailMailgun) {
	const mg = mailgun({apiKey, domain: sendingDomain})
	return {
		sendEmail: async({to, body, subject}) => {
			await mg.messages().send({
				from,
				to,
				subject,
				text: body,
			})
		},
	}
}
