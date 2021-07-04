
import {makeLoginLink} from "./make-login-link.js"
import {SendEmail} from "../../types/emails/send-email.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {SendLoginEmail} from "../../types/emails/send-login-email.js"

export function prepareSendLoginEmail({sendEmail}: {
		sendEmail: SendEmail
	}): SendLoginEmail {

	return async function sendLoginEmail({
			to,
			appHome,
			appLabel,
			lifespan,
			legalLink,
			loginToken,
			platformLink,
		}) {

		const loginLink = makeLoginLink({loginToken, home: appHome})
		const minutesLeft = (lifespan / minute).toFixed(0)

		return sendEmail({
			to,
			subject: `Login to ${appLabel}`,
			body: (
`
Login link for ${appLabel} (expires in ${minutesLeft} minutes)

 » ${loginLink} «

If you didn't request this login link, just ignore it

 * logins powered by ${platformLink} *
 * policies and terms of service ${legalLink} *
`
			),
		})
	}
}
