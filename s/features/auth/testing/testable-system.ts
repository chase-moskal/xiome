
import {tempStorage} from "../../../toolbox/json-storage.js"
import {mockWholeSystem} from "../../../assembly/mock-whole-system.js"

export async function testableSystem() {
	let count = 0

	// TODO email "lol"....
	const system = await mockWholeSystem({
		storage: tempStorage(),
		generateNickname: () => `Anonymous ${count++}`,
		sendEmail: async(emailDetails) => console.log("EMAIL", emailDetails),
	})

	return {
		system,
		platformToken: await system.signAppToken({
			...system.config.platform.app,
			platform: true,
			label: "Platform",
		}),
	}
}
