
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {loginEmailRecaller} from "../tools/login-email-recaller.js"
import {SendEmail} from "../../../features/auth/types/emails/send-email.js"
import {mockSendEmail} from "../../../features/auth/utils/emails/mock-send-email.js"
import {makeEmailEnabler} from "../../frontend/connect/mock/common/email-enabler.js"
import {prepareSendLoginEmail} from "../../../features/auth/utils/emails/send-login-email.js"

export function assimilateEmails({
		config,
		configureMailgun,
	}: AssimilatorOptions) {

	let sendEmail: SendEmail

	if (config.email === "mock-console") {
		sendEmail = mockSendEmail
	}
	else {
		sendEmail = configureMailgun(config.email).sendEmail
	}

	const enabler = makeEmailEnabler(sendEmail)
	sendEmail = enabler.sendEmail
	const {disableEmails, enableEmails} = enabler

	const {sendLoginEmail, recallLatestLoginEmail} = loginEmailRecaller(
		prepareSendLoginEmail({sendEmail})
	)

	return {
		sendEmail,
		enableEmails,
		disableEmails,
		sendLoginEmail,
		recallLatestLoginEmail,
	}
}
