
import {makeLoginLink} from "./make-login-link.js"
import {SendEmail} from "../../types/emails/send-email.js"
import {minute} from "../../../../toolbox/goodtimes/times.js"
import {escapeHtml} from "../../../../toolbox/escape-html.js"
import {noop as html} from "../../../../toolbox/template-noop.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"
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
		const expiry = formatDate(Date.now() + lifespan)
		const safeLabel = escapeHtml(appLabel)
		const platformHost = new URL(platformLink).host

		return sendEmail({
			to,
			fromLabel: appLabel,
			subject: `Login link`,

			html: (
html`
<h1>Login link for ${safeLabel}</h1>
<p>To login, click the link:</p>
<p style="font-size: 1.2em; padding: 0.5rem;">
	<a href="${loginLink.toString()}">» Login to ${safeLabel} «</a>
</p>
<hr style="margin-top: 1em;"/>
<div style="font-size: 0.8em; opacity: 0.7;">
	<p>Expires in ${minutesLeft} minutes <span style="opacity: 0.7;">(${expiry.time})</span></p>
	<p>If you didn't request this login link, just ignore it.</p>
	<p>For customer support, you can reply directly to this email</p>
	<ul>
		<li>Logins powered by <a href="${platformLink}">${platformHost}</a></li>
		<li><a href="${platformLink}">Policies and terms of service</a></li>
	</ul>
</div>
`
			),

			text: (
`
Login link for ${appLabel}

  » ${loginLink.toString()}


Expires in ${minutesLeft} minutes (${expiry.time})

If you didn't request this login link, just ignore it.

For customer support, you can reply directly to this email.

  * Logins powered by ${platformLink}

  * Policies and terms of service ${legalLink}
`
			),

		})
	}
}
