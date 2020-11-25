
import {testableSystem} from "./base/testable-system.js"
import {setNextEmailLogin} from "./routines/set-next-email-login.js"

export async function technicianSystem() {
	const testable = await testableSystem()
	return setNextEmailLogin({
		testable,
		appToken: testable.platformAppToken,
		email: testable.system.config.platform.technician.email,
	})
}
