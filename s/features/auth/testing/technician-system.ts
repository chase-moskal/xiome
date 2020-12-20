
import {testableSystem} from "./base/testable-system.js"
import {primeFrontendWithLogin} from "./routines/prime-frontend-with-login.js"

export async function technicianSystem() {
	const testable = await testableSystem()
	return primeFrontendWithLogin({
		testable,
		appToken: testable.platformAppToken,
		email: testable.system.config.platform.technician.email,
	})
}
