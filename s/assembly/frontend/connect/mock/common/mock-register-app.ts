
import {Await} from "../../../../../types/await.js"
import {mockBackend} from "../../../../backend/mock-backend.js"

export async function mockRegisterApp({
		apiLink, ownerEmail, appOrigins, backend
	}: {
		apiLink: string
		ownerEmail: string
		appOrigins: string[]
		backend: Await<ReturnType<typeof mockBackend>>
	}) {

	const mockBrowserForPlatform = await backend.mockBrowser()
	const mockWindowForPlatform = await mockBrowserForPlatform.mockAppWindow({
		apiLink,
		latency: false,
		appId: backend.platformAppId,
		windowLink: window.location.href,
	})

	const {authModel, appModel} = mockWindowForPlatform.models
	await authModel.sendLoginLink(ownerEmail)
	await authModel.login(backend.getLatestLoginEmail().loginToken)

	const {appId} = await appModel.registerApp({
		label: "Mock App",
		home: window.location.href,
		origins: appOrigins,
	})

	console.log("mock: register app", appId)

	// // link bank account with stripe
	await mockWindowForPlatform.models.bankModel.setupStripeAccount(appId)
	// const stripeDetails = await mockWindowForPlatform.models.bankModel.getStripeAccountDetails(appId)
	// console.log("mock: app stripe details", stripeDetails)

	return appId
}
