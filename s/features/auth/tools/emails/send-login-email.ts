
import {makeLoginLink} from "./make-login-link.js"
import {minute} from "../../../../toolbox/timely.js"
import {SendEmail, SendLoginEmail} from "../../auth-types.js"

export function prepareSendLoginEmail({sendEmail}: {
		sendEmail: SendEmail
	}): SendLoginEmail {

	return async function sendLoginEmail({
			to,
			appHome,
			appLabel,
			lifespan,
			loginToken,
			platformLink,
		}) {

		const loginLink = makeLoginLink({loginToken, home: appHome})
		const minutesLeft = (lifespan / minute).toFixed(0)

		return sendEmail({
			to,
			subject: `Login link for ${appLabel}`,
			body: (
`
Login link for ${appLabel} (expires in ${minutesLeft} minutes)
 » ${loginLink} «

If you didn't request this login link, just ignore it

 * logins powered by ${platformLink} *
`
			),
		})
	}
}
