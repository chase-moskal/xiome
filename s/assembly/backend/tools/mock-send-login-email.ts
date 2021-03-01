
import {SendLoginEmail} from "../../../features/auth/types/SendLoginEmail"
import {LoginEmailDetails} from "../../../features/auth/types/LoginEmailDetails"

export function mockSendLoginEmail(sendLoginEmail: SendLoginEmail) {
	let latestLoginEmail: LoginEmailDetails
	const getLatestLoginEmail = () => latestLoginEmail
	const fakeSendLoginEmail = async(details: LoginEmailDetails) => {
		latestLoginEmail = details
		await sendLoginEmail(details)
	}
	return {fakeSendLoginEmail, getLatestLoginEmail}
}
