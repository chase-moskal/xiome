
import {FlexStorage} from "dbmage"

import {mockPopups} from "./common/mock-popups.js"
import {mockWiredRemote} from "./common/mock-wired-remote.js"
import {mockConfig} from "../../../backend/config/mock-config.js"
import {backendForBrowser} from "../../../backend/backend-for-browser.js"
import {chatMockClientEntirely} from "../../../../features/chat/api/sockets/chat-mock-client-entirely.js"

export async function mockConnectPlatform({
		platformHome, storage,
	}: {
		platformHome: string
		storage: FlexStorage
	}) {

	const appOrigin = new URL(platformHome).origin

	const backend = await backendForBrowser(storage)(mockConfig({
		platformHome,
		platformOrigins: [appOrigin],
	}))

	const appId = backend.platformAppId

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
