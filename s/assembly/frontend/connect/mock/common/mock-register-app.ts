
import {Await} from "../../../../../types/await.js"
import {backendForNode} from "../../../../backend/backend-for-node.js"

export async function mockRegisterApp({
		apiLink, ownerEmail, adminEmail, appOrigins, backend
	}: {
		apiLink: string
		ownerEmail: string
		adminEmail: string
		appOrigins: string[]
		backend: Await<ReturnType<typeof backendForNode>>
	}) {

	const mockBrowserForPlatform = await backend.mockBrowser()
	const mockWindowForPlatform = await mockBrowserForPlatform.mockAppWindow({
		apiLink,
		appId: backend.platformAppId,
		windowLink: window.location.href,
	})

	const {accessModel, appsModel} = mockWindowForPlatform.models
	await accessModel.sendLoginLink(ownerEmail)
	await accessModel.login(backend.emails.recallLatestLoginEmail().loginToken)

	const {appId} = await appsModel.registerApp({
		label: "Mock App",
		home: window.location.href,
		origins: appOrigins,
	})

	console.log("mock: register app", appId)

	await appsModel.appEditService.assignAdmin({
		appId,
		email: adminEmail,
	})

	// TODO reactivate store
	// // link bank account with stripe
	// await mockWindowForPlatform.models.storeModel.shares.bank.setupStripeAccount(appId)
	// const stripeDetails = await mockWindowForPlatform.models.bankModel.getStripeAccountDetails(appId)
	// console.log("mock: app stripe details", stripeDetails)

	return appId
}
