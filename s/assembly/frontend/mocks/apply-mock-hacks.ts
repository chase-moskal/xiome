
import {nap} from "../../../toolbox/nap.js"
import {Await} from "../../../types/await.js"
import {hitchie} from "../../../toolbox/hitchie.js"
import {mockConnect} from "../connect/mock/mock-connect.js"
import {assembleAndInitializeFrontend} from "../assemble-and-initialize-frontend.js"

export async function applyMockHacks({connection, frontend}: {
		connection: Await<ReturnType<typeof mockConnect>>
		frontend: Await<ReturnType<typeof assembleAndInitializeFrontend>>
	}) {

	const {loginService} = connection.remote.auth

	loginService.sendLoginLink = hitchie(
		loginService.sendLoginLink,
		async(func, ...args) => {
			await func(...args)
			const details = connection.backend.emails.recallLatestLoginEmail()
			console.log("mock: logging in...")
			await nap(1000)
			await frontend.models.authModel.login(details.loginToken)
			console.log(`mock: logged in as ${details.to}`)
		},
	)

	connection.popups.triggerBankPopup = hitchie(
		connection.popups.triggerBankPopup,
		async(...args) => {
			console.log("mock: bank popup", args)
		},
	)
}
