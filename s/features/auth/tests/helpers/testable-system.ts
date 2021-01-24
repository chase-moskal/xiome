
import {LoginEmailDetails} from "../../auth-types.js"
import {memoryStorage} from "../../../../toolbox/json-storage.js"
import {mockWholeSystem} from "../../../../assembly/mock-whole-system.js"
import {platformLink, technicianEmail, platformAppLabel} from "./constants.js"

export async function testableSystem() {
	let loginEmail: LoginEmailDetails

	const system = await mockWholeSystem({
		platformLink,
		technicianEmail,
		platformAppLabel,
		tableStorage: memoryStorage(),
		sendLoginEmail: async (details) => {
			loginEmail = details
		},
	})

	return {
		system,
		getLatestLoginEmail: () => loginEmail,
	}
}
