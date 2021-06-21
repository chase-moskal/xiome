
import {SendEmail} from "../../../../../features/auth/types/emails/send-email.js"
import {EmailDetails} from "../../../../../features/auth/types/emails/email-details.js"

export function makeEmailEnabler(sendEmailActual: SendEmail) {
	const disabled = async() => {}
	let sendEmailMaybe: SendEmail = disabled

	function enableEmails() {
		sendEmailMaybe = sendEmailActual
	}

	function disableEmails() {
		sendEmailMaybe = disabled
	}

	async function sendEmail(details: EmailDetails) {
		await sendEmailMaybe(details)
	}

	return {sendEmail, enableEmails, disableEmails}
}
