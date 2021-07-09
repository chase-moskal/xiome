
import {Await} from "../../../../../types/await.js"
import {configureApiForNode} from "../../../../backend/configure-api-for-node.js"

export async function mockRegisterApp({
		apiLink, ownerEmail, appOrigins, backend
	}: {
		apiLink: string
		ownerEmail: string
		appOrigins: string[]
		backend: Await<ReturnType<typeof configureApiForNode>>
	}) {

	const mockBrowserForPlatform = await backend.mockBrowser()
	const mockWindowForPlatform = await mockBrowserForPlatform.mockAppWindow({
		apiLink,
		latency: false,
		id_app: backend.platformAppId,
		windowLink: window.location.href,
	})

	const {authModel, appModel} = mockWindowForPlatform.models
	await authModel.sendLoginLink(ownerEmail)
	await authModel.login(backend.emails.recallLatestLoginEmail().loginToken)

	const {id_app} = await appModel.registerApp({
		label: "Mock App",
		home: window.location.href,
		origins: appOrigins,
	})

	console.log("mock: register app", id_app)

	// TODO reactivate store
	// // link bank account with stripe
	// await mockWindowForPlatform.models.storeModel.shares.bank.setupStripeAccount(id_app)
	// const stripeDetails = await mockWindowForPlatform.models.bankModel.getStripeAccountDetails(id_app)
	// console.log("mock: app stripe details", stripeDetails)

	return id_app
}
