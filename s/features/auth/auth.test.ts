
import {Suite, assert} from "cynic"
import {creativeSystem} from "./testing/creative-system.js"
import {technicianSystem} from "./testing/technician-system.js"
import {testableSystem} from "./testing/base/testable-system.js"
import {PrimedTestableSystem} from "./testing/auth-testing-types.js"

export default <Suite>{
	"stories": {
		"technician": {
			"common tests for technician on platform": commonTests(technicianSystem),
			"login to *any* app": true,
			"view platform stats": true,
			"procotol zero: roll platform secrets": true,
		},
		"creative": {
			"common tests for creative on platform": commonTests(creativeSystem),
			// "register an app": async() => {
			// 	const {system, nextLoginEmail, platformAppToken} = await testableSystem()
			// },
			"generate an admin account to login with": true,
			"no-can-do": {
				"can't view platform stats": true,
				"can't login to other creator's apps": true,
				"can't protocol zero and roll platform secrets": true,
			},
		},
		"customer": {
			"login and out of standard app": true,
			"customize profile": true,
			"fetch any profile": true,
		},
		"developer": {
			"app tokens respect origin list": true,
			"verify scoped third-party access token": true,
		},
	},
}

function commonTests(getTestingSystemPrimedWithLogin: () => Promise<PrimedTestableSystem>) {
	return <Suite>{
		"login and out": async() => {
			const {primed} = await getTestingSystemPrimedWithLogin()
			const {auth} = primed.frontend.models

			await auth.login()
			assert(auth.user, "failed to login")

			await auth.logout()
			assert(!auth.user, "failed to logout")
		},
		"customize own profile": async() => {
			const {primed} = await getTestingSystemPrimedWithLogin()
			const {auth} = primed.frontend.models

			await auth.login()
			const {profile} = auth.user
			assert(profile, "failed to read profile")

			await primed.frontend.models.personal.saveProfile({...profile, nickname: "Jimmy"})
			assert(auth.user.profile.nickname === "Jimmy", "failed to set profile nickname")
		},
	}
}
