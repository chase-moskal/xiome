
import {apiOrigin} from "../../../constants.js"
import {mockPopups} from "./common/mock-popups.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockConfig} from "../../../backend/config/mock-config.js"
import {backendForBrowser} from "../../../backend/backend-for-browser.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {chatMockClient} from "../../../../features/chat/api/sockets/chat-mock-client.js"

export async function mockConnectApp({
		origins, storage, appWindowLink,
	}: {
		origins: string[]
		storage: FlexStorage
		appWindowLink: string
	}) {

	const backend = await backendForBrowser(storage)(mockConfig({
		platformHome: appWindowLink,
		platformOrigins: origins,
	}))
	backend.emails.disableEmails()

	const apiLink = apiOrigin + "/"
	const ownerEmail = "creative@xiome.io"
	const adminEmail = "admin@xiome.io"

	let appId = await storage.read<string>("mock-app")
	if (!appId) {
		appId = await mockRegisterApp({
			apiLink,
			backend,
			ownerEmail,
			adminEmail,
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
		appWindowLink,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	const chatConnect = await chatMockClient({storage})

	return {appId, remote, storage, authMediator, backend, popups, chatConnect}
}
