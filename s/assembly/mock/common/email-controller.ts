
import {SendEmail} from "../../../features/auth/types/SendEmail"
import {EmailDetails} from "../../../features/auth/types/EmailDetails"

export function makeEmailController(sendEmailActual: SendEmail) {
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
