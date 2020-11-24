
import {testableSystem} from "./testable-system.js"

export async function technicianSystem() {
	const testable = await testableSystem()
	const appToken = testable.platformAppToken
	const {loginTopic} = testable.system.backend.authApi
	const {email} = testable.system.config.platform.technician

	testable.system.controls.setNextLogin(async function registerTechnician() {
		const {nextLoginEmail} = testable
		await loginTopic.sendLoginLink({appToken}, {email})
		const {loginToken} = await nextLoginEmail
		return loginTopic.authenticateViaLoginToken({appToken}, {loginToken})
	})

	return testable
}
