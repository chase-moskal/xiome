
import {Suite, assert} from "cynic"

import { LoginEmailDetails } from "./auth-types.js"
import { mockWholeSystem } from "../../assembly/mock-whole-system.js"

// import {creativeSystem} from "./testing/creative-system.js"
// import {technicianSystem} from "./testing/technician-system.js"
// import {PrimedTestableSystem} from "./testing/auth-testing-types.js"

const apiLink = "http://localhost:5001/"
const windowLink = "http://localhost:5000/"

export default <Suite>{
	"stories": {
		"technician": {
			"common tests for technician on platform": async() => {
				let recentLogin: LoginEmailDetails
				const system = await mockWholeSystem({
					sendLoginEmail: async details => {
						recentLogin = details
					},
				})
				const browser = await system.fakeBrowser()

				// technician signup
				{
					const platformWindow = await browser.mockAppWindow({
						apiLink,
						windowLink,
						appToken: system.platformAppToken,
					})
					await platformWindow.frontend.models.authModel.sendLoginLink(
						system.config.platform.technician.email
					)
				}

				// technician login
				{
					const browser2 = await system.fakeBrowser()
					const technicianWindow = await browser2.mockAppWindow({
						apiLink,
						windowLink: `${windowLink}?login=${recentLogin.loginToken}`,
						appToken: system.platformAppToken,
					})
					const access = await technicianWindow.frontend.models.authModel.getAccess()
					assert(access.user.userId.length > 0, "error with user id")
				}
			},
			"login to *any* app": true,
			"view platform stats": true,
			"procotol zero: roll platform secrets": true,
		},
		"creative": {
			// "common tests for creative on platform": commonTests(creativeSystem),
			// "register an app": async() => {
			// 	const {primed} = await creativeSystem()
			// 	const {authModel, appModel} = primed.frontend.models

			// 	// throw new Error("TODO rewrite tests")

			// 	// await authModel.login
			// 	// assert(authModel.user, "failed to login")

			// 	// await app.loadAppListing()
			// 	// assert(app.listing.length === 0, "apps listing should start empty")

			// 	// const draft = {
			// 	// 	label: "My Cool App",
			// 	// 	home: "https://example.chasemoskal.com",
			// 	// 	origins: [
			// 	// 		"https://example.chasemoskal.com",
			// 	// 	],
			// 	// }

			// 	// app.setAppDraft(draft)
			// 	// await app.submitAppDraftForRegistration()
			// 	// assert(app.listing.length === 1, "new app should appear in listing")
			// 	// assert(app.listing[0].label === draft.label, "label should be maintained")
			// 	// assert(app.listing[0].appId.length > 8, "new app id should be generated")
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

// function commonTests(getTestingSystemPrimedWithLogin: () => Promise<PrimedTestableSystem>) {
// 	return <Suite>{
// 		"login and out": async() => {
// 			const {primed} = await getTestingSystemPrimedWithLogin()

			

// 			// throw new Error("TODO implement login tests")
// 			// const {auth} = primed.frontend.models

// 			// await auth.login()
// 			// assert(auth.user, "failed to login")

// 			// await auth.logout()
// 			// assert(!auth.user, "failed to logout")
// 		},
// 		"customize own profile": async() => {
// 			const {primed} = await getTestingSystemPrimedWithLogin()
// 			// throw new Error("TODO implement login tests")
// 			// const {auth} = primed.frontend.models

// 			// await auth.login()
// 			// const {profile} = auth.user
// 			// assert(profile, "failed to read profile")

// 			// await primed.frontend.models.personal.saveProfile({...profile, nickname: "Jimmy"})
// 			// assert(auth.user.profile.nickname === "Jimmy", "failed to set profile nickname")
// 		},
// 	}
// }
