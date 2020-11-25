
import {AppToken} from "../../auth-types.js"
import {Await} from "../../../../types/fancy.js"
import {testableSystem} from "../base/testable-system.js"

export async function setNextEmailLogin({
			email,
			appToken,
			testable
		}: {
			email: string
			appToken: AppToken
			testable: Await<ReturnType<typeof testableSystem>>
		}) {

	const {frontend, frontHacks} = await testable.system.assembleFrontendForApp(testable.platformAppToken)
	const {loginTopic} = testable.system.backend.authApi
	
	frontHacks.setNextLogin(async() => {
		const {nextLoginEmail} = testable
		await loginTopic.sendLoginLink({appToken}, {email})
		const {loginToken} = await nextLoginEmail
		return loginTopic.authenticateViaLoginToken({appToken}, {loginToken})
	})

	return {frontend, frontHacks, testable}
}
