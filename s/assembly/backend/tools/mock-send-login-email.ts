
import {SendLoginEmail, LoginEmailDetails} from "../../../features/auth/types/auth-types.js"

export function mockSendLoginEmail(sendLoginEmail: SendLoginEmail) {
	let latestLoginEmail: LoginEmailDetails
	const getLatestLoginEmail = () => latestLoginEmail
	const fakeSendLoginEmail = async(details: LoginEmailDetails) => {
		latestLoginEmail = details
		await sendLoginEmail(details)
	}
	return {fakeSendLoginEmail, getLatestLoginEmail}
}
