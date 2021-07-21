
import {SendLoginEmail} from "../../../features/auth/aspects/users/types/emails/send-login-email.js"
import {LoginEmailDetails} from "../../../features/auth/aspects/users/types/emails/login-email-details.js"

export function loginEmailRecaller(sendLoginEmail: SendLoginEmail) {

	let latestLoginEmail: LoginEmailDetails

	return {
		sendLoginEmail: async(details: LoginEmailDetails) => {
			latestLoginEmail = details
			await sendLoginEmail(details)
		},
		recallLatestLoginEmail: () => latestLoginEmail,
	}
}
