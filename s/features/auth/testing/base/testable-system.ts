
import {LoginEmailDetails} from "../../auth-types.js"
import {tempStorage} from "../../../../toolbox/json-storage.js"
import {remotePromise} from "../../../../toolbox/remote-promise.js"
import {mockWholeSystem} from "../../../../assembly/mock-whole-system.js"

export async function testableSystem() {
	let count = 0
	let remoteNextLoginEmail = remotePromise<LoginEmailDetails>()

	const system = await mockWholeSystem({
		storage: tempStorage(),
		generateNickname: () => `Anonymous ${count++}`,
		sendLoginEmail: async details => {
			remoteNextLoginEmail.resolve(details)
			remoteNextLoginEmail = remotePromise()
		},
	})

	async function primeFrontendWithLogin({email, appToken}: {
				email: string
				appToken: string
			}) {

		const {frontend, frontHacks} = await system.assembleFrontendForApp(appToken)
		const {loginTopic} = system.backend.authApi
		
		frontHacks.setNextLogin(async() => {
			const {promise} = remoteNextLoginEmail
			await loginTopic.sendLoginLink({appToken}, {email})
			const {loginToken} = await promise
			return loginTopic.authenticateViaLoginToken({appToken}, {loginToken})
		})

		return {frontend, frontHacks}
	}

	return {
		system,
		primeFrontendWithLogin,
		platformAppToken: await system.hacks.signAppToken(system.config.platform.app),
		get nextLoginEmail() {
			return remoteNextLoginEmail.promise
		},
	}
}
