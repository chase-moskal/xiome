
import {Suite, assert} from "cynic"
import {testableSystem} from "./testable-system.js"

export function commonTests(makeTestable: () => ReturnType<typeof testableSystem>) {
	return <Suite>{
		"login and out": async() => {
			const {system} = await makeTestable()
			const {auth} = system.frontend.models
			await auth.login()
			assert(auth.user, "initial login")
			await auth.logout()
			assert(!auth.user, "initial logout")
		},

		"customize own profile": true,

		"fetch other profiles": true,
	}
}
