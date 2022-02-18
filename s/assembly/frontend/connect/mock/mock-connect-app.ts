
import {FlexStorage} from "dbmage"

import {mockPopups} from "./common/mock-popups.js"
import {mockRegisterApp} from "./common/mock-register-app.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockConfig} from "../../../backend/config/mock-config.js"
import {backendForBrowser} from "../../../backend/backend-for-browser.js"
import {chatMockClientEntirely} from "../../../../features/chat/api/sockets/chat-mock-client-entirely.js"

export async function mockConnectApp({
		appOrigin, origins, storage, appWindowLink,
	}: {
		appOrigin: string
		origins: string[]
		storage: FlexStorage
		appWindowLink: string
	}) {

	const backend = await backendForBrowser(storage)(mockConfig({
		platformHome: appWindowLink,
		platformOrigins: origins,
	}))
	backend.emails.disableEmails()

	const ownerEmail = "creative@xiome.io"
	const adminEmail = "admin@xiome.io"

	let appId = await storage.read<string>("mock-app")
	if (!appId) {
		appId = await mockRegisterApp({
			backend,
			ownerEmail,
			adminEmail,
			appOrigins: origins,
			platformOrigin: appOrigin,
		})
		await storage.write<string>("mock-app", appId)
	}
	console.log(`mock: app owner email "${ownerEmail}"`)

	backend.emails.enableEmails()
	const {remote, authMediator, setMockLatency} = await mockWiredRemote({
		appId,
		backend,
		storage,
		appOrigin,
	})

	const popups = mockPopups({
		mockStripeOperations: backend.mockStripeOperations,
	})

	const chatConnect = await chatMockClientEntirely(storage)
	// const chatConnect = chatSocketClient("ws://localhost:8001/")

	return {appId, remote, storage, authMediator, backend, popups, setMockLatency, chatConnect}
}
