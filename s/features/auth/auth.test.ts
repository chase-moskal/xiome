
import {Suite} from "cynic"
import creative from "./tests/creative.test.js"
import technician from "./tests/technician.test.js"

export default <Suite>{
	"as technician": technician,
	"as creative": creative,

	// "creative-old": {
	// 	// "common tests for creative on platform": commonTests(creativeSystem),
	// 	// "register an app": async() => {
	// 	// 	const {primed} = await creativeSystem()
	// 	// 	const {authModel, appModel} = primed.frontend.models

	// 	// 	// throw new Error("TODO rewrite tests")

	// 	// 	// await authModel.login
	// 	// 	// assert(authModel.user, "failed to login")

	// 	// 	// await app.loadAppListing()
	// 	// 	// assert(app.listing.length === 0, "apps listing should start empty")

	// 	// 	// const draft = {
	// 	// 	// 	label: "My Cool App",
	// 	// 	// 	home: "https://example.chasemoskal.com",
	// 	// 	// 	origins: [
	// 	// 	// 		"https://example.chasemoskal.com",
	// 	// 	// 	],
	// 	// 	// }

	// 	// 	// app.setAppDraft(draft)
	// 	// 	// await app.submitAppDraftForRegistration()
	// 	// 	// assert(app.listing.length === 1, "new app should appear in listing")
	// 	// 	// assert(app.listing[0].label === draft.label, "label should be maintained")
	// 	// 	// assert(app.listing[0].appId.length > 8, "new app id should be generated")
	// 	// },
	// 	"generate an admin account to login with": true,
	// 	"no-can-do": {
	// 		"can't view platform stats": true,
	// 		"can't login to other creator's apps": true,
	// 		"can't protocol zero and roll platform secrets": true,
	// 	},
	// },
	// "customer": {
	// 	"login and out of standard app": true,
	// 	"customize profile": true,
	// 	"fetch any profile": true,
	// },
	// "developer": {
	// 	"app tokens respect origin list": true,
	// 	"verify scoped third-party access token": true,
	// },
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
