
import {Suite, assert} from "cynic"
import {Await} from "../../../types/fancy.js"
import {testableSystem} from "./testable-system.js"

export function commonTests({initialize,}: {
			initialize: (testable: Await<ReturnType<typeof testableSystem>>) => Promise<void>
		}) {

	async function initializeTestable() {
		const testable = await testableSystem()
		await initialize(testable)
		return testable
	}

	return <Suite>{

		"login and out": async() => {
			const testable = await initializeTestable()
			const {core} = testable.system.frontend.models

			await core.login()
			assert(core.user, "initial login")
			await core.logout()
			assert(!core.user, "initial logout")
		},

		"customize own profile": true,

		"fetch other profiles": true,
	}
}
