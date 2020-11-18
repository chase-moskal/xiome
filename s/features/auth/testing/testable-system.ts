
import {LoginEmailDetails} from "../auth-types.js"
import {tempStorage} from "../../../toolbox/json-storage.js"
import {remotePromise} from "../../../toolbox/remote-promise.js"
import {mockWholeSystem} from "../../../assembly/mock-whole-system.js"

export async function testableSystem() {
	let count = 0
	let nextLoginEmail = remotePromise<LoginEmailDetails>()

	const system = await mockWholeSystem({
		storage: tempStorage(),
		generateNickname: () => `Anonymous ${count++}`,
		sendLoginEmail: async details => {
			nextLoginEmail.resolve(details)
			nextLoginEmail = remotePromise()
		},
	})

	return {
		system,
		platformToken: await system.signAppToken(system.config.platform.app),
		get nextLoginEmail() {
			return nextLoginEmail.promise
		},
	}
}
