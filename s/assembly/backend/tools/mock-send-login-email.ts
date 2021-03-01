
import {SendLoginEmail} from "../../../features/auth/types/send-login-email.js"
import {LoginEmailDetails} from "../../../features/auth/types/login-email-details"

export function mockSendLoginEmail(sendLoginEmail: SendLoginEmail) {
	let latestLoginEmail: LoginEmailDetails
	const getLatestLoginEmail = () => latestLoginEmail
	const fakeSendLoginEmail = async(details: LoginEmailDetails) => {
		latestLoginEmail = details
		await sendLoginEmail(details)
	}
	return {fakeSendLoginEmail, getLatestLoginEmail}
}
