
import {AppToken} from "../../auth-types.js"
import {Await} from "../../../../types/fancy.js"
import {testableSystem} from "../base/testable-system.js"

export function setNextEmailLogin({email, appToken, testable}: {
			email: string
			appToken: AppToken
			testable: Await<ReturnType<typeof testableSystem>>
		}) {
	const {loginTopic} = testable.system.backend.authApi
	testable.system.controls.setNextLogin(async function registerCreative() {
		const {nextLoginEmail} = testable
		await loginTopic.sendLoginLink({appToken}, {email})
		const {loginToken} = await nextLoginEmail
		return loginTopic.authenticateViaLoginToken({appToken}, {loginToken})
	})
}
