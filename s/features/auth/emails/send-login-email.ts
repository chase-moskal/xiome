
import {minute} from "../../../toolbox/timely.js"
import {PlatformConfig, SendEmail, SendLoginEmail} from "../auth-types.js"

export function prepareSendLoginEmail({config, sendEmail}: {
			config: PlatformConfig
			sendEmail: SendEmail
		}): SendLoginEmail {

	return async function sendLoginEmail({to, app, loginToken}) {
		const loginLink = app.home + "#" + loginToken
		const minutesLeft = (config.tokens.lifespans.login / minute).toFixed(0)
		const platformLink = config.platform.app.home
		return sendEmail({
			to,
			subject: `Login link for ${app.label}`,
			body: [
				`Login link for ${app.label}`,
				`    » ${loginLink} «`,
				``,
				`Link expires in ${minutesLeft} minutes`,
				``,
				`If you didn't request this login link, just ignore it`,
				``,
				`  * logins powered by ${platformLink} *`,
				``,
			].join("\n\n"),
		})
	}
}
