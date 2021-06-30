
import {SendEmail} from "../../../../../features/auth/types/emails/send-email.js"

export function makeEmailEnabler(actuallySendEmail: SendEmail) {
	let enabled = true

	const sendEmail: SendEmail = async details => {
		if (enabled)
			return actuallySendEmail(details)
	}

	return {
		sendEmail,
		enableEmails() { enabled = true },
		disableEmails() { enabled = false },
	}
}
