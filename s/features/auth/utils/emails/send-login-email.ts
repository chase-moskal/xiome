
import {makeLoginLink} from "./make-login-link.js"
import {SendEmail} from "../../types/emails/send-email.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {escapeHtml} from "../../../../toolbox/escape-html.js"
import {noop as html} from "../../../../toolbox/template-noop.js"
import {SendLoginEmail} from "../../aspects/users/types/emails/send-login-email.js"

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
		const minutesLeft = Math.round((lifespan / minute)).toFixed(0)
		const safeLabel = escapeHtml(appLabel)
		const platformHost = new URL(platformLink).host

		return sendEmail({
			to,
			fromLabel: appLabel,
			subject: `Login link`,

			html: (
html`
<h1>Login link for ${safeLabel}</h1>
<p style="font-size: 1.2em; padding-left: 0.5rem;">
	<a href="${loginLink.toString()}">» Login to ${safeLabel} «</a>
</p>
<div style="opacity: 0.7; font-size: 0.8em; margin-top: 2rem;">
	<p>Expires in ${minutesLeft} minutes.</p>
	<p>If you didn't request this login link, just ignore it.</p>
	<p>You can contact support by replying to this email.</p>
	<ul style="padding-left: 0.5rem;">
		<li>Logins powered by <a href="${platformLink}">${platformHost}</a></li>
		<li><a href="${legalLink}">Policies and terms of service</a></li>
	</ul>
	<p style="opacity: 0.3; font-size: 0.4em;">
		${Date.now()}
	</p>
</div>
`
			),

			text: (
`
Login link for ${appLabel}

  » ${loginLink.toString()}


Expires in ${minutesLeft} minutes

If you didn't request this login link, just ignore it.

You can contact support by replying to this email.

  * Logins powered by ${platformLink}

  * Policies and terms of service ${legalLink}

${Date.now()}
`
			),

		})
	}
}
