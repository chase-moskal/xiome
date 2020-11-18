
import {Suite, assert} from "cynic"
import {testableSystem} from "./testable-system.js"

export function commonTests(makeTestable: () => ReturnType<typeof testableSystem>) {
	return <Suite>{
		"login and out": async() => {
			const {system} = await makeTestable()
			const {core} = system.frontend.models
			await core.login()
			assert(core.user, "initial login")
			await core.logout()
			assert(!core.user, "initial logout")
		},

		"customize own profile": true,

		"fetch other profiles": true,
	}
}
