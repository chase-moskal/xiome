
// import sendgridMail from "@sendgrid/mail"

// import {SecretConfig} from "../types/secret-config.js"
// import {ConfigEmailSendgrid} from "../types/config-email-sendgrid.js"

// export function configureSendgrid(config: {email: ConfigEmailSendgrid} & SecretConfig) {
// 	const {apiKey} = config.email.sendgrid
// 	sendgridMail.setApiKey(apiKey)
// 	return {
// 		sendEmail: async({to, body, subject}) => {
// 			await sendgridMail.send({
// 				to,
// 				subject,
// 				from: config.platform.from,
// 				text: body,
// 			})
// 		},
// 	}
// }
