
import {testableSystem} from "./base/testable-system.js"
import {primeFrontendWithLogin} from "./routines/prime-frontend-with-login.js"

export async function creativeSystem() {
	const testable = await testableSystem()
	return primeFrontendWithLogin({
		testable,
		email: "somebody@chasemoskal.com",
		appToken: testable.platformAppToken,
	})
}
