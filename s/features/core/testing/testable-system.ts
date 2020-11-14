
import {tempStorage} from "../../../toolbox/json-storage.js"
import {mockWholeSystem} from "../../../assembly/mock-whole-system.js"

export async function testableSystem() {
	let count = 0
	const system = await mockWholeSystem({
		storage: tempStorage(),
		generateNickname: () => `Anonymous ${count++}`,
	})
	return {
		system,
		rootAppToken: await system.signAppToken({
			...system.config.platform.app,
			root: true,
		}),
	}
}
