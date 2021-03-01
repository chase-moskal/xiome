
import {SendLoginEmail} from "../../../features/auth/types/emails/send-login-email.js"
import {LoginEmailDetails} from "../../../features/auth/types/emails/login-email-details.js"

export function mockSendLoginEmail(sendLoginEmail: SendLoginEmail) {
	let latestLoginEmail: LoginEmailDetails
	const getLatestLoginEmail = () => latestLoginEmail
	const fakeSendLoginEmail = async(details: LoginEmailDetails) => {
		latestLoginEmail = details
		await sendLoginEmail(details)
	}
	return {fakeSendLoginEmail, getLatestLoginEmail}
}
