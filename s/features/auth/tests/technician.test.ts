
import {Suite, assert} from "cynic"

import {Await} from "../../../types/fancy.js"
import {LoginEmailDetails} from "../auth-types.js"
import {mockWholeSystem} from "../../../assembly/mock-whole-system.js"

const apiLink = "https://api.xiom.app/"
const platformLink = "https://xiom.app/"

export default <Suite>{
	"sign up, login, and logout": async() => {
		let recentLoginEmail: LoginEmailDetails
		const system = await mockWholeSystem({
			sendLoginEmail: async details => {
				recentLoginEmail = details
			},
		})
		const browser = await system.mockBrowser()
		const grabAccess = (window: Await<ReturnType<typeof browser.mockAppWindow>>) =>
			window.frontend.authModel.getAccess()

		// signup
		const windowA = await browser.mockAppWindow({
			apiLink,
			windowLink: platformLink,
			appToken: system.platformAppToken,
		})
		await windowA.frontend.authModel.sendLoginLink(
			system.config.platform.technician.email
		)
		assert(
			await grabAccess(windowA) === undefined,
			"windowA should start logged out"
		)

		// login
		const windowB = await browser.mockAppWindow({
			apiLink,
			appToken: system.platformAppToken,
			windowLink: `${platformLink}?login=${recentLoginEmail.loginToken}`,
		})
		assert(
			(await grabAccess(windowB)).user,
			"windowB should now be logged in"
		)
		assert(
			(await grabAccess(windowA)).user,
			"windowA should also be logged in"
		)

		// logout
		await windowB.frontend.authModel.logout()
		assert(
			await grabAccess(windowA) === undefined
				&& await grabAccess(windowB) === undefined,
			"both windows should be logged out"
		)
	},

	"login to *any* app": true,
	"view platform stats": true,
	"procotol zero: roll platform secrets": true,
}
