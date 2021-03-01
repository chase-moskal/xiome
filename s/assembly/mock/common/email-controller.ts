
import {EmailDetails, SendEmail} from "../../../features/auth/types/auth-types.js"

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
