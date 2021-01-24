
import {makeLoginLink} from "./make-login-link.js"
import {minute} from "../../../../toolbox/timely.js"
import {SendEmail, SendLoginEmail} from "../../auth-types.js"

export function prepareSendLoginEmail({sendEmail}: {
		sendEmail: SendEmail
	}): SendLoginEmail {

	return async function sendLoginEmail({
			to,
			app,
			lifespan,
			loginToken,
			platformLink,
		}) {

		const loginLink = makeLoginLink({loginToken, home: app.home})
		const minutesLeft = (lifespan / minute).toFixed(0)

		return sendEmail({
			to,
			subject: `Login link for ${app.label}`,
			body: (
`
Login link for ${app.label} (expires in ${minutesLeft} minutes)
 » ${loginLink} «

If you didn't request this login link, just ignore it

 * logins powered by ${platformLink} *
`
			),
		})
	}
}
