
import {LoginEmailDetails} from "../../auth-types.js"
import {mockWholeSystem} from "../../../../assembly/mock-whole-system.js"

export async function testableSystem() {

	let loginEmail: LoginEmailDetails

	const system = await mockWholeSystem({
		sendLoginEmail: async (details) => {
			loginEmail = details
		},
	})

	return {
		system,
		getLatestLoginEmail: () => loginEmail,
	}
}
