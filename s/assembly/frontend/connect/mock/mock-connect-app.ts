
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockConfig} from "../../../backend/mock-config.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {MockLatency} from "../../../../framework/add-mock-latency.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {configureApiForBrowser} from "../../../backend/configure-api-for-browser.js"

export async function mockConnectApp({
		origins, latency, storage, appWindowLink,
	}: {
		origins: string[]
		latency: MockLatency
		storage: FlexStorage
		appWindowLink: string
	}) {

	const backend = await configureApiForBrowser(mockConfig({
		platformHome: appWindowLink,
		platformOrigins: origins,
	}))
	backend.emails.disableEmails()

	const apiLink = apiOrigin + "/"
	const ownerEmail = "creative@xiome.io"

	let appId = await storage.read<string>("mock-app")
	if (!appId) {
		appId = await mockRegisterApp({
			apiLink,
			backend,
			ownerEmail,
			appOrigins: origins,
		})
		await storage.write<string>("mock-app", appId)
	}
	console.log(`mock: app owner email "${ownerEmail}"`)

	backend.emails.enableEmails()
	const {remote, authMediator} = await mockWiredRemote({
		appId,
		apiLink,
		backend,
		storage,
		latency,
		appWindowLink,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	return {appId, remote, authMediator, backend, popups}
}
