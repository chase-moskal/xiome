
import {testableSystem} from "./base/testable-system.js"
import {setNextEmailLogin} from "./routines/set-next-email-login.js"

export async function creativeSystem() {
	const testable = await testableSystem()

	setNextEmailLogin({
		testable,
		email: "somebody@chasemoskal.com",
		appToken: testable.platformAppToken,
	})

	return testable
}
