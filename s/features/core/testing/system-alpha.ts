
import {testableSystem} from "./testable-system.js"

export async function systemAlpha() {
	const {system, rootAppToken} = await testableSystem()

	system.mockNextLogin(
		async authTopic => authTopic.authenticateViaPasskey(
			{appToken: rootAppToken},
			{passkey: system.technicianPasskey},
		)
	)

	await system.frontend.models.core.login()

	// TODO implement: example app registration, return apptoken
}
